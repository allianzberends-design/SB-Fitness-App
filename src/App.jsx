import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Home, Dumbbell, TrendingUp, User, Play, Pause, X, ChevronRight,
  ChevronLeft, Check, CheckCircle2, Flame, Clock, Search, SkipForward,
  RotateCcw, Trophy, ArrowLeft, Bell, Ruler, LogOut, Info, Zap
} from "lucide-react";
import {
  BarChart, Bar, XAxis, ResponsiveContainer, Cell,
} from "recharts";

/* ----------------------------- DESIGN TOKENS ----------------------------- */
const COLORS = {
  bg: "#0A0B0D",
  surface: "#141519",
  surfaceElevated: "#1C1E24",
  border: "#26282F",
  accent: "#2F6FED",
  accentSoft: "rgba(47,111,237,0.16)",
  text: "#F4F5F7",
  textDim: "#8A8D96",
  textFaint: "#5B5E67",
  success: "#42D77D",
  successSoft: "rgba(66,215,125,0.14)",
};

/* -------------------------------- DATA ------------------------------------ */
const MUSCLE_GROUPS = ["Ganzer Körper", "Oberkörper", "Unterkörper", "Körpermitte"];
const DIFFICULTIES = ["Anfänger", "Fortgeschritten", "Profi"];
const EQUIPMENT_OPTIONS = ["Kein Equipment", "Kurzhanteln", "Widerstandsband"];

const CATEGORY_META = {
  Bodyweight: { color: "#2F6FED" },
  HIIT: { color: "#FF6A3D" },
  Kraft: { color: "#C084FC" },
  Cardio: { color: "#42D77D" },
  Bauch: { color: "#FFC93D" },
};

const WORKOUTS = [
  {
    id: "w1",
    title: "Ganzkörper-Aktivierung",
    category: "Bodyweight",
    muscle: "Ganzer Körper",
    difficulty: "Anfänger",
    equipment: "Kein Equipment",
    duration: 15,
    points: 320,
    description:
      "Trainiere deine Muskeln progressiv mit vielen Wiederholungen und geringem Widerstand. Perfekt zum Einstieg in deine Training Journey.",
    exercises: [
      { name: "Jumping Jacks", kind: "time", value: 40, rest: 20 },
      { name: "Kniebeugen", kind: "reps", value: 15, rest: 20 },
      { name: "Liegestütze (Knie)", kind: "reps", value: 10, rest: 20 },
      { name: "Plank", kind: "time", value: 30, rest: 20 },
      { name: "Ausfallschritte", kind: "reps", value: 12, rest: 20 },
      { name: "Superman Hold", kind: "time", value: 25, rest: 0 },
    ],
  },
  {
    id: "w2",
    title: "Conditioning",
    category: "Bodyweight",
    muscle: "Ganzer Körper",
    difficulty: "Fortgeschritten",
    equipment: "Kein Equipment",
    duration: 32,
    points: 656,
    description:
      "Beine, Bauch & Kurven. Ein forderndes Ganzkörper-Intervall mit kontrollierter Geschwindigkeit und minimalen Pausen.",
    exercises: [
      { name: "Burpees", kind: "reps", value: 12, rest: 25 },
      { name: "Mountain Climbers", kind: "time", value: 40, rest: 20 },
      { name: "Kniebeugen Sprung", kind: "reps", value: 16, rest: 25 },
      { name: "Seitliche Ausfallschritte", kind: "reps", value: 14, rest: 20 },
      { name: "Plank Shoulder Taps", kind: "time", value: 35, rest: 20 },
      { name: "Glute Bridges", kind: "reps", value: 18, rest: 20 },
      { name: "High Knees", kind: "time", value: 30, rest: 0 },
    ],
  },
  {
    id: "w3",
    title: "Express-Workout",
    category: "HIIT",
    muscle: "Ganzer Körper",
    difficulty: "Fortgeschritten",
    equipment: "Kein Equipment",
    duration: 15,
    points: 410,
    description:
      "Maximale Intensität, minimale Zeit. Ein kurzes, knackiges HIIT-Intervall für Tage, an denen es schnell gehen muss.",
    exercises: [
      { name: "Climbers", kind: "time", value: 20, rest: 10 },
      { name: "Squat Jumps", kind: "reps", value: 15, rest: 15 },
      { name: "Push-up to Renegade Row", kind: "reps", value: 10, rest: 15 },
      { name: "Skater Jumps", kind: "time", value: 30, rest: 15 },
      { name: "Plank Jacks", kind: "time", value: 30, rest: 0 },
    ],
  },
  {
    id: "w4",
    title: "HIIT & Laufen",
    category: "Cardio",
    muscle: "Unterkörper",
    difficulty: "Fortgeschritten",
    equipment: "Kein Equipment",
    duration: 22,
    points: 380,
    description:
      "Steigere deine Performance mit einem Mix aus Lauf-Intervallen und explosiven Unterkörper-Übungen.",
    exercises: [
      { name: "Lockeres Einlaufen", kind: "time", value: 120, rest: 0 },
      { name: "Sprint-Intervall", kind: "time", value: 30, rest: 30 },
      { name: "Kniebeugen Sprung", kind: "reps", value: 15, rest: 20 },
      { name: "Sprint-Intervall", kind: "time", value: 30, rest: 30 },
      { name: "Ausfallschritte Walking", kind: "reps", value: 20, rest: 20 },
      { name: "Cool-down Lauf", kind: "time", value: 90, rest: 0 },
    ],
  },
  {
    id: "w5",
    title: "Kraftaufbau Oberkörper",
    category: "Kraft",
    muscle: "Oberkörper",
    difficulty: "Fortgeschritten",
    equipment: "Kurzhanteln",
    duration: 35,
    points: 540,
    description:
      "Baue Muskeln in Brust, Schultern und Armen auf – mit progressivem Trainingswiderstand und kontrollierten Wiederholungen.",
    exercises: [
      { name: "Dumbbell Bench Press", kind: "reps", value: 12, rest: 40 },
      { name: "Dumbbell Clean and Press", kind: "reps", value: 8, rest: 40 },
      { name: "Bent-over Row", kind: "reps", value: 12, rest: 40 },
      { name: "Schulterdrücken", kind: "reps", value: 10, rest: 35 },
      { name: "Bizeps Curls", kind: "reps", value: 14, rest: 30 },
      { name: "Trizeps Kickbacks", kind: "reps", value: 14, rest: 0 },
    ],
  },
  {
    id: "w6",
    title: "Bauchmuskel-Burner",
    category: "Bauch",
    muscle: "Körpermitte",
    difficulty: "Anfänger",
    equipment: "Kein Equipment",
    duration: 12,
    points: 240,
    description:
      "Back Extensions, Reverse Crunches und Co. – gezieltes Core-Training ganz ohne Equipment.",
    exercises: [
      { name: "Reverse Crunches", kind: "reps", value: 15, rest: 20 },
      { name: "Back Extensions", kind: "reps", value: 15, rest: 20 },
      { name: "Bicycle Crunches", kind: "time", value: 30, rest: 20 },
      { name: "Side Plank links", kind: "time", value: 20, rest: 10 },
      { name: "Side Plank rechts", kind: "time", value: 20, rest: 20 },
      { name: "Hollow Body Hold", kind: "time", value: 25, rest: 0 },
    ],
  },
  {
    id: "w7",
    title: "Rücken & Core Stability",
    category: "Kraft",
    muscle: "Körpermitte",
    difficulty: "Profi",
    equipment: "Widerstandsband",
    duration: 26,
    points: 470,
    description:
      "Stabilität statt Tempo: Trainiere tiefliegende Rumpf- und Rückenmuskulatur mit dem Widerstandsband.",
    exercises: [
      { name: "Band Pull-Apart", kind: "reps", value: 16, rest: 25 },
      { name: "Bird Dog", kind: "reps", value: 12, rest: 25 },
      { name: "Band Good Mornings", kind: "reps", value: 14, rest: 30 },
      { name: "Pallof Press", kind: "reps", value: 12, rest: 25 },
      { name: "Superman Hold", kind: "time", value: 35, rest: 20 },
      { name: "Dead Bug", kind: "reps", value: 14, rest: 0 },
    ],
  },
];

const DAY_LABELS = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];

/* ------------------------------- HELPERS ---------------------------------- */
function formatClock(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return "Guten Morgen";
  if (h < 17) return "Guten Tag";
  return "Guten Abend";
}

function getWeekDates() {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function sameDay(a, b) {
  return a.toDateString() === b.toDateString();
}

/* ------------------------------ BODY DIAGRAM ------------------------------ */
function BodyDiagram({ active = [], size = 96 }) {
  const isOn = (part) =>
    active.includes("Ganzer Körper") || active.includes(part);

  const base = COLORS.surfaceElevated;
  const on = COLORS.accent;

  return (
    <svg width={size} height={size * 1.7} viewBox="0 0 120 210" fill="none">
      {/* base silhouette */}
      <circle cx="60" cy="20" r="15" fill={base} />
      <rect x="30" y="38" width="60" height="55" rx="16" fill={base} />
      <rect x="10" y="42" width="18" height="60" rx="9" fill={base} />
      <rect x="92" y="42" width="18" height="60" rx="9" fill={base} />
      <rect x="38" y="92" width="20" height="55" rx="9" fill={base} />
      <rect x="62" y="92" width="20" height="55" rx="9" fill={base} />

      {/* upper body overlay (chest/shoulders/arms) */}
      <g opacity={isOn("Oberkörper") ? 1 : 0}>
        <rect x="30" y="38" width="60" height="30" rx="14" fill={on} />
        <rect x="10" y="42" width="18" height="50" rx="9" fill={on} />
        <rect x="92" y="42" width="18" height="50" rx="9" fill={on} />
      </g>

      {/* core overlay */}
      <g opacity={isOn("Körpermitte") ? 1 : 0}>
        <rect x="34" y="66" width="52" height="27" rx="10" fill={on} />
      </g>

      {/* lower body overlay */}
      <g opacity={isOn("Unterkörper") ? 1 : 0}>
        <rect x="38" y="92" width="20" height="55" rx="9" fill={on} />
        <rect x="62" y="92" width="20" height="55" rx="9" fill={on} />
      </g>
    </svg>
  );
}

/* -------------------------------- ATOMS ------------------------------------ */
function DifficultyDots({ level }) {
  const idx = DIFFICULTIES.indexOf(level);
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            background: i <= idx ? COLORS.accent : COLORS.border,
          }}
        />
      ))}
    </span>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: "8px 14px",
        borderRadius: 99,
        fontSize: 13,
        fontWeight: 600,
        border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
        background: active ? COLORS.accentSoft : "transparent",
        color: active ? COLORS.accent : COLORS.textDim,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all .15s ease",
      }}
    >
      {label}
    </button>
  );
}

function CategoryTag({ category }) {
  const c = CATEGORY_META[category]?.color || COLORS.accent;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.06em",
        color: c,
        textTransform: "uppercase",
      }}
    >
      {category}
    </span>
  );
}

/* ------------------------------ WORKOUT CARD ------------------------------- */
function WorkoutCard({ workout, onOpen }) {
  return (
    <button
      onClick={() => onOpen(workout)}
      style={{
        textAlign: "left",
        width: "100%",
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 18,
        padding: 16,
        cursor: "pointer",
        display: "flex",
        gap: 14,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: `linear-gradient(145deg, ${CATEGORY_META[workout.category]?.color}33, ${COLORS.surfaceElevated})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Dumbbell size={22} color={CATEGORY_META[workout.category]?.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <CategoryTag category={workout.category} />
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: COLORS.text,
            marginTop: 2,
            letterSpacing: "-0.01em",
          }}
        >
          {workout.title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 6,
            fontSize: 12.5,
            color: COLORS.textDim,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={12} /> {workout.duration} Min.
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Zap size={12} /> {workout.points} Punkte
          </span>
          <DifficultyDots level={workout.difficulty} />
        </div>
      </div>
      <ChevronRight size={18} color={COLORS.textFaint} />
    </button>
  );
}

/* -------------------------------- TAB BAR ---------------------------------- */
function TabBar({ tab, setTab }) {
  const items = [
    { id: "home", icon: Home, label: "Home" },
    { id: "workouts", icon: Dumbbell, label: "Workouts" },
    { id: "progress", icon: TrendingUp, label: "Fortschritt" },
    { id: "profile", icon: User, label: "Profil" },
  ];
  return (
    <div
      style={{
        display: "flex",
        borderTop: `1px solid ${COLORS.border}`,
        background: COLORS.bg,
        padding: "10px 8px calc(env(safe-area-inset-bottom, 0px) + 10px)",
        flexShrink: 0,
      }}
    >
      {items.map((it) => {
        const isActive = tab === it.id;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
            }}
          >
            <Icon size={21} color={isActive ? COLORS.accent : COLORS.textFaint} strokeWidth={isActive ? 2.4 : 2} />
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: isActive ? COLORS.accent : COLORS.textFaint,
              }}
            >
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------- HEADER ---------------------------------- */
function ScreenHeader({ title, onBack, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 20px 12px",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 99,
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={16} color={COLORS.text} />
          </button>
        )}
        <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.text, letterSpacing: "-0.02em" }}>
          {title}
        </div>
      </div>
      {right}
    </div>
  );
}

/* -------------------------------- HOME SCREEN ------------------------------ */
function HomeScreen({ completed, streak, onOpenWorkout, featured }) {
  const week = useMemo(getWeekDates, []);
  const today = new Date();
  const doneCount = completed.filter((c) =>
    week.some((d) => sameDay(d, c.date))
  ).length;

  return (
    <div style={{ padding: "18px 20px 28px", display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <div style={{ fontSize: 13, color: COLORS.textDim, fontWeight: 600 }}>
          {getGreeting()}, Sascha
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.text, letterSpacing: "-0.02em", marginTop: 2 }}>
          Bereit für dein Training?
        </div>
      </div>

      {/* streak + week strip */}
      <div
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          padding: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Flame size={16} color="#FF6A3D" />
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>
              {streak}-Tage-Streak
            </span>
          </div>
          <span style={{ fontSize: 12.5, color: COLORS.textDim, fontWeight: 600 }}>
            {doneCount}/7 diese Woche
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {week.map((d, i) => {
            const isToday = sameDay(d, today);
            const isDone = completed.some((c) => sameDay(c.date, d));
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: COLORS.textFaint }}>
                  {DAY_LABELS[i]}
                </span>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 99,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isToday ? COLORS.accent : isDone ? COLORS.successSoft : COLORS.surfaceElevated,
                    border: isToday ? "none" : `1px solid ${COLORS.border}`,
                  }}
                >
                  {isDone ? (
                    <Check size={14} color={isToday ? "#fff" : COLORS.success} />
                  ) : (
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: isToday ? "#fff" : COLORS.textDim }}>
                      {d.getDate()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* today's workout */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.textDim, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Heutige Empfehlung
        </div>
        <button
          onClick={() => onOpenWorkout(featured)}
          style={{
            width: "100%",
            textAlign: "left",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 22,
            padding: 20,
            background: `linear-gradient(155deg, ${COLORS.accentSoft}, ${COLORS.surface} 60%)`,
            cursor: "pointer",
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <BodyDiagram active={[featured.muscle]} size={54} />
          <div style={{ flex: 1 }}>
            <CategoryTag category={featured.category} />
            <div style={{ fontSize: 19, fontWeight: 900, color: COLORS.text, marginTop: 3, letterSpacing: "-0.01em" }}>
              {featured.title}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 12.5, color: COLORS.textDim, fontWeight: 600 }}>
              <span>{featured.duration} Min.</span>
              <span>·</span>
              <span>{featured.muscle}</span>
              <span>·</span>
              <DifficultyDots level={featured.difficulty} />
            </div>
          </div>
        </button>
      </div>

      {/* quick categories */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.textDim, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Kategorien
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.keys(CATEGORY_META).map((cat) => (
            <div
              key={cat}
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: "14px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 99,
                  background: CATEGORY_META[cat].color,
                }}
              />
              <span style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text }}>{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ WORKOUTS SCREEN ---------------------------- */
function WorkoutsScreen({ onOpenWorkout }) {
  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState("Alle");
  const [difficulty, setDifficulty] = useState("Alle");

  const filtered = WORKOUTS.filter((w) => {
    if (muscle !== "Alle" && w.muscle !== muscle) return false;
    if (difficulty !== "Alle" && w.difficulty !== difficulty) return false;
    if (search && !w.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ScreenHeader title="Workouts" />
      <div style={{ padding: "0 20px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: "10px 14px",
          }}
        >
          <Search size={16} color={COLORS.textFaint} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Workout suchen"
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: COLORS.text,
              fontSize: 14,
              width: "100%",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "0 20px 8px", overflowX: "auto" }}>
        {["Alle", ...MUSCLE_GROUPS].map((m) => (
          <Chip key={m} label={m} active={muscle === m} onClick={() => setMuscle(m)} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, padding: "0 20px 16px", overflowX: "auto" }}>
        {["Alle", ...DIFFICULTIES].map((d) => (
          <Chip key={d} label={d} active={difficulty === d} onClick={() => setDifficulty(d)} />
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: COLORS.textDim, fontSize: 13.5, padding: "40px 0" }}>
            Keine Workouts gefunden. Passe deine Filter an.
          </div>
        )}
        {filtered.map((w) => (
          <WorkoutCard key={w.id} workout={w} onOpen={onOpenWorkout} />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- WORKOUT DETAIL ------------------------------ */
function WorkoutDetail({ workout, onBack, onStart }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ScreenHeader title="" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 110px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
          <BodyDiagram active={[workout.muscle]} size={64} />
          <div>
            <CategoryTag category={workout.category} />
            <div style={{ fontSize: 23, fontWeight: 900, color: COLORS.text, marginTop: 4, letterSpacing: "-0.02em" }}>
              {workout.title}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          <div style={metaPillStyle}><Clock size={13} color={COLORS.textDim} /> {workout.duration} Min.</div>
          <div style={metaPillStyle}><Zap size={13} color={COLORS.textDim} /> {workout.points} Punkte</div>
          <div style={metaPillStyle}><Dumbbell size={13} color={COLORS.textDim} /> {workout.equipment}</div>
          <div style={metaPillStyle}>
            <DifficultyDots level={workout.difficulty} />
            <span style={{ marginLeft: 4 }}>{workout.difficulty}</span>
          </div>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.6, color: COLORS.textDim, marginBottom: 22 }}>
          {workout.description}
        </p>

        <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.textDim, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {workout.exercises.length} Übungen
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {workout.exercises.map((ex, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: COLORS.surfaceElevated,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: COLORS.textDim,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: COLORS.text }}>{ex.name}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.accent }}>
                {ex.kind === "time" ? `${ex.value}s` : `${ex.value}x`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 20px calc(env(safe-area-inset-bottom, 0px) + 14px)",
          background: `linear-gradient(0deg, ${COLORS.bg} 60%, transparent)`,
        }}
      >
        <button
          onClick={() => onStart(workout)}
          style={{
            width: "100%",
            background: COLORS.accent,
            border: "none",
            borderRadius: 16,
            padding: "16px 0",
            fontSize: 15.5,
            fontWeight: 800,
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Play size={17} fill="#fff" /> Workout starten
        </button>
      </div>
    </div>
  );
}

const metaPillStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 99,
  padding: "6px 12px",
  fontSize: 12.5,
  fontWeight: 600,
  color: COLORS.text,
};

/* -------------------------------- PLAYER ----------------------------------- */
function Player({ workout, onExit, onFinish }) {
  const [step, setStep] = useState(0); // exercise index
  const [phase, setPhase] = useState("work"); // work | rest
  const [timeLeft, setTimeLeft] = useState(workout.exercises[0].kind === "time" ? workout.exercises[0].value : null);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const startRef = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);

  const ex = workout.exercises[step];
  const isLast = step === workout.exercises.length - 1;

  useEffect(() => {
    const t = setInterval(() => {
      if (!paused && !done) setElapsed(Math.round((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [paused, done]);

  useEffect(() => {
    if (paused || done) return;
    if (timeLeft === null) return; // reps-based work phase waits for manual "Fertig"
    if (timeLeft <= 0) {
      advance();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, paused, done]);

  function advance() {
    if (phase === "work") {
      if (ex.rest > 0) {
        setPhase("rest");
        setTimeLeft(ex.rest);
      } else {
        goNext();
      }
    } else {
      goNext();
    }
  }

  function goNext() {
    if (isLast) {
      setDone(true);
      return;
    }
    const nextIdx = step + 1;
    const nextEx = workout.exercises[nextIdx];
    setStep(nextIdx);
    setPhase("work");
    setTimeLeft(nextEx.kind === "time" ? nextEx.value : null);
  }

  if (done) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30, textAlign: "center" }}>
        <div style={{ animation: "ff-pop .4s ease" }}>
          <CheckCircle2 size={64} color={COLORS.success} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.text, marginTop: 18, letterSpacing: "-0.02em" }}>
          Workout geschafft!
        </div>
        <div style={{ fontSize: 14, color: COLORS.textDim, marginTop: 6 }}>
          {workout.title} · {formatClock(elapsed)} Min.
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 24,
            width: "100%",
          }}
        >
          <div style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 16 }}>
            <Trophy size={18} color={COLORS.accent} />
            <div style={{ fontSize: 18, fontWeight: 900, color: COLORS.text, marginTop: 6 }}>+{workout.points}</div>
            <div style={{ fontSize: 11.5, color: COLORS.textDim, fontWeight: 600 }}>Punkte</div>
          </div>
          <div style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 16 }}>
            <Flame size={18} color="#FF6A3D" />
            <div style={{ fontSize: 18, fontWeight: 900, color: COLORS.text, marginTop: 6 }}>{workout.exercises.length}</div>
            <div style={{ fontSize: 11.5, color: COLORS.textDim, fontWeight: 600 }}>Übungen</div>
          </div>
        </div>
        <button
          onClick={() => onFinish(elapsed)}
          style={{
            width: "100%",
            marginTop: 26,
            background: COLORS.accent,
            border: "none",
            borderRadius: 16,
            padding: "16px 0",
            fontSize: 15.5,
            fontWeight: 800,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Fertig
        </button>
      </div>
    );
  }

  const progressPct = ((step + (phase === "rest" ? 1 : 0)) / workout.exercises.length) * 100;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onExit} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <X size={22} color={COLORS.textDim} />
        </button>
        <div style={{ flex: 1, height: 5, background: COLORS.surfaceElevated, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ width: `${progressPct}%`, height: "100%", background: COLORS.accent, transition: "width .3s ease" }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textDim }}>
          {step + 1}/{workout.exercises.length}
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: phase === "rest" ? COLORS.success : COLORS.accent,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {phase === "rest" ? "Pause" : "Übung"}
        </span>

        <div
          style={{
            width: 210,
            height: 210,
            borderRadius: "50%",
            border: `6px solid ${phase === "rest" ? COLORS.successSoft : COLORS.accentSoft}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginBottom: 26,
          }}
        >
          {phase === "rest" ? (
            <>
              <div style={{ fontSize: 44, fontWeight: 900, color: COLORS.text, letterSpacing: "-0.02em" }}>
                {formatClock(timeLeft ?? 0)}
              </div>
              <div style={{ fontSize: 12.5, color: COLORS.textDim, marginTop: 4 }}>
                Nächste: {workout.exercises[step + 1]?.name || "Fertig"}
              </div>
            </>
          ) : ex.kind === "time" ? (
            <div style={{ fontSize: 44, fontWeight: 900, color: COLORS.text, letterSpacing: "-0.02em" }}>
              {formatClock(timeLeft ?? 0)}
            </div>
          ) : (
            <>
              <div style={{ fontSize: 44, fontWeight: 900, color: COLORS.text, letterSpacing: "-0.02em" }}>
                {ex.value}x
              </div>
              <div style={{ fontSize: 12.5, color: COLORS.textDim, marginTop: 4 }}>Wiederholungen</div>
            </>
          )}
        </div>

        <div style={{ fontSize: 21, fontWeight: 900, color: COLORS.text, textAlign: "center", letterSpacing: "-0.01em" }}>
          {phase === "rest" ? "Kurz durchatmen" : ex.name}
        </div>
      </div>

      <div style={{ padding: "0 24px calc(env(safe-area-inset-bottom, 0px) + 24px)", display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={() => setPaused((p) => !p)}
          style={{
            width: 54,
            height: 54,
            borderRadius: 99,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {paused ? <Play size={20} color={COLORS.text} fill={COLORS.text} /> : <Pause size={20} color={COLORS.text} fill={COLORS.text} />}
        </button>

        {ex.kind === "reps" && phase === "work" ? (
          <button
            onClick={advance}
            style={{
              flex: 1,
              background: COLORS.accent,
              border: "none",
              borderRadius: 16,
              padding: "16px 0",
              fontSize: 15.5,
              fontWeight: 800,
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Check size={18} /> Fertig
          </button>
        ) : (
          <button
            onClick={advance}
            style={{
              flex: 1,
              background: COLORS.surfaceElevated,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: "16px 0",
              fontSize: 15.5,
              fontWeight: 700,
              color: COLORS.text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <SkipForward size={18} /> Überspringen
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ PROGRESS SCREEN ---------------------------- */
function ProgressScreen({ completed, streak }) {
  const week = useMemo(getWeekDates, []);
  const chartData = week.map((d, i) => {
    const entry = completed.find((c) => sameDay(c.date, d));
    return { day: DAY_LABELS[i], minutes: entry ? Math.round(entry.duration / 60) : 0, isToday: sameDay(d, new Date()) };
  });

  const totalWorkouts = completed.length;
  const totalMinutes = Math.round(completed.reduce((s, c) => s + c.duration, 0) / 60);
  const totalPoints = completed.reduce((s, c) => s + c.points, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ScreenHeader title="Fortschritt" />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          <StatBox icon={<Flame size={16} color="#FF6A3D" />} value={streak} label="Streak" />
          <StatBox icon={<Dumbbell size={16} color={COLORS.accent} />} value={totalWorkouts} label="Workouts" />
          <StatBox icon={<Trophy size={16} color="#FFC93D" />} value={totalPoints} label="Punkte" />
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "18px 12px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 8px 14px" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.text }}>Minuten diese Woche</span>
            <span style={{ fontSize: 12.5, color: COLORS.textDim }}>{totalMinutes} Min. gesamt</span>
          </div>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: COLORS.textFaint, fontSize: 11, fontWeight: 700 }}
                />
                <Bar dataKey="minutes" radius={[6, 6, 6, 6]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.isToday ? COLORS.accent : COLORS.surfaceElevated} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.textDim, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Letzte Workouts
        </div>
        {completed.length === 0 && (
          <div style={{ textAlign: "center", color: COLORS.textDim, fontSize: 13.5, padding: "30px 0" }}>
            Noch keine Workouts abgeschlossen. Starte jetzt dein erstes Training!
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...completed].reverse().map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                padding: "12px 14px",
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.successSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Check size={16} color={COLORS.success} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text }}>{c.title}</div>
                <div style={{ fontSize: 11.5, color: COLORS.textDim }}>
                  {c.date.toLocaleDateString("de-DE", { day: "2-digit", month: "short" })} · {formatClock(c.duration)} Min.
                </div>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.accent }}>+{c.points}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, value, label }) {
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "14px 10px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: COLORS.text }}>{value}</div>
      <div style={{ fontSize: 10.5, color: COLORS.textDim, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

/* -------------------------------- PROFILE ---------------------------------- */
function ProfileScreen() {
  const menu = [
    { icon: User, label: "Konto" },
    { icon: Bell, label: "Benachrichtigungen" },
    { icon: Ruler, label: "Einheiten" },
    { icon: Info, label: "Hilfe & Support" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ScreenHeader title="Profil" />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 99,
              background: COLORS.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 900,
              color: "#fff",
            }}
          >
            S
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: COLORS.text }}>Sascha</div>
            <div style={{ fontSize: 12.5, color: COLORS.textDim }}>Wunstorf · Mitglied seit 2026</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {menu.map((m, i) => (
            <button
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                padding: "13px 14px",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
              }}
            >
              <m.icon size={17} color={COLORS.textDim} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: COLORS.text }}>{m.label}</span>
              <ChevronRight size={16} color={COLORS.textFaint} />
            </button>
          ))}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "transparent",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: "13px 14px",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              marginTop: 8,
            }}
          >
            <LogOut size={17} color="#FF6A6A" />
            <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#FF6A6A" }}>Abmelden</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- APP ------------------------------------ */
export default function FitnessApp() {
  const [tab, setTab] = useState("home");
  const [openWorkout, setOpenWorkout] = useState(null);
  const [playingWorkout, setPlayingWorkout] = useState(null);
  const [completed, setCompleted] = useState(() => {
    const today = new Date();
    const mk = (offset, w) => {
      const d = new Date(today);
      d.setDate(today.getDate() - offset);
      return { date: d, title: w.title, duration: w.duration * 60, points: w.points };
    };
    return [mk(1, WORKOUTS[0]), mk(2, WORKOUTS[5]), mk(4, WORKOUTS[2])];
  });

  const streak = useMemo(() => {
    let s = 0;
    const d = new Date();
    while (completed.some((c) => sameDay(c.date, d))) {
      s += 1;
      d.setDate(d.getDate() - 1);
    }
    return s;
  }, [completed]);

  function finishWorkout(workout, elapsedSec) {
    setCompleted((prev) => [
      ...prev,
      { date: new Date(), title: workout.title, duration: elapsedSec, points: workout.points },
    ]);
    setPlayingWorkout(null);
    setOpenWorkout(null);
    setTab("home");
  }

  let content;
  if (tab === "home") content = <HomeScreen completed={completed} streak={streak} onOpenWorkout={setOpenWorkout} featured={WORKOUTS[1]} />;
  else if (tab === "workouts") content = <WorkoutsScreen onOpenWorkout={setOpenWorkout} />;
  else if (tab === "progress") content = <ProgressScreen completed={completed} streak={streak} />;
  else content = <ProfileScreen />;

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        minHeight: 640,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Arial, sans-serif",
      }}
    >
      <style>{`
        @keyframes ff-pop { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); } }
        * { box-sizing: border-box; }
        input::placeholder { color: ${COLORS.textFaint}; }
        button:focus-visible, input:focus-visible { outline: 2px solid ${COLORS.accent}; outline-offset: 2px; }
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          height: "100%",
          maxHeight: 900,
          background: COLORS.bg,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRadius: 28,
          boxShadow: "0 0 0 1px #000, 0 30px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {playingWorkout ? (
            <Player
              workout={playingWorkout}
              onExit={() => setPlayingWorkout(null)}
              onFinish={(elapsed) => finishWorkout(playingWorkout, elapsed)}
            />
          ) : openWorkout ? (
            <WorkoutDetail
              workout={openWorkout}
              onBack={() => setOpenWorkout(null)}
              onStart={(w) => setPlayingWorkout(w)}
            />
          ) : (
            <div style={{ height: "100%", overflowY: "auto" }}>{content}</div>
          )}
        </div>
        {!playingWorkout && !openWorkout && <TabBar tab={tab} setTab={setTab} />}
      </div>
    </div>
  );
}
