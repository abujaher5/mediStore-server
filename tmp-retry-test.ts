import { prisma } from "./src/lib/prisma";

let ok = 0;
let failed = 0;

for (let i = 1; i <= 120; i++) {
  try {
    await prisma.medicine.count();
    ok++;
  } catch (error) {
    failed++;
    console.error(`run ${i} FAILED:`, (error as Error)?.message || error);
  }
}

console.log(`done -> ok: ${ok}, failed: ${failed}`);
await prisma.$disconnect();
process.exit(0);
