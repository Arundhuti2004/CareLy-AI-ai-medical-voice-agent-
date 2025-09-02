import { db } from "@/config/db";
import { sessionsChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req:NextRequest){
    const {notes , selectedDoctor} = await req.json();
    const user = await currentUser();

    try {
        const sessionId = uuidv4();
        const result = await db.insert(sessionsChatTable).values({
            sessionId : sessionId,
            CreatedBy: user?.primaryEmailAddress?.emailAddress ,
            notes: notes,
            selectedDoctor: selectedDoctor,
            CreateOn : (new Date()).toString()
            //@ts-ignore
        }).returning({sessionsChatTable})
        return NextResponse.json(result[0]?.sessionsChatTable);
    } catch (error) {
        return NextResponse.json(error);
    }
}


export async function GET(req:NextRequest){
    const {searchParams} = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const user = await currentUser();

    const result = await db.select().from(sessionsChatTable)
    //@ts-ignore
    .where(eq(sessionsChatTable.sessionId, sessionId));


    return NextResponse.json(result[0]);
}