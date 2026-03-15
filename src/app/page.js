"use client";
import { useState } from "react";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("import");
const [selectedStudent, setSelectedStudent] = useState(null);
const [scenario, setScenario] = useState("low_score");
const [coachingScript, setCoachingScript] = useState("");
const [coachingLoading, setCoachingLoading] = useState(false);
const [emailTone, setEmailTone] = useState("concerned");
const [emailDraft, setEmailDraft] = useState("");
const [emailLoading, setEmailLoading] = useState(false);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      
      {/* HEADER */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center 
        justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br 
            from-amber-400 to-red-500 rounded-lg flex items-center 
            justify-center text-sm">
              ⚡
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                LearnPulse <span className="text-amber-400 
                italic">AI</span>
              </h1>
              <p className="text-xs text-gray-500">
                Student Performance Intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full 
            animate-pulse"></div>
            <span className="text-xs text-gray-400">
              AI Connected
            </span>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 
      py-3">
        <div className="max-w-6xl mx-auto flex gap-6">
          {[
            { 
              label: "Students", 
              value: students.length, 
              color: "text-blue-400" 
            },
            { 
              label: "At Risk", 
              value: students.filter(s => s.avgScore < 60).length, 
              color: "text-red-400" 
            },
            { 
              label: "On Track", 
              value: students.filter(s => s.avgScore >= 80).length, 
              color: "text-green-400" 
            },
            { 
              label: "Avg Score", 
              value: students.length ? 
                Math.round(students.reduce((a,b) => 
                a + b.avgScore, 0) / students.length) + "%" 
                : "—", 
              color: "text-amber-400" 
            },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div className="border-b border-gray-800 px-6">
        <div className="max-w-6xl mx-auto flex gap-1">
          {[
            { id: "import", label: "📥 Import" },
            { id: "data", label: "📊 Data" },
            { id: "insights", label: "🤖 AI Insights" },
            { id: "actions", label: "📞 Actions" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm border-b-2 
              transition-colors ${
                activeTab === tab.id
                  ? "border-amber-400 text-white font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        
        {/* IMPORT TAB */}
        {activeTab === "import" && (
          <div className="max-w-2xl">
            <div className="bg-gray-900 border border-gray-800 
            rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-2">
                📥 Import Student Data
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Paste your Google Sheets data below. 
                Headers and student rows will be auto-detected.
              </p>
              <textarea
                placeholder={`Paste your sheet data here...\n\nExample:\nname,grade,subject,avgScore,lessonCompletion\nZara Johnson,3,Reading,42,45\nNoah Kim,5,Science,94,95`}
                rows={8}
                className="w-full bg-gray-950 border border-gray-700 
                rounded-lg p-4 text-sm font-mono text-gray-300 
                placeholder-gray-600 focus:outline-none 
                focus:border-amber-400 resize-none"
                id="csvInput"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    const text = document
                      .getElementById("csvInput").value;
                    if (!text.trim()) return;
                    const lines = text.trim().split("\n")
                      .filter(l => l.trim());
                    if (lines.length < 2) return;
                    const headers = lines[0].split(",")
                      .map(h => h.trim().toLowerCase()
                      .replace(/\s+/g, ""));
                    const parsed = lines.slice(1).map((line, i) => {
                      const vals = line.split(",")
                        .map(v => v.trim());
                      const row = {};
                      headers.forEach((h, idx) => {
                        row[h] = vals[idx] || "";
                      });
                      return {
                        id: i + 1,
                        name: row.name || `Student ${i+1}`,
                        grade: parseInt(row.grade) || 3,
                        subject: row.subject || "General",
                        avgScore: parseInt(row.avgscore) || 70,
                        lessonCompletion: 
                          parseInt(row.lessoncomplete ||
                          row.lessoncompletion) || 70,
                        streak: parseInt(row.streak) || 0,
                        lastActive: row.lastactive || "Unknown",
                        errorPatterns: row.errorpatterns || "None",
                        parentName: row.parentname || "",
                        parentEmail: row.parentemail || "",
                      };
                    });
                    setStudents(parsed);
                    setActiveTab("data");
                  }}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 
                  text-gray-900 font-bold py-3 rounded-lg 
                  transition-colors text-sm"
                >
                  ⬆ Import Students
                </button>
                <button
                  onClick={() => {
                    const demo = [
                      { id:1, name:"Ava Thompson", grade:3, 
                        subject:"Math", avgScore:88, 
                        lessonCompletion:92, streak:7, 
                        lastActive:"Today", 
                        errorPatterns:"None",
                        parentName:"Lisa Thompson", 
                        parentEmail:"lisa@email.com" },
                      { id:2, name:"Liam Patel", grade:4, 
                        subject:"Reading", avgScore:54, 
                        lessonCompletion:61, streak:0, 
                        lastActive:"4 days ago", 
                        errorPatterns:"Skipping questions",
                        parentName:"Raj Patel", 
                        parentEmail:"raj@email.com" },
                      { id:3, name:"Zara Johnson", grade:3, 
                        subject:"Reading", avgScore:42, 
                        lessonCompletion:45, streak:0, 
                        lastActive:"6 days ago", 
                        errorPatterns:"Low engagement",
                        parentName:"Dana Johnson", 
                        parentEmail:"dana@email.com" },
                      { id:4, name:"Noah Kim", grade:5, 
                        subject:"Science", avgScore:94, 
                        lessonCompletion:95, streak:12, 
                        lastActive:"Today", 
                        errorPatterns:"None",
                        parentName:"James Kim", 
                        parentEmail:"james@email.com" },
                      { id:5, name:"Sofia Reyes", grade:2, 
                        subject:"Math", avgScore:71, 
                        lessonCompletion:78, streak:2, 
                        lastActive:"Yesterday", 
                        errorPatterns:"Word problems",
                        parentName:"Maria Reyes", 
                        parentEmail:"maria@email.com" },
                    ];
                    setStudents(demo);
                    setActiveTab("data");
                  }}
                  className="px-4 bg-gray-800 hover:bg-gray-700 
                  text-gray-300 font-medium py-3 rounded-lg 
                  transition-colors text-sm border border-gray-700"
                >
                  Load Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DATA TAB */}
        {activeTab === "data" && (
          <div>
            {students.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <div className="text-4xl mb-4">📭</div>
                <p>No students yet — go to Import tab first</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      {["Student","Grade","Subject","Score",
                        "Completion","Streak","Last Active",
                        "Status"].map(h => (
                        <th key={h} className="text-left py-3 
                        px-4 text-xs text-gray-500 font-medium 
                        uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s.id} 
                        className={`border-b border-gray-900 
                        hover:bg-gray-900 transition-colors ${
                          i % 2 === 0 ? "bg-gray-950" : 
                          "bg-gray-900/50"
                        }`}
                      >
                        <td className="py-3 px-4 font-medium 
                        text-white">
                          {s.avgScore < 60 && (
                            <span className="text-red-400 
                            mr-2">⚑</span>
                          )}
                          {s.name}
                        </td>
                        <td className="py-3 px-4 
                        text-gray-400">{s.grade}</td>
                        <td className="py-3 px-4 
                        text-blue-300">{s.subject}</td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${
                            s.avgScore >= 80 ? "text-green-400" :
                            s.avgScore >= 60 ? "text-amber-400" :
                            "text-red-400"
                          }`}>
                            {s.avgScore}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 
                            bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  s.lessonCompletion >= 80 ? 
                                  "bg-green-400" :
                                  s.lessonCompletion >= 60 ? 
                                  "bg-amber-400" : "bg-red-400"
                                }`}
                                style={{ 
                                  width: `${s.lessonCompletion}%` 
                                }}
                              />
                            </div>
                            <span className="text-gray-400 text-xs">
                              {s.lessonCompletion}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={
                            s.streak > 3 ? "text-green-400" :
                            s.streak === 0 ? "text-red-400" :
                            "text-amber-400"
                          }>
                            {s.streak}d 🔥
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 
                        text-xs">{s.lastActive}</td>
                        <td className="py-3 px-4">
                          {s.avgScore < 60 ? (
                            <span className="bg-red-400/20 
                            text-red-400 text-xs px-2 py-1 
                            rounded-full font-medium">
                              At Risk
                            </span>
                          ) : s.avgScore >= 80 ? (
                            <span className="bg-green-400/20 
                            text-green-400 text-xs px-2 py-1 
                            rounded-full font-medium">
                              On Track
                            </span>
                          ) : (
                            <span className="bg-amber-400/20 
                            text-amber-400 text-xs px-2 py-1 
                            rounded-full font-medium">
                              Monitor
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === "insights" && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between 
            mb-6">
              <div>
                <h2 className="text-lg font-semibold">
                  🤖 AI Cohort Analysis
                </h2>
                <p className="text-gray-400 text-sm">
                  {students.length} students loaded
                </p>
              </div>
              <button
                onClick={async () => {
                  if (students.length === 0) {
                    alert("Import students first!");
                    return;
                  }
                  setLoading(true);
                  setInsight("");
                  try {
                    const res = await fetch("/api/analyze", {
                      method: "POST",
                      headers: { 
                        "Content-Type": "application/json" 
                      },
                      body: JSON.stringify({ students }),
                    });
                    const data = await res.json();
                    setInsight(data.insight || data.error);
                  } catch (e) {
                    setInsight("Error — check console");
                  }
                  setLoading(false);
                }}
                disabled={loading || students.length === 0}
                className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                loading || students.length === 0
                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-400 to-red-500 text-gray-900 hover:opacity-90"
                }`}      
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⟳</span>
                    Analyzing...
                  </span>
                ) : "⚡ Run Analysis"}
              </button>
            </div>

            {insight ? (
              <div className="bg-gray-900 border border-gray-800 
              rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4 
                pb-4 border-b border-gray-800">
                  <div className="w-2 h-2 bg-green-400 
                  rounded-full"></div>
                  <span className="text-xs text-gray-500">
                    Analysis complete · {new Date()
                    .toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-gray-300 
                whitespace-pre-wrap leading-relaxed">
                  {insight}
                </div>
              </div>
            ) : (
              <div className="border border-dashed 
              border-gray-800 rounded-xl p-16 text-center 
              text-gray-600">
                <div className="text-4xl mb-4">🧠</div>
                <p>Hit the button to analyze your cohort</p>
              </div>
            )}
          </div>
        )}

        {/* ACTIONS TAB */}
{activeTab === "actions" && (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* LEFT — Student Selector */}
    <div className="lg:col-span-1">
      <h3 className="text-sm font-medium text-gray-400 
      uppercase tracking-wider mb-3">
        Select Student
      </h3>
      {students.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 
        rounded-xl p-6 text-center text-gray-600 text-sm">
          Import students first
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {students.map(s => (
            <div
              key={s.id}
              onClick={() => setSelectedStudent(s)}
              className={`p-3 rounded-xl border cursor-pointer 
              transition-all ${
                selectedStudent?.id === s.id
                  ? "border-amber-400 bg-gray-900"
                  : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-white">
                    {s.avgScore < 60 && (
                      <span className="text-red-400 mr-1">⚑</span>
                    )}
                    {s.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Gr.{s.grade} · {s.subject}
                  </div>
                </div>
                <span className={`text-sm font-bold ${
                  s.avgScore >= 80 ? "text-green-400" :
                  s.avgScore >= 60 ? "text-amber-400" :
                  "text-red-400"
                }`}>
                  {s.avgScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* RIGHT — Action Panel */}
    <div className="lg:col-span-2">
      {!selectedStudent ? (
        <div className="border border-dashed border-gray-800 
        rounded-xl p-16 text-center text-gray-600">
          <div className="text-4xl mb-4">👈</div>
          <p>Select a student to generate actions</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">

          {/* Student Card */}
          <div className="bg-gray-900 border border-gray-800 
          rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedStudent.name}
                </h3>
                <p className="text-gray-400 text-sm mt-0.5">
                  Grade {selectedStudent.grade} · {selectedStudent.subject}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${
                  selectedStudent.avgScore >= 80 ? "text-green-400" :
                  selectedStudent.avgScore >= 60 ? "text-amber-400" :
                  "text-red-400"
                }`}>
                  {selectedStudent.avgScore}%
                </div>
                <div className="text-xs text-gray-500">avg score</div>
              </div>
            </div>
            <div className="flex gap-3 mt-4 flex-wrap">
              {[
                ["Completion", `${selectedStudent.lessonCompletion}%`],
                ["Streak", `${selectedStudent.streak}d 🔥`],
                ["Last Active", selectedStudent.lastActive],
                ["Errors", selectedStudent.errorPatterns],
              ].map(([label, value]) => (
                <div key={label} className="bg-gray-950 rounded-lg 
                px-3 py-2 text-xs">
                  <span className="text-gray-500">{label}: </span>
                  <span className="text-gray-300 font-medium">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Coaching Script Generator */}
          <div className="bg-gray-900 border border-gray-800 
          rounded-xl p-5">
            <h4 className="font-semibold text-white mb-3">
              📞 Coaching Call Script
            </h4>
            <div className="flex gap-2 flex-wrap mb-4">
              {[
                { key: "low_score", label: "📉 Low Score" },
                { key: "disengaged", label: "💤 Disengaged" },
                { key: "blocker", label: "🧱 Blocker" },
                { key: "encourage", label: "🚀 Push to Mastery" },
              ].map(sc => (
                <button
                  key={sc.key}
                  onClick={() => setScenario(sc.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs 
                  font-medium transition-all border ${
                    scenario === sc.key
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
            <button
              onClick={async () => {
                setCoachingLoading(true);
                setCoachingScript("");
                try {
                  const res = await fetch("/api/coaching", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      student: selectedStudent,
                      scenario
                    }),
                  });
                  const data = await res.json();
                  setCoachingScript(
                    data.script || data.error
                  );
                } catch (e) {
                  setCoachingScript("Error generating script");
                }
                setCoachingLoading(false);
              }}
              disabled={coachingLoading}
              className={`w-full py-2.5 rounded-lg text-sm 
              font-bold transition-all ${
                coachingLoading
                  ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {coachingLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⟳</span>
                  Writing script...
                </span>
              ) : "📞 Generate Call Script"}
            </button>
            {coachingScript && (
              <div className="mt-4">
                <div className="flex justify-between items-center 
                mb-2">
                  <span className="text-xs text-gray-500">
                    ~10 min call
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coachingScript);
                      alert("Copied to clipboard!");
                    }}
                    className="text-xs text-blue-400 
                    hover:text-blue-300"
                  >
                    Copy ↗
                  </button>
                </div>
                <div className="bg-gray-950 rounded-lg p-4 
                text-sm text-gray-300 whitespace-pre-wrap 
                leading-relaxed max-h-64 overflow-y-auto">
                  {coachingScript}
                </div>
              </div>
            )}
          </div>

          {/* Parent Email Generator */}
          <div className="bg-gray-900 border border-gray-800 
          rounded-xl p-5">
            <h4 className="font-semibold text-white mb-3">
              📧 Parent Email
            </h4>
            <div className="flex gap-2 flex-wrap mb-4">
              {[
                { key: "concerned", label: "😟 Concerned" },
                { key: "positive", label: "🎉 Celebrating" },
                { key: "checkIn", label: "📋 Check-In" },
                { key: "urgent", label: "🚨 Urgent" },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setEmailTone(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs 
                  font-medium transition-all border ${
                    emailTone === t.key
                      ? "bg-purple-500 border-purple-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              onClick={async () => {
                setEmailLoading(true);
                setEmailDraft("");
                try {
                  const res = await fetch("/api/email", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      student: selectedStudent,
                      tone: emailTone
                    }),
                  });
                  const data = await res.json();
                  setEmailDraft(data.email || data.error);
                } catch (e) {
                  setEmailDraft("Error generating email");
                }
                setEmailLoading(false);
              }}
              disabled={emailLoading}
              className={`w-full py-2.5 rounded-lg text-sm 
              font-bold transition-all ${
                emailLoading
                  ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-500 text-white"
              }`}
            >
              {emailLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⟳</span>
                  Drafting email...
                </span>
              ) : "📧 Generate Parent Email"}
            </button>
            {emailDraft && (
              <div className="mt-4">
                <div className="flex justify-between 
                items-center mb-2">
                  <span className="text-xs text-gray-500">
                    Ready to send
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(emailDraft);
                      alert("Copied to clipboard!");
                    }}
                    className="text-xs text-purple-400 
                    hover:text-purple-300"
                  >
                    Copy ↗
                  </button>
                </div>
                <div className="bg-gray-950 rounded-lg p-4 
                text-sm text-gray-300 whitespace-pre-wrap 
                leading-relaxed max-h-64 overflow-y-auto">
                  {emailDraft}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  </div>
)}

      </div>
    </main>
  );
}