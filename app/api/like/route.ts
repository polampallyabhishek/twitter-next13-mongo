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

    const userId = session?.user?.id;

    const { postId } = (await req.json()) as {
      postId: string;
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

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Invalid ID",
        }),
        { status: 400 }
      );
    }

    let updatedLikedIds = [...(post.likedIds || [])];

    if (updatedLikedIds.includes(userId)) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Already liked",
        }),
        { status: 400 }
      );
    }

    updatedLikedIds.push(userId);

    try {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (post?.userId) {
        await prisma.notification.create({
          data: {
            body: "Someone liked your tweet!",
            userId: post.userId,
          },
        });

        await prisma.user.update({
          where: {
            id: post.userId,
          },
          data: {
            hasNotification: true,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likedIds: updatedLikedIds,
      },
    });

    return NextResponse.json(updatedPost);
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

    const { postId } = (await req.json()) as {
      postId: string;
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

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Invalid ID",
        }),
        { status: 400 }
      );
    }

    let updatedLikedIds = [...(post.likedIds || [])];

    if (!updatedLikedIds.includes(userId)) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Not liked",
        }),
        { status: 400 }
      );
    }

    updatedLikedIds = updatedLikedIds.filter((likedId) => likedId !== userId);

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likedIds: updatedLikedIds,
      },
    });

    return NextResponse.json(updatedPost);
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
