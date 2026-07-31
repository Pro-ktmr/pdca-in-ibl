"use client";

import { useState } from "react";
import {
  Activity,
  ActivityTextField,
  isActivityComplete,
} from "@/types/note";

const FIELDS: { key: ActivityTextField; label: string; prompt: string }[] = [
  { key: "plan", label: "Plan", prompt: "どのような活動目標を設定しましたか？" },
  { key: "do", label: "Do", prompt: "どのような活動を実施しましたか？" },
  { key: "check", label: "Check", prompt: "どのような活動成果が得られましたか？" },
  { key: "action", label: "Action", prompt: "次回以降の活動にどう繋げていきますか？" },
];

interface Props {
  activities: Activity[];
  onChange: (id: string, updater: (activity: Activity) => Activity) => void;
  onAdd: () => void;
}

export function CycleNoteTabs({ activities, onChange, onAdd }: Props) {
  const [activeTab, setActiveTab] = useState(Math.max(0, activities.length - 1));

  const visibleTab = Math.min(activeTab, Math.max(0, activities.length - 1));
  const current = activities[visibleTab];
  const lastActivity = activities[activities.length - 1];
  const canAdd = lastActivity ? isActivityComplete(lastActivity) : false;

  const update = (partial: Partial<Activity>) => {
    if (!current) return;
    onChange(current.id, (activity) => ({ ...activity, ...partial }));
  };

  const addNext = () => {
    if (!canAdd) return;
    onAdd();
    setActiveTab(activities.length);
  };

  if (!current) return null;

  return (
    <section className="bg-white shadow rounded-lg p-5 sm:p-6 space-y-5">
      <div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">各活動の記録</h2>
          <p className="text-sm text-gray-500">PDCA 4 項目をすべて記入すると、次の活動を追加できます。</p>
        </div>
      </div>

      <div className="flex items-end gap-1 overflow-x-auto border-b border-gray-200" role="tablist" aria-label="活動">
        {activities.map((activity, index) => (
          <button
            key={activity.id}
            type="button"
            role="tab"
            aria-selected={index === visibleTab}
            onClick={() => setActiveTab(index)}
            className={`shrink-0 rounded-t px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              index === visibleTab ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            活動 #{String(index + 1).padStart(2, "0")}
          </button>
        ))}
        <button
          type="button"
          onClick={addNext}
          disabled={!canAdd}
          title={canAdd ? "次の活動を追加" : "Plan・Do・Check・Action をすべて記入してください"}
          className={`shrink-0 rounded-t px-3 py-2 text-sm font-semibold transition-colors ${
            canAdd ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer" : "bg-gray-50 text-gray-400 cursor-not-allowed"
          }`}
        >
          ＋ 次の活動
        </button>
      </div>

      <div>
        <div>
          <label htmlFor="activity-date" className="block text-sm font-medium text-gray-700 mb-1">活動日</label>
          <input
            id="activity-date"
            type="date"
            value={current.date}
            onChange={(event) => update({ date: event.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
      {!current.date && <p className="-mt-3 text-xs text-amber-700">活動日を入力してください。</p>}

      <div className="space-y-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label htmlFor={`activity-${field.key}`} className="block text-sm font-semibold text-gray-800 mb-1">{field.label}</label>
            <p className="text-xs text-gray-500 mb-1">{field.prompt}</p>
            <textarea
              id={`activity-${field.key}`}
              value={current[field.key]}
              onChange={(event) => update({ [field.key]: event.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
