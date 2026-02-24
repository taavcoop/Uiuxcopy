import { useEffect, useMemo, useState } from 'react';
import ConfirmDialog from '../common/ConfirmDialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

type T = 'fixed' | 'float-day' | 'float-abs' | 'split' | 'rotate';
type B = { id: string; kind: 'fixed' | 'floating'; a: string; b: string; m: number; d: boolean };
const W = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
const SHIFT_LABEL: Record<T, string> = {
  fixed: 'شیفت ثابت',
  'float-day': 'شیفت شناور - شروع روز',
  'float-abs': 'شیفت شناور - مطلق',
  split: 'شیفت دو تکه',
  rotate: 'شیفت چرخشی',
};
const n = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
const add = (t: string, m: number) => {
  const x = n(t) + m;
  const d = Math.floor(x / 1440);
  const hh = String(Math.floor((x % 1440) / 60)).padStart(2, '0');
  const mm = String(x % 60).padStart(2, '0');
  return { t: `${hh}:${mm}`, d };
};
const mk = (k: 'fixed' | 'floating'): B => ({ id: `${Date.now()}-${Math.random()}`, kind: k, a: '13:00', b: '14:00', m: 10, d: true });
const TPL: Record<T, string[]> = {
  fixed: ['اداری استاندارد', 'کارخانه روزکار'],
  'float-day': ['شناور روزانه', 'شناور منعطف'],
  'float-abs': ['مطلق اداری', 'مطلق پشتیبانی'],
  split: ['رستورانی', 'خدماتی'],
  rotate: ['2 صبح + 3 شب + OFF', '3 کار + 3 استراحت'],
};

export default function Step2CalendarShift({ onValidityChange }: { onValidityChange: (v: boolean) => void }) {
  const [cal, setCal] = useState('');
  const [off, setOff] = useState<string[]>([]);
  const [hol, setHol] = useState<Array<{ id: string; date: string; title: string }>>([]);
  const [skip, setSkip] = useState(false);
  const [skipDlg, setSkipDlg] = useState(false);
  const [holDlg, setHolDlg] = useState(false);
  const [hDate, setHDate] = useState('');
  const [hTitle, setHTitle] = useState('');

  const [type, setType] = useState<T | ''>('');
  const [title, setTitle] = useState('');
  const [from, setFrom] = useState('1404/1/1');
  const [to, setTo] = useState('1404/12/29');
  const [tpl, setTpl] = useState('');
  const [days, setDays] = useState<string[]>([]);

  const [fS, setFS] = useState('08:00');
  const [fE, setFE] = useState('17:00');
  const [fP, setFP] = useState('');
  const [fDlg, setFDlg] = useState(false);
  const [fBr, setFBr] = useState<B[]>([]);

  const [eS, setES] = useState('07:00');
  const [eE, setEE] = useState('10:00');
  const [reqH, setReqH] = useState(8);
  const [fdBr, setFdBr] = useState<B[]>([]);

  const [aS, setAS] = useState('09:00');
  const [aE, setAE] = useState('18:00');
  const [aReq, setAReq] = useState(480);
  const [faBr, setFaBr] = useState<B[]>([]);

  const [s1S, setS1S] = useState('10:00');
  const [s1E, setS1E] = useState('14:00');
  const [s2S, setS2S] = useState('18:00');
  const [s2E, setS2E] = useState('23:00');
  const [s2Pending, setS2Pending] = useState('');
  const [s2Dlg, setS2Dlg] = useState(false);
  const [s1Br, setS1Br] = useState<B[]>([]);
  const [s2Br, setS2Br] = useState<B[]>([]);

  const [rot, setRot] = useState<Array<{ id: string; t: string; r: number }>>([
    { id: 'r1', t: 'صبح', r: 2 },
    { id: 'r2', t: 'شب', r: 3 },
    { id: 'r3', t: 'OFF', r: 2 },
  ]);
  const [rotBr, setRotBr] = useState<B[]>([]);

  const hasHoliday = off.length > 0 || hol.length > 0;
  const showShift = !!cal && (hasHoliday || skip);
  const out1 = add(eS, reqH * 60);
  const out2 = add(eE, reqH * 60);

  const err = useMemo(() => {
    const e: string[] = [];
    if (!cal) e.push('تقویم پایه انتخاب نشده است.');
    if (!showShift) return e;
    if (!type) e.push('نوع شیفت انتخاب نشده است.');
    if (!title.trim()) e.push('عنوان شیفت الزامی است.');
    if (!from || !to) e.push('بازه تاریخ الزامی است.');
    if (!tpl) e.push('قالب شیفت را انتخاب کنید.');
    if (type && type !== 'rotate' && days.length === 0) e.push('روزهای هفته را انتخاب کنید.');
    if (type === 'fixed' && n(fE) <= n(fS) && !fDlg) e.push('پایان روز بعد باید تایید شود.');
    if (type === 'float-day') {
      if (n(eE) <= n(eS)) e.push('بازه ورود نمی تواند روز بعد باشد.');
      if (reqH <= 0) e.push('ساعت موظفی باید بیشتر از صفر باشد.');
      if (out2.d >= 2) e.push('ساعت موظفی زیاد است و خروج به دو روز بعد می افتد.');
    }
    if (type === 'float-abs' && aReq <= 0) e.push('ساعت موظفی کارکرد نامعتبر است.');
    if (type === 'split' && n(s1E) <= n(s1S)) e.push('پایان تکه اول نمی تواند روز بعد باشد.');
    if (type === 'rotate' && rot.some((r) => r.r < 1)) e.push('تکرار هر آیتم باید حداقل 1 باشد.');
    return e;
  }, [cal, showShift, type, title, from, to, tpl, days.length, fE, fS, fDlg, eE, eS, out2.d, reqH, aReq, s1E, s1S, rot]);

  useEffect(() => onValidityChange(err.length === 0), [err, onValidityChange]);

  const td = (d: string) => setDays((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));
  const toff = (d: string) => {
    setSkip(false);
    setOff((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));
  };
  const ah = () => {
    if (!hDate || !hTitle) return;
    setSkip(false);
    setHol((p) => [...p, { id: `${Date.now()}-${p.length}`, date: hDate, title: hTitle }]);
    setHDate('');
    setHTitle('');
    setHolDlg(false);
  };
  const cfe = (v: string) => {
    if (n(v) <= n(fS)) {
      setFP(v);
      setFDlg(true);
      return;
    }
    setFE(v);
  };
  const cs2e = (v: string) => {
    if (n(v) <= n(s2S)) {
      setS2Pending(v);
      setS2Dlg(true);
      return;
    }
    setS2E(v);
  };

  const applyTemplate = (nextType: T, nextTpl: string) => {
    if (nextType === 'fixed') {
      if (nextTpl === 'کارخانه روزکار') {
        setFS('07:00'); setFE('15:00');
      } else {
        setFS('08:00'); setFE('17:00');
      }
    }
    if (nextType === 'float-day') {
      if (nextTpl === 'شناور منعطف') {
        setReqH(7); setES('08:00'); setEE('12:00');
      } else {
        setReqH(8); setES('07:00'); setEE('10:00');
      }
    }
    if (nextType === 'float-abs') {
      if (nextTpl === 'مطلق پشتیبانی') {
        setAS('10:00'); setAE('22:00'); setAReq(8 * 60);
      } else {
        setAS('09:00'); setAE('18:00'); setAReq(8 * 60);
      }
    }
    if (nextType === 'split') {
      if (nextTpl === 'رستورانی') {
        setS1S('11:00'); setS1E('15:00'); setS2S('18:00'); setS2E('23:00');
      } else {
        setS1S('09:00'); setS1E('13:00'); setS2S('16:00'); setS2E('20:00');
      }
    }
    if (nextType === 'rotate') {
      if (nextTpl === '3 کار + 3 استراحت') {
        setRot([{ id: 'r1', t: 'صبح', r: 3 }, { id: 'r2', t: 'OFF', r: 3 }]);
      } else {
        setRot([{ id: 'r1', t: 'صبح', r: 2 }, { id: 'r2', t: 'شب', r: 3 }, { id: 'r3', t: 'OFF', r: 2 }]);
      }
    }
  };

  const onTypeSelect = (nextType: T) => {
    const defaultTpl = TPL[nextType][0];
    setType(nextType);
    setTpl(defaultTpl);
    applyTemplate(nextType, defaultTpl);
  };

  const onTplSelect = (nextTpl: string) => {
    setTpl(nextTpl);
    if (type && nextTpl) applyTemplate(type, nextTpl);
  };

  const renderB = (x: B[], sx: (v: B[]) => void, onlyFloat = false) => {
    const up = (id: string, patch: Partial<B>) => sx(x.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    const rm = (id: string) => sx(x.filter((b) => b.id !== id));

    return (
      <div className="space-y-2 rounded-xl border border-white/10 bg-slate-900/50 p-3">
        <div className="text-xs text-slate-300">استراحت ها</div>
        <div className="flex gap-2">
          {!onlyFloat && (
            <button
              title="افزودن استراحت ثابت با ساعت شروع/پایان"
              className="px-2.5 py-1.5 border border-white/15 rounded-lg text-xs text-slate-200 hover:border-white/30"
              onClick={() => sx([...x, mk('fixed')])}
            >
              + ثابت
            </button>
          )}
          <button
            title="افزودن استراحت شناور با مدت زمان"
            className="px-2.5 py-1.5 border border-white/15 rounded-lg text-xs text-slate-200 hover:border-white/30"
            onClick={() => sx([...x, mk('floating')])}
          >
            + شناور
          </button>
        </div>

        {x.length === 0 && <div className="text-xs text-slate-500">هنوز استراحتی تعریف نشده است.</div>}

        {x.map((b, i) => (
          <div key={b.id} className="rounded-lg border border-white/10 bg-slate-800/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-300">استراحت {i + 1}</div>
              <button title="حذف این استراحت" className="px-2 py-1 border border-rose-300/25 rounded text-[11px] text-rose-200" onClick={() => rm(b.id)}>
                حذف
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                title="نوع استراحت"
                value={b.kind}
                disabled={onlyFloat}
                onChange={(e) => up(b.id, { kind: e.target.value as 'fixed' | 'floating' })}
                className="px-2 py-1.5 border border-white/10 rounded bg-slate-900/60 text-xs text-slate-100 disabled:opacity-60"
              >
                <option value="fixed">استراحت ثابت</option>
                <option value="floating">استراحت شناور</option>
              </select>
              <label className="inline-flex items-center gap-2 text-xs text-slate-300 border border-white/10 rounded px-2 py-1.5 bg-slate-900/60">
                <input title="اگر فعال باشد از کارکرد کسر می‌شود" type="checkbox" checked={b.d} onChange={(e) => up(b.id, { d: e.target.checked })} className="accent-indigo-500" />
                کسر از کارکرد
              </label>
            </div>

            {b.kind === 'fixed' ? (
              <div className="grid grid-cols-2 gap-2">
                <input title="شروع استراحت ثابت" type="time" value={b.a} onChange={(e) => up(b.id, { a: e.target.value })} className="px-2 py-1.5 border border-white/10 rounded bg-slate-900/60 text-xs text-slate-100" />
                <input title="پایان استراحت ثابت" type="time" value={b.b} onChange={(e) => up(b.id, { b: e.target.value })} className="px-2 py-1.5 border border-white/10 rounded bg-slate-900/60 text-xs text-slate-100" />
              </div>
            ) : (
              <input
                title="مدت استراحت شناور به دقیقه"
                type="number"
                min={1}
                value={b.m}
                onChange={(e) => up(b.id, { m: Number(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 border border-white/10 rounded bg-slate-900/60 text-xs text-slate-100"
                placeholder="مدت به دقیقه"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-white">مرحله 2: ثبت تقویم، تعطیلات و شیفت</h2>
        <span className="text-xs px-3 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200">Step 2</span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 space-y-3">
        <div className="text-sm font-semibold text-slate-100">1) تقویم پایه</div>
        <button title="تقویم پایه برای ساخت شیفت‌ها" className={`w-full px-4 py-3 rounded-xl border text-right text-sm transition-colors ${cal ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-200' : 'border-white/10 text-slate-200 hover:border-white/25'}`} onClick={() => setCal('1404')}>
          تقویم 1404 با تعطیلات رسمی کشوری
        </button>
      </div>

      {cal && <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-100">2) تعطیلات سازمانی</div>
          <div className="text-xs text-indigo-200 bg-indigo-500/10 border border-indigo-400/25 px-2.5 py-1 rounded-full">تقویم: 1404</div>
        </div>
        <div className="flex flex-wrap gap-2">{W.map((d) => <button title={`تعطیلی هفتگی ${d}`} key={d} className={`px-2.5 py-1.5 border rounded-lg text-xs transition-colors ${off.includes(d) ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200' : 'border-white/15 text-slate-300 hover:border-white/30'}`} onClick={() => toff(d)}>{d}</button>)}</div>
        <button title="ثبت تعطیلی یک روز خاص" className="px-3 py-1.5 rounded-lg border border-white/15 text-xs text-slate-200 hover:border-white/30" onClick={() => setHolDlg(true)}>تعطیلی تکی سریع</button>
        {hol.length > 0 ? hol.map((h) => <div key={h.id} className="text-xs text-slate-300">{h.date} - {h.title}</div>) : <div className="text-xs text-slate-500">هنوز تعطیلی تکی ثبت نشده است.</div>}
        <button title="اگر این بخش را رد کنید، شیفت‌ها روی تعطیلات سازمانی اعمال نمی‌شوند" className="px-3 py-1.5 rounded-lg border border-amber-300/30 text-xs text-amber-200 hover:bg-amber-500/10" onClick={() => setSkipDlg(true)}>رد کردن این بخش</button>
      </div>}

      {showShift && <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 space-y-4">
        <div className="text-sm font-semibold text-slate-100">3) شیفت ها</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {(['float-day', 'fixed', 'split', 'float-abs', 'rotate'] as T[]).map((t) => (
            <button key={t} title="نوع شیفت را انتخاب کنید" className={`px-3 py-2 rounded-xl border text-xs text-right transition-colors ${type === t ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200' : 'border-white/15 text-slate-300 hover:border-white/30'}`} onClick={() => onTypeSelect(t)}>
              {SHIFT_LABEL[t]}
            </button>
          ))}
        </div>

        {!!type && <>
          <div className="space-y-2 rounded-xl border border-white/10 bg-slate-900/50 p-3">
            <div className="text-xs text-slate-300">عنوان شیفت</div>
            <input title="نام شیفت در لیست شیفت‌ها" className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان شیفت" />
            <div className="flex gap-2 flex-wrap">{['شیفت صبح', 'شیفت عصر', 'شیفت شب'].map((t) => <button title={`انتخاب سریع عنوان: ${t}`} key={t} className="px-2.5 py-1.5 border border-white/15 rounded-lg text-xs text-slate-200 hover:border-white/30" onClick={() => setTitle(t)}>{t}</button>)}</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="space-y-2 rounded-xl border border-white/10 bg-slate-900/50 p-3">
              <div className="text-xs text-slate-300">از تاریخ</div>
              <input title="تاریخ شروع اعمال شیفت" className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={from} onChange={(e) => setFrom(e.target.value)} />
              <div className="flex gap-2 flex-wrap">
                <button className="px-2.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 text-xs" onClick={() => setFrom('1404/1/15')}>از امروز</button>
                <button className="px-2.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 text-xs" onClick={() => setFrom('1404/1/1')}>از اول سال</button>
                <button className="px-2.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 text-xs" onClick={() => setFrom('1404/1/1')}>از اول ماه</button>
              </div>
            </div>
            <div className="space-y-2 rounded-xl border border-white/10 bg-slate-900/50 p-3">
              <div className="text-xs text-slate-300">تا تاریخ</div>
              <input title="تاریخ پایان اعمال شیفت" className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={to} onChange={(e) => setTo(e.target.value)} />
              <div className="flex gap-2 flex-wrap">
                <button className="px-2.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 text-xs" onClick={() => setTo('1404/1/31')}>تا آخر ماه</button>
                <button className="px-2.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 text-xs" onClick={() => setTo('1404/12/29')}>تا آخر سال</button>
              </div>
            </div>
          </div>

          <select title="بعد از انتخاب قالب، فیلدها خودکار مقدار می‌گیرند" className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={tpl} onChange={(e) => onTplSelect(e.target.value)}>
            <option value="">قالب شیفت</option>
            {(type ? TPL[type] : []).map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </>}

        {(type === 'fixed' || type === 'float-day' || type === 'float-abs' || type === 'split') && <div className="flex flex-wrap gap-2">{W.map((d) => <button title={`انتخاب روز کاری: ${d}`} key={d} className={`px-2.5 py-1.5 border rounded-lg text-xs ${days.includes(d) ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200' : 'border-white/15 text-slate-300 hover:border-white/30'}`} onClick={() => td(d)}>{d}</button>)}</div>}

        {type === 'fixed' && <>
          <div className="grid grid-cols-2 gap-2"><input title="شروع شیفت ثابت" type="time" className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={fS} onChange={(e) => setFS(e.target.value)} /><input title="پایان شیفت ثابت" type="time" className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={fE} onChange={(e) => cfe(e.target.value)} /></div>
          {n(fE) <= n(fS) ? <div className="text-xs text-amber-300">پایان این شیفت در روز بعد است. <button className="underline mr-1" onClick={() => setFE(fS)}>برگشت به روز قبل</button></div> : null}
          {renderB(fBr, setFBr)}
        </>}

        {type === 'float-day' && <>
          <div className="space-y-2 rounded-xl border border-white/10 bg-slate-900/50 p-3">
            <div className="text-xs text-slate-300">ساعت موظفی (ساعت)</div>
            <input title="بر حسب ساعت. خروج براساس آن محاسبه می‌شود." type="number" min={1} className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={reqH} onChange={(e) => setReqH(Number(e.target.value) || 0)} />
          </div>
          <div className="grid grid-cols-2 gap-2"><input title="شروع بازه ورود" type="time" className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={eS} onChange={(e) => setES(e.target.value)} /><input title="پایان بازه ورود" type="time" className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={eE} onChange={(e) => setEE(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-2">
            <input readOnly title="شروع بازه خروج محاسبه شده" value={`${out1.t}${out1.d ? ' (فردا)' : ''}`} className="px-3 py-2 rounded-lg border border-cyan-400/20 bg-cyan-500/10 text-cyan-100" />
            <input readOnly title="پایان بازه خروج محاسبه شده" value={`${out2.t}${out2.d ? ' (فردا)' : ''}`} className="px-3 py-2 rounded-lg border border-cyan-400/20 bg-cyan-500/10 text-cyan-100" />
          </div>
          {renderB(fdBr, setFdBr)}
        </>}

        {type === 'float-abs' && <>
          <div className="grid grid-cols-3 gap-2"><input title="شروع شیفت شناور مطلق (همان روز)" type="time" className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={aS} onChange={(e) => setAS(e.target.value)} /><input title="پایان شیفت شناور مطلق" type="time" className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={aE} onChange={(e) => setAE(e.target.value)} /><input title="ساعت موظفی کارکرد (دقیقه)" type="number" className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={aReq} onChange={(e) => setAReq(Number(e.target.value) || 0)} /></div>
          {renderB(faBr, setFaBr, true)}
        </>}

        {type === 'split' && <>
          <div className="grid grid-cols-2 gap-2"><input title="شروع تکه اول" type="time" className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={s1S} onChange={(e) => setS1S(e.target.value)} /><input title="پایان تکه اول" type="time" className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={s1E} onChange={(e) => setS1E(e.target.value)} /></div>
          {renderB(s1Br, setS1Br)}
          <div className="grid grid-cols-2 gap-2"><input title="شروع تکه دوم" type="time" className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={s2S} onChange={(e) => setS2S(e.target.value)} /><input title="پایان تکه دوم (می‌تواند فردا باشد)" type="time" className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60 text-slate-100" value={s2E} onChange={(e) => cs2e(e.target.value)} /></div>
          {n(s2E) <= n(s2S) ? <div className="text-xs text-amber-300">پایان تکه دوم در روز بعد در نظر گرفته می شود. <button className="underline mr-1" onClick={() => setS2E(s2S)}>برگشت به روز قبل</button></div> : null}
          {renderB(s2Br, setS2Br)}
        </>}

        {type === 'rotate' && <div className="space-y-2 rounded-xl border border-white/10 bg-slate-900/50 p-3">
          {rot.map((r) => <div key={r.id} className="grid grid-cols-3 gap-2"><select title="نوع شیفت آیتم چرخشی" className="px-2 py-1 border border-white/10 rounded bg-slate-800/60" value={r.t} onChange={(e) => setRot((p) => p.map((x) => x.id === r.id ? { ...x, t: e.target.value } : x))}><option>صبح</option><option>عصر</option><option>شب</option><option>OFF</option></select><input title="تعداد تکرار روز" type="number" className="px-2 py-1 border border-white/10 rounded bg-slate-800/60" value={r.r} onChange={(e) => setRot((p) => p.map((x) => x.id === r.id ? { ...x, r: Number(e.target.value) || 1 } : x))} /><button title="حذف آیتم چرخشی" className="px-2 py-1 border rounded text-xs" onClick={() => setRot((p) => p.filter((x) => x.id !== r.id))}>حذف</button></div>)}
          <button title="افزودن آیتم جدید به شیفت چرخشی" className="px-2 py-1 border rounded text-xs" onClick={() => setRot((p) => [...p, { id: `${Date.now()}-${p.length}`, t: 'صبح', r: 1 }])}>+ آیتم جدید</button>
          {renderB(rotBr, setRotBr)}
        </div>}

        {err.length > 0 ? <div className="text-xs text-rose-300 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2">{err[0]}</div> : null}
      </div>}

      <ConfirmDialog open={skipDlg} onOpenChange={setSkipDlg} title="رد کردن تعطیلات سازمانی" description="در صورت رد کردن، شیفت ها روی تعطیلات سازمانی اعمال نمی شوند و باید بعدا در تنظیمات تکمیل کنید." confirmText="بله" cancelText="بازگشت" onConfirm={() => { setSkipDlg(false); setOff([]); setHol([]); setSkip(true); }} />
      <ConfirmDialog
        open={fDlg}
        onOpenChange={(open) => {
          if (!open && fP) setFP('');
          setFDlg(open);
        }}
        title="تایید پایان روز بعد"
        description="ساعت پایان در روز بعد قرار می گیرد. تایید می کنید؟"
        confirmText="تایید"
        cancelText="ویرایش"
        onConfirm={() => {
          setFE(fP);
          setFP('');
          setFDlg(false);
        }}
      />
      <ConfirmDialog
        open={s2Dlg}
        onOpenChange={(open) => {
          if (!open && s2Pending) {
            setS2E(s2S);
            setS2Pending('');
          }
          setS2Dlg(open);
        }}
        title="تایید پایان تکه دوم در روز بعد"
        description="پایان تکه دوم در روز بعد قرار می گیرد. تایید می کنید؟"
        confirmText="تایید"
        cancelText="بازگشت به روز قبل"
        onConfirm={() => {
          setS2E(s2Pending);
          setS2Pending('');
          setS2Dlg(false);
        }}
      />
      <Dialog open={holDlg} onOpenChange={setHolDlg}><DialogContent dir="rtl" className="bg-slate-900 border-white/10 text-slate-100"><DialogHeader><DialogTitle className="text-white">تعطیلی تکی سریع</DialogTitle><DialogDescription className="text-slate-300">مثال: 1404/4/4 - تعطیل است</DialogDescription></DialogHeader><input title="تاریخ تعطیلی تکی" className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60" value={hDate} onChange={(e) => setHDate(e.target.value)} placeholder="1404/4/4" /><input title="عنوان تعطیلی تکی" className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800/60" value={hTitle} onChange={(e) => setHTitle(e.target.value)} placeholder="تعطیل است" /><DialogFooter><button title="بستن بدون ذخیره" className="px-3 py-1.5 border border-white/15 rounded-lg" onClick={() => setHolDlg(false)}>انصراف</button><button title="ثبت تعطیلی تکی" className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white" onClick={ah}>ثبت</button></DialogFooter></DialogContent></Dialog>
    </section>
  );
}
