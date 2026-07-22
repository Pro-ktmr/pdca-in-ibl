"use client";

import { Activity, Competency, formatActivityDate } from "@/types/note";

const ROWS: { key: "plan" | "do" | "check" | "action"; label: string }[] = [
  { key: "plan", label: "Plan" },
  { key: "do", label: "Do" },
  { key: "check", label: "Check" },
  { key: "action", label: "Action" },
];

const COMPETENCIES: { value: Competency; color: string }[] = [
  { value: "課題の設定", color: "bg-rose-100" },
  { value: "課題解決の過程", color: "bg-amber-100" },
  { value: "分析・考察・推論", color: "bg-sky-100" },
  { value: "表現・伝達", color: "bg-violet-100" },
];

function preview(value: string): string {
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length > 50 ? `${compact.slice(0, 50)}…` : compact || "—";
}

interface Props {
  activities: Activity[];
  onChange: (id: string, updater: (activity: Activity) => Activity) => void;
}

export function ReflectionSection({ activities, onChange }: Props) {
  return (
    <section className="bg-white shadow rounded-lg p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">活動ノート一覧</h2>
        <p className="text-sm text-gray-500">横にスクロールしてこれまでの活動を一覧できます。また、各活動が探究活動の{COMPETENCIES.map(competency => `「${competency.value}」`).join("")}のいずれに対応していたのかを振り返ることができます。</p>
      </div>

      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="border-collapse text-sm">
          <tbody>
            <tr>
              <th scope="row" className="sticky left-0 z-10 min-w-32 border-b border-r border-gray-200 bg-gray-50 px-3 py-3 text-left font-semibold text-gray-700">活動番号</th>
              {activities.map((activity, index) => <td key={activity.id} className="min-w-48 border-b border-r border-gray-200 px-3 py-3 font-semibold text-gray-800">活動 #{String(index + 1).padStart(2, "0")}</td>)}
            </tr>
            <tr>
              <th scope="row" className="sticky left-0 z-10 min-w-32 border-b border-r border-gray-200 bg-gray-50 px-3 py-3 text-left font-semibold text-gray-700">活動日</th>
              {activities.map((activity) => <td key={activity.id} className="min-w-48 border-b border-r border-gray-200 px-3 py-3 text-gray-700">{formatActivityDate(activity)}</td>)}
            </tr>
            {ROWS.map((row) => (
              <tr key={row.key}>
                <th scope="row" className="sticky left-0 z-10 min-w-32 border-b border-r border-gray-200 bg-gray-50 px-3 py-3 text-left font-semibold text-gray-700">{row.label}</th>
                {activities.map((activity) => <td key={activity.id} className="min-w-48 border-b border-r border-gray-200 px-3 py-3 align-top leading-relaxed text-gray-700">{preview(activity[row.key])}</td>)}
              </tr>
            ))}
            {COMPETENCIES.map((competency) => (
              <tr key={competency.value}>
                <th scope="row" className="sticky left-0 z-10 min-w-32 border-b border-r border-gray-200 bg-gray-50 px-3 py-3 text-left font-semibold text-gray-700">{competency.value}</th>
                {activities.map((activity) => {
                  const checked = activity.competency === competency.value;
                  return (
                    <td key={activity.id} className={`min-w-48 border-b border-r border-gray-200 px-3 py-3 text-center ${checked ? competency.color : "bg-white"}`}>
                      <input
                        type="radio"
                        name={`competency-${activity.id}`}
                        checked={checked}
                        onChange={() => onChange(activity.id, (current) => ({ ...current, competency: competency.value }))}
                        aria-label={`${formatActivityDate(activity)}：${competency.value}`}
                        className="h-4 w-4 cursor-pointer accent-gray-700"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
