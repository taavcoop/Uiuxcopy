import { MapPin } from 'lucide-react';
import { useState } from 'react';

const PRESET_TITLES = ['دفتر مرکزی', 'کارخانه', 'انبار', 'شعبه شمال', 'شعبه فروش'];

export default function Step1Location() {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState(150);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const pickMap = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const nextLat = 35.86 - y * (35.86 - 35.58);
    const nextLng = 51.21 + x * (51.62 - 51.21);
    setLat(Number(nextLat.toFixed(6)));
    setLng(Number(nextLng.toFixed(6)));
    setAddress(`نقطه انتخابی روی نقشه (Lat: ${nextLat.toFixed(5)} - Lng: ${nextLng.toFixed(5)})`);
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-white">مرحله 1: ثبت محل سریع</h2>
        <span className="text-xs px-3 py-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 text-indigo-200">Step 1</span>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-slate-300">عنوان</div>
        <div className="flex flex-wrap gap-2">
          {PRESET_TITLES.map((t) => (
            <button
              key={t}
              title="انتخاب عنوان سریع"
              className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${title === t ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200' : 'border-white/15 text-slate-300 hover:border-white/30'}`}
              onClick={() => setTitle(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <input
          title="عنوان محل کار"
          className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-slate-800/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="یا عنوان دلخواه را وارد کنید"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-300">انتخاب آدرس از روی نقشه</div>
          <div className="text-xs text-slate-400">روی نقشه کلیک کنید</div>
        </div>
        <button title="برای انتخاب موقعیت روی نقشه کلیک کنید" type="button" onClick={pickMap} className="w-full h-52 rounded-2xl border border-white/10 relative bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.2),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.15),transparent_40%)]" />
          {lat && lng ? <MapPin className="text-rose-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" /> : null}
        </button>
        <input
          title="آدرس انتخاب شده از نقشه"
          className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-slate-800/60 text-slate-100 placeholder:text-slate-500"
          readOnly
          value={address}
          placeholder="بعد از کلیک روی نقشه آدرس اینجا ثبت می شود"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-300">شعاع مجاز</div>
          <div className="text-sm font-bold text-indigo-200">{radius} متر</div>
        </div>
        <input title="تنظیم شعاع مجاز حضور" type="range" min={50} max={1000} step={10} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-indigo-500" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[100, 150, 300, 500].map((r) => (
            <button
              key={r}
              type="button"
              title={`انتخاب سریع شعاع ${r} متر`}
              onClick={() => setRadius(r)}
              className={`py-2 rounded-lg border text-xs transition-colors ${radius === r ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200' : 'border-white/15 text-slate-300 hover:border-white/30'}`}
            >
              {r} متر
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
