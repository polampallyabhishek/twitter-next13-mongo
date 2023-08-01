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

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      hasNotification: false,
    },
  });

  return NextResponse.json(notifications);
}
