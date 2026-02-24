import { useState } from 'react';

export default function Step3Policy() {
  const [nightEnabled, setNightEnabled] = useState(false);
  const [nightFrom, setNightFrom] = useState('22:00');
  const [nightTo, setNightTo] = useState('06:00');

  const [overtimeEnabled, setOvertimeEnabled] = useState(true);

  const [geofenceEnabled, setGeofenceEnabled] = useState(false);
  const [faceEnabled, setFaceEnabled] = useState(false);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-white">مرحله 3: سیاست کاری</h2>
        <span className="text-xs px-3 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">Step 3</span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 space-y-3">
        <div className="text-sm font-semibold text-slate-100">تنظیمات شب کاری</div>
        <div className="flex items-center gap-2">
          <button
            title="آیا شب کاری در سازمان فعال است؟"
            className={`px-3 py-1.5 rounded-lg border text-xs ${nightEnabled ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200' : 'border-white/15 text-slate-300'}`}
            onClick={() => setNightEnabled(true)}
          >
            دارد
          </button>
          <button
            title="اگر شب کاری ندارید این گزینه را انتخاب کنید"
            className={`px-3 py-1.5 rounded-lg border text-xs ${!nightEnabled ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200' : 'border-white/15 text-slate-300'}`}
            onClick={() => setNightEnabled(false)}
          >
            ندارد
          </button>
        </div>

        {nightEnabled && (
          <div className="grid grid-cols-2 gap-2">
            <input
              title="شروع بازه محاسبه شب کاری"
              type="time"
              value={nightFrom}
              onChange={(e) => setNightFrom(e.target.value)}
              className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100"
            />
            <input
              title="پایان بازه محاسبه شب کاری"
              type="time"
              value={nightTo}
              onChange={(e) => setNightTo(e.target.value)}
              className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100"
            />
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 space-y-3">
        <div className="text-sm font-semibold text-slate-100">اضافه کاری</div>
        <div className="flex items-center gap-2">
          <button
            title="آیا اضافه کاری فعال باشد؟"
            className={`px-3 py-1.5 rounded-lg border text-xs ${overtimeEnabled ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200' : 'border-white/15 text-slate-300'}`}
            onClick={() => setOvertimeEnabled(true)}
          >
            دارد
          </button>
          <button
            title="اگر اضافه کاری ندارید این گزینه را انتخاب کنید"
            className={`px-3 py-1.5 rounded-lg border text-xs ${!overtimeEnabled ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200' : 'border-white/15 text-slate-300'}`}
            onClick={() => setOvertimeEnabled(false)}
          >
            ندارد
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 space-y-3">
        <div className="text-sm font-semibold text-slate-100">تنظیمات ترددی</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="inline-flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2.5">
            <span className="text-xs text-slate-200">الزام محدوده مکانی برای تردد</span>
            <input
              title="اگر فعال شود ثبت تردد فقط در محدوده مجاز امکان پذیر است"
              type="checkbox"
              checked={geofenceEnabled}
              onChange={(e) => setGeofenceEnabled(e.target.checked)}
              className="accent-indigo-500"
            />
          </label>

          <label className="inline-flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2.5">
            <span className="text-xs text-slate-200">تشخیص چهره در فلو تردد</span>
            <input
              title="اگر فعال شود در فلو تردد تایید چهره انجام می شود"
              type="checkbox"
              checked={faceEnabled}
              onChange={(e) => setFaceEnabled(e.target.checked)}
              className="accent-indigo-500"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
