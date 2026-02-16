import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Toggle } from '../components/Toggle';

type MainTab = 'shift' | 'leave' | 'mission' | 'overtime' | 'attendance' | 'swap' | 'holiday' | 'other' | 'nightShift';
type ShiftSubTab = 'fixed' | 'floating' | 'rotating' | 'split';
type LeaveSubTab = 'annual' | 'sick' | 'unpaid' | 'incentive';

export default function AddPolicy() {
  const navigate = useNavigate();
  const [policyName, setPolicyName] = useState('');
  const [policyDesc, setPolicyDesc] = useState('');
  const [activeTab, setActiveTab] = useState<MainTab>('shift');
  const [activeShiftSubTab, setActiveShiftSubTab] = useState<ShiftSubTab>('fixed');
  const [activeLeaveSubTab, setActiveLeaveSubTab] = useState<LeaveSubTab>('annual');

  // Leave Policy - Unit Toggle State
  const [leaveUnitMode, setLeaveUnitMode] = useState<'daily' | 'hourly'>('daily');

  // Fixed Shift States
  const [fixedInGrace, setFixedInGrace] = useState('10');
  const [fixedLateMethod, setFixedLateMethod] = useState<'Graceful' | 'Strict'>('Graceful');
  const [fixedOutGrace, setFixedOutGrace] = useState('15');
  const [fixedEarlyMethod, setFixedEarlyMethod] = useState<'Graceful' | 'Strict'>('Graceful');
  const [fixedMaxLateAbsent, setFixedMaxLateAbsent] = useState('120');
  const [fixedRoundingPolicy, setFixedRoundingPolicy] = useState<'none' | 'nearest' | 'ceil' | 'floor'>('none');
  const [fixedRoundSize, setFixedRoundSize] = useState('5');

  // Floating Shift States
  const [floatingType, setFloatingType] = useState<'windowed' | 'absolute'>('windowed');
  const [floatingBuffer, setFloatingBuffer] = useState('30');
  const [floatingBufferPolicy, setFloatingBufferPolicy] = useState<'lateOnly' | 'absentIfExceeded'>('lateOnly');
  const [floatingLateMethod, setFloatingLateMethod] = useState<'Graceful' | 'Strict'>('Graceful');
  const [floatingMaxLateAbsent, setFloatingMaxLateAbsent] = useState('120');
  const [floatingRoundingPolicy, setFloatingRoundingPolicy] = useState<'none' | 'nearest' | 'ceil' | 'floor'>('none');
  const [floatingRoundSize, setFloatingRoundSize] = useState('5');
  const [floatingInGrace, setFloatingInGrace] = useState('10');
  const [floatingOutGrace, setFloatingOutGrace] = useState('15');
  const [absMinPresenceHours, setAbsMinPresenceHours] = useState('4');
  const [absMaxPunches, setAbsMaxPunches] = useState<'unlimited' | '2' | '4' | '6'>('unlimited');

  // Rotating Shift States
  const [rotInGrace, setRotInGrace] = useState('10');
  const [rotLateMethod, setRotLateMethod] = useState<'Graceful' | 'Strict'>('Graceful');
  const [rotOutGrace, setRotOutGrace] = useState('15');
  const [rotEarlyMethod, setRotEarlyMethod] = useState<'Graceful' | 'Strict'>('Graceful');
  const [rotMaxLateAbsent, setRotMaxLateAbsent] = useState('120');
  const [rotRoundingPolicy, setRotRoundingPolicy] = useState<'none' | 'nearest' | 'ceil' | 'floor'>('none');
  const [rotRoundSize, setRotRoundSize] = useState('5');
  const [allowSwapRequests, setAllowSwapRequests] = useState<'yes' | 'no'>('yes');

  // Split Shift States
  const [splitInGrace, setSplitInGrace] = useState('10');
  const [splitLateMethod, setSplitLateMethod] = useState<'Graceful' | 'Strict'>('Graceful');
  const [splitOutGrace, setSplitOutGrace] = useState('15');
  const [splitEarlyMethod, setSplitEarlyMethod] = useState<'Graceful' | 'Strict'>('Graceful');
  const [splitMaxLateAbsent, setSplitMaxLateAbsent] = useState('120');
  const [splitRoundingPolicy, setSplitRoundingPolicy] = useState<'none' | 'nearest' | 'ceil' | 'floor'>('none');
  const [splitRoundSize, setSplitRoundSize] = useState('5');

  // Night Shift States
  const [nightShiftStart, setNightShiftStart] = useState('20:00');
  const [nightShiftEnd, setNightShiftEnd] = useState('08:00');

  // Leave Policy States
  const [leaveTitle, setLeaveTitle] = useState('');
  const [leaveNature, setLeaveNature] = useState<'paid' | 'unpaid'>('paid');
  const [leaveUnit, setLeaveUnit] = useState<'daily' | 'hourly'>('daily');
  const [leaveQuotaView, setLeaveQuotaView] = useState<'day' | 'hour'>('day');
  const [leaveAnnualQuota, setLeaveAnnualQuota] = useState('26');
  const [leaveAnnualQuotaHours, setLeaveAnnualQuotaHours] = useState('208');
  const [leaveAnnualQuotaMinutes, setLeaveAnnualQuotaMinutes] = useState('0');
  const [leaveMonthlyQuota, setLeaveMonthlyQuota] = useState('2.5');
  const [leaveMonthlyQuotaHours, setLeaveMonthlyQuotaHours] = useState('20');
  const [leaveMonthlyQuotaMinutes, setLeaveMonthlyQuotaMinutes] = useState('0');
  const [leaveMonthlyCapEnabled, setLeaveMonthlyCapEnabled] = useState(true);
  const [leaveMinRequest, setLeaveMinRequest] = useState('30');
  const [leaveMinUnit, setLeaveMinUnit] = useState<'minute' | 'day'>('minute');
  const [leaveMinMinutes, setLeaveMinMinutes] = useState('30');
  const [leaveMaxRequest, setLeaveMaxRequest] = useState('3');
  const [leaveMaxMinutes, setLeaveMaxMinutes] = useState('180');
  const [leaveCarryoverCap, setLeaveCarryoverCap] = useState('9');
  const [leaveCarryoverCapHours, setLeaveCarryoverCapHours] = useState('72');
  const [leaveCarryoverCapMinutes, setLeaveCarryoverCapMinutes] = useState('0');
  const [leaveBuyback, setLeaveBuyback] = useState(false);
  const [leaveAttachmentRequired, setLeaveAttachmentRequired] = useState(false);
  const [leaveApprovalSteps, setLeaveApprovalSteps] = useState<'1' | '2'>('1');

  // Work Calendar State
  const [selectedCalendar, setSelectedCalendar] = useState<string>('');

  const handleSave = () => {
    console.log('Saving policy...', {
      policyName,
      policyDesc,
      activeTab,
      activeShiftSubTab,
    });
    navigate('/policies');
  };

  const mainTabs = [
    { id: 'shift' as const, label: 'سیاست‌های شیفت' },
    { id: 'nightShift' as const, label: 'تنظیمات شب کاری' },
    { id: 'leave' as const, label: 'مرخصی' },
    { id: 'mission' as const, label: 'ماموریت' },
    { id: 'overtime' as const, label: 'اضافه‌کاری' },
    { id: 'attendance' as const, label: 'تردد دستی' },
    { id: 'swap' as const, label: 'جابجایی شیفت' },
    { id: 'holiday' as const, label: 'روز تعطیل' },
    { id: 'other' as const, label: 'سایر' },
  ];

  const shiftSubTabs = [
    { id: 'fixed' as const, label: 'شیفت ثابت', desc: 'ساعات کاری مشخص و ثابت' },
    { id: 'floating' as const, label: 'شیفت شناور', desc: 'زمان ورود/خروج انعطاف‌پذیر' },
    { id: 'rotating' as const, label: 'شیفت چرخشی', desc: 'چرخش بین شیفت‌های مختلف' },
    { id: 'split' as const, label: 'شیفت دوتیکه', desc: 'کار در دو بازه زمانی جداگانه' },
  ];

  const leaveTitleDefaults: Record<LeaveSubTab, string> = {
    annual: 'مرخصی استحقاقی',
    sick: 'مرخصی استعلاجی',
    unpaid: 'مرخصی بدون حقوق',
    incentive: 'مرخصی تشویقی',
  };

  const leaveSubTabs = [
    { id: 'annual' as const, label: 'استحقاقی', desc: 'مرخصی‌های سالانه و قانونی' },
    { id: 'sick' as const, label: 'استعلاجی', desc: 'نیازمند گواهی پزشکی' },
    { id: 'unpaid' as const, label: 'بدون حقوق', desc: 'کسر از حقوق' },
    { id: 'incentive' as const, label: 'تشویقی', desc: 'مناسبت، شویق و ...' },
  ];

  // Mock calendars data
  const mockCalendars = [
    { id: '1', name: 'تقویم عمومی ۱۴۰۳', type: 'عمومی', days: '365' },
    { id: '2', name: 'تقویم شرکتی', type: 'سفارشی', days: '260' },
    { id: '3', name: 'تقویم پروژه خاص', type: 'پروژه‌ای', days: '180' },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-6 sm:px-8 py-4 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/policies')}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">ثبت سیاست کاری جدید</h1>
            <p className="text-xs text-slate-500 mt-0.5">تنظیم قوانین حضور و غیاب کارمندان</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          <CheckCircle2 className="w-4 h-4" />
          ذخیره سیاست
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-5">
          {/* Basic Info + Main Tabs */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <FormGroup
                label="نام سیاست کاری"
                required
                tooltip="نام منحصر به فرد برای این سیاست که به راحتی قابل شناسایی باشد"
              >
                <input
                  type="text"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  placeholder="مثال: سیاست کارمندان دفتر مرکزی"
                  className="input-field"
                />
              </FormGroup>
              <FormGroup label="توضیحات" tooltip="توضیح مختصری درباره کاربرد این سیاست و مخاطبان آن">
                <input
                  type="text"
                  value={policyDesc}
                  onChange={(e) => setPolicyDesc(e.target.value)}
                  placeholder="برای کارمندان اداری با ساعت کار 8 تا 17"
                  className="input-field"
                />
              </FormGroup>
            </div>

            {/* Calendar Selection */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-1">
                  انتخاب تقویم کاری
                  <span className="text-rose-400 text-xs">*</span>
                  <Tooltip>
                    تقویم کاری که روزهای کاری و تعطیل در آن تعریف شده است. این تقویم به این سیاست متصل می‌شود و تغییر آن بعد از ذخیره امکان‌پذیر نیست.
                  </Tooltip>
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  این تنظیم بعد از ذخیره سیاست <span className="text-amber-400 font-medium">غیرقابل تغییر</span> است
                </p>
              </div>

              {selectedCalendar ? (
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-5 relative">
                  <div className="absolute top-3 left-3">
                    <button
                      onClick={() => setSelectedCalendar('')}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="تغییر تقویم"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-bold text-white">
                          {mockCalendars.find((c) => c.id === selectedCalendar)?.name}
                        </h4>
                        <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded text-xs text-indigo-300">
                          {mockCalendars.find((c) => c.id === selectedCalendar)?.type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {mockCalendars.find((c) => c.id === selectedCalendar)?.days} روز کاری در سال
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-amber-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>این تقویم بعد از ذخیره قابل تغییر نیست</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {mockCalendars.map((calendar) => (
                    <button
                      key={calendar.id}
                      onClick={() => setSelectedCalendar(calendar.id)}
                      className="group p-4 bg-slate-800/30 hover:bg-slate-800/60 border border-white/5 hover:border-indigo-500/30 rounded-xl text-right transition-all"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-slate-700/50 group-hover:bg-indigo-500/20 rounded-lg flex items-center justify-center transition-colors">
                          <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors mb-1">
                            {calendar.name}
                          </h4>
                          <span className="inline-block px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400">
                            {calendar.type}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {calendar.days} روز کاری
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Tabs */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <label className="text-xs font-medium text-slate-400 mb-3 block">دسته‌بندی سیاست‌ها</label>
              <div className="flex flex-wrap gap-2">
                {mainTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                      activeTab === tab.id
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:border-white/10'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'shift' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="mb-5">
                <h2 className="text-base font-bold text-white mb-2">انتخاب نوع شیفت</h2>
                <p className="text-xs text-slate-400">
                  هر نوع شیفت قوانین و محدودیت‌های خاص خود را دارد. نوع مناسب را بر اساس ساختار کاری سازمان خود انتخاب
                  کنید.
                </p>
              </div>

              {/* Shift Sub Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {shiftSubTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveShiftSubTab(tab.id)}
                    className={cn(
                      'p-4 rounded-xl border text-right transition-all group',
                      activeShiftSubTab === tab.id
                        ? 'bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/5'
                        : 'bg-slate-800/30 border-white/5 hover:bg-slate-800/50 hover:border-white/10'
                    )}
                  >
                    <div
                      className={cn(
                        'text-sm font-bold mb-1 transition-colors',
                        activeShiftSubTab === tab.id ? 'text-indigo-300' : 'text-slate-200 group-hover:text-white'
                      )}
                    >
                      {tab.label}
                    </div>
                    <div className="text-xs text-slate-500">{tab.desc}</div>
                  </button>
                ))}
              </div>

              {/* Shift Content Card */}
              <div className="bg-slate-950/50 border border-white/5 rounded-xl p-5">
                {activeShiftSubTab === 'fixed' && (
                  <FixedShiftTab
                    inGrace={fixedInGrace}
                    setInGrace={setFixedInGrace}
                    lateMethod={fixedLateMethod}
                    setLateMethod={setFixedLateMethod}
                    outGrace={fixedOutGrace}
                    setOutGrace={setFixedOutGrace}
                    earlyMethod={fixedEarlyMethod}
                    setEarlyMethod={setFixedEarlyMethod}
                    maxLateAbsent={fixedMaxLateAbsent}
                    setMaxLateAbsent={setFixedMaxLateAbsent}
                    roundingPolicy={fixedRoundingPolicy}
                    setRoundingPolicy={setFixedRoundingPolicy}
                    roundSize={fixedRoundSize}
                    setRoundSize={setFixedRoundSize}
                  />
                )}

                {activeShiftSubTab === 'floating' && (
                  <FloatingShiftTab
                    type={floatingType}
                    setType={setFloatingType}
                    buffer={floatingBuffer}
                    setBuffer={setFloatingBuffer}
                    bufferPolicy={floatingBufferPolicy}
                    setBufferPolicy={setFloatingBufferPolicy}
                    lateMethod={floatingLateMethod}
                    setLateMethod={setFloatingLateMethod}
                    maxLateAbsent={floatingMaxLateAbsent}
                    setMaxLateAbsent={setFloatingMaxLateAbsent}
                    roundingPolicy={floatingRoundingPolicy}
                    setRoundingPolicy={setFloatingRoundingPolicy}
                    roundSize={floatingRoundSize}
                    setRoundSize={setFloatingRoundSize}
                    inGrace={floatingInGrace}
                    setInGrace={setFloatingInGrace}
                    outGrace={floatingOutGrace}
                    setOutGrace={setFloatingOutGrace}
                    minPresenceHours={absMinPresenceHours}
                    setMinPresenceHours={setAbsMinPresenceHours}
                    maxPunches={absMaxPunches}
                    setMaxPunches={setAbsMaxPunches}
                  />
                )}

                {activeShiftSubTab === 'rotating' && (
                  <RotatingShiftTab
                    inGrace={rotInGrace}
                    setInGrace={setRotInGrace}
                    lateMethod={rotLateMethod}
                    setLateMethod={setRotLateMethod}
                    outGrace={rotOutGrace}
                    setOutGrace={setRotOutGrace}
                    earlyMethod={rotEarlyMethod}
                    setEarlyMethod={setRotEarlyMethod}
                    maxLateAbsent={rotMaxLateAbsent}
                    setMaxLateAbsent={setRotMaxLateAbsent}
                    roundingPolicy={rotRoundingPolicy}
                    setRoundingPolicy={setRotRoundingPolicy}
                    roundSize={rotRoundSize}
                    setRoundSize={setRotRoundSize}
                    allowSwapRequests={allowSwapRequests}
                    setAllowSwapRequests={setAllowSwapRequests}
                  />
                )}

                {activeShiftSubTab === 'split' && (
                  <SplitShiftTab
                    inGrace={splitInGrace}
                    setInGrace={setSplitInGrace}
                    lateMethod={splitLateMethod}
                    setLateMethod={setSplitLateMethod}
                    outGrace={splitOutGrace}
                    setOutGrace={setSplitOutGrace}
                    earlyMethod={splitEarlyMethod}
                    setEarlyMethod={setSplitEarlyMethod}
                    maxLateAbsent={splitMaxLateAbsent}
                    setMaxLateAbsent={setSplitMaxLateAbsent}
                    roundingPolicy={splitRoundingPolicy}
                    setRoundingPolicy={setSplitRoundingPolicy}
                    roundSize={splitRoundSize}
                    setRoundSize={setSplitRoundSize}
                  />
                )}
              </div>
            </div>
          )}

          {/* Leave Policy Tab */}
          {activeTab === 'leave' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="mb-5">
                <h2 className="text-base font-bold text-white mb-2">سیاست‌های مرخصی</h2>
                <p className="text-xs text-slate-400">تعریف نوع مرخصی، سهمیه‌ها و محدودیت‌های درخواست</p>
              </div>

              {/* Leave Sub Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                {leaveSubTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveLeaveSubTab(tab.id);
                    }}
                    className={cn(
                      'p-4 rounded-xl border text-right transition-all group',
                      activeLeaveSubTab === tab.id
                        ? 'bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/5'
                        : 'bg-slate-800/30 border-white/5 hover:bg-slate-800/50 hover:border-white/10'
                    )}
                  >
                    <div
                      className={cn(
                        'text-sm font-bold mb-1 transition-colors',
                        activeLeaveSubTab === tab.id ? 'text-indigo-300' : 'text-slate-200 group-hover:text-white'
                      )}
                    >
                      {tab.label}
                    </div>
                    <div className="text-xs text-slate-500">{tab.desc}</div>
                  </button>
                ))}
              </div>

              <div className="bg-slate-950/50 border border-white/5 rounded-xl p-5">
                <LeavePolicyTab
                  title={leaveTitle}
                  setTitle={setLeaveTitle}
                  nature={leaveNature}
                  setNature={setLeaveNature}
                  unit={leaveUnit}
                  setUnit={setLeaveUnit}
                  quotaView={leaveQuotaView}
                  setQuotaView={setLeaveQuotaView}
                  annualQuota={leaveAnnualQuota}
                  setAnnualQuota={setLeaveAnnualQuota}
                  annualQuotaHours={leaveAnnualQuotaHours}
                  setAnnualQuotaHours={setLeaveAnnualQuotaHours}
                  annualQuotaMinutes={leaveAnnualQuotaMinutes}
                  setAnnualQuotaMinutes={setLeaveAnnualQuotaMinutes}
                  monthlyQuota={leaveMonthlyQuota}
                  setMonthlyQuota={setLeaveMonthlyQuota}
                  monthlyQuotaHours={leaveMonthlyQuotaHours}
                  setMonthlyQuotaHours={setLeaveMonthlyQuotaHours}
                  monthlyQuotaMinutes={leaveMonthlyQuotaMinutes}
                  setMonthlyQuotaMinutes={setLeaveMonthlyQuotaMinutes}
                  monthlyCapEnabled={leaveMonthlyCapEnabled}
                  setMonthlyCapEnabled={setLeaveMonthlyCapEnabled}
                  minRequest={leaveMinRequest}
                  setMinRequest={setLeaveMinRequest}
                  minUnit={leaveMinUnit}
                  setMinUnit={setLeaveMinUnit}
                  minMinutes={leaveMinMinutes}
                  setMinMinutes={setLeaveMinMinutes}
                  maxRequest={leaveMaxRequest}
                  setMaxRequest={setLeaveMaxRequest}
                  maxMinutes={leaveMaxMinutes}
                  setMaxMinutes={setLeaveMaxMinutes}
                  carryoverCap={leaveCarryoverCap}
                  setCarryoverCap={setLeaveCarryoverCap}
                  carryoverCapHours={leaveCarryoverCapHours}
                  setCarryoverCapHours={setLeaveCarryoverCapHours}
                  carryoverCapMinutes={leaveCarryoverCapMinutes}
                  setCarryoverCapMinutes={setLeaveCarryoverCapMinutes}
                  buyback={leaveBuyback}
                  setBuyback={setLeaveBuyback}
                  attachmentRequired={leaveAttachmentRequired}
                  setAttachmentRequired={setLeaveAttachmentRequired}
                  approvalSteps={leaveApprovalSteps}
                  setApprovalSteps={setLeaveApprovalSteps}
                />
              </div>
            </div>
          )}

          {/* Other Tabs - Coming Soon */}
          {activeTab !== 'shift' && activeTab !== 'nightShift' && activeTab !== 'leave' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-200 mb-2">این بخش به زودی فعال می‌شود</h3>
              <p className="text-sm text-slate-400">در حال توسعه تنظیمات {mainTabs.find((t) => t.id === activeTab)?.label} هستیم</p>
            </div>
          )}

          {/* Night Shift Tab */}
          {activeTab === 'nightShift' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="mb-5">
                <h2 className="text-base font-bold text-white mb-2">تنظیمات شب کاری</h2>
                <p className="text-xs text-slate-400">
                  تعریف بازه زمانی شب کاری برای محاسبه اضافه‌کاری و حق شب کاری
                </p>
              </div>

              <div className="bg-slate-950/50 border border-white/5 rounded-xl p-5">
                <NightShiftTab start={nightShiftStart} setStart={setNightShiftStart} end={nightShiftEnd} setEnd={setNightShiftEnd} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span className="group relative inline-block">
      <Info className="w-4 h-4 text-slate-500 hover:text-indigo-400 cursor-help transition-colors" />
      <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute z-50 w-64 p-3 text-xs leading-relaxed text-slate-200 bg-slate-800 border border-white/10 rounded-lg shadow-xl -top-2 left-6 backdrop-blur-xl">
        {children}
      </span>
    </span>
  );
}

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
      {icon}
      <h3 className="text-sm font-bold text-slate-200">{children}</h3>
    </div>
  );
}

function FormGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div className={`grid grid-cols-1 ${cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-5`}>{children}</div>
  );
}

function FormGroup({
  label,
  tooltip,
  note,
  required,
  children,
}: {
  label: string;
  tooltip?: string;
  note?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
        {label}
        {required && <span className="text-rose-400 text-xs">*</span>}
        {tooltip && <Tooltip>{tooltip}</Tooltip>}
      </label>
      {children}
      {note && (
        <span className="text-xs text-slate-500 leading-relaxed bg-slate-800/30 rounded-lg px-3 py-2 border border-white/5">
          {note}
        </span>
      )}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />;
}

function InfoBox({ children, variant = 'info' }: { children: React.ReactNode; variant?: 'info' | 'warning' | 'success' }) {
  const colors = {
    info: 'bg-blue-500/5 border-blue-500/20 text-blue-200',
    warning: 'bg-amber-500/5 border-amber-500/20 text-amber-200',
    success: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200',
  };

  return (
    <div className={`flex items-start gap-3 ${colors[variant]} border rounded-xl p-4 mt-5`}>
      <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-xs leading-relaxed">{children}</p>
    </div>
  );
}

// Fixed Shift Tab
function FixedShiftTab({
  inGrace,
  setInGrace,
  lateMethod,
  setLateMethod,
  outGrace,
  setOutGrace,
  earlyMethod,
  setEarlyMethod,
  maxLateAbsent,
  setMaxLateAbsent,
  roundingPolicy,
  setRoundingPolicy,
  roundSize,
  setRoundSize,
}: any) {
  return (
    <div className="space-y-6">
      <InfoBox variant="info">
        در شیفت ثابت، ساعات کاری از قبل تعیین شده و کارمند باید در بازه زمانی مشخصی ورود و خروج ثبت کند. این نوع شیفت برای مشاغل اداری و دفتری مناسب است.
      </InfoBox>

      <div>
        <SectionTitle>📥 قوانین ورود به کار</SectionTitle>
        <FormGrid>
          <FormGroup
            label="فرجه مجاز ورود"
            tooltip="مدت زمانی که کارمند می‌تواند بعد از شروع شیفت وارد شود بدون اینکه تاخیر محاسبه شود. مثلاً اگر ۱۰ دقیقه باشد و شیفت ۸ صبح شروع شود، ورود تا ۸:۱۰ بدون مشکل است."
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={inGrace}
                onChange={(e) => setInGrace(e.target.value)}
                min="0"
                className="input-field flex-1"
                placeholder="10"
              />
              <span className="text-xs text-slate-500 whitespace-nowrap">دقیقه</span>
            </div>
          </FormGroup>

          <FormGroup
            label="نحوه محاسبه تاخیر"
            tooltip="ملایم: فقط زمان اضافه بر فرجه به عنوان تاخیر محاسبه می‌شود (مثلاً اگر فرجه ۱۰ دقیقه باشد و ۲۰ دقیقه تاخیر کند، فقط ۱۰ دقیقه کسر می‌شود). سخت‌گیر: کل مدت تاخیر از زمان شروع شیفت محاسبه می‌شود (۲۰ دقیقه کامل کسر می‌شود)."
          >
            <select value={lateMethod} onChange={(e) => setLateMethod(e.target.value)} className="input-field">
              <option value="Graceful">ملایم (توصیه می‌شود)</option>
              <option value="Strict">سخت‌گیرانه</option>
            </select>
          </FormGroup>

          <FormGroup
            label="حداکثر تاخیر مجاز"
            tooltip="اگر کارمند بیش از این مقدار تاخیر کند، روز به صورت غیبت ثبت می‌شود. معمولاً ۱۲۰ دقیقه (۲ ساعت) تنظیم می‌شود."
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={maxLateAbsent}
                onChange={(e) => setMaxLateAbsent(e.target.value)}
                min="0"
                className="input-field flex-1"
                placeholder="120"
              />
              <span className="text-xs text-slate-500 whitespace-nowrap">دقیقه</span>
            </div>
          </FormGroup>
        </FormGrid>
      </div>

      <Divider />

      <div>
        <SectionTitle>📤 قوانین خروج از کار</SectionTitle>
        <FormGrid>
          <FormGroup
            label="فرجه مجاز خروج"
            tooltip="مدت زمانی که کارمند می‌تواند قبل از پایان شیفت خارج شود بدون اینکه تعجیل محاسبه شود. مثلاً اگر ۱۵ دقیقه باشد و شیفت ۵ عصر تمام شود، خروج از ۴:۴۵ بدون مشکل است."
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={outGrace}
                onChange={(e) => setOutGrace(e.target.value)}
                min="0"
                className="input-field flex-1"
                placeholder="15"
              />
              <span className="text-xs text-slate-500 whitespace-nowrap">دقیقه</span>
            </div>
          </FormGroup>

          <FormGroup
            label="نحوه محاسبه تعجیل"
            tooltip="ملایم: فقط زمان اضافه بر فرجه به عنوان تعجیل محاسبه می‌شود. سخت‌گیر: کل مدت تعجیل از زمان پایان شیفت محاسبه می‌شود."
          >
            <select value={earlyMethod} onChange={(e) => setEarlyMethod(e.target.value)} className="input-field">
              <option value="Graceful">ملایم (توصیه می‌شود)</option>
              <option value="Strict">سخت‌گیرانه</option>
            </select>
          </FormGroup>
        </FormGrid>
      </div>

      <Divider />

      <div>
        <SectionTitle>🔄 قوانین گرد کردن زمان</SectionTitle>
        <FormGrid>
          <FormGroup
            label="روش گرد کردن"
            tooltip="نحوه تبدیل زمان‌های ثبت شده به اعداد رند. بدون گرد کردن: زمان دقیق ثبت می‌شود. نزدیک‌ترین: به نزدیک‌ترین بازه رند می‌شود. به بالا: همیشه به سمت بالا گرد می‌شود. به پایین: همیشه به سمت پایین گرد می‌شود."
          >
            <select value={roundingPolicy} onChange={(e) => setRoundingPolicy(e.target.value)} className="input-field">
              <option value="none">بدون گرد کردن</option>
              <option value="nearest">به نزدیک‌ترین</option>
              <option value="ceil">به بالا</option>
              <option value="floor">به پایین</option>
            </select>
          </FormGroup>

          <FormGroup
            label="بازه گرد کردن"
            tooltip="هر چند دقیقه یکبار زمان گرد شود. معمولاً ۵ یا ۱۰ دقیقه انتخاب می‌شود. مثلاً با بازه ۵ دقیقه، زمان ۸:۰۳ به ۸:۰۵ تبدیل می‌شود (در روش نزدیک‌ترین)."
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={roundSize}
                onChange={(e) => setRoundSize(e.target.value)}
                min="0"
                className="input-field flex-1"
                placeholder="5"
              />
              <span className="text-xs text-slate-500 whitespace-nowrap">دقیقه</span>
            </div>
          </FormGroup>
        </FormGrid>

        {roundingPolicy !== 'none' && (
          <div className="mt-4 bg-slate-800/50 border border-white/5 rounded-lg p-4">
            <div className="text-xs font-medium text-slate-300 mb-2">مثال با بازه {roundSize} دقیقه:</div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>زمان ثبت: <span className="text-white">08:03</span></div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>نزدیک‌ترین → <span className="text-indigo-400">08:05</span></div>
                <div>به بالا → <span className="text-indigo-400">08:05</span></div>
                <div>به پایین → <span className="text-indigo-400">08:00</span></div>
                <div>بدون گرد → <span className="text-indigo-400">08:03</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Floating Shift Tab
function FloatingShiftTab({
  type,
  setType,
  buffer,
  setBuffer,
  bufferPolicy,
  setBufferPolicy,
  lateMethod,
  setLateMethod,
  maxLateAbsent,
  setMaxLateAbsent,
  roundingPolicy,
  setRoundingPolicy,
  roundSize,
  setRoundSize,
  inGrace,
  setInGrace,
  outGrace,
  setOutGrace,
  minPresenceHours,
  setMinPresenceHours,
  maxPunches,
  setMaxPunches,
}: any) {
  return (
    <div className="space-y-6">
      <InfoBox variant="info">
        شیفت شناور به کارمند اجازه می‌دهد که زمان ورود و خروج خود را در چارچوب قوانین تعیین شده انتخاب کند. دو نوع شیفت شناور وجود دارد: <strong>پنجره‌ای</strong> (با بازه ورود/خروج مشخص) و <strong>مطلق</strong> (فقط حداقل ساعات کار مشخص است).
      </InfoBox>

      {/* Type Selection */}
      <div>
        <label className="text-sm font-medium text-slate-300 mb-3 block">نوع شیفت شناور</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('windowed')}
            className={cn(
              'p-4 rounded-xl border text-right transition-all',
              type === 'windowed'
                ? 'bg-indigo-500/10 border-indigo-500/30 shadow-lg'
                : 'bg-slate-800/30 border-white/5 hover:bg-slate-800/50'
            )}
          >
            <div className={cn('text-sm font-bold mb-1', type === 'windowed' ? 'text-indigo-300' : 'text-slate-200')}>
              شناور شروع روز
            </div>
            <div className="text-xs text-slate-500">بازه ورود و خروج مشخص + فرجه و Buffer</div>
          </button>
          <button
            type="button"
            onClick={() => setType('absolute')}
            className={cn(
              'p-4 rounded-xl border text-right transition-all',
              type === 'absolute'
                ? 'bg-indigo-500/10 border-indigo-500/30 shadow-lg'
                : 'bg-slate-800/30 border-white/5 hover:bg-slate-800/50'
            )}
          >
            <div className={cn('text-sm font-bold mb-1', type === 'absolute' ? 'text-indigo-300' : 'text-slate-200')}>
              شناوری مطلق
            </div>
            <div className="text-xs text-slate-500">فقط حداقل ساعات کار + تعداد ورود/خروج</div>
          </button>
        </div>
      </div>

      <Divider />

      {/* Windowed Floating Shift */}
      {type === 'windowed' && (
        <>
          <div>
            <SectionTitle>⏰ تنظیمات بازه زمانی</SectionTitle>
            <InfoBox variant="warning">
              در شیفت شناور پنجره‌ای، بازه ورود و خروج از قبل تعیین می‌شود (مثلاً بازه ورود ۷-۹ صبح و بازه خروج ۴-۶ عصر). کارمند در این بازه‌ها می‌تواند ورود و خروج ثبت کند.
            </InfoBox>
            <FormGrid>
              <FormGroup
                label="فرجه ورود"
                tooltip="مدت زمانی که کارمند می‌تواند بعد از پایان بازه ورود، بدون محاسبه تاخیر وارد شود. مثلاً اگر بازه ورود تا ۹ صبح است و فرجه ۱۰ دقیقه، ورود تا ۹:۱۰ بدون تاخیر است."
              >
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={inGrace}
                    onChange={(e) => setInGrace(e.target.value)}
                    min="0"
                    className="input-field flex-1"
                    placeholder="10"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">دقیقه</span>
                </div>
              </FormGroup>

              <FormGroup
                label="فرجه خروج"
                tooltip="مدت زمانی که کارمند می‌تواند قبل از شروع بازه خروج، بدون محاسبه تعجیل خارج شود."
              >
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={outGrace}
                    onChange={(e) => setOutGrace(e.target.value)}
                    min="0"
                    className="input-field flex-1"
                    placeholder="15"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">دقیقه</span>
                </div>
              </FormGroup>
            </FormGrid>
          </div>

          <div>
            <SectionTitle>🔒 سقف شناوری (Buffer)</SectionTitle>
            <FormGrid>
              <FormGroup
                label="سقف شناوری"
                tooltip="حداکثر تاخیری که پس از پایان بازه ورود + فرجه قابل قبول است. مثلاً اگر بازه ورود تا ۹ صبح، فرجه ۱۰ دقیقه و Buffer ۳۰ دقیقه باشد، ورود تا ۹:۴۰ با سیاست انتخابی برخورد می‌شود."
              >
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={buffer}
                    onChange={(e) => setBuffer(e.target.value)}
                    min="0"
                    className="input-field flex-1"
                    placeholder="30"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">دقیقه</span>
                </div>
              </FormGroup>

              <FormGroup
                label="سیاست تجاوز از سقف"
                tooltip="تعیین می‌کند که اگر تاخیر از Buffer بیشتر شود چه اتفاقی بیفتد. 'فقط تاخیر': روز حاضر ولی با تاخیر زیاد ثبت می‌شود. 'ثبت غیبت': کل روز به عنوان غیبت محسوب می‌شود."
              >
                <select value={bufferPolicy} onChange={(e) => setBufferPolicy(e.target.value)} className="input-field">
                  <option value="lateOnly">فقط تاخیر ثبت شود</option>
                  <option value="absentIfExceeded">ثبت غیبت</option>
                </select>
              </FormGroup>
            </FormGrid>
          </div>

          <Divider />

          <div>
            <SectionTitle>⚖️ محاسبه تاخیر</SectionTitle>
            <FormGrid>
              <FormGroup
                label="نحوه محاسبه تاخیر"
                tooltip="ملایم: فقط مازاد فرجه به عنوان تاخیر ثبت می‌شود. سخت‌گیر: کل تاخیر از پایان بازه ورود محاسبه می‌شود."
              >
                <select value={lateMethod} onChange={(e) => setLateMethod(e.target.value)} className="input-field">
                  <option value="Graceful">ملایم (توصیه می‌شود)</option>
                  <option value="Strict">سخت‌گیرانه</option>
                </select>
              </FormGroup>

              <FormGroup
                label="حداکثر تاخیر برای غیبت"
                tooltip="اگر کل تاخیر (شامل فرجه + Buffer) از این مقدار بیشتر شود، روز به صورت غیبت ثبت می‌شود."
              >
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={maxLateAbsent}
                    onChange={(e) => setMaxLateAbsent(e.target.value)}
                    min="0"
                    className="input-field flex-1"
                    placeholder="120"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">دقیقه</span>
                </div>
              </FormGroup>
            </FormGrid>
          </div>

          <Divider />

          <div>
            <SectionTitle>🔄 گرد کردن زمان</SectionTitle>
            <FormGrid>
              <FormGroup
                label="روش گرد کردن"
                tooltip="نحوه تبدیل زمان‌های ثبت شده به اعداد رند برای سهولت محاسبات."
              >
                <select value={roundingPolicy} onChange={(e) => setRoundingPolicy(e.target.value)} className="input-field">
                  <option value="none">بدون گرد کردن</option>
                  <option value="nearest">به نزدیک‌ترین</option>
                  <option value="ceil">به بالا</option>
                  <option value="floor">به پایین</option>
                </select>
              </FormGroup>

              <FormGroup label="بازه گرد کردن" tooltip="فاصله زمانی برای گرد کردن (معمولاً ۵ یا ۱۰ دقیقه)">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={roundSize}
                    onChange={(e) => setRoundSize(e.target.value)}
                    min="0"
                    className="input-field flex-1"
                    placeholder="5"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">دقیقه</span>
                </div>
              </FormGroup>
            </FormGrid>
          </div>
        </>
      )}

      {/* Absolute Floating Shift */}
      {type === 'absolute' && (
        <>
          <div>
            <SectionTitle>✅ شرایط تایید حضور</SectionTitle>
            <InfoBox variant="success">
              در شیفت شناور مطلق، کارمند در هر زمان می‌تواند ورود و خروج داشته باشد. مهم این است که در مجموع حداقل ساعات مورد نیاز را کار کند. این نوع شیفت برای کارهای پروژه‌ای و دورکاری مناسب است.
            </InfoBox>
            <FormGrid>
              <FormGroup
                label="حداقل ساعات حضور روزانه"
                tooltip="کارمند باید حداقل این تعداد ساعت در محل کار (یا به صورت remote) حضور داشته باشد تا روز به عنوان حضور کامل محاسبه شود. کمتر از این مقدار ممکن است به عنوان حضور ناقص یا غیبت ثبت شود."
              >
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minPresenceHours}
                    onChange={(e) => setMinPresenceHours(e.target.value)}
                    min="0"
                    step="0.5"
                    className="input-field flex-1"
                    placeholder="4"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">ساعت</span>
                </div>
              </FormGroup>

              <FormGroup
                label="محدودیت ورود/خروج روزانه"
                tooltip="تعداد مجاز ثبت ورود و خروج در یک روز. نامحدود: بدون محدودیت (برای دورکاری مناسب). ۲ بار: یک ورود و یک خروج. ۴ بار: دو ورود و دو خروج (مثلاً برای استراحت ناهار)."
              >
                <select value={maxPunches} onChange={(e) => setMaxPunches(e.target.value)} className="input-field">
                  <option value="unlimited">نامحدود (توصیه می‌شود)</option>
                  <option value="2">۲ بار (یک ورود/خروج)</option>
                  <option value="4">۴ بار (با استراحت)</option>
                  <option value="6">۶ بار</option>
                </select>
              </FormGroup>
            </FormGrid>
          </div>

          <Divider />

          <div>
            <SectionTitle>🔄 گرد کردن زمان</SectionTitle>
            <FormGrid>
              <FormGroup
                label="روش گرد کردن"
                tooltip="نحوه تبدیل زمان‌های ثبت شده به اعداد رند. در شیفت مطلق این بیشتر برای محاسبه مجموع ساعات کاری استفاده می‌شود."
              >
                <select value={roundingPolicy} onChange={(e) => setRoundingPolicy(e.target.value)} className="input-field">
                  <option value="none">بدون گرد کردن</option>
                  <option value="nearest">به نزدیک‌ترین</option>
                  <option value="ceil">به بالا</option>
                  <option value="floor">به پایین</option>
                </select>
              </FormGroup>

              <FormGroup label="بازه گرد کردن" tooltip="فاصله زمانی برای گرد کردن (معمولاً ۵ یا ۱۰ دقیقه)">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={roundSize}
                    onChange={(e) => setRoundSize(e.target.value)}
                    min="0"
                    className="input-field flex-1"
                    placeholder="5"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">دقیقه</span>
                </div>
              </FormGroup>
            </FormGrid>
          </div>
        </>
      )}
    </div>
  );
}

// Rotating Shift Tab
function RotatingShiftTab({
  inGrace,
  setInGrace,
  lateMethod,
  setLateMethod,
  outGrace,
  setOutGrace,
  earlyMethod,
  setEarlyMethod,
  maxLateAbsent,
  setMaxLateAbsent,
  roundingPolicy,
  setRoundingPolicy,
  roundSize,
  setRoundSize,
  allowSwapRequests,
  setAllowSwapRequests,
}: any) {
  return (
    <div className="space-y-6">
      <InfoBox variant="info">
        در شیفت چرخشی، کارمندان در دوره‌های زمانی مختلف (صبح، عصر، شب) به صورت چرخشی کار می‌کنند. این نوع شیفت معمولاً در سازمان‌های ۲۴ ساعته مانند بیمارستان‌ها استفاده می‌شود.
      </InfoBox>

      <div>
        <SectionTitle>📥 قوانین ورود</SectionTitle>
        <FormGrid>
          <FormGroup
            label="فرجه مجاز ورود"
            tooltip="مدت زمانی که کارمند می‌تواند بعد از شروع شیفت وارد شود بدون محاسبه تاخیر."
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={inGrace}
                onChange={(e) => setInGrace(e.target.value)}
                min="0"
                className="input-field flex-1"
              />
              <span className="text-xs text-slate-500">دقیقه</span>
            </div>
          </FormGroup>

          <FormGroup
            label="نحوه محاسبه تاخیر"
            tooltip="ملایم: فقط مازاد فرجه کسر می‌شود. سخت‌گیر: کل تاخیر کسر می‌شود."
          >
            <select value={lateMethod} onChange={(e) => setLateMethod(e.target.value)} className="input-field">
              <option value="Graceful">ملایم</option>
              <option value="Strict">سخت‌گیرانه</option>
            </select>
          </FormGroup>

          <FormGroup
            label="حداکثر تاخیر برای غیبت"
            tooltip="اگر تاخیر از این مقدار بیشتر شود، روز به صورت غیبت ثبت می‌شود."
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={maxLateAbsent}
                onChange={(e) => setMaxLateAbsent(e.target.value)}
                min="0"
                className="input-field flex-1"
              />
              <span className="text-xs text-slate-500">دقیقه</span>
            </div>
          </FormGroup>
        </FormGrid>
      </div>

      <Divider />

      <div>
        <SectionTitle>📤 قوانین خروج</SectionTitle>
        <FormGrid>
          <FormGroup
            label="فرجه مجاز خروج"
            tooltip="مدت زمانی که کارمند می‌تواند قبل از پایان شیفت خارج شود بدون محاسبه تعجیل."
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={outGrace}
                onChange={(e) => setOutGrace(e.target.value)}
                min="0"
                className="input-field flex-1"
              />
              <span className="text-xs text-slate-500">دقیقه</span>
            </div>
          </FormGroup>

          <FormGroup
            label="نحوه محاسبه تعجیل"
            tooltip="ملایم: فقط مازاد فرجه کسر می‌شود. سخت‌گیر: کل تعجیل کسر می‌شود."
          >
            <select value={earlyMethod} onChange={(e) => setEarlyMethod(e.target.value)} className="input-field">
              <option value="Graceful">ملایم</option>
              <option value="Strict">سخت‌گیرانه</option>
            </select>
          </FormGroup>
        </FormGrid>
      </div>

      <Divider />

      <div>
        <SectionTitle>🔄 گرد کردن زمان</SectionTitle>
        <FormGrid>
          <FormGroup label="روش گرد کردن" tooltip="نحوه تبدیل زمان‌های ثبت شده به اعداد رند.">
            <select value={roundingPolicy} onChange={(e) => setRoundingPolicy(e.target.value)} className="input-field">
              <option value="none">بدون گرد کردن</option>
              <option value="nearest">به نزدیک‌ترین</option>
              <option value="ceil">به بالا</option>
              <option value="floor">به پایین</option>
            </select>
          </FormGroup>

          <FormGroup label="بازه گرد کردن" tooltip="فاصله زمانی برای گرد کردن (۵ یا ۱۰ دقیقه)">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={roundSize}
                onChange={(e) => setRoundSize(e.target.value)}
                min="0"
                className="input-field flex-1"
              />
              <span className="text-xs text-slate-500">دقیقه</span>
            </div>
          </FormGroup>
        </FormGrid>
      </div>

      <Divider />

      <div>
        <SectionTitle>🔀 جابه‌جایی شیفت</SectionTitle>
        <FormGroup
          label="امکان درخواست جابه‌جایی"
          tooltip="آیا کارمندان اجازه دارند درخواست تعویض شیفت با همکاران خود را بدهند؟ این قابلیت به کارمندان امکان می‌دهد در مواقع ضروری شیفت‌های خود را با دیگران جابجا کنند."
        >
          <select value={allowSwapRequests} onChange={(e) => setAllowSwapRequests(e.target.value)} className="input-field">
            <option value="yes">بله، مجاز است</option>
            <option value="no">خیر، مجاز نیست</option>
          </select>
        </FormGroup>
      </div>
    </div>
  );
}

// Split Shift Tab
function SplitShiftTab({
  inGrace,
  setInGrace,
  lateMethod,
  setLateMethod,
  outGrace,
  setOutGrace,
  earlyMethod,
  setEarlyMethod,
  maxLateAbsent,
  setMaxLateAbsent,
  roundingPolicy,
  setRoundingPolicy,
  roundSize,
  setRoundSize,
}: any) {
  return (
    <div className="space-y-6">
      <InfoBox variant="info">
        در شیفت دوتیکه، روز کاری به دو بخش جداگانه تقسیم می‌شود (مثلاً ۸-۱۲ صبح و ۴-۸ عصر). این نوع شیفت برای مشاغلی مناسب است که در بخش‌های خاصی از روز فعالیت بیشتری دارند.
      </InfoBox>

      <div>
        <SectionTitle>📥 قوانین ورود</SectionTitle>
        <FormGrid>
          <FormGroup
            label="فرجه مجاز ورود"
            tooltip="این فرجه برای هر دو بخش شیفت (صبح و عصر) اعمال می‌شود. کارمند در هر بخش می‌تواند تا این مدت بعد از شروع، وارد شود."
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={inGrace}
                onChange={(e) => setInGrace(e.target.value)}
                min="0"
                className="input-field flex-1"
              />
              <span className="text-xs text-slate-500">دقیقه</span>
            </div>
          </FormGroup>

          <FormGroup
            label="نحوه محاسبه تاخیر"
            tooltip="ملایم: فقط مازاد فرجه کسر می‌شود. سخت‌گیر: کل تاخیر کسر می‌شود. این قانون برای هر دو بخش شیفت یکسان است."
          >
            <select value={lateMethod} onChange={(e) => setLateMethod(e.target.value)} className="input-field">
              <option value="Graceful">ملایم</option>
              <option value="Strict">سخت‌گیرانه</option>
            </select>
          </FormGroup>

          <FormGroup
            label="حداکثر تاخیر برای غیبت"
            tooltip="اگر در هر بخش شیفت، تاخیر از این مقدار بیشتر شود، آن بخش به صورت غیبت ثبت می‌شود. اگر هر دو بخش غیبت باشند، کل روز غیبت محسوب می‌شود."
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={maxLateAbsent}
                onChange={(e) => setMaxLateAbsent(e.target.value)}
                min="0"
                className="input-field flex-1"
              />
              <span className="text-xs text-slate-500">دقیقه</span>
            </div>
          </FormGroup>
        </FormGrid>
      </div>

      <Divider />

      <div>
        <SectionTitle>📤 قوانین خروج</SectionTitle>
        <FormGrid>
          <FormGroup
            label="فرجه مجاز خروج"
            tooltip="کارمند در پایان هر بخش شیفت می‌تواند تا این مدت زودتر خارج شود بدون محاسبه تعجیل."
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={outGrace}
                onChange={(e) => setOutGrace(e.target.value)}
                min="0"
                className="input-field flex-1"
              />
              <span className="text-xs text-slate-500">دقیقه</span>
            </div>
          </FormGroup>

          <FormGroup
            label="نحوه محاسبه تعجیل"
            tooltip="ملایم: فقط مازاد فرجه کسر می‌شود. سخت‌گیر: کل تعجیل کسر می‌شود."
          >
            <select value={earlyMethod} onChange={(e) => setEarlyMethod(e.target.value)} className="input-field">
              <option value="Graceful">ملایم</option>
              <option value="Strict">سخت‌گیرانه</option>
            </select>
          </FormGroup>
        </FormGrid>
      </div>

      <Divider />

      <div>
        <SectionTitle>🔄 گرد کردن زمان</SectionTitle>
        <FormGrid>
          <FormGroup label="روش گرد کردن" tooltip="نحوه تبدیل زمان‌های ثبت شده در هر دو بخش به اعداد رند.">
            <select value={roundingPolicy} onChange={(e) => setRoundingPolicy(e.target.value)} className="input-field">
              <option value="none">بدون گرد کردن</option>
              <option value="nearest">به نزدیک‌ترین</option>
              <option value="ceil">به بالا</option>
              <option value="floor">به پایین</option>
            </select>
          </FormGroup>

          <FormGroup label="بازه گرد کردن" tooltip="فاصله زمانی برای گرد کردن (۵ یا ۱۰ دقیقه)">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={roundSize}
                onChange={(e) => setRoundSize(e.target.value)}
                min="0"
                className="input-field flex-1"
              />
              <span className="text-xs text-slate-500">دقیقه</span>
            </div>
          </FormGroup>
        </FormGrid>
      </div>
    </div>
  );
}

// Night Shift Tab
function NightShiftTab({ start, setStart, end, setEnd }: any) {
  return (
    <div className="space-y-6">
      <InfoBox variant="info">
        در شیفت شب، کارمندان در ساعات شب کار می‌کنند. این نوع شیفت برای سازمان‌هایی که در ساعات شب نیز فعالیت دارند مانند بیمارستان‌ها و کارخانجات ۲۴ ساعته مناسب است.
      </InfoBox>

      <div>
        <SectionTitle>⏰ تنظیمات بازه زمانی شب کاری</SectionTitle>
        <FormGrid>
          <FormGroup
            label="شروع شیفت شب"
            tooltip="ساعت و دقیقه شروع شیفت شب کاری. مثلاً اگر شیفت شب از ۸ شب شروع شود، این مقدار ۲۰:۰۰ است."
          >
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="input-field"
              placeholder="20:00"
            />
          </FormGroup>

          <FormGroup
            label="پایان شیفت شب"
            tooltip="ساعت و دقیقه پایان شیفت شب کاری. مثلاً اگر شیفت شب تا ۸ صبح تمام شود، این مقدار ۰۸:۰۰ است."
          >
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="input-field"
              placeholder="08:00"
            />
          </FormGroup>
        </FormGrid>
      </div>
    </div>
  );
}

// Leave Policy Tab
function LeavePolicyTab({
  title,
  setTitle,
  nature,
  setNature,
  unit,
  setUnit,
  quotaView,
  setQuotaView,
  annualQuota,
  setAnnualQuota,
  annualQuotaHours,
  setAnnualQuotaHours,
  annualQuotaMinutes,
  setAnnualQuotaMinutes,
  monthlyQuota,
  setMonthlyQuota,
  monthlyQuotaHours,
  setMonthlyQuotaHours,
  monthlyQuotaMinutes,
  setMonthlyQuotaMinutes,
  monthlyCapEnabled,
  setMonthlyCapEnabled,
  minRequest,
  setMinRequest,
  minUnit,
  setMinUnit,
  minMinutes,
  setMinMinutes,
  maxRequest,
  setMaxRequest,
  maxMinutes,
  setMaxMinutes,
  carryoverCap,
  setCarryoverCap,
  carryoverCapHours,
  setCarryoverCapHours,
  carryoverCapMinutes,
  setCarryoverCapMinutes,
  buyback,
  setBuyback,
  attachmentRequired,
  setAttachmentRequired,
  approvalSteps,
  setApprovalSteps,
}: any) {
  return (
    <div className="space-y-6">
      <InfoBox variant="info">این بخش هویت نوع مرخصی را مشخص می‌کند.</InfoBox>

      <div>
        <FormGrid>
          <FormGroup label="نوع ماهیت" tooltip="آیا این مرخصی با حقوق است یا بدون حقوق؟">
            <select value={nature} onChange={(e) => setNature(e.target.value)} className="input-field">
              <option value="paid">با حقوق (Paid)</option>
              <option value="unpaid">بدون حقوق (Unpaid)</option>
            </select>
          </FormGroup>

          <FormGroup label="واحد محاسبه" tooltip="مرخصی به صورت روزانه یا ساعتی محاسبه می‌شود">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-sm text-slate-200">تغییر به {unit === 'daily' ? 'ساعت' : 'روز'}</div>
                  <div className="text-xs text-slate-500">سوئیچ برای تغییر واحد محاسبه</div>
                </div>
              </div>
              <Toggle 
                checked={unit === 'hourly'} 
                onChange={() => setUnit(unit === 'daily' ? 'hourly' : 'daily')} 
              />
            </div>
            <div className="mt-2 text-xs text-slate-400 bg-slate-800/20 border border-indigo-500/20 rounded-lg p-3">
              📌 <strong>واحد فعلی:</strong> {unit === 'daily' ? 'روزانه' : 'ساعتی'}
            </div>
          </FormGroup>

          <FormGroup label="نمایش سهمیه" tooltip="قابلیت نمایش سهمیه هم به روز و هم به ساعت برای گزارش‌گیری">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div>
                <div className="text-sm text-slate-200">نمایش به {quotaView === 'day' ? 'ساعت' : 'روز'}</div>
                <div className="text-xs text-slate-500">برای گزارش‌گیری و پیگیری</div>
              </div>
              <Toggle 
                checked={quotaView === 'hour'} 
                onChange={() => setQuotaView(quotaView === 'day' ? 'hour' : 'day')} 
              />
            </div>
          </FormGroup>
        </FormGrid>
      </div>

      <Divider />

      <div>
        <FormGrid cols={2}>
          <FormGroup
            label="سهمیه سالانه"
            tooltip="مثال: ۲۶ روز طبق قانون کار یا ۳۰ روز. امکان نمایش به روز یا ساعت"
          >
            {unit === 'daily' ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={annualQuota}
                  onChange={(e) => setAnnualQuota(e.target.value)}
                  min="0"
                  className="input-field flex-1"
                  placeholder="26"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">روز</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">ساعت</label>
                    <input
                      type="number"
                      value={annualQuotaHours}
                      onChange={(e) => setAnnualQuotaHours(e.target.value)}
                      min="0"
                      className="input-field w-full"
                      placeholder="208"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">دقیقه</label>
                    <input
                      type="number"
                      value={annualQuotaMinutes}
                      onChange={(e) => setAnnualQuotaMinutes(e.target.value)}
                      min="0"
                      max="59"
                      className="input-field w-full"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="text-xs text-slate-400 bg-slate-800/20 border border-indigo-500/20 rounded-lg p-3">
                  ۲۶ روز = <strong>{annualQuotaHours || '208'} ساعت و {annualQuotaMinutes || '0'} دقیقه</strong>
                </div>
              </div>
            )}
          </FormGroup>

          <FormGroup label="سهمیه ماهانه" tooltip="مثال: ۲.۵ روز">
            {unit === 'daily' ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={monthlyQuota}
                  onChange={(e) => setMonthlyQuota(e.target.value)}
                  min="0"
                  step="0.5"
                  className="input-field flex-1"
                  placeholder="2.5"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">روز</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">ساعت</label>
                    <input
                      type="number"
                      value={monthlyQuotaHours}
                      onChange={(e) => setMonthlyQuotaHours(e.target.value)}
                      min="0"
                      className="input-field w-full"
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">دقیقه</label>
                    <input
                      type="number"
                      value={monthlyQuotaMinutes}
                      onChange={(e) => setMonthlyQuotaMinutes(e.target.value)}
                      min="0"
                      max="59"
                      className="input-field w-full"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="text-xs text-slate-400 bg-slate-800/20 border border-indigo-500/20 rounded-lg p-3">
                  ۲.۵ روز = <strong>{monthlyQuotaHours || '20'} ساعت و {monthlyQuotaMinutes || '0'} دقیقه</strong>
                </div>
              </div>
            )}
          </FormGroup>

          <FormGroup
            label="محدودیت سقف ماهانه"
            tooltip="اگر روشن باشد، پرسنل نمی‌تواند بیشتر از سهمیه ماهانه استفاده کند"
            note={
              monthlyCapEnabled
                ? 'این محدودیت حتی در صورت داشتن سهمیه سالانه بالاتر اعمال می‌شود.'
                : 'در صورت خاموش بودن، فقط سهمیه سالانه محدودیت دارد.'
            }
          >
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div>
                <div className="text-sm text-slate-200">فعال‌سازی سقف ماهانه</div>
                <div className="text-xs text-slate-500">برای کنترل مصرف ماهانه مرخصی</div>
              </div>
              <Toggle checked={monthlyCapEnabled} onChange={setMonthlyCapEnabled} />
            </div>
          </FormGroup>

          <FormGroup label="حداقل مدت درخواست" tooltip="برای مرخصی ساعتی حداقل می‌تواند ۳۰ دقیقه باشد">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={unit === 'daily' ? minRequest : minUnit === 'day' ? minRequest : minMinutes}
                  onChange={(e) => {
                    if (unit === 'daily') {
                      setMinRequest(e.target.value);
                    } else {
                      setLeaveMinMinutes(e.target.value);
                    }
                  }}
                  min="0"
                  className="input-field flex-1"
                  placeholder={unit === 'daily' ? 'روز' : 'دقیقه'}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">{unit === 'daily' ? 'روز' : 'دقیقه'}</span>
              </div>
              {unit === 'hourly' && (
                <div className="text-xs text-slate-400 bg-slate-800/20 border border-indigo-500/20 rounded-lg p-3">
                  💡 معادل: {Math.round((parseInt(minMinutes) || 30) / 60)} ساعت و {(parseInt(minMinutes) || 30) % 60} دقیقه
                </div>
              )}
            </div>
          </FormGroup>

          <FormGroup
            label="حداکثر مدت درخواست در یک نوبت"
            tooltip="مثال: برای استعلاجی بیش از ۳ روز نیاز به تأییدیه خاص دارد"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={unit === 'daily' ? maxRequest : leaveMaxMinutes}
                  onChange={(e) => {
                    if (unit === 'daily') {
                      setLeaveMaxRequest(e.target.value);
                    } else {
                      setLeaveMaxMinutes(e.target.value);
                    }
                  }}
                  min="0"
                  className="input-field flex-1"
                  placeholder={unit === 'daily' ? '3' : '180'}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">{unit === 'daily' ? 'روز' : 'دقیقه'}</span>
              </div>
              {unit === 'hourly' && (
                <div className="text-xs text-slate-400 bg-slate-800/20 border border-indigo-500/20 rounded-lg p-3">
                  💡 معادل: {Math.round((parseInt(leaveMaxMinutes) || 180) / 60)} ساعت و {(parseInt(leaveMaxMinutes) || 180) % 60} دقیقه
                </div>
              )}
            </div>
          </FormGroup>

          <FormGroup
            label="سقف انتقال به سال بعد"
            tooltip="طبق قانون کار معمولاً ۹ روز است، اما برخی شرکت‌ها ۱۵ روز یا نامحدود می‌گذارند"
          >
            {unit === 'daily' ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={carryoverCap}
                  onChange={(e) => setCarryoverCap(e.target.value)}
                  min="0"
                  className="input-field flex-1"
                  placeholder="9"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">روز</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">ساعت</label>
                    <input
                      type="number"
                      value={carryoverCapHours}
                      onChange={(e) => setCarryoverCapHours(e.target.value)}
                      min="0"
                      className="input-field w-full"
                      placeholder="72"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">دقیقه</label>
                    <input
                      type="number"
                      value={carryoverCapMinutes}
                      onChange={(e) => setCarryoverCapMinutes(e.target.value)}
                      min="0"
                      max="59"
                      className="input-field w-full"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="text-xs text-slate-400 bg-slate-800/20 border border-indigo-500/20 rounded-lg p-3">
                  ۹ روز = <strong>{carryoverCapHours || '72'} ساعت و {carryoverCapMinutes || '0'} دقیقه</strong>
                </div>
              </div>
            )}
          </FormGroup>
        </FormGrid>
      </div>

      <Divider />

      <div>
        <SectionTitle>شرایط تکمیلی</SectionTitle>
        <FormGrid cols={2}>
          <FormGroup label="قابلیت بازخرید دارد؟" tooltip="آیا مانده مرخصی پایان سال قابل تبدیل به پول است؟">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div>
                <div className="text-sm text-slate-200">بازخرید مانده مرخصی</div>
                <div className="text-xs text-slate-500">امکان پرداخت نقدی پایان سال</div>
              </div>
              <Toggle checked={buyback} onChange={setBuyback} />
            </div>
          </FormGroup>

          <FormGroup label="الزام به پیوست فایل" tooltip="برای مرخصی استعلاجی، گواهی پزشک الزامی است">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div>
                <div className="text-sm text-slate-200">پیوست اجباری</div>
                <div className="text-xs text-slate-500">درخواست بدون فایل ثبت نشود</div>
              </div>
              <Toggle checked={attachmentRequired} onChange={setAttachmentRequired} />
            </div>
          </FormGroup>

          <FormGroup label="تعداد مراحل تأیید" tooltip="۱ مرحله: فقط مدیر مستقیم، ۲ مرحله: مدیر + مدیر ارشد/منابع انسانی">
            <select value={approvalSteps} onChange={(e) => setApprovalSteps(e.target.value)} className="input-field">
              <option value="1">۱ مرحله (مدیر مستقیم)</option>
              <option value="2">۲ مرحله (مدیر + منابع انسانی)</option>
            </select>
          </FormGroup>
        </FormGrid>
      </div>
    </div>
  );
}
