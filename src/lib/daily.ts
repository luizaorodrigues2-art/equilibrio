import fs from "fs";
import path from "path";

export type DailyReflection = {
  id: string;
  title: string;
  body: string;
  pillar: "Espiritual" | "Mental" | "Corpo" | string;
};

const DATA_PATH = path.join(process.cwd(), "content", "data", "daily-reflections.json");

function dayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getDailyReflections(): DailyReflection[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  const raw = fs.readFileSync(DATA_PATH, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as DailyReflection[];
}

/** Pílula Diária — uma reflexão por dia do calendário */
export function getTodaysReflection(date = new Date()): DailyReflection | null {
  const all = getDailyReflections();
  if (!all.length) return null;
  return all[dayOfYear(date) % all.length] ?? all[0];
}
