import { AIDoctorAgents } from "@/app/shared/list";
import { openai } from "@/config/OpenAiModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json();

    // Step 1: Select agent
    let selectedAgent = AIDoctorAgents[0]; // default = General Physician
    const lowercaseNotes = (notes || "").toLowerCase();

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
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [
        {
          role: "system",
          content: `You are ${selectedAgent.specialist} AI. 
          Follow this prompt: ${selectedAgent.agentPrompt}.
          IMPORTANT: Always respond in valid JSON with this format:
          {
            "specialist": "${selectedAgent.specialist}",
            "image": "${selectedAgent.image}",
            "description": "${selectedAgent.description}",
            "agentPrompt": "${selectedAgent.agentPrompt}",
            "voiceId": "${selectedAgent.voiceId}",
            "message": string
          }`
        },
        { role: "user", content: notes }
      ]
    });

    // Step 3: Parse safely
    const rawResp = completion.choices[0].message?.content || "{}";
    const Resp =  rawResp
  .replace(/```json/g, '')
  .replace(/```/g, '')
  .trim();
    let jsonResp;
    try {
      jsonResp = JSON.parse(Resp);
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

    return NextResponse.json([jsonResp], { status: 200 });

  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
