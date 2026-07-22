"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, createEmptyActivity } from "@/types/note";

const STORAGE_KEY = "ibl-notes";
const TEAM_NAME_KEY = "ibl-notes-username";

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

function isActivity(value: unknown): value is Activity {
  return typeof value === "object" && value !== null && "plan" in value && "do" in value && "check" in value && "action" in value;
}

function normaliseActivity(value: Activity): Activity {
  return {
    id: typeof value.id === "string" ? value.id : crypto.randomUUID(),
    dateStart: typeof value.dateStart === "string" ? value.dateStart : "",
    dateEnd: typeof value.dateEnd === "string" ? value.dateEnd : "",
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
      dateStart: note.date ?? "",
      dateEnd: "",
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
    setActivities((previous) => [...previous, createEmptyActivity()]);
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
