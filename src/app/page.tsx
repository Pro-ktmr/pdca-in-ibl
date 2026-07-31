"use client";

import { useState } from "react";
import { CycleNoteTabs } from "@/components/CycleNoteTabs";
import { PrintView } from "@/components/PrintView";
import { ReflectionSection } from "@/components/ReflectionSection";
import { useNotesContext } from "@/contexts/NotesContext";

export default function HomePage() {
  const { activities, loaded, teamName, setTeamName, updateActivity, addActivity, importActivities } = useNotesContext();
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importError, setImportError] = useState("");

  if (!loaded) return <p className="text-gray-500">読み込み中...</p>;

  const handleImport = () => {
    const result = importActivities(importJson);
    if (result.success) {
      setImportJson("");
      setShowImport(false);
      setImportError("");
    } else {
      setImportError(result.error ?? "インポートに失敗しました。");
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white shadow rounded-lg p-5 sm:p-6">
        <label htmlFor="team-name" className="block text-sm font-semibold text-gray-700 mb-1">チーム名</label>
        <input
          id="team-name"
          type="text"
          value={teamName}
          onChange={(event) => setTeamName(event.target.value)}
          placeholder="チーム名を入力してください"
          className="w-full max-w-xl border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </section>

      <CycleNoteTabs activities={activities} onChange={updateActivity} onAdd={addActivity} />
      <ReflectionSection activities={activities} onChange={updateActivity} />

      <section className="bg-white shadow rounded-lg p-5 sm:p-6 print:hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800">データの印刷・インポート</h2>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => window.print()} className="bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer">印刷</button>
            <button type="button" onClick={() => { setShowImport((value) => !value); setImportError(""); }} className="text-sm font-medium text-blue-700 hover:underline cursor-pointer">{showImport ? "閉じる" : "JSON をインポート"}</button>
          </div>
        </div>
        {showImport && (
          <div className="mt-4 space-y-2">
            <textarea
              value={importJson}
              onChange={(event) => { setImportJson(event.target.value); setImportError(""); }}
              rows={8}
              placeholder="印刷最終ページの JSON をここに貼り付けてください"
              className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
            />
            <button type="button" onClick={handleImport} className="bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-700 transition-colors cursor-pointer">インポートする</button>
            {importError && <p className="text-sm text-red-600">{importError}</p>}
            <p className="text-xs text-gray-500">インポートすると、現在の活動データは置き換えられます。</p>
          </div>
        )}
      </section>

      <PrintView activities={activities} teamName={teamName} />
    </div>
  );
}
