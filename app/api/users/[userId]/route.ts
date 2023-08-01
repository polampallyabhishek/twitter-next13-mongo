import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  if (!userId || typeof userId !== "string") {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "Invalid request" }),
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const followersCount = await prisma.user.count({
    where: {
      followingIds: {
        has: userId,
      },
    },
  });

  return NextResponse.json({
    ...existingUser,
    follower_count: followersCount,
  });
}
