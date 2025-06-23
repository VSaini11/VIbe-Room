import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ✅ Avoid creating multiple Prisma instances in dev
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ✅ Utility function to save a reaction
export const saveReaction = async ({
  user,
  emoji,
  intensity,
}: {
  user: string;
  emoji: string;
  intensity: number;
}) => {
  return await prisma.reaction.create({
    data: {
      user,
      emoji,
      intensity,
    },
  });
};
