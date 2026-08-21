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
