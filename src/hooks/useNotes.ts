"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, createEmptyActivity } from "@/types/note";

const STORAGE_KEY = "pdca-in-ibl";
const TEAM_NAME_KEY = "pdca-in-ibl-username";

function getTodayDate(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

type LegacyCycleTab = {
  taskSetting?: string;
  problemSolving?: string;
  analysis?: string;
  expression?: string;
};

type LegacyNote = {
  date?: string;
  cycleTabs?: LegacyCycleTab[];
};

type StoredActivity = Partial<Activity> & {
  dateStart?: unknown;
};

function isActivity(value: unknown): value is StoredActivity {
  return typeof value === "object" && value !== null && "plan" in value && "do" in value && "check" in value && "action" in value;
}

function normaliseActivity(value: StoredActivity): Activity {
  return {
    id: typeof value.id === "string" ? value.id : crypto.randomUUID(),
    date: typeof value.date === "string" ? value.date : typeof value.dateStart === "string" ? value.dateStart : "",
    plan: typeof value.plan === "string" ? value.plan : "",
    do: typeof value.do === "string" ? value.do : "",
    check: typeof value.check === "string" ? value.check : "",
    action: typeof value.action === "string" ? value.action : "",
    competency: value.competency,
  };
}

function migrateLegacyNotes(notes: LegacyNote[]): Activity[] {
  return notes.flatMap((note) =>
    (note.cycleTabs ?? []).map((tab) => ({
      id: crypto.randomUUID(),
      date: note.date ?? "",
      plan: tab.taskSetting ?? "",
      do: tab.problemSolving ?? "",
      check: tab.analysis ?? "",
      action: tab.expression ?? "",
    }))
  );
}

function parseActivities(raw: string): Activity[] | null {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return null;
  if (parsed.every(isActivity)) return parsed.map(normaliseActivity);
  if (parsed.every((item) => typeof item === "object" && item !== null && "cycleTabs" in item)) {
    return migrateLegacyNotes(parsed as LegacyNote[]);
  }
  return null;
}

export function useNotes() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [teamName, setTeamNameState] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const restored = raw ? parseActivities(raw) : null;
        setActivities(restored?.length ? restored : [createEmptyActivity()]);
        setTeamNameState(localStorage.getItem(TEAM_NAME_KEY) ?? "");
      } catch {
        setActivities([createEmptyActivity()]);
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities, loaded]);

  const setTeamName = useCallback((name: string) => {
    setTeamNameState(name);
    localStorage.setItem(TEAM_NAME_KEY, name);
  }, []);

  const updateActivity = useCallback((id: string, updater: (activity: Activity) => Activity) => {
    setActivities((previous) => previous.map((activity) => (activity.id === id ? updater(activity) : activity)));
  }, []);

  const addActivity = useCallback(() => {
    setActivities((previous) => [...previous, createEmptyActivity(getTodayDate())]);
  }, []);

  const importActivities = useCallback((json: string): { success: boolean; error?: string } => {
    try {
      const imported = parseActivities(json);
      if (!imported) return { success: false, error: "活動データの配列ではありません。" };
      setActivities(imported.length ? imported : [createEmptyActivity()]);
      return { success: true };
    } catch {
      return { success: false, error: "JSON の読み込みに失敗しました。" };
    }
  }, []);

  return { activities, loaded, teamName, setTeamName, updateActivity, addActivity, importActivities };
}
