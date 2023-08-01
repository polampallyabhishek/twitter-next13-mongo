import authOptions from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get("postId");
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

    const userId = session?.user?.id;

    const { body } = (await req.json()) as {
      body: string;
    };

    if (!postId || typeof postId !== "string") {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Invalid ID",
        }),
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        body,
        userId,
        postId,
      },
    });

    return NextResponse.json(comment);
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

    const userId = session?.user?.id;

    const { commentId } = (await req.json()) as {
      commentId: string;
    };

    if (!commentId || typeof commentId !== "string") {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Invalid ID",
        }),
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment || comment.userId !== userId) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Invalid ID",
        }),
        { status: 400 }
      );
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json("Comment deleted");
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
