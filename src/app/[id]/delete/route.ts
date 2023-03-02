import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

export const DELETE = async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").filter((x) => x)[0];
  console.log(req.nextUrl.pathname, id);
  const session = await getServerSession(authOptions);
  console.log(session?.user.id, id);

  if (!session || !id) return NextResponse.error();

  const res = await prisma.chat.delete({
    where: {
      personId_userId: {
        personId: id,
        userId: session.user.id,
      },
    },
  });
  return NextResponse.json(res);
};
