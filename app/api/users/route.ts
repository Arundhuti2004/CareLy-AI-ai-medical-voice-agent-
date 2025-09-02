import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../config/db";
import { usersTable } from "../../../config/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "No authenticated user" }, { status: 401 });
    }

    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, user.primaryEmailAddress?.emailAddress ?? ""));

    if (existingUsers.length === 0) {
      const inserted = await db
        .insert(usersTable)
        .values({
          email: user.primaryEmailAddress?.emailAddress ?? "",
          name: user.fullName ?? "",
          credits: 10,
        })
        .returning({ id: usersTable.id, email: usersTable.email });

      return NextResponse.json(inserted[0]?usersTable:null, { status: 201 });
    }

    // ✅ Always return something
    return NextResponse.json(existingUsers[0], { status: 200 });
  } catch (error: any) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
