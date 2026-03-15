import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export async function POST(request) {
  try {
    const { student, scenario } = await request.json();

    const scenarios = {
      low_score: "consistently scoring below 60% and seems discouraged",
      disengaged: "not logging in for days and losing motivation",
      blocker: "stuck on a concept and making repeated errors",
      encourage: "doing well but could be pushed toward mastery",
    };

    const model = genAI.getGenerativeModel({
      model: "gemma-3-1b-it",
    });

    const prompt = `You are a master K-8 learning coach.
    
    Student: ${student.name}, Grade ${student.grade}, ${student.subject}
    Score: ${student.avgScore}%, Completion: ${student.lessonCompletion}%
    Streak: ${student.streak} days, Last active: ${student.lastActive}
    Error patterns: ${student.errorPatterns}
    Scenario: This student is ${scenarios[scenario]}
    
    Write a warm encouraging 10-minute rescue call script with:
    1) OPENING — build trust immediately
    2) CHECK-IN — how are they feeling?
    3) DIAGNOSIS — gently find the blocker
    4) INTERVENTION — specific strategy to unblock
    5) ACTION PLAN — one small win before next session
    6) CLOSE — leave them energized and confident
    
    Use age-appropriate language for Grade ${student.grade}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return Response.json({
      script: response.text()
    });

  } catch (error) {
    console.error("Coaching error:", error);
    return Response.json(
      { error: "Failed to generate coaching script" },
      { status: 500 }
    );
  }
}