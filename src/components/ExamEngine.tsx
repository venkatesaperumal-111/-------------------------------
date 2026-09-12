"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type QuestionData = {
  id: string;
  text: string;
  options: string;
  correctAnswer: number;
  explanation: string | null;
};

type ShuffledQuestion = QuestionData & {
  shuffledOptions: string[];
  mappedCorrect: number; // index in shuffledOptions that is correct
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ExamEngine({
  topicName,
  questions,
  topicId,
  durationMinutes = 30,
}: {
  topicName: string;
  questions: QuestionData[];
  topicId: string;
  durationMinutes?: number;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const [shuffled, setShuffled] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | null>>({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultData, setResultData] = useState<{ score: number; total: number } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "correct" | "wrong" | "skipped">("all");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Shuffle questions and options on mount
  useEffect(() => {
    const shuffledQs = shuffleArray(questions).slice(0, Math.min(50, questions.length));
    const prepared: ShuffledQuestion[] = shuffledQs.map(q => {
      const opts = JSON.parse(q.options) as string[];
      const correctText = opts[q.correctAnswer];
      const shuffledOpts = shuffleArray(opts);
      const mappedCorrect = shuffledOpts.indexOf(correctText);
      return { ...q, shuffledOptions: shuffledOpts, mappedCorrect };
    });
    setShuffled(prepared);
  }, []);

  // Timer
  useEffect(() => {
    if (isSubmitted || shuffled.length === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isSubmitted, shuffled.length]);

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (isSubmitted || isSubmitting) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitting(true);
    setShowConfirm(false);

    // Build answers map using original question IDs
    const answersPayload: Record<string, number | null> = {};
    shuffled.forEach((q, idx) => {
      const selected = selectedAnswers[idx] ?? null;
      // Convert shuffled index back to original index
      if (selected !== null) {
        const selectedText = q.shuffledOptions[selected];
        const originalOptions = JSON.parse(q.options) as string[];
        answersPayload[q.id] = originalOptions.indexOf(selectedText);
      } else {
        answersPayload[q.id] = null;
      }
    });

    try {
      if (session?.user) {
        const res = await fetch("/api/attempts/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topicId,
            questionCount: shuffled.length,
            questions: shuffled.map(q => ({ id: q.id, correctAnswer: q.correctAnswer })),
            answers: answersPayload,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setResultData({ score: data.score, total: data.total });
        }
      } else {
        // Local calculation for non-logged-in users
        let score = 0;
        shuffled.forEach((q, idx) => {
          if (selectedAnswers[idx] === q.mappedCorrect) score++;
        });
        setResultData({ score, total: shuffled.length });
      }
    } catch {
      // Fallback local calculation
      let score = 0;
      shuffled.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.mappedCorrect) score++;
      });
      setResultData({ score, total: shuffled.length });
    }

    setIsSubmitted(true);
    setIsSubmitting(false);
  }, [isSubmitted, isSubmitting, shuffled, selectedAnswers, session, topicId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isTimeCritical = timeLeft < 120;

  if (shuffled.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertCircle className="h-14 w-14 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-600 mb-2">கேள்விகள் இல்லை</h2>
        <p className="text-slate-400 mb-6">இந்த தலைப்பிற்கான கேள்விகள் விரைவில் சேர்க்கப்படும்.</p>
        <button onClick={() => router.push("/practice")} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          திரும்பு
        </button>
      </div>
    );
  }

  // ===================== RESULT VIEW =====================
  if (isSubmitted && resultData) {
    const pct = Math.round((resultData.score / resultData.total) * 100);
    const perf = pct >= 90 ? "மிகச் சிறந்த செயல்திறன்! 🏆" :
      pct >= 75 ? "சிறந்த செயல்திறன்! 👍" :
      pct >= 50 ? "மேலும் பயிற்சி தேவை 📚" :
      "இந்த தலைப்பில் கூடுதல் பயிற்சி மேற்கொள்ளுங்கள் 💪";

    const correct = shuffled.filter((q, i) => selectedAnswers[i] === q.mappedCorrect);
    const wrong = shuffled.filter((q, i) => selectedAnswers[i] !== undefined && selectedAnswers[i] !== null && selectedAnswers[i] !== q.mappedCorrect);
    const skipped = shuffled.filter((q, i) => selectedAnswers[i] === undefined || selectedAnswers[i] === null);

    const filtered = reviewFilter === "correct" ? correct
      : reviewFilter === "wrong" ? wrong
      : reviewFilter === "skipped" ? skipped
      : shuffled;

    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Result Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">தேர்வு முடிவுகள்</h2>
          <div className={`text-6xl font-extrabold mb-3 ${pct >= 75 ? "text-green-600" : pct >= 50 ? "text-yellow-600" : "text-red-600"}`}>
            {pct}%
          </div>
          <p className="text-slate-600 text-lg mb-6">{perf}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-6">
            {[
              { label: "மொத்த கேள்விகள்", val: resultData.total, color: "slate" },
              { label: "சரியான விடைகள்", val: resultData.score, color: "green" },
              { label: "தவறான விடைகள்", val: wrong.length, color: "red" },
              { label: "பதில் அளிக்காதவை", val: skipped.length, color: "amber" },
            ].map(({ label, val, color }) => (
              <div key={label} className={`bg-${color}-50 rounded-xl p-4`}>
                <div className={`text-2xl font-bold text-${color}-600`}>{val}</div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => { setIsSubmitted(false); setSelectedAnswers({}); setTimeLeft(durationMinutes * 60); setResultData(null); setCurrentIndex(0); const shuffledQs = shuffleArray(questions); const prepared: ShuffledQuestion[] = shuffledQs.map(q => { const opts = JSON.parse(q.options) as string[]; const correctText = opts[q.correctAnswer]; const shuffledOpts = shuffleArray(opts); const mappedCorrect = shuffledOpts.indexOf(correctText); return { ...q, shuffledOptions: shuffledOpts, mappedCorrect }; }); setShuffled(prepared); }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              மீண்டும் முயற்சி
            </button>
            <button onClick={() => router.push("/practice")} className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition">
              பயிற்சிக்கு திரும்பு
            </button>
          </div>
        </div>

        {/* Answer Review */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: "all", label: "அனைத்தும்" },
              { key: "correct", label: `✓ சரி (${correct.length})` },
              { key: "wrong", label: `✗ தவறு (${wrong.length})` },
              { key: "skipped", label: `— தவிர்த்தவை (${skipped.length})` },
            ].map(f => (
              <button key={f.key} onClick={() => setReviewFilter(f.key as typeof reviewFilter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${reviewFilter === f.key ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filtered.map((q, fIdx) => {
              const globalIdx = shuffled.indexOf(q);
              const userAnswer = selectedAnswers[globalIdx];
              const isCorrect = userAnswer === q.mappedCorrect;
              const isSkip = userAnswer === undefined || userAnswer === null;

              return (
                <div key={q.id} className={`rounded-xl border-l-4 p-5 ${isCorrect ? "border-green-400 bg-green-50" : isSkip ? "border-slate-300 bg-slate-50" : "border-red-400 bg-red-50"}`}>
                  <div className="flex gap-3 mb-4">
                    <span className="font-bold text-slate-400 shrink-0">{fIdx + 1}.</span>
                    <p className="font-medium text-slate-800 leading-relaxed">{q.text}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-6 mb-4">
                    {q.shuffledOptions.map((opt, oIdx) => {
                      let cls = "border rounded-lg p-3 text-sm ";
                      if (oIdx === q.mappedCorrect) cls += "bg-green-100 border-green-400 text-green-800 font-semibold";
                      else if (oIdx === userAnswer) cls += "bg-red-100 border-red-400 text-red-800";
                      else cls += "bg-white border-slate-200 text-slate-600";
                      return <div key={oIdx} className={cls}><span className="mr-2 font-bold text-slate-400">{["A","B","C","D"][oIdx]}.</span>{opt}</div>;
                    })}
                  </div>
                  {q.explanation && (
                    <div className="ml-6 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                      <span className="font-bold">விளக்கம்: </span>{q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ===================== EXAM VIEW =====================
  const currentQ = shuffled[currentIndex];
  const answered = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">தேர்வை சமர்ப்பிக்கிறீர்களா?</h3>
            <p className="text-slate-500 mb-6">{shuffled.length - answered} கேள்விகள் பதில் அளிக்கப்படவில்லை.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => handleSubmit()} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">சமர்ப்பிக்க</button>
              <button onClick={() => setShowConfirm(false)} className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition">ரத்து செய்க</button>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm flex-wrap gap-3">
        <div>
          <h2 className="font-bold text-slate-800 text-lg">{topicName}</h2>
          <p className="text-slate-400 text-sm">கேள்வி {currentIndex + 1} / {shuffled.length}</p>
        </div>
        <div className={`flex items-center gap-2 text-2xl font-mono font-bold ${isTimeCritical ? "text-red-600 animate-pulse" : "text-blue-600"}`}>
          <Clock className="h-5 w-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-200 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${((currentIndex + 1) / shuffled.length) * 100}%` }} />
      </div>

      {/* Question Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-4 shadow-sm min-h-72">
        <div className="flex gap-4 mb-6">
          <div className="bg-blue-600 text-white font-bold w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm">
            {currentIndex + 1}
          </div>
          <p className="text-slate-800 text-lg leading-relaxed font-medium pt-0.5">{currentQ.text}</p>
        </div>

        <div className="space-y-3 ml-13 pl-1">
          {currentQ.shuffledOptions.map((opt, idx) => {
            const isSelected = selectedAnswers[currentIndex] === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedAnswers(p => ({ ...p, [currentIndex]: idx }))}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-900 shadow"
                    : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-slate-700"
                }`}
              >
                <span className={`font-bold mr-3 ${isSelected ? "text-blue-600" : "text-slate-400"}`}>
                  {["A", "B", "C", "D"][idx]}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-3 mb-4 shadow-sm gap-2 flex-wrap">
        <button
          onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
        >
          <ChevronLeft className="h-4 w-4" /> முந்தைய
        </button>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition text-sm shadow"
        >
          {isSubmitting ? "சமர்ப்பிக்கிறோம்..." : "தேர்வை சமர்ப்பிக்க"}
        </button>

        <button
          onClick={() => setCurrentIndex(p => Math.min(shuffled.length - 1, p + 1))}
          disabled={currentIndex === shuffled.length - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
        >
          அடுத்த <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Question Navigator */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <p className="text-sm font-medium text-slate-600">கேள்வி பட்டியல்</p>
          <div className="flex gap-3 text-xs text-slate-400 ml-auto">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600 inline-block" /> தற்போது</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> பதில் அளித்தது</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-200 inline-block" /> பதில் அளிக்காதது</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {shuffled.map((_, idx) => {
            const isCurrent = idx === currentIndex;
            const isAns = selectedAnswers[idx] !== undefined && selectedAnswers[idx] !== null;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition border ${
                  isCurrent ? "bg-blue-600 text-white border-blue-600 shadow" :
                  isAns ? "bg-green-100 text-green-800 border-green-300" :
                  "bg-slate-100 text-slate-500 border-slate-200 hover:bg-blue-50 hover:border-blue-300"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
