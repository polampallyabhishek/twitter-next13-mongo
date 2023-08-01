import authOptions from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Unauthenticated",
        }),
        { status: 401 }
      );
    }

    const { userId } = (await req.json()) as {
      userId: string;
    };

    if (!userId || typeof userId !== "string") {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Invalid ID",
        }),
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Invalid ID",
        }),
        { status: 400 }
      );
    }

    let updatedFollowingIds = [...(user.followingIds || [])];

    if (updatedFollowingIds.includes(userId)) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Already a follower",
        }),
        { status: 400 }
      );
    }

    updatedFollowingIds.push(userId);

    const updatedUser = await prisma.user.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        followingIds: updatedFollowingIds,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Unauthenticated",
        }),
        { status: 401 }
      );
    }

    const { userId } = (await req.json()) as {
      userId: string;
    };

    if (!userId || typeof userId !== "string") {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Invalid ID",
        }),
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Invalid ID",
        }),
        { status: 400 }
      );
    }

    let updatedFollowingIds = [...(user.followingIds || [])];

    if (!updatedFollowingIds.includes(userId)) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "No follower",
        }),
        { status: 400 }
      );
    }

    updatedFollowingIds = updatedFollowingIds.filter(
      (followingId) => followingId !== userId
    );

    const updatedUser = await prisma.user.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        followingIds: updatedFollowingIds,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
