// src/app.ts
import express8 from "express";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(true)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  role          String?   @default("CUSTOMER")\n  phone         String?\n  status        String?   @default("ACTIVE")\n  sessions      Session[]\n  accounts      Account[]\n\n  medicines Medicine[] @relation("SellerMedicines")\n\n  orders  Order[]  @relation("CustomerOrders")\n  reviews Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Category {\n  id        String     @id @default(uuid())\n  name      String     @unique\n  medicines Medicine[]\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n}\n\nmodel Medicine {\n  id           String      @id @default(uuid())\n  name         String\n  description  String\n  price        Float\n  imageUrl     String\n  stock        Int\n  manufacturer String\n  sellerId     String\n  categoryId   String\n  seller       User        @relation("SellerMedicines", fields: [sellerId], references: [id])\n  category     Category    @relation(fields: [categoryId], references: [id])\n  orderItems   OrderItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([name])\n  @@index([price])\n  @@index([categoryId])\n  @@index([sellerId])\n}\n\nmodel Order {\n  id              String        @id @default(uuid())\n  customerId      String\n  status          OrderStatus   @default(PENDING)\n  paymentMethod   PaymentMethod @default(COD)\n  paymentStatus   PaymentStatus @default(PENDING)\n  stripeSessionId String?\n\n  totalAmount Float\n  subtotal    Float\n  deliveryFee Float @default(0)\n\n  customerName    String\n  customerPhone   String\n  customerEmail   String?\n  customerAddress String\n  customerCity    String\n  notes           String?\n\n  items    OrderItem[]\n  customer User        @relation("CustomerOrders", fields: [customerId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([customerId])\n  @@index([status])\n}\n\nmodel OrderItem {\n  id         String @id @default(uuid())\n  orderId    String\n  medicineId String\n  name       String\n  price      Float\n  quantity   Int\n  subtotal   Float\n\n  order    Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  medicine Medicine @relation(fields: [medicineId], references: [id])\n\n  @@index([orderId])\n  @@index([medicineId])\n}\n\nenum OrderStatus {\n  PENDING\n  CONFIRMED\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nenum PaymentMethod {\n  COD\n  ONLINE\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n}\n\nmodel Review {\n  id          String @id @default(uuid())\n  quote       String\n  designation String\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"SellerMedicines"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"SellerMedicines"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"subtotal","kind":"scalar","type":"Float"},{"name":"deliveryFee","kind":"scalar","type":"Float"},{"name":"customerName","kind":"scalar","type":"String"},{"name":"customerPhone","kind":"scalar","type":"String"},{"name":"customerEmail","kind":"scalar","type":"String"},{"name":"customerAddress","kind":"scalar","type":"String"},{"name":"customerCity","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"subtotal","kind":"scalar","type":"Float"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"quote","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 10px;">
        <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#4f46e5; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0;">MediStore</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;">
              <h2 style="color:#111827;">Verify your email address</h2>
              <p style="color:#374151; font-size:16px; line-height:1.6;">
                Thanks for signing up for <strong>Prisma Blog</strong>!  
                Please confirm your email address by clicking the button below.
              </p>

              <div style="text-align:center; margin:30px 0;">
                <a href="${verificationUrl}"
                   style="
                     background:#4f46e5;
                     color:#ffffff;
                     padding:12px 24px;
                     text-decoration:none;
                     border-radius:6px;
                     font-size:16px;
                     display:inline-block;
                   ">
                  Verify Email
                </a>
              </div>

              <p style="color:#6b7280; font-size:14px;">
                If the button doesn\u2019t work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; font-size:14px; color:#4f46e5;">
                ${verificationUrl}
              </p>

              <p style="color:#6b7280; font-size:14px; margin-top:30px;">
                If you did not create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#9ca3af;">
              \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Prisma Blog. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@gmail.com>',
          to: user.email,
          subject: "Please Verify Your Email",
          html: htmlTemplate
        });
        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent"
    }
  }
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/modules/medicine/medicine.route.ts
import express from "express";

// src/modules/medicine/medicine.service.ts
var addMedicine = async (data, sellerId) => {
  const result = await prisma.medicine.create({
    data: { ...data, sellerId }
  });
  return result;
};
var getAllMedicines = async ({
  search,
  description,
  manufacturer,
  price
}) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive"
          }
        }
        // {
        //   price: {
        //     contains: search,
        //     mode: "insensitive",
        //   },
        // },
      ]
    });
  }
  const allMedicine = await prisma.medicine.findMany({
    where: {
      AND: andConditions
    }
  });
  return allMedicine;
};
var getMedicineDetails = async (medicineId) => {
  const medicineDetails = await prisma.medicine.findUnique({
    where: {
      id: medicineId
    },
    include: {
      category: true
    }
  });
  return medicineDetails;
};
var updateMedicine = async (medicineId, data, sellerId, isSeller) => {
  const medicineData = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medicineId
    },
    select: {
      id: true,
      sellerId: true
    }
  });
  if (!isSeller && medicineData.sellerId !== sellerId) {
    throw new Error("You are not the owner of this medicine..!!");
  }
  const result = await prisma.medicine.update({
    where: {
      id: medicineData.id
    },
    data
  });
  return result;
};
var deleteMedicine = async (medicineId, sellerId, isSeller) => {
  const medicineData = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medicineId
    },
    select: {
      id: true,
      sellerId: true
    }
  });
  if (!isSeller && medicineData.sellerId !== sellerId) {
    throw new Error(
      "You are not the owner/creator of this Medicine to delete.."
    );
  }
  return await prisma.medicine.delete({
    where: {
      id: medicineId
    }
  });
};
var medicineService = {
  addMedicine,
  getAllMedicines,
  getMedicineDetails,
  updateMedicine,
  deleteMedicine
};

// src/middlewares/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!!!"
        });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required.Please verify your email!"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission to access this resources."
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth2;

// src/modules/medicine/medicine.controller.ts
var addMedicine2 = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const result = await medicineService.addMedicine(
      req.body,
      sellerId
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot add this medicines",
      details: error
    });
  }
};
var getAllMedicines2 = async (req, res) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const result = await medicineService.getAllMedicines({
      search: searchString
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get all medicines",
      details: error
    });
  }
};
var getMedicineDetails2 = async (req, res) => {
  try {
    const { medicineId } = req.params;
    if (!medicineId) {
      throw new Error("Medicine id is required!!");
    }
    const result = await medicineService.getMedicineDetails(
      medicineId
    );
    return res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get  medicines details..!!",
      details: error
    });
  }
};
var updateMedicine2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized..!!");
    }
    const { medicineId } = req.params;
    const isSeller = user.role === "SELLER" /* SELLER */;
    const result = await medicineService.updateMedicine(
      medicineId,
      req.body,
      user.id,
      isSeller
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Update  Medicines Details..!!",
      details: error
    });
  }
};
var deleteMedicine2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!!");
    }
    const { medicineId } = req.params;
    const isSeller = user.role === "SELLER" /* SELLER */;
    const result = await medicineService.deleteMedicine(
      medicineId,
      user.id,
      isSeller
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Delete This Medicines..!!",
      details: error
    });
  }
};
var medicineController = {
  getAllMedicines: getAllMedicines2,
  addMedicine: addMedicine2,
  getMedicineDetails: getMedicineDetails2,
  updateMedicine: updateMedicine2,
  deleteMedicine: deleteMedicine2
};

// src/modules/medicine/medicine.route.ts
var router = express.Router();
router.get("/", medicineController.getAllMedicines);
router.get("/:medicineId", medicineController.getMedicineDetails);
router.post(
  "/medicines",
  auth_default("SELLER" /* SELLER */),
  medicineController.addMedicine
);
router.put(
  "/medicines/:medicineId",
  auth_default("SELLER" /* SELLER */),
  medicineController.updateMedicine
);
router.delete(
  "/medicines/:medicineId",
  auth_default("SELLER" /* SELLER */),
  medicineController.deleteMedicine
);
var medicineRouter = router;

// src/modules/category/category.route.ts
import express2 from "express";

// src/modules/category/category.service.ts
var createCategory = async (payload) => {
  const result = await prisma.category.create({
    data: payload
  });
  return result;
};
var getAllCategories = async () => {
  const result = await prisma.category.findMany();
  return result;
};
var updateCategoryName = async (categoryId, name) => {
  await prisma.category.findFirstOrThrow({
    where: {
      id: categoryId
    }
  });
  const result = await prisma.category.update({
    where: {
      id: categoryId
    },
    data: { name }
  });
  return result;
};
var deleteCategory = async (categoryId, isAdmin) => {
  const categoryData = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId
    }
  });
  if (!isAdmin && categoryData.id !== categoryId) {
    throw new Error("You are not admin to delete category..");
  }
  return await prisma.category.delete({
    where: {
      id: categoryId
    }
  });
};
var categoryService = {
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategoryName
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot add this medicines",
      details: error
    });
  }
};
var getAllCategories2 = async (req, res) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get all categories..!!!",
      details: error
    });
  }
};
var updateCategoryName2 = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { name } = req.body;
    const result = await categoryService.updateCategoryName(
      categoryId,
      name
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Update This Category Name..!!",
      details: error
    });
  }
};
var deleteCategories = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized !!");
    }
    const { categoryId } = req.params;
    const isAdmin = user.role === "ADMIN" /* ADMIN */;
    const result = await categoryService.deleteCategory(
      categoryId,
      isAdmin
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Delete This Category!!!",
      details: error
    });
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  deleteCategories,
  updateCategoryName: updateCategoryName2
};

// src/modules/category/category.route.ts
var router2 = express2.Router();
router2.post("/", auth_default("ADMIN" /* ADMIN */), categoryController.createCategory);
router2.get("/", categoryController.getAllCategories);
router2.patch(
  "/:categoryId",
  auth_default("ADMIN" /* ADMIN */),
  categoryController.updateCategoryName
);
router2.delete(
  "/:categoryId",
  auth_default("ADMIN" /* ADMIN */),
  categoryController.deleteCategories
);
var categoryRouter = router2;

// src/modules/user/user.route.ts
import express3 from "express";

// src/modules/user/user.service.ts
var getAdminStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalSellers = await prisma.user.count({
    where: {
      role: "SELLER"
    }
  });
  const totalCustomers = await prisma.user.count({
    where: {
      role: "CUSTOMER"
    }
  });
  const totalMedicines = await prisma.medicine.count();
  const totalOrders = await prisma.order.count();
  return {
    totalUsers,
    totalSellers,
    totalCustomers,
    totalMedicines,
    totalOrders
  };
};
var getAllUsers = async () => {
  const result = await prisma.user.findMany();
  return result;
};
var getCurrentUser = async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: new Headers(req.headers)
  });
  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User is not found.."
    });
  }
  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || "Customer",
    emailVerified: user.emailVerified
  };
  next();
};
var updateUserStatus = async (userId, status) => {
  await prisma.user.findFirstOrThrow({
    where: {
      id: userId
    }
  });
  const result = await prisma.user.update({
    where: { id: userId },
    data: { status }
  });
  return result;
};
var deleteUser = async (userId, isAdmin) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
    // select: {
    //   id: true,
    //   userId: true,
    // },
  });
  console.log(userData);
  if (!isAdmin && userData.id !== userId) {
    throw new Error("You are not admin to delete user..");
  }
  return await prisma.user.delete({
    where: {
      id: userId
    }
  });
};
var userService = {
  getAllUsers,
  getCurrentUser,
  updateUserStatus,
  deleteUser,
  getAdminStats
};

// src/modules/user/user.controller.ts
var getAllUsers2 = async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get all the users",
      details: error
    });
  }
};
var getAdminStats2 = async (req, res) => {
  try {
    const result = await userService.getAdminStats();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get admin stats",
      details: error
    });
  }
};
var getCurrentUser2 = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};
var updateUserStatus2 = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { status } = req.body;
    const result = await userService.updateUserStatus(userId, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Update This User Status..!!",
      details: error
    });
  }
};
var deleteUser2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!!");
    }
    const { userId } = req.params;
    const isAdmin = user.role === "ADMIN" /* ADMIN */;
    const result = await userService.deleteUser(userId, isAdmin);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Delete This User!!",
      details: error
    });
  }
};
var userController = {
  getAllUsers: getAllUsers2,
  getCurrentUser: getCurrentUser2,
  updateUserStatus: updateUserStatus2,
  deleteUser: deleteUser2,
  getAdminStats: getAdminStats2
};

// src/modules/user/user.route.ts
var router3 = express3.Router();
router3.get("/", auth_default("ADMIN" /* ADMIN */), userController.getAllUsers);
router3.get(
  "/dashboard-stats",
  auth_default("ADMIN" /* ADMIN */),
  userController.getAdminStats
);
router3.get(
  "/me",
  auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */, "CUSTOMER" /* CUSTOMER */),
  userController.getCurrentUser
);
router3.patch(
  "/:userId",
  auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */),
  userController.updateUserStatus
);
router3.delete("/:userId", auth_default("ADMIN" /* ADMIN */), userController.deleteUser);
var userRouter = router3;

// src/modules/order/order.route.ts
import express4 from "express";

// src/modules/order/order.service.ts
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
var createOrder = async (customerId, payload) => {
  const user = await prisma.user.findUnique({
    where: { id: customerId }
  });
  if (!user) {
    throw new Error("User not found");
  }
  for (const item of payload.items) {
    const medicine = await prisma.medicine.findUnique({
      where: { id: item.medicineId }
    });
    if (!medicine) {
      throw new Error(`Medicine "${item.name}" not found`);
    }
    if (medicine.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for "${item.name}". Only ${medicine.stock} left`
      );
    }
  }
  if (payload.paymentMethod === "COD") {
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId,
          status: "PENDING",
          paymentMethod: "COD",
          paymentStatus: "PENDING",
          totalAmount: payload.totalAmount,
          subtotal: payload.subtotal,
          deliveryFee: payload.deliveryFee,
          customerName: payload.customer.name,
          customerPhone: payload.customer.phone,
          customerEmail: payload.customer.email ?? null,
          customerAddress: payload.customer.address,
          customerCity: payload.customer.city,
          notes: payload.customer.notes ?? null,
          items: {
            create: payload.items.map((item) => ({
              name: item.name,
              medicine: {
                connect: {
                  id: item.medicineId
                }
              },
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity
            }))
          }
        }
      });
      for (const item of payload.items) {
        await tx.medicine.update({
          where: {
            id: item.medicineId
          },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
      return newOrder;
    });
    return {
      type: "COD",
      orderId: order.id
    };
  }
  if (payload.paymentMethod === "ONLINE") {
    const order = await prisma.order.create({
      data: {
        customerId,
        status: "PENDING",
        paymentMethod: "ONLINE",
        paymentStatus: "PENDING",
        totalAmount: payload.totalAmount,
        subtotal: payload.subtotal,
        deliveryFee: payload.deliveryFee,
        customerName: payload.customer.name,
        customerPhone: payload.customer.phone,
        customerEmail: payload.customer.email ?? null,
        customerAddress: payload.customer.address,
        customerCity: payload.customer.city,
        notes: payload.customer.notes ?? null,
        items: {
          create: payload.items.map((item) => ({
            name: item.name,
            medicine: {
              connect: {
                id: item.medicineId
              }
            },
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
          }))
        }
      }
    });
    const BDT_TO_USD_RATE = 91e-4;
    const amountInUsd = parseFloat(
      (payload.totalAmount * BDT_TO_USD_RATE).toFixed(2)
    );
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "MediStore Order",
              description: `\u09F3${payload.totalAmount} BDT \u2014 Delivery to ${payload.customer.city}`
            },
            unit_amount: Math.round(amountInUsd * 100)
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/payment-cancel`
    });
    await prisma.order.update({
      where: {
        id: order.id
      },
      data: {
        stripeSessionId: session.id
      }
    });
    return {
      type: "ONLINE",
      orderId: order.id,
      paymentUrl: session.url
    };
  }
};
var verifyPayment = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    throw new Error("Payment failed");
  }
  const order = await prisma.order.findFirst({
    where: {
      stripeSessionId: sessionId
    },
    include: {
      items: true
    }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: {
        id: order.id
      },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED"
      }
    });
    for (const item of order.items) {
      await tx.medicine.update({
        where: {
          id: item.medicineId
        },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }
  });
  return {
    success: true
  };
};
var getMyOrders = async (customerId) => {
  return await prisma.order.findMany({
    where: { customerId },
    include: {
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getSingleOrder = async (orderId, customerId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId },
    include: {
      items: {
        include: {
          medicine: {
            select: { id: true, name: true, imageUrl: true }
          }
        }
      }
    }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};
var getAllOrders = async () => {
  const result = await prisma.order.findMany({
    include: {
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      }
    }
  });
  return result;
};
var orderService = {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  verifyPayment
};

// src/modules/order/order.controller.ts
import httpStatus from "http-status";
var createOrder2 = async (req, res, next) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }
    const result = await orderService.createOrder(customerId, req.body);
    if (result?.type === "COD") {
      res.status(httpStatus.CREATED).json({
        success: true,
        message: "Order placed successfully",
        data: {
          type: "COD",
          orderId: result.orderId
        }
      });
      return;
    }
    if (result?.type === "ONLINE") {
      res.status(httpStatus.CREATED).json({
        success: true,
        message: "Redirecting to payment gateway",
        data: {
          type: "ONLINE",
          orderId: result.orderId,
          paymentUrl: result.paymentUrl
          // ✅ frontend redirects here
        }
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};
var verifyPayment2 = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Session ID is required"
      });
      return;
    }
    const result = await orderService.verifyPayment(sessionId);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Payment verified successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const result = await orderService.getAllOrders();
    res.status(httpStatus.OK).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get all orders..!!!",
      details: error
    });
  }
};
var getMyOrders2 = async (req, res, next) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }
    const result = await orderService.getMyOrders(customerId);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Your orders fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user?.id;
    if (!orderId || Array.isArray(orderId)) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid orderId"
      });
      return;
    }
    if (!customerId) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }
    const result = await orderService.getSingleOrder(orderId, customerId);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Order details fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var orderController = {
  createOrder: createOrder2,
  verifyPayment: verifyPayment2,
  // ✅ exported
  getAllOrders: getAllOrders2,
  getMyOrders: getMyOrders2,
  getOrderDetails
};

// src/modules/order/order.route.ts
var router4 = express4.Router();
router4.post("/", auth_default("CUSTOMER" /* CUSTOMER */), orderController.createOrder);
router4.post("/verify-payment", orderController.verifyPayment);
router4.get("/", orderController.getAllOrders);
router4.get("/my-orders", auth_default("CUSTOMER" /* CUSTOMER */), orderController.getMyOrders);
router4.get(
  "/:orderId",
  auth_default("CUSTOMER" /* CUSTOMER */),
  orderController.getOrderDetails
);
var orderRouter = router4;

// src/modules/seller/seller.route.ts
import express5 from "express";

// src/modules/seller/seller.service.ts
var addMedicine3 = async (data, sellerId) => {
  const result = await prisma.medicine.create({
    data: { ...data, sellerId }
  });
  return result;
};
var getMyMedicines = async (sellerId) => {
  const result = await prisma.medicine.findMany({
    where: {
      sellerId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var getSellerStats = async (sellerId) => {
  const medicines = await prisma.medicine.findMany({
    where: {
      sellerId
    }
  });
  const orderedMedicines = await prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: {
            sellerId
          }
        }
      }
    }
  });
  const totalMedicines = medicines.length;
  const totalStock = medicines.reduce((acc, medicine) => {
    return acc + medicine.stock;
  }, 0);
  const lowStock = medicines.filter(
    (medicine) => medicine.stock > 0 && medicine.stock < 10
  ).length;
  const outOfStock = medicines.filter(
    (medicine) => medicine.stock === 0
  ).length;
  const totalOrders = orderedMedicines.length;
  const revenue = await prisma.orderItem.aggregate({
    where: {
      medicine: {
        sellerId
      }
    },
    _sum: {
      subtotal: true
    }
  });
  const totalRevenue = revenue._sum.subtotal || 0;
  return {
    totalMedicines,
    totalStock,
    lowStock,
    outOfStock,
    totalOrders,
    totalRevenue
  };
};
var updateMedicine3 = async (medicineId, name, price, stock, manufacturer, sellerId, isSeller) => {
  const medicineData = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medicineId
    }
  });
  if (isSeller && medicineData.sellerId !== sellerId) {
    throw new Error("You are not the owner");
  }
  console.log(medicineData.id);
  const result = await prisma.medicine.update({
    where: {
      id: medicineId
    },
    data: { name, price, stock, manufacturer }
  });
  console.log("updated data", result);
  return result;
};
var deleteMedicine3 = async (medicineId, sellerId, isSeller) => {
  const medicineData = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medicineId
    },
    select: {
      id: true,
      sellerId: true
    }
  });
  if (!isSeller && medicineData.sellerId !== sellerId) {
    throw new Error(
      "You are not the owner/creator of this Medicine to delete.."
    );
  }
  return await prisma.medicine.delete({
    where: {
      id: medicineId
    }
  });
};
var getOrderedMedicines = async (sellerId) => {
  const orderedMedicines = await prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: {
            sellerId
          }
        }
      }
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      items: {
        where: {
          medicine: {
            sellerId
            // only this seller's medicines
          }
        },
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              price: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return orderedMedicines;
};
var updateOrderStatus = async (orderId, sellerId, status) => {
  await prisma.order.findFirstOrThrow({
    where: {
      id: orderId,
      items: {
        some: {
          medicine: {
            sellerId
          }
        }
      }
    }
  });
  const result = await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
  return result;
};
var updateStock = async (medicineId, sellerId, quantity) => {
  await prisma.medicine.findFirstOrThrow({
    where: {
      id: medicineId,
      sellerId
    }
  });
  return await prisma.medicine.update({
    where: {
      id: medicineId
    },
    data: {
      stock: {
        increment: quantity
      }
    }
  });
};
var sellerServices = {
  addMedicine: addMedicine3,
  getMyMedicines,
  updateMedicine: updateMedicine3,
  deleteMedicine: deleteMedicine3,
  getOrderedMedicines,
  updateOrderStatus,
  updateStock,
  getSellerStats
};

// src/modules/seller/seller.controller.ts
var addMedicine4 = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    const user = req.user;
    if (!sellerId) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const isSeller = user?.role === "SELLER" /* SELLER */;
    if (isSeller === false) {
      res.status(400).json({
        error: "You are not seller to add medicine."
      });
    } else {
      const result = await sellerServices.addMedicine(
        req.body,
        sellerId
      );
      res.status(201).json(result);
    }
  } catch (error) {
    res.status(400).json({
      error: "Cannot add this medicines",
      details: error
    });
  }
};
var getMyMedicines2 = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    console.log(req.user);
    if (!sellerId) {
      return res.status(401).json({
        error: "Unauthorized!"
      });
    }
    const result = await sellerServices.getMyMedicines(sellerId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch medicines",
      details: error
    });
  }
};
var getSellerStats2 = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await sellerServices.getSellerStats(sellerId);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get seller statistics",
      details: error
    });
  }
};
var updateMedicine4 = async (req, res) => {
  try {
    const user = req.user;
    const { name, price, stock, manufacturer } = req.body;
    if (!user) {
      throw new Error("You are unauthorized..!!");
    }
    const { medicineId } = req.params;
    console.log(medicineId, req.body);
    const isSeller = user.role === "SELLER" /* SELLER */;
    const result = await sellerServices.updateMedicine(
      medicineId,
      name,
      price,
      stock,
      manufacturer,
      user.id,
      isSeller
    );
    console.log("From controller", result);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Update  Medicines Details..!!",
      details: error
    });
  }
};
var deleteMedicine4 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!!");
    }
    const { medicineId } = req.params;
    const isSeller = user.role === "SELLER" /* SELLER */;
    const result = await sellerServices.deleteMedicine(
      medicineId,
      user.id,
      isSeller
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Delete This Medicines..!!",
      details: error
    });
  }
};
var getOrderedMedicines2 = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }
    const result = await sellerServices.getOrderedMedicines(sellerId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      error: "Cannot get your orders",
      details: error
    });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    const orderId = req.params.orderId;
    const { status } = req.body;
    console.log(orderId, status);
    const result = await sellerServices.updateOrderStatus(
      orderId,
      sellerId,
      status
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Update This Order Status..!!",
      details: error
    });
  }
};
var updateStock2 = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }
    const medicineId = req.params.medicineId;
    const { stock } = req.body;
    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({
        error: "Invalid stock value"
      });
    }
    const result = await sellerServices.updateStock(
      medicineId,
      sellerId,
      stock
    );
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      error: "Cannot update stock",
      details: error
    });
  }
};
var sellerControllers = {
  addMedicine: addMedicine4,
  getMyMedicines: getMyMedicines2,
  updateMedicine: updateMedicine4,
  deleteMedicine: deleteMedicine4,
  getOrderedMedicines: getOrderedMedicines2,
  updateOrderStatus: updateOrderStatus2,
  updateStock: updateStock2,
  getSellerStats: getSellerStats2
};

// src/modules/seller/seller.route.ts
var router5 = express5.Router();
router5.post(
  "/medicines",
  auth_default("SELLER" /* SELLER */, "CUSTOMER" /* CUSTOMER */, "ADMIN" /* ADMIN */),
  sellerControllers.addMedicine
);
router5.get(
  "/my-medicines",
  auth_default("SELLER" /* SELLER */),
  sellerControllers.getMyMedicines
);
router5.get(
  "/medicines/dashboard-stats",
  auth_default("SELLER" /* SELLER */),
  sellerControllers.getSellerStats
);
router5.get(
  "/orders",
  auth_default("SELLER" /* SELLER */),
  sellerControllers.getOrderedMedicines
);
router5.patch(
  "/orders/:orderId",
  auth_default("SELLER" /* SELLER */),
  sellerControllers.updateOrderStatus
);
router5.patch(
  "/medicines/:medicineId",
  auth_default("SELLER" /* SELLER */),
  sellerControllers.updateStock
);
router5.patch(
  "/medicines/updateMedicine/:medicineId",
  auth_default("SELLER" /* SELLER */),
  sellerControllers.updateMedicine
);
router5.delete(
  "/medicines/:medicineId",
  auth_default("SELLER" /* SELLER */),
  sellerControllers.deleteMedicine
);
var sellerRouter = router5;

// src/modules/review/review.route.ts
import express6 from "express";

// src/modules/review/review.service.ts
var createReview = async (userId, payload) => {
  const result = await prisma.review.create({
    data: {
      quote: payload.quote,
      designation: payload.designation,
      userId
    }
  });
  return result;
};
var getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      user: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const result = reviews.map((review) => ({
    id: review.id,
    quote: review.quote,
    name: review.user.name,
    designation: review.designation,
    src: review.user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      review.user.name || "User"
    )}`
  }));
  return result;
};
var reviewService = {
  createReview,
  getAllReviews
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { quote, designation } = req.body;
    const result = await reviewService.createReview(userId, {
      quote,
      designation
    });
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getAllReviews2 = async (req, res) => {
  try {
    const result = await reviewService.getAllReviews();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var reviewController = {
  createReview: createReview2,
  getAllReviews: getAllReviews2
};

// src/modules/review/review.route.ts
var router6 = express6.Router();
router6.post(
  "/create-review",
  auth_default("CUSTOMER" /* CUSTOMER */),
  reviewController.createReview
);
router6.get("/all-reviews", reviewController.getAllReviews);
var reviewRouter = router6;

// src/modules/customer/customer.route.ts
import express7 from "express";

// src/modules/customer/customer.service.ts
var getCustomerStats = async (customerId) => {
  const totalOrders = await prisma.order.count({
    where: {
      customerId
    }
  });
  const pendingOrders = await prisma.order.count({
    where: {
      customerId,
      status: "PENDING"
    }
  });
  const completedOrders = await prisma.order.count({
    where: {
      customerId,
      status: "DELIVERED"
    }
  });
  const shippedOrders = await prisma.order.count({
    where: {
      customerId,
      status: "SHIPPED"
    }
  });
  const confirmedOrders = await prisma.order.count({
    where: {
      customerId,
      status: "CONFIRMED"
    }
  });
  const totalSpent = await prisma.order.aggregate({
    where: {
      customerId,
      status: {
        in: ["CONFIRMED", "SHIPPED", "DELIVERED"]
      }
    },
    _sum: {
      totalAmount: true
    }
  });
  const reviewsGiven = await prisma.review.count({
    where: {
      userId: customerId
    }
  });
  return {
    totalOrders,
    confirmedOrders,
    pendingOrders,
    completedOrders,
    shippedOrders,
    totalSpent: totalSpent._sum.totalAmount || 0,
    reviewsGiven
  };
};
var customerService = {
  getCustomerStats
};

// src/modules/customer/customer.controller.ts
var getCustomerStats2 = async (req, res) => {
  try {
    const customerId = req.user?.id;
    const result = await customerService.getCustomerStats(customerId);
    res.status(200).json({
      success: true,
      message: "Customer stats fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch customer stats",
      error
    });
  }
};
var customerController = {
  getCustomerStats: getCustomerStats2
};

// src/modules/customer/customer.route.ts
var router7 = express7.Router();
router7.get(
  "/dashboard-stats",
  auth_default("CUSTOMER" /* CUSTOMER */),
  customerController.getCustomerStats
);
var customerRouter = router7;

// src/app.ts
var app = express8();
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express8.json());
app.use("/api/medicines", medicineRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/admin/categories", categoryRouter);
app.use("/api/admin/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/customer", customerRouter);
app.get("/", (req, res) => {
  res.send("Hello From MediStore");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
