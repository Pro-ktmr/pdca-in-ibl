export type Competency =
  | "課題の設定"
  | "課題解決の過程"
  | "分析・考察・推論"
  | "表現・伝達";

export type ActivityTextField = "plan" | "do" | "check" | "action";

export interface Activity {
  id: string;
  date: string;
  plan: string;
  do: string;
  check: string;
  action: string;
  competency?: Competency;
}

export function createEmptyActivity(): Activity {
  return {
    id: crypto.randomUUID(),
    date: "",
    plan: "",
    do: "",
    check: "",
    action: "",
  };
}

export function isActivityComplete(activity: Activity): boolean {
  return [activity.plan, activity.do, activity.check, activity.action].every(
    (value) => value.trim() !== ""
  );
}

export function formatActivityDate(activity: Pick<Activity, "date">): string {
  return activity.date || "未入力";
}
