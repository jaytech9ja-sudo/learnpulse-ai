import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export async function POST(request) {
  try {
    const { students } = await request.json();

    if (!students || students.length === 0) {
      return Response.json(
        { error: "No student data provided" },
        { status: 400 }
      );
    }

    const studentSummary = students
      .map(
        (s) =>
          `${s.name} (Grade ${s.grade}, ${s.subject}): ` +
          `Score=${s.avgScore}%, Completion=${s.lessonCompletion}%, ` +
          `Streak=${s.streak} days, Last active=${s.lastActive}, ` +
          `Errors="${s.errorPatterns}"`
      )
      .join("\n");

    const model = genAI.getGenerativeModel({
      model: "gemma-3-1b-it",
    });

    const prompt = `You are an expert EdTech data analyst for an 
    AI-powered school. Analyze this student performance data 
    and provide:
    
    1. 🔍 KEY PATTERNS across the cohort
    2. 🚨 TOP 3 AT-RISK students and exactly why
    3. ⚡ INTERVENTIONS to action within 48 hours
    4. ✅ ONE quick win to implement today
    
    Student data:
    ${studentSummary}
    
    Be specific, warm, and action-oriented. 
    Plain language only.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({ insight: text });

  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}