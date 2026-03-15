import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export async function POST(request) {
  try {
    const { student, tone } = await request.json();

    const tones = {
      concerned: "concerned but warm — child needs extra support at home",
      positive: "celebratory — sharing wonderful progress with proud parent",
      checkIn: "friendly routine weekly update — neutral and informative",
      urgent: "urgent — student has not engaged in days, needs immediate attention",
    };

    const model = genAI.getGenerativeModel({
      model: "gemma-3-1b-it",
    });

    const prompt = `You are a compassionate learning coach 
    writing to a parent.
    
    Student: ${student.name}, Grade ${student.grade}, ${student.subject}
    Score: ${student.avgScore}%, Completion: ${student.lessonCompletion}%
    Streak: ${student.streak} days, Last active: ${student.lastActive}
    Parent name: ${student.parentName || "Parent"}
    Tone: ${tones[tone]}
    
    Write a parent email with:
    - Subject line
    - Warm personal greeting
    - Specific data points about their child
    - What you as the coach are doing about it
    - ONE concrete action they can do at home
    - Hopeful encouraging close
    
    Human and warm — not corporate. 
    Parents should feel like partners not bystanders.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return Response.json({
      email: response.text()
    });

  } catch (error) {
    console.error("Email error:", error);
    return Response.json(
      { error: "Failed to generate email" },
      { status: 500 }
    );
  }
}