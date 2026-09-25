import "dotenv/config";
import dns from "node:dns";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

dns.setDefaultResultOrder("ipv4first");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is not defined. Please add it to your environment variables.",
  );
}

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 15_000,
  allowExitOnIdle: true,
});

pool.on("error", (error) => {
  console.error("[prisma] idle client error:", error.message);
});

const adapter = new PrismaPg(pool, {
  onPoolError: (error) => {
    console.error("[prisma] pool error:", error.message);
  },
  onConnectionError: (error) => {
    console.error("[prisma] connection error:", error.message);
  },
});

const RETRYABLE_ERROR_CODES = new Set([
  "P1001", // Can't reach database server
  "P1002", // Database server timed out
  "P1008", // Operation timed out
  "P1017", // Server has closed the connection
  "P2024", // Timed out fetching a connection from the pool
  "ETIMEDOUT",
  "ECONNRESET",
  "ECONNREFUSED",
  "EPIPE",
  "ENETUNREACH",
  "EHOSTUNREACH",
  "ENOTFOUND",
  "EAI_AGAIN",
]);

const RETRYABLE_ERROR_NAMES = new Set([
  "PrismaClientInitializationError",
  "PrismaClientUnknownRequestError",
]);

const READ_OPERATIONS = new Set([
  "findUnique",
  "findUniqueOrThrow",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
]);

const MAX_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 200;

const isTransientError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) return false;

  const candidate = error as {
    code?: unknown;
    name?: unknown;
    message?: unknown;
    type?: unknown;
  };

  const code = typeof candidate.code === "string" ? candidate.code : "";
  if (RETRYABLE_ERROR_CODES.has(code)) return true;

  const name = typeof candidate.name === "string" ? candidate.name : "";
  if (RETRYABLE_ERROR_NAMES.has(name)) return true;

  // The Neon/WebSocket driver can surface failures as browser-style
  // `ErrorEvent` objects that carry no `message` or `code`.
  const type = typeof candidate.type === "string" ? candidate.type : "";
  if (type === "error" || type === "close") return true;

  const message = typeof candidate.message === "string" ? candidate.message : "";

  return /(connection terminated|connection closed|server closed|econnreset|etimedout|econnrefused|socket hang up|fetch failed)/i.test(
    message,
  );
};

const withRetry = async <T>(
  operation: () => Promise<T>,
  attempt = 1,
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (!isTransientError(error) || attempt >= MAX_RETRIES) {
      throw error;
    }

    const delay =
      BASE_RETRY_DELAY_MS * 2 ** (attempt - 1) + Math.floor(Math.random() * 50);

    console.warn(
      `[prisma] transient error (attempt ${attempt}/${MAX_RETRIES}), retrying in ${delay}ms`,
    );

    await new Promise((resolve) => setTimeout(resolve, delay));

    return withRetry(operation, attempt + 1);
  }
};

const createPrismaClient = (): PrismaClient => {
  const client = new PrismaClient({ adapter });

  // Prisma's `$extends` return type is not assignable to `PrismaClient`, which
  // breaks existing transaction typings. The runtime object is a superset of
  // `PrismaClient`, so we expose it as `PrismaClient` to keep the public type
  // stable while still applying the retry behaviour to read queries.
  return client.$extends({
    query: {
      $allOperations({ model, operation, args, query }) {
        if (!model || !READ_OPERATIONS.has(operation)) {
          return query(args);
        }

        return withRetry(() => query(args));
      },
    },
  }) as unknown as PrismaClient;
};

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
