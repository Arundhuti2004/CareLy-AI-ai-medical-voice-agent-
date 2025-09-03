
import { AIDoctorAgents } from "@/app/shared/list";
import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { sessionsChatTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

const REPORT_GEN_PROMPT = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on the transcript, generate a structured report with the following fields:

{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"]
}

Respond ONLY with valid JSON, no explanations or extra text.`;

export async function POST(req: NextRequest) {
  try {
    const { session, sessionDetails, message } = await req.json();

    // Guard clause for missing data
     let selectedAgent = AIDoctorAgents[0]; // default = General Physician
    const lowercaseNotes = (message || "").toLowerCase();

    if (lowercaseNotes.includes("child") || lowercaseNotes.includes("baby")) {
      selectedAgent = AIDoctorAgents.find(a => a.specialist === "Pediatrician")!;
    } else if (
      lowercaseNotes.includes("skin") ||
      lowercaseNotes.includes("rash") ||
      lowercaseNotes.includes("acne")
    ) {
      selectedAgent = AIDoctorAgents.find(a => a.specialist === "Dermatologist")!;
    } else if (
      lowercaseNotes.includes("anxiety") ||
      lowercaseNotes.includes("stress") ||
      lowercaseNotes.includes("depression")
    ) {
      selectedAgent = AIDoctorAgents.find(a => a.specialist === "Psychologist")!;
    }


    // Step 2: Ask DeepSeek, enforce JSON
    const UserInput = `AI Doctor Agent Info: ${JSON.stringify(sessionDetails)} Conversation: ${JSON.stringify(message)}`;
    let completion;
    try{
     completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [
        {
          role: "system",
          content: REPORT_GEN_PROMPT
        },
        { role: "user", content: UserInput }
      ]
    });
  } catch (err: any) {
      if (err.status === 429) {
        console.warn("Rate limit hit. Falling back to gpt-4o-mini...");
        completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: REPORT_GEN_PROMPT },
            { role: "user", content: UserInput }
          ]
        });
      } else {
        throw err;
      }
    }

    // Step 3: Parse safely
       const rawResp = completion.choices[0].message?.content || "{}";
      const cleaned = rawResp.replace(/```json/g, "").replace(/```/g, "").trim();

    let jsonResp;
    try {
      jsonResp = JSON.parse(cleaned);
    } catch {
      jsonResp = {
        specialist: selectedAgent.specialist,
        image: selectedAgent.image,
        description: selectedAgent.description,
        agentPrompt: selectedAgent.agentPrompt,
        voiceId: selectedAgent.voiceId,
        message: rawResp
      };
    }

    // Step 4: Update DB
    try {
      await db.update(sessionsChatTable).set({
        report: jsonResp,
        conversation: message
      }).where(eq(sessionsChatTable.sessionId, session.sessionId));
      return NextResponse.json(jsonResp, { status: 200 });
    } catch (dbError: any) {

      console.error("DB error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(jsonResp, { status: 200 });

  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}