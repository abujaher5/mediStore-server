import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not defined. Please add it to your environment variables.");
}

const sql = neon(connectionString);
const adapter = new PrismaNeon(sql);
const prisma = new PrismaClient({ adapter });

export { prisma };
