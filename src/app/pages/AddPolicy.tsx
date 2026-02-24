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
  const [leaveUnit, setLeaveUnit] = useState<'minute' | 'hour'>('minute');
  const [leaveAnnualQuota, setLeaveAnnualQuota] = useState('26');
  const [leaveAnnualQuotaHours, setLeaveAnnualQuotaHours] = useState('208');
  const [leaveAnnualQuotaMinutes, setLeaveAnnualQuotaMinutes] = useState('0');
  const [leaveMonthlyQuota, setLeaveMonthlyQuota] = useState('2.5');
  const [leaveMonthlyQuotaHours, setLeaveMonthlyQuotaHours] = useState('20');
  const [leaveMonthlyQuotaMinutes, setLeaveMonthlyQuotaMinutes] = useState('0');
  const [leaveMonthlyCapEnabled, setLeaveMonthlyCapEnabled] = useState(true);
  const [leaveMinRequest, setLeaveMinRequest] = useState('30');
  const [leaveMinMinutes, setLeaveMinMinutes] = useState('30');
  const [leaveMaxRequest, setLeaveMaxRequest] = useState('3');
  const [leaveMaxMinutes, setLeaveMaxMinutes] = useState('180');
  const [leaveCarryoverCap, setLeaveCarryoverCap] = useState('9');
  const [leaveCarryoverCapHours, setLeaveCarryoverCapHours] = useState('72');
  const [leaveCarryoverCapMinutes, setLeaveCarryoverCapMinutes] = useState('0');
  const [leaveBuyback, setLeaveBuyback] = useState(false);
  const [leaveAttachmentRequired, setLeaveAttachmentRequired] = useState(false);
  const [leaveApprovalSteps, setLeaveApprovalSteps] = useState<'1' | '2'>('1');

  // Mission Policy States
  const [missionUnit, setMissionUnit] = useState<'minute' | 'hour'>('minute');
  const [missionMinMinutes, setMissionMinMinutes] = useState('30');
  const [missionMaxMinutes, setMissionMaxMinutes] = useState('480');
  const [missionDailyCapMinutes, setMissionDailyCapMinutes] = useState('600');
  const [missionMonthlyCapMinutes, setMissionMonthlyCapMinutes] = useState('3600');
  const [missionWeekendAllowed, setMissionWeekendAllowed] = useState(false);
  const [missionRemoteAllowed, setMissionRemoteAllowed] = useState(true);
  const [missionRequirePreApproval, setMissionRequirePreApproval] = useState(true);
  const [missionAttachmentRequired, setMissionAttachmentRequired] = useState(true);
  const [missionApprovalSteps, setMissionApprovalSteps] = useState<'1' | '2'>('2');
  const [missionCountAsWorkTime, setMissionCountAsWorkTime] = useState(true);

  // Overtime Policy States
  const [overtimeUnit, setOvertimeUnit] = useState<'minute' | 'hour'>('minute');
  const [overtimeMinBlockMinutes, setOvertimeMinBlockMinutes] = useState('30');
  const [overtimeDailyCapMinutes, setOvertimeDailyCapMinutes] = useState('240');
  const [overtimeMonthlyCapMinutes, setOvertimeMonthlyCapMinutes] = useState('2400');
  const [overtimeBeforeShiftAllowed, setOvertimeBeforeShiftAllowed] = useState(false);
  const [overtimeAfterShiftAllowed, setOvertimeAfterShiftAllowed] = useState(true);
  const [overtimeHolidayAllowed, setOvertimeHolidayAllowed] = useState(true);
  const [overtimeAutoFromPunch, setOvertimeAutoFromPunch] = useState(true);
  const [overtimeAttachmentRequired, setOvertimeAttachmentRequired] = useState(false);
  const [overtimeRequireApproval, setOvertimeRequireApproval] = useState(true);
  const [overtimeApprovalSteps, setOvertimeApprovalSteps] = useState<'1' | '2'>('1');
  const [overtimeRoundPolicy, setOvertimeRoundPolicy] = useState<'none' | 'nearest' | 'ceil' | 'floor'>('nearest');
  const [overtimeRoundSize, setOvertimeRoundSize] = useState('15');

  // Manual Attendance Policy States
  const [manualAttendanceEnabled, setManualAttendanceEnabled] = useState(true);
  const [manualAttendanceRequireReason, setManualAttendanceRequireReason] = useState(true);
  const [manualAttendanceRequireAttachment, setManualAttendanceRequireAttachment] = useState(false);
  const [manualAttendanceAllowPastDays, setManualAttendanceAllowPastDays] = useState(true);
  const [manualAttendancePastDaysLimit, setManualAttendancePastDaysLimit] = useState('3');
  const [manualAttendanceApprovalSteps, setManualAttendanceApprovalSteps] = useState<'1' | '2'>('1');
  const [manualAttendanceMaxPerMonth, setManualAttendanceMaxPerMonth] = useState('10');

  // Shift Swap Policy States
  const [swapEnabled, setSwapEnabled] = useState(true);
  const [swapAllowCrossGroup, setSwapAllowCrossGroup] = useState(false);
  const [swapRequirePeerApproval, setSwapRequirePeerApproval] = useState(true);
  const [swapRequireManagerApproval, setSwapRequireManagerApproval] = useState(true);
  const [swapAllowPastShift, setSwapAllowPastShift] = useState(false);
  const [swapMinNoticeHours, setSwapMinNoticeHours] = useState('12');
  const [swapMonthlyLimit, setSwapMonthlyLimit] = useState('4');
  const [swapUnit, setSwapUnit] = useState<'minute' | 'hour'>('hour');
  const [swapMinGapMinutes, setSwapMinGapMinutes] = useState('480');
  const [swapBlockOvertimeConflict, setSwapBlockOvertimeConflict] = useState(true);
  const [swapBlockLeaveConflict, setSwapBlockLeaveConflict] = useState(true);

  // Holiday Policy States
  const [holidayEnabled, setHolidayEnabled] = useState(true);
  const [holidayAutoFromCalendar, setHolidayAutoFromCalendar] = useState(true);
  const [holidayWorkAsOvertime, setHolidayWorkAsOvertime] = useState(true);
  const [holidayRequireApprovalForWork, setHolidayRequireApprovalForWork] = useState(true);
  const [holidayRequireAttachment, setHolidayRequireAttachment] = useState(false);
  const [holidayCompOffEnabled, setHolidayCompOffEnabled] = useState(false);
  const [holidayCompOffExpireDays, setHolidayCompOffExpireDays] = useState('90');
  const [holidayUnit, setHolidayUnit] = useState<'minute' | 'hour'>('hour');
  const [holidayMaxWorkMinutes, setHolidayMaxWorkMinutes] = useState('480');

  // Other Attendance Policy States
  const [otherAutoAbsentNoPunch, setOtherAutoAbsentNoPunch] = useState(true);
  const [otherMissingPunchAction, setOtherMissingPunchAction] = useState<'pending' | 'absent' | 'manualRequest'>('pending');
  const [otherRequireReasonForExceptions, setOtherRequireReasonForExceptions] = useState(true);
  const [otherGeofenceRequired, setOtherGeofenceRequired] = useState(false);
  const [otherDeviceBindingRequired, setOtherDeviceBindingRequired] = useState(false);
  const [otherFaceRecognitionInAttendanceFlow, setOtherFaceRecognitionInAttendanceFlow] = useState(false);
  const [otherAttendanceLockDays, setOtherAttendanceLockDays] = useState('2');
  const [otherMaxConsecutiveAbsence, setOtherMaxConsecutiveAbsence] = useState('3');
  const [otherAlertOnAbsenceLimit, setOtherAlertOnAbsenceLimit] = useState(true);

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
                  leaveType={activeLeaveSubTab}
                  title={leaveTitle}
                  setTitle={setLeaveTitle}
                  nature={leaveNature}
                  setNature={setLeaveNature}
                  unit={leaveUnit}
                  setUnit={setLeaveUnit}
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

          {/* Mission Policy Tab */}
          {activeTab === 'mission' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="mb-5">
                <h2 className="text-base font-bold text-white mb-2">سیاست‌های ماموریت</h2>
                <p className="text-xs text-slate-400">تعریف قوانین ثبت، تایید و محدودیت‌های زمانی ماموریت سازمانی</p>
              </div>

              <div className="bg-slate-950/50 border border-white/5 rounded-xl p-5">
                <MissionPolicyTab
                  unit={missionUnit}
                  setUnit={setMissionUnit}
                  minMinutes={missionMinMinutes}
                  setMinMinutes={setMissionMinMinutes}
                  maxMinutes={missionMaxMinutes}
                  setMaxMinutes={setMissionMaxMinutes}
                  dailyCapMinutes={missionDailyCapMinutes}
                  setDailyCapMinutes={setMissionDailyCapMinutes}
                  monthlyCapMinutes={missionMonthlyCapMinutes}
                  setMonthlyCapMinutes={setMissionMonthlyCapMinutes}
                  weekendAllowed={missionWeekendAllowed}
                  setWeekendAllowed={setMissionWeekendAllowed}
                  remoteAllowed={missionRemoteAllowed}
                  setRemoteAllowed={setMissionRemoteAllowed}
                  requirePreApproval={missionRequirePreApproval}
                  setRequirePreApproval={setMissionRequirePreApproval}
                  attachmentRequired={missionAttachmentRequired}
                  setAttachmentRequired={setMissionAttachmentRequired}
                  approvalSteps={missionApprovalSteps}
                  setApprovalSteps={setMissionApprovalSteps}
                  countAsWorkTime={missionCountAsWorkTime}
                  setCountAsWorkTime={setMissionCountAsWorkTime}
                />
              </div>
            </div>
          )}

          {/* Overtime Policy Tab */}
          {activeTab === 'overtime' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="mb-5">
                <h2 className="text-base font-bold text-white mb-2">سیاست‌های اضافه‌کاری</h2>
                <p className="text-xs text-slate-400">تعریف بازه مجاز، تایید، سقف زمانی و ضرایب محاسبه اضافه‌کاری</p>
              </div>

              <div className="bg-slate-950/50 border border-white/5 rounded-xl p-5">
                <OvertimePolicyTab
                  unit={overtimeUnit}
                  setUnit={setOvertimeUnit}
                  minBlockMinutes={overtimeMinBlockMinutes}
                  setMinBlockMinutes={setOvertimeMinBlockMinutes}
                  dailyCapMinutes={overtimeDailyCapMinutes}
                  setDailyCapMinutes={setOvertimeDailyCapMinutes}
                  monthlyCapMinutes={overtimeMonthlyCapMinutes}
                  setMonthlyCapMinutes={setOvertimeMonthlyCapMinutes}
                  beforeShiftAllowed={overtimeBeforeShiftAllowed}
                  setBeforeShiftAllowed={setOvertimeBeforeShiftAllowed}
                  afterShiftAllowed={overtimeAfterShiftAllowed}
                  setAfterShiftAllowed={setOvertimeAfterShiftAllowed}
                  holidayAllowed={overtimeHolidayAllowed}
                  setHolidayAllowed={setOvertimeHolidayAllowed}
                  autoFromPunch={overtimeAutoFromPunch}
                  setAutoFromPunch={setOvertimeAutoFromPunch}
                  attachmentRequired={overtimeAttachmentRequired}
                  setAttachmentRequired={setOvertimeAttachmentRequired}
                  requireApproval={overtimeRequireApproval}
                  setRequireApproval={setOvertimeRequireApproval}
                  approvalSteps={overtimeApprovalSteps}
                  setApprovalSteps={setOvertimeApprovalSteps}
                  roundPolicy={overtimeRoundPolicy}
                  setRoundPolicy={setOvertimeRoundPolicy}
                  roundSize={overtimeRoundSize}
                  setRoundSize={setOvertimeRoundSize}
                />
              </div>
            </div>
          )}

          {/* Manual Attendance Policy Tab */}
          {activeTab === 'attendance' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="mb-5">
                <h2 className="text-base font-bold text-white mb-2">سیاست‌های تردد دستی</h2>
                <p className="text-xs text-slate-400">تعریف شرایط ثبت دستی ورود و خروج، محدودیت‌ها و تاییدها</p>
              </div>

              <div className="bg-slate-950/50 border border-white/5 rounded-xl p-5">
                <ManualAttendancePolicyTab
                  enabled={manualAttendanceEnabled}
                  setEnabled={setManualAttendanceEnabled}
                  requireReason={manualAttendanceRequireReason}
                  setRequireReason={setManualAttendanceRequireReason}
                  requireAttachment={manualAttendanceRequireAttachment}
                  setRequireAttachment={setManualAttendanceRequireAttachment}
                  allowPastDays={manualAttendanceAllowPastDays}
                  setAllowPastDays={setManualAttendanceAllowPastDays}
                  pastDaysLimit={manualAttendancePastDaysLimit}
                  setPastDaysLimit={setManualAttendancePastDaysLimit}
                  approvalSteps={manualAttendanceApprovalSteps}
                  setApprovalSteps={setManualAttendanceApprovalSteps}
                  maxPerMonth={manualAttendanceMaxPerMonth}
                  setMaxPerMonth={setManualAttendanceMaxPerMonth}
                />
              </div>
            </div>
          )}

          {/* Shift Swap Policy Tab */}
          {activeTab === 'swap' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="mb-5">
                <h2 className="text-base font-bold text-white mb-2">سیاست‌های جابجایی شیفت</h2>
                <p className="text-xs text-slate-400">تعریف مجوزها، تاییدها و محدودیت‌های زمانی جابجایی بین پرسنل</p>
              </div>

              <div className="bg-slate-950/50 border border-white/5 rounded-xl p-5">
                <SwapPolicyTab
                  enabled={swapEnabled}
                  setEnabled={setSwapEnabled}
                  allowCrossGroup={swapAllowCrossGroup}
                  setAllowCrossGroup={setSwapAllowCrossGroup}
                  requirePeerApproval={swapRequirePeerApproval}
                  setRequirePeerApproval={setSwapRequirePeerApproval}
                  requireManagerApproval={swapRequireManagerApproval}
                  setRequireManagerApproval={setSwapRequireManagerApproval}
                  allowPastShift={swapAllowPastShift}
                  setAllowPastShift={setSwapAllowPastShift}
                  minNoticeHours={swapMinNoticeHours}
                  setMinNoticeHours={setSwapMinNoticeHours}
                  monthlyLimit={swapMonthlyLimit}
                  setMonthlyLimit={setSwapMonthlyLimit}
                  unit={swapUnit}
                  setUnit={setSwapUnit}
                  minGapMinutes={swapMinGapMinutes}
                  setMinGapMinutes={setSwapMinGapMinutes}
                  blockOvertimeConflict={swapBlockOvertimeConflict}
                  setBlockOvertimeConflict={setSwapBlockOvertimeConflict}
                  blockLeaveConflict={swapBlockLeaveConflict}
                  setBlockLeaveConflict={setSwapBlockLeaveConflict}
                />
              </div>
            </div>
          )}

          {/* Holiday Policy Tab */}
          {activeTab === 'holiday' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="mb-5">
                <h2 className="text-base font-bold text-white mb-2">سیاست‌های روز تعطیل</h2>
                <p className="text-xs text-slate-400">تعریف نحوه کار در تعطیلات، تاییدها و قوانین جایگزین</p>
              </div>

              <div className="bg-slate-950/50 border border-white/5 rounded-xl p-5">
                <HolidayPolicyTab
                  enabled={holidayEnabled}
                  setEnabled={setHolidayEnabled}
                  autoFromCalendar={holidayAutoFromCalendar}
                  setAutoFromCalendar={setHolidayAutoFromCalendar}
                  workAsOvertime={holidayWorkAsOvertime}
                  setWorkAsOvertime={setHolidayWorkAsOvertime}
                  requireApprovalForWork={holidayRequireApprovalForWork}
                  setRequireApprovalForWork={setHolidayRequireApprovalForWork}
                  requireAttachment={holidayRequireAttachment}
                  setRequireAttachment={setHolidayRequireAttachment}
                  compOffEnabled={holidayCompOffEnabled}
                  setCompOffEnabled={setHolidayCompOffEnabled}
                  compOffExpireDays={holidayCompOffExpireDays}
                  setCompOffExpireDays={setHolidayCompOffExpireDays}
                  unit={holidayUnit}
                  setUnit={setHolidayUnit}
                  maxWorkMinutes={holidayMaxWorkMinutes}
                  setMaxWorkMinutes={setHolidayMaxWorkMinutes}
                />
              </div>
            </div>
          )}

          {/* Other Attendance Policy Tab */}
          {activeTab === 'other' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="mb-5">
                <h2 className="text-base font-bold text-white mb-2">سیاست‌های سایر</h2>
                <p className="text-xs text-slate-400">تنظیمات تکمیلی حضور و غیاب که در سایر تب‌ها پوشش داده نشده‌اند</p>
              </div>

              <div className="bg-slate-950/50 border border-white/5 rounded-xl p-5">
                <OtherAttendancePolicyTab
                  autoAbsentNoPunch={otherAutoAbsentNoPunch}
                  setAutoAbsentNoPunch={setOtherAutoAbsentNoPunch}
                  missingPunchAction={otherMissingPunchAction}
                  setMissingPunchAction={setOtherMissingPunchAction}
                  requireReasonForExceptions={otherRequireReasonForExceptions}
                  setRequireReasonForExceptions={setOtherRequireReasonForExceptions}
                  geofenceRequired={otherGeofenceRequired}
                  setGeofenceRequired={setOtherGeofenceRequired}
                  deviceBindingRequired={otherDeviceBindingRequired}
                  setDeviceBindingRequired={setOtherDeviceBindingRequired}
                  faceRecognitionInAttendanceFlow={otherFaceRecognitionInAttendanceFlow}
                  setFaceRecognitionInAttendanceFlow={setOtherFaceRecognitionInAttendanceFlow}
                  attendanceLockDays={otherAttendanceLockDays}
                  setAttendanceLockDays={setOtherAttendanceLockDays}
                  maxConsecutiveAbsence={otherMaxConsecutiveAbsence}
                  setMaxConsecutiveAbsence={setOtherMaxConsecutiveAbsence}
                  alertOnAbsenceLimit={otherAlertOnAbsenceLimit}
                  setAlertOnAbsenceLimit={setOtherAlertOnAbsenceLimit}
                />
              </div>
            </div>
          )}

          {/* Other Tabs - Coming Soon */}
          {activeTab !== 'shift' &&
            activeTab !== 'nightShift' &&
            activeTab !== 'leave' &&
            activeTab !== 'mission' &&
            activeTab !== 'overtime' &&
            activeTab !== 'attendance' &&
            activeTab !== 'swap' &&
            activeTab !== 'holiday' &&
            activeTab !== 'other' && (
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

// Mission Policy Tab
function MissionPolicyTab({
  unit,
  setUnit,
  minMinutes,
  setMinMinutes,
  maxMinutes,
  setMaxMinutes,
  dailyCapMinutes,
  setDailyCapMinutes,
  monthlyCapMinutes,
  setMonthlyCapMinutes,
  weekendAllowed,
  setWeekendAllowed,
  remoteAllowed,
  setRemoteAllowed,
  requirePreApproval,
  setRequirePreApproval,
  attachmentRequired,
  setAttachmentRequired,
  approvalSteps,
  setApprovalSteps,
  countAsWorkTime,
  setCountAsWorkTime,
}: any) {
  return (
    <div className="space-y-6">
      <InfoBox variant="info">در تب ماموریت فقط الزام پیوست فایل تنظیم می‌شود.</InfoBox>

      <FormGrid>
        <FormGroup label="الزام به پیوست" tooltip="برای ثبت ماموریت، پیوست فایل الزامی باشد">
          <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
            <div className="text-sm text-slate-200">پیوست فایل اجباری</div>
            <Toggle checked={attachmentRequired} onChange={setAttachmentRequired} />
          </div>
        </FormGroup>
      </FormGrid>
    </div>
  );
}

// Overtime Policy Tab
function OvertimePolicyTab({
  unit,
  setUnit,
  minBlockMinutes,
  setMinBlockMinutes,
  dailyCapMinutes,
  setDailyCapMinutes,
  monthlyCapMinutes,
  setMonthlyCapMinutes,
  beforeShiftAllowed,
  setBeforeShiftAllowed,
  afterShiftAllowed,
  setAfterShiftAllowed,
  holidayAllowed,
  setHolidayAllowed,
  autoFromPunch,
  setAutoFromPunch,
  attachmentRequired,
  setAttachmentRequired,
  requireApproval,
  setRequireApproval,
  approvalSteps,
  setApprovalSteps,
  roundPolicy,
  setRoundPolicy,
  roundSize,
  setRoundSize,
}: any) {
  return (
    <div className="space-y-6">
      <InfoBox variant="info">در تب اضافه‌کاری، روش محاسبه خودکار و گزینه‌های مرتبط با آن تنظیم می‌شود.</InfoBox>

      <FormGrid cols={2}>
        <FormGroup label="محاسبه خودکار از تردد" tooltip="اختلاف ورود/خروج با برنامه کاری به صورت خودکار اضافه‌کاری شود">
          <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
            <div className="text-sm text-slate-200">محاسبه خودکار اضافه‌کاری</div>
            <Toggle checked={autoFromPunch} onChange={setAutoFromPunch} />
          </div>
        </FormGroup>

        <FormGroup label="الزام به پیوست" tooltip="برای ثبت اضافه‌کاری، پیوست فایل الزامی باشد">
          <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
            <div className="text-sm text-slate-200">پیوست اجباری</div>
            <Toggle checked={attachmentRequired} onChange={setAttachmentRequired} />
          </div>
        </FormGroup>

        {autoFromPunch && (
          <FormGroup label="اضافه‌کاری قبل از شیفت" tooltip="با روشن بودن محاسبه خودکار، زمان قبل از شروع شیفت محاسبه شود">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">اضافه‌کاری قبل از شیفت</div>
              <Toggle checked={beforeShiftAllowed} onChange={setBeforeShiftAllowed} />
            </div>
          </FormGroup>
        )}

        {autoFromPunch && (
          <FormGroup label="اضافه‌کاری بعد از شیفت" tooltip="با روشن بودن محاسبه خودکار، زمان بعد از پایان شیفت محاسبه شود">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">اضافه‌کاری بعد از شیفت</div>
              <Toggle checked={afterShiftAllowed} onChange={setAfterShiftAllowed} />
            </div>
          </FormGroup>
        )}
      </FormGrid>
    </div>
  );
}

// Manual Attendance Policy Tab
function ManualAttendancePolicyTab({
  enabled,
  setEnabled,
  requireReason,
  setRequireReason,
  requireAttachment,
  setRequireAttachment,
  allowPastDays,
  setAllowPastDays,
  pastDaysLimit,
  setPastDaysLimit,
  approvalSteps,
  setApprovalSteps,
  maxPerMonth,
  setMaxPerMonth,
}: any) {
  return (
    <div className="space-y-6">
      <InfoBox variant="info">
        در این بخش مشخص می‌شود پرسنل در چه شرایطی بتوانند ورود و خروج را به صورت دستی ثبت یا اصلاح کنند.
      </InfoBox>

      <div>
        <SectionTitle>🧩 دسترسی و الزامات</SectionTitle>
        <FormGrid>
          <FormGroup label="فعال‌سازی تردد دستی" tooltip="اجازه ثبت دستی ورود/خروج برای کاربران">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">تردد دستی فعال باشد</div>
              <Toggle checked={enabled} onChange={setEnabled} />
            </div>
          </FormGroup>

          <FormGroup label="الزام ثبت دلیل" tooltip="کاربر هنگام ثبت دستی باید دلیل وارد کند">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">دلیل اجباری</div>
              <Toggle checked={requireReason} onChange={setRequireReason} />
            </div>
          </FormGroup>

          <FormGroup label="الزام پیوست" tooltip="مثلاً نامه، اسکرین‌شات یا تایید سرپرست">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">پیوست فایل اجباری</div>
              <Toggle checked={requireAttachment} onChange={setRequireAttachment} />
            </div>
          </FormGroup>

        </FormGrid>
      </div>

      <Divider />

      <div>
        <SectionTitle>⏳ محدودیت‌های ثبت</SectionTitle>
        <FormGrid>
          <FormGroup label="اجازه ثبت برای روزهای گذشته" tooltip="کاربر بتواند برای روزهای قبل ثبت/اصلاح بزند">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">ثبت روزهای گذشته</div>
              <Toggle checked={allowPastDays} onChange={setAllowPastDays} />
            </div>
          </FormGroup>

          <FormGroup label="حداکثر روز مجاز گذشته" tooltip="تعداد روز مجاز برای برگشت به عقب">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pastDaysLimit}
                onChange={(e) => setPastDaysLimit(e.target.value)}
                min="0"
                className="input-field flex-1"
                placeholder="3"
                disabled={!allowPastDays}
              />
              <span className="text-xs text-slate-500 whitespace-nowrap">روز</span>
            </div>
          </FormGroup>

          <FormGroup label="سقف ثبت ماهانه" tooltip="هر نفر در ماه حداکثر چند بار ثبت دستی انجام دهد">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={maxPerMonth}
                onChange={(e) => setMaxPerMonth(e.target.value)}
                min="0"
                className="input-field flex-1"
                placeholder="10"
              />
              <span className="text-xs text-slate-500 whitespace-nowrap">بار</span>
            </div>
          </FormGroup>
        </FormGrid>
      </div>

      <Divider />

      <div>
        <SectionTitle>✅ جریان تایید</SectionTitle>
        <FormGrid>
          <FormGroup label="تعداد مراحل تایید" tooltip="۱ مرحله: مدیر مستقیم، ۲ مرحله: مدیر + منابع انسانی">
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

// Shift Swap Policy Tab
function SwapPolicyTab({
  enabled,
  setEnabled,
  allowCrossGroup,
  setAllowCrossGroup,
  requirePeerApproval,
  setRequirePeerApproval,
  requireManagerApproval,
  setRequireManagerApproval,
  allowPastShift,
  setAllowPastShift,
  minNoticeHours,
  setMinNoticeHours,
  monthlyLimit,
  setMonthlyLimit,
  unit,
  setUnit,
  minGapMinutes,
  setMinGapMinutes,
  blockOvertimeConflict,
  setBlockOvertimeConflict,
  blockLeaveConflict,
  setBlockLeaveConflict,
}: any) {
  const toSafeNumber = (value: string, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const isHourMode = unit === 'hour';
  const toHourMinute = (totalMinutes: number) => {
    const safe = Math.max(0, Math.round(totalMinutes));
    return { hours: Math.floor(safe / 60), minutes: safe % 60 };
  };
  const minutesToHourInput = (value: string) => {
    const totalMinutes = Math.max(0, Math.round(toSafeNumber(value, 0)));
    const hours = totalMinutes / 60;
    return Number.isInteger(hours) ? String(hours) : hours.toFixed(2).replace(/\.?0+$/, '');
  };
  const inputToMinutes = (value: string) => {
    if (value.trim() === '') return '';
    if (isHourMode) return String(Math.max(0, Math.round(toSafeNumber(value, 0) * 60)));
    return String(Math.max(0, Math.round(toSafeNumber(value, 0))));
  };
  const displayValue = isHourMode ? minutesToHourInput(minGapMinutes) : minGapMinutes;
  const minuteHint = Math.max(0, Math.round(toSafeNumber(minGapMinutes, 0)));
  const hourHint = toHourMinute(minuteHint);

  return (
    <div className="space-y-6">
      <InfoBox variant="info">
        این بخش قوانین جابجایی شیفت بین پرسنل را کنترل می‌کند تا تداخل زمانی، اضافه‌کاری ناخواسته و بی‌نظمی ایجاد نشود.
      </InfoBox>

      <div>
        <SectionTitle>🔁 تنظیمات پایه جابجایی</SectionTitle>
        <FormGrid>
          <FormGroup label="فعال‌سازی جابجایی شیفت" tooltip="اجازه درخواست جابجایی بین کارکنان">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">جابجایی شیفت فعال باشد</div>
              <Toggle checked={enabled} onChange={setEnabled} />
            </div>
          </FormGroup>

          <FormGroup label="جابجایی بین گروهی" tooltip="اجازه جابجایی با افراد خارج از گروه کاری">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">بین گروه‌های مختلف مجاز باشد</div>
              <Toggle checked={allowCrossGroup} onChange={setAllowCrossGroup} />
            </div>
          </FormGroup>

          <FormGroup label="جابجایی شیفت گذشته" tooltip="اجازه ثبت جابجایی برای شیفتی که زمانش گذشته">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">جابجایی برای شیفت گذشته</div>
              <Toggle checked={allowPastShift} onChange={setAllowPastShift} />
            </div>
          </FormGroup>
        </FormGrid>
      </div>

      <Divider />

      <div>
        <SectionTitle>⏱ محدودیت‌های زمانی</SectionTitle>
        <FormGrid cols={2}>
          <FormGroup label="حداقل زمان اطلاع‌رسانی" tooltip="درخواست جابجایی حداقل چند ساعت قبل از شروع شیفت ثبت شود">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minNoticeHours}
                onChange={(e) => setMinNoticeHours(e.target.value)}
                min="0"
                className="input-field flex-1"
                placeholder="12"
              />
              <span className="text-xs text-slate-500 whitespace-nowrap">ساعت</span>
            </div>
          </FormGroup>

          <FormGroup label="سقف جابجایی ماهانه" tooltip="هر نفر در ماه حداکثر چند جابجایی داشته باشد">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                min="0"
                className="input-field flex-1"
                placeholder="4"
              />
              <span className="text-xs text-slate-500 whitespace-nowrap">بار</span>
            </div>
          </FormGroup>

          <FormGroup label="حداقل فاصله بین دو شیفت" tooltip="برای جلوگیری از خستگی بیش از حد بعد از جابجایی">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
                <div className="text-sm text-slate-200">واحد ثبت: {isHourMode ? 'ساعت' : 'دقیقه'}</div>
                <Toggle checked={isHourMode} onChange={() => setUnit(isHourMode ? 'minute' : 'hour')} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={displayValue}
                  onChange={(e) => setMinGapMinutes(inputToMinutes(e.target.value))}
                  min="0"
                  step={isHourMode ? '0.25' : '1'}
                  className="input-field flex-1"
                  placeholder={isHourMode ? '8' : '480'}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">{isHourMode ? 'ساعت' : 'دقیقه'}</span>
              </div>
              <div className="text-xs text-slate-400 bg-slate-800/20 border border-indigo-500/20 rounded-lg p-3">
                {isHourMode ? (
                  <>💡 معادل: <strong>{minuteHint} دقیقه</strong></>
                ) : (
                  <>
                    💡 معادل: <strong>{hourHint.hours} ساعت و {hourHint.minutes} دقیقه</strong>
                  </>
                )}
              </div>
            </div>
          </FormGroup>
        </FormGrid>
      </div>

      <Divider />

      <div>
        <SectionTitle>✅ تایید و کنترل تداخل</SectionTitle>
        <FormGrid>
          <FormGroup label="تایید نفر جایگزین" tooltip="فردی که شیفت را می‌گیرد باید تایید کند">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">تایید نفر جایگزین اجباری</div>
              <Toggle checked={requirePeerApproval} onChange={setRequirePeerApproval} />
            </div>
          </FormGroup>

          <FormGroup label="تایید مدیر" tooltip="درخواست جابجایی باید توسط مدیر تایید نهایی شود">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">تایید مدیر اجباری</div>
              <Toggle checked={requireManagerApproval} onChange={setRequireManagerApproval} />
            </div>
          </FormGroup>

          <FormGroup label="جلوگیری از تداخل اضافه‌کاری" tooltip="اگر جابجایی باعث تضاد با قوانین اضافه‌کاری شود رد شود">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">مسدودسازی تداخل اضافه‌کاری</div>
              <Toggle checked={blockOvertimeConflict} onChange={setBlockOvertimeConflict} />
            </div>
          </FormGroup>

          <FormGroup label="جلوگیری از تداخل مرخصی" tooltip="اگر فرد در بازه مرخصی باشد جابجایی ثبت نشود">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">مسدودسازی تداخل مرخصی</div>
              <Toggle checked={blockLeaveConflict} onChange={setBlockLeaveConflict} />
            </div>
          </FormGroup>
        </FormGrid>
      </div>
    </div>
  );
}

// Holiday Policy Tab
function HolidayPolicyTab({
  enabled,
  setEnabled,
  autoFromCalendar,
  setAutoFromCalendar,
  workAsOvertime,
  setWorkAsOvertime,
  requireApprovalForWork,
  setRequireApprovalForWork,
  requireAttachment,
  setRequireAttachment,
  compOffEnabled,
  setCompOffEnabled,
  compOffExpireDays,
  setCompOffExpireDays,
  unit,
  setUnit,
  maxWorkMinutes,
  setMaxWorkMinutes,
}: any) {
  const isHourMode = unit === 'hour';
  const toSafeNumber = (value: string, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const minutesToHourInput = (value: string) => {
    const totalMinutes = Math.max(0, Math.round(toSafeNumber(value, 0)));
    const hours = totalMinutes / 60;
    return Number.isInteger(hours) ? String(hours) : hours.toFixed(2).replace(/\.?0+$/, '');
  };
  const inputToMinutes = (value: string) => {
    if (value.trim() === '') return '';
    if (isHourMode) return String(Math.max(0, Math.round(toSafeNumber(value, 0) * 60)));
    return String(Math.max(0, Math.round(toSafeNumber(value, 0))));
  };

  return (
    <div className="space-y-6">
      <InfoBox variant="info">در تب روز تعطیل فقط چهار تنظیم اصلی نمایش داده می‌شود.</InfoBox>

      <FormGrid cols={2}>
        <FormGroup label="محاسبه به عنوان اضافه‌کاری" tooltip="کار در تعطیل به عنوان اضافه‌کاری ثبت شود">
          <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
            <div className="text-sm text-slate-200">محاسبه به عنوان اضافه‌کاری</div>
            <Toggle checked={workAsOvertime} onChange={setWorkAsOvertime} />
          </div>
        </FormGroup>

        <FormGroup label="نیاز به تایید مدیر" tooltip="ثبت کار در تعطیلات بدون تایید مدیر نهایی نشود">
          <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
            <div className="text-sm text-slate-200">نیاز به تایید مدیر</div>
            <Toggle checked={requireApprovalForWork} onChange={setRequireApprovalForWork} />
          </div>
        </FormGroup>

        <FormGroup label="پیوست اجباری" tooltip="برای کار در تعطیلات، پیوست مستندات الزامی باشد">
          <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
            <div className="text-sm text-slate-200">پیوست اجباری</div>
            <Toggle checked={requireAttachment} onChange={setRequireAttachment} />
          </div>
        </FormGroup>

        <FormGroup label="حداکثر کار مجاز در تعطیل" tooltip="سقف زمان قابل ثبت برای هر روز تعطیل">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="text-sm text-slate-200">واحد ثبت: {isHourMode ? 'ساعت' : 'دقیقه'}</div>
              <Toggle checked={isHourMode} onChange={() => setUnit(isHourMode ? 'minute' : 'hour')} />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={isHourMode ? minutesToHourInput(maxWorkMinutes) : maxWorkMinutes}
                onChange={(e) => setMaxWorkMinutes(inputToMinutes(e.target.value))}
                min="0"
                step={isHourMode ? '0.25' : '1'}
                className="input-field flex-1"
                placeholder={isHourMode ? '8' : '480'}
              />
              <span className="text-xs text-slate-500 whitespace-nowrap">{isHourMode ? 'ساعت' : 'دقیقه'}</span>
            </div>
          </div>
        </FormGroup>
      </FormGrid>
    </div>
  );
}

// Other Attendance Policy Tab
function OtherAttendancePolicyTab({
  autoAbsentNoPunch,
  setAutoAbsentNoPunch,
  missingPunchAction,
  setMissingPunchAction,
  requireReasonForExceptions,
  setRequireReasonForExceptions,
  geofenceRequired,
  setGeofenceRequired,
  deviceBindingRequired,
  setDeviceBindingRequired,
  faceRecognitionInAttendanceFlow,
  setFaceRecognitionInAttendanceFlow,
  attendanceLockDays,
  setAttendanceLockDays,
  maxConsecutiveAbsence,
  setMaxConsecutiveAbsence,
  alertOnAbsenceLimit,
  setAlertOnAbsenceLimit,
}: any) {
  return (
    <div className="space-y-6">
      <InfoBox variant="info">در تب سایر فقط تنظیمات امنیتی تردد و هشدار غیبت متوالی نمایش داده می‌شود.</InfoBox>

      <FormGrid cols={2}>
        <FormGroup label="الزام محدوده مکانی (Geofence)" tooltip="ثبت تردد فقط داخل محدوده‌های تعریف‌شده مجاز باشد">
          <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
            <div className="text-sm text-slate-200">الزام محدوده مکانی (Geofence)</div>
            <Toggle checked={geofenceRequired} onChange={setGeofenceRequired} />
          </div>
        </FormGroup>

        <FormGroup label="تشخیص چهره در فلو تردد" tooltip="برای ثبت ورود/خروج، تایید چهره کاربر در جریان تردد انجام شود">
          <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
            <div className="text-sm text-slate-200">تشخیص چهره در فلو تردد</div>
            <Toggle checked={faceRecognitionInAttendanceFlow} onChange={setFaceRecognitionInAttendanceFlow} />
          </div>
        </FormGroup>

        <FormGroup label="هشدار سقف غیبت متوالی" tooltip="با رسیدن به سقف غیبت، هشدار برای مدیر ارسال شود">
          <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
            <div className="text-sm text-slate-200">هشدار سقف غیبت متوالی</div>
            <Toggle checked={alertOnAbsenceLimit} onChange={setAlertOnAbsenceLimit} />
          </div>
        </FormGroup>

        <FormGroup label="حداکثر غیبت متوالی برای هشدار" tooltip="این فیلد فقط وقتی هشدار روشن باشد فعال است">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={maxConsecutiveAbsence}
              onChange={(e) => setMaxConsecutiveAbsence(e.target.value)}
              min="0"
              className="input-field flex-1"
              placeholder="3"
              disabled={!alertOnAbsenceLimit}
            />
            <span className="text-xs text-slate-500 whitespace-nowrap">روز</span>
          </div>
        </FormGroup>
      </FormGrid>
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
  leaveType,
  title,
  setTitle,
  nature,
  setNature,
  unit,
  setUnit,
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
  const toSafeNumber = (value: string, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const toHourMinute = (totalMinutes: number) => {
    const safeMinutes = Math.max(0, Math.round(totalMinutes));
    const hours = Math.floor(safeMinutes / 60);
    const minutes = safeMinutes % 60;
    return { hours, minutes };
  };

  const minutesToHourInput = (value: string) => {
    const totalMinutes = Math.max(0, Math.round(toSafeNumber(value, 0)));
    const hours = totalMinutes / 60;
    return Number.isInteger(hours) ? String(hours) : hours.toFixed(2).replace(/\.?0+$/, '');
  };

  const hourInputToMinutes = (value: string) => {
    if (value.trim() === '') return '';
    const totalMinutes = Math.max(0, Math.round(toSafeNumber(value, 0) * 60));
    return String(totalMinutes);
  };

  const annualTotalMinutes = Math.max(
    0,
    Math.round(toSafeNumber(annualQuotaHours, 0) * 60 + toSafeNumber(annualQuotaMinutes, 0))
  );
  const monthlyTotalMinutes = Math.max(
    0,
    Math.round(toSafeNumber(monthlyQuotaHours, 0) * 60 + toSafeNumber(monthlyQuotaMinutes, 0))
  );
  const carryoverTotalMinutes = Math.max(
    0,
    Math.round(toSafeNumber(carryoverCapHours, 0) * 60 + toSafeNumber(carryoverCapMinutes, 0))
  );
  const minTotalMinutes = Math.max(0, Math.round(toSafeNumber(minMinutes, 0)));
  const maxTotalMinutes = Math.max(0, Math.round(toSafeNumber(maxMinutes, 0)));
  const isHourMode = unit === 'hour';

  const normalizeMinuteInput = (value: string) => {
    if (value.trim() === '') return '';
    return String(Math.max(0, Math.round(toSafeNumber(value, 0))));
  };

  const inputToMinutesByMode = (value: string) => {
    return isHourMode ? hourInputToMinutes(value) : normalizeMinuteInput(value);
  };

  const displayValueByMode = (totalMinutes: number) => {
    return isHourMode ? minutesToHourInput(String(totalMinutes)) : String(totalMinutes);
  };

  const setHourMinutePairFromTotal = (
    totalMinutesValue: string,
    setHours: (value: string) => void,
    setMinutes: (value: string) => void
  ) => {
    const totalMinutes = Math.max(0, Math.round(toSafeNumber(totalMinutesValue, 0)));
    const { hours, minutes } = toHourMinute(totalMinutes);
    setHours(String(hours));
    setMinutes(String(minutes));
  };

  const isAnnualLeave = leaveType === 'annual';
  const isSickLeave = leaveType === 'sick';
  const isUnpaidLeave = leaveType === 'unpaid';
  const isIncentiveLeave = leaveType === 'incentive';

  if (isAnnualLeave) {
    return (
      <div className="space-y-6">
        <InfoBox variant="info">در مرخصی استحقاقی فقط محدودیت مصرف ماهانه و الزام پیوست تنظیم می‌شود.</InfoBox>

        <FormGrid cols={2}>
          <FormGroup label="حداکثر استفاده از سهمیه در ماه" tooltip="سقف مجاز مصرف مرخصی استحقاقی در هر ماه">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={displayValueByMode(monthlyTotalMinutes)}
                  onChange={(e) =>
                    setHourMinutePairFromTotal(
                      inputToMinutesByMode(e.target.value),
                      setMonthlyQuotaHours,
                      setMonthlyQuotaMinutes
                    )
                  }
                  min="0"
                  step={isHourMode ? '0.25' : '1'}
                  className="input-field flex-1"
                  placeholder={isHourMode ? '20' : '1200'}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">{isHourMode ? 'ساعت' : 'دقیقه'}</span>
              </div>
            </div>
          </FormGroup>

          <FormGroup label="الزام به پیوست فایل" tooltip="درخواست مرخصی بدون فایل پیوست ثبت نشود">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div>
                <div className="text-sm text-slate-200">پیوست اجباری</div>
                <div className="text-xs text-slate-500">درخواست بدون فایل ثبت نشود</div>
              </div>
              <Toggle checked={attachmentRequired} onChange={setAttachmentRequired} />
            </div>
          </FormGroup>
        </FormGrid>
      </div>
    );
  }

  if (isSickLeave || isIncentiveLeave) {
    return (
      <div className="space-y-6">
        <InfoBox variant="info">برای این نوع مرخصی فقط الزام پیوست تنظیم می‌شود.</InfoBox>

        <FormGrid cols={2}>
          <FormGroup label="الزام به پیوست فایل" tooltip="درخواست مرخصی بدون فایل پیوست ثبت نشود">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div>
                <div className="text-sm text-slate-200">پیوست اجباری</div>
                <div className="text-xs text-slate-500">درخواست بدون فایل ثبت نشود</div>
              </div>
              <Toggle checked={attachmentRequired} onChange={setAttachmentRequired} />
            </div>
          </FormGroup>
        </FormGrid>
      </div>
    );
  }

  if (isUnpaidLeave) {
    return (
      <div className="space-y-6">
        <InfoBox variant="info">برای مرخصی بدون حقوق فقط سقف مجاز و الزام پیوست تنظیم می‌شود.</InfoBox>

        <FormGrid cols={2}>
          <FormGroup label="سقف مرخصی بدون حقوق" tooltip="حداکثر مدت مجاز برای مرخصی بدون حقوق">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={displayValueByMode(maxTotalMinutes)}
                  onChange={(e) => setMaxMinutes(inputToMinutesByMode(e.target.value))}
                  min="0"
                  step={isHourMode ? '0.25' : '1'}
                  className="input-field flex-1"
                  placeholder={isHourMode ? '8' : '480'}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">{isHourMode ? 'ساعت' : 'دقیقه'}</span>
              </div>
            </div>
          </FormGroup>

          <FormGroup label="الزام به پیوست فایل" tooltip="درخواست مرخصی بدون فایل پیوست ثبت نشود">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div>
                <div className="text-sm text-slate-200">پیوست اجباری</div>
                <div className="text-xs text-slate-500">درخواست بدون فایل ثبت نشود</div>
              </div>
              <Toggle checked={attachmentRequired} onChange={setAttachmentRequired} />
            </div>
          </FormGroup>
        </FormGrid>
      </div>
    );
  }

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

          <FormGroup label="واحد محاسبه" tooltip="مرخصی فقط بر اساس ساعت یا دقیقه محاسبه می‌شود">
            <div className="flex items-center justify-between gap-3 bg-slate-800/40 border border-white/5 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-sm text-slate-200">تغییر به {isHourMode ? 'دقیقه' : 'ساعت'}</div>
                  <div className="text-xs text-slate-500">سوئیچ برای تغییر واحد محاسبه</div>
                </div>
              </div>
              <Toggle 
                checked={isHourMode} 
                onChange={() => setUnit(isHourMode ? 'minute' : 'hour')} 
              />
            </div>
            <div className="mt-2 text-xs text-slate-400 bg-slate-800/20 border border-indigo-500/20 rounded-lg p-3">
              📌 <strong>واحد فعلی:</strong> {isHourMode ? 'ساعت' : 'دقیقه'}
            </div>
          </FormGroup>
        </FormGrid>
      </div>

      <Divider />

      <div>
        <FormGrid cols={2}>
          <FormGroup label="سهمیه سالانه" tooltip="مثال: ۲۰۸ ساعت یا ۱۲۴۸۰ دقیقه">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={displayValueByMode(annualTotalMinutes)}
                  onChange={(e) =>
                    setHourMinutePairFromTotal(
                      inputToMinutesByMode(e.target.value),
                      setAnnualQuotaHours,
                      setAnnualQuotaMinutes
                    )
                  }
                  min="0"
                  step={isHourMode ? '0.25' : '1'}
                  className="input-field flex-1"
                  placeholder={isHourMode ? '208' : '12480'}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">{isHourMode ? 'ساعت' : 'دقیقه'}</span>
              </div>
              <div className="text-xs text-slate-400 bg-slate-800/20 border border-indigo-500/20 rounded-lg p-3">
                {isHourMode ? (
                  <>💡 معادل: <strong>{annualTotalMinutes} دقیقه</strong></>
                ) : (
                  <>
                    💡 معادل: <strong>{toHourMinute(annualTotalMinutes).hours} ساعت و {toHourMinute(annualTotalMinutes).minutes} دقیقه</strong>
                  </>
                )}
              </div>
            </div>
          </FormGroup>

          <FormGroup label="سهمیه ماهانه" tooltip="مثال: ۲۰ ساعت یا ۱۲۰۰ دقیقه">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={displayValueByMode(monthlyTotalMinutes)}
                  onChange={(e) =>
                    setHourMinutePairFromTotal(
                      inputToMinutesByMode(e.target.value),
                      setMonthlyQuotaHours,
                      setMonthlyQuotaMinutes
                    )
                  }
                  min="0"
                  step={isHourMode ? '0.25' : '1'}
                  className="input-field flex-1"
                  placeholder={isHourMode ? '20' : '1200'}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">{isHourMode ? 'ساعت' : 'دقیقه'}</span>
              </div>
              <div className="text-xs text-slate-400 bg-slate-800/20 border border-indigo-500/20 rounded-lg p-3">
                {isHourMode ? (
                  <>💡 معادل: <strong>{monthlyTotalMinutes} دقیقه</strong></>
                ) : (
                  <>
                    💡 معادل: <strong>{toHourMinute(monthlyTotalMinutes).hours} ساعت و {toHourMinute(monthlyTotalMinutes).minutes} دقیقه</strong>
                  </>
                )}
              </div>
            </div>
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

          <FormGroup label="حداقل مدت درخواست" tooltip="حداقل زمان مجاز برای ثبت یک درخواست مرخصی">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={displayValueByMode(minTotalMinutes)}
                  onChange={(e) => setMinMinutes(inputToMinutesByMode(e.target.value))}
                  min="0"
                  step={isHourMode ? '0.25' : '1'}
                  className="input-field flex-1"
                  placeholder={isHourMode ? '0.5' : '30'}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {isHourMode ? 'ساعت' : 'دقیقه'}
                </span>
              </div>
              <div className="text-xs text-slate-400 bg-slate-800/20 border border-indigo-500/20 rounded-lg p-3">
                {isHourMode ? (
                  <>💡 معادل: <strong>{minTotalMinutes} دقیقه</strong></>
                ) : (
                  <>
                    💡 معادل: <strong>{toHourMinute(minTotalMinutes).hours} ساعت و {toHourMinute(minTotalMinutes).minutes} دقیقه</strong>
                  </>
                )}
              </div>
            </div>
          </FormGroup>

          <FormGroup
            label="حداکثر مدت درخواست در یک نوبت"
            tooltip="بیشترین زمان مجاز برای ثبت یک درخواست مرخصی"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={displayValueByMode(maxTotalMinutes)}
                  onChange={(e) => setMaxMinutes(inputToMinutesByMode(e.target.value))}
                  min="0"
                  step={isHourMode ? '0.25' : '1'}
                  className="input-field flex-1"
                  placeholder={isHourMode ? '3' : '180'}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {isHourMode ? 'ساعت' : 'دقیقه'}
                </span>
              </div>
              <div className="text-xs text-slate-400 bg-slate-800/20 border border-indigo-500/20 rounded-lg p-3">
                {isHourMode ? (
                  <>💡 معادل: <strong>{maxTotalMinutes} دقیقه</strong></>
                ) : (
                  <>
                    💡 معادل: <strong>{toHourMinute(maxTotalMinutes).hours} ساعت و {toHourMinute(maxTotalMinutes).minutes} دقیقه</strong>
                  </>
                )}
              </div>
            </div>
          </FormGroup>

          <FormGroup
            label="سقف انتقال به سال بعد"
            tooltip="حداکثر مانده مرخصی قابل انتقال به سال بعد"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={displayValueByMode(carryoverTotalMinutes)}
                  onChange={(e) =>
                    setHourMinutePairFromTotal(
                      inputToMinutesByMode(e.target.value),
                      setCarryoverCapHours,
                      setCarryoverCapMinutes
                    )
                  }
                  min="0"
                  step={isHourMode ? '0.25' : '1'}
                  className="input-field flex-1"
                  placeholder={isHourMode ? '72' : '4320'}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">{isHourMode ? 'ساعت' : 'دقیقه'}</span>
              </div>
              <div className="text-xs text-slate-400 bg-slate-800/20 border border-indigo-500/20 rounded-lg p-3">
                {isHourMode ? (
                  <>💡 معادل: <strong>{carryoverTotalMinutes} دقیقه</strong></>
                ) : (
                  <>
                    💡 معادل: <strong>{toHourMinute(carryoverTotalMinutes).hours} ساعت و {toHourMinute(carryoverTotalMinutes).minutes} دقیقه</strong>
                  </>
                )}
              </div>
            </div>
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
