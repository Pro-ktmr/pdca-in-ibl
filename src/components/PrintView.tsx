"use client";

import { Activity, Competency, formatActivityDate } from "@/types/note";

const COMPETENCY_COLORS: Record<Competency, string> = {
  "課題の設定": "bg-rose-100",
  "課題解決の過程": "bg-amber-100",
  "分析・考察・推論": "bg-sky-100",
  "表現・伝達": "bg-violet-100",
};

const FIELDS: { key: "plan" | "do" | "check" | "action"; label: string }[] = [
  { key: "plan", label: "Plan：どのような活動目標を設定しましたか？" },
  { key: "do", label: "Do：どのような活動を実施しましたか？" },
  { key: "check", label: "Check：どのような活動成果が得られましたか？" },
  { key: "action", label: "Action：次回以降の活動にどう繋げていきますか？" },
];

interface Props {
  activities: Activity[];
  teamName: string;
}

export function PrintView({ activities, teamName }: Props) {
  return (
    <div className="print-view hidden print:block text-sm text-black bg-white">
      {teamName && <div className="print-header-name">チーム名：{teamName}</div>}
      <h1 className="text-xl font-bold mb-5 border-b-2 border-black pb-2">各活動の記録</h1>
      {activities.map((activity, index) => (
        <article key={activity.id} className="mb-5 border border-gray-400 rounded p-4 print-no-break">
          <h2 className="font-bold text-base mb-1">活動 #{String(index + 1).padStart(2, "0")}</h2>
          <p className="mb-4">実施日：{formatActivityDate(activity)}</p>
          {FIELDS.map((field) => (
            <div key={field.key} className="mb-3">
              <h3 className="font-semibold mb-1">{field.label}</h3>
              <p className="whitespace-pre-wrap">{activity[field.key] || "未記入"}</p>
            </div>
          ))}
          {activity.competency && <p className={`inline-block rounded px-2 py-1 ${COMPETENCY_COLORS[activity.competency]}`}>探究活動の段階：{activity.competency}</p>}
        </article>
      ))}
      <div className="print-page-break" />
      <h2 className="text-lg font-bold mb-3 border-b-2 border-black pb-1">データバックアップ（JSON）</h2>
      <p className="text-xs text-gray-600 mb-2">以下の JSON をコピーすると、別の端末でも活動データをインポートできます。</p>
      <pre className="text-[6px] leading-tight whitespace-pre-wrap break-all font-mono border border-gray-300 p-2 rounded">{JSON.stringify(activities, null, 2)}</pre>
    </div>
  );
}
