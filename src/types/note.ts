export type Competency =
  | "課題の設定"
  | "課題解決の過程"
  | "分析・考察・推論"
  | "表現・伝達";

export type ActivityTextField = "plan" | "do" | "check" | "action";

export interface Activity {
  id: string;
  dateStart: string;
  dateEnd?: string;
  plan: string;
  do: string;
  check: string;
  action: string;
  competency?: Competency;
}

export function createEmptyActivity(): Activity {
  return {
    id: crypto.randomUUID(),
    dateStart: "",
    dateEnd: "",
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

export function formatActivityDate(activity: Pick<Activity, "dateStart" | "dateEnd">): string {
  if (!activity.dateStart) return "未入力";
  return activity.dateEnd ? `${activity.dateStart} ～ ${activity.dateEnd}` : activity.dateStart;
}
