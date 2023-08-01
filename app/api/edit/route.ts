import authOptions from "@/libs/auth";
import { getServerSession } from "next-auth";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    const { username, name, bio, profileImage, coverImage } =
      (await req.json()) as any;

    if (!name || !username) {
      throw new Error("Missing fields");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        name,
        username,
        bio,
        profileImage,
        coverImage,
      },
    });

    return NextResponse.json({ user: updatedUser });
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
