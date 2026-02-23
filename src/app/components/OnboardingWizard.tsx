import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  Briefcase,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  RefreshCcw,
  Sun,
} from "lucide-react";

type ShiftTypeId = "fixed" | "floating" | "split" | "rotating";

type ShiftTypeItem = {
  id: ShiftTypeId;
  label: string;
  description: string;
  icon: React.ElementType;
};

type FormValues = {
  startTime: string;
  endTime: string;
  endsNextDay: boolean;
  restDuration: number;
  deductRest: boolean;
  requiredMinutes: number;
  bandwidthStart: string;
  bandwidthEnd: string;
  coreTimeStart: string;
  coreTimeEnd: string;
  segment1Start: string;
  segment1End: string;
  segment2Start: string;
  segment2End: string;
  segment2EndsNextDay: boolean;
  patternName: string;
  cycleDescription: string;
  rotationStartDate: string;
  cycleLengthDays: number;
  workDays: number;
  offDays: number;
};

type OnboardingData = {
  workplaceName: string;
  radius: 100 | 300 | 500;
  calendarId: "official-1404";
  applyOfficialHolidays: boolean;
  selectedShiftType: ShiftTypeId;
  formValues: FormValues;
};

type TemplateItem = {
  id: string;
  label: string;
  values: Partial<FormValues>;
};

const SHIFT_TYPES: ShiftTypeItem[] = [
  { id: "fixed", label: "ثابت", description: "ساعت ورود و خروج مشخص", icon: Briefcase },
  { id: "floating", label: "شناور", description: "بازه ورود و خروج منعطف", icon: Calendar },
  { id: "split", label: "دوتکه", description: "دو بخش کاری در روز", icon: Clock },
  { id: "rotating", label: "چرخشی", description: "الگوی گردشی شیفت‌ها", icon: RefreshCcw },
];

const TEMPLATES: Record<ShiftTypeId, TemplateItem[]> = {
  fixed: [
    {
      id: "fixed-office",
      label: "اداری عادی",
      values: { startTime: "08:00", endTime: "17:00", restDuration: 60, endsNextDay: false },
    },
    {
      id: "fixed-factory-morning",
      label: "شیفت صبح کارخانه",
      values: { startTime: "06:00", endTime: "14:00", restDuration: 30, endsNextDay: false },
    },
    {
      id: "fixed-guard-night",
      label: "نگهبانی شب",
      values: { startTime: "22:00", endTime: "06:00", endsNextDay: true, restDuration: 45 },
    },
  ],
  floating: [
    {
      id: "floating-standard",
      label: "شناور استاندارد",
      values: {
        requiredMinutes: 480,
        bandwidthStart: "07:00",
        bandwidthEnd: "19:00",
        coreTimeStart: "09:00",
        coreTimeEnd: "15:00",
      },
    },
    {
      id: "floating-free",
      label: "شناور آزاد",
      values: {
        requiredMinutes: 440,
        bandwidthStart: "08:00",
        bandwidthEnd: "20:00",
        coreTimeStart: "",
        coreTimeEnd: "",
      },
    },
  ],
  split: [
    {
      id: "split-restaurant",
      label: "رستوران (ناهار/شام)",
      values: {
        segment1Start: "11:00",
        segment1End: "16:00",
        segment2Start: "19:00",
        segment2End: "23:00",
        segment2EndsNextDay: false,
      },
    },
  ],
  rotating: [
    {
      id: "rotating-2-2-2",
      label: "گردشی 2-2-2",
      values: {
        patternName: "2 صبح، 2 شب، 2 استراحت",
        cycleDescription: "دو روز شیفت صبح، دو روز شیفت شب و سپس دو روز استراحت",
        cycleLengthDays: 6,
        workDays: 4,
        offDays: 2,
      },
    },
  ],
};

const RADIUS_OPTIONS: Array<100 | 300 | 500> = [100, 300, 500];

function getDefaultFormValues(type: ShiftTypeId): FormValues {
  return {
    startTime: type === "fixed" ? "08:00" : "",
    endTime: type === "fixed" ? "17:00" : "",
    endsNextDay: false,
    restDuration: 60,
    deductRest: true,
    requiredMinutes: type === "floating" ? 480 : 0,
    bandwidthStart: type === "floating" ? "07:00" : "",
    bandwidthEnd: type === "floating" ? "19:00" : "",
    coreTimeStart: "",
    coreTimeEnd: "",
    segment1Start: type === "split" ? "11:00" : "",
    segment1End: type === "split" ? "16:00" : "",
    segment2Start: type === "split" ? "19:00" : "",
    segment2End: type === "split" ? "23:00" : "",
    segment2EndsNextDay: false,
    patternName: type === "rotating" ? "الگوی گردشی پایه" : "",
    cycleDescription: "",
    rotationStartDate: "",
    cycleLengthDays: type === "rotating" ? 6 : 0,
    workDays: type === "rotating" ? 4 : 0,
    offDays: type === "rotating" ? 2 : 0,
  };
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function textInputClassName() {
  return "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-100";
}

function StepOne({
  workplaceName,
  setWorkplaceName,
  radius,
  setRadius,
}: {
  workplaceName: string;
  setWorkplaceName: Dispatch<SetStateAction<string>>;
  radius: 100 | 300 | 500;
  setRadius: Dispatch<SetStateAction<100 | 300 | 500>>;
}) {
  const radiusIndex = RADIUS_OPTIONS.findIndex((item) => item === radius);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-slate-900">تنظیمات کارگاه</h2>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">نام کارگاه</label>
          <input
            value={workplaceName}
            onChange={(e) => setWorkplaceName(e.target.value)}
            placeholder="مثال: کارگاه مرکزی تهران"
            className={textInputClassName()}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">شعاع مجاز</label>
            <span className="text-sm font-semibold text-[#3b82f6]">{radius} متر</span>
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={radiusIndex}
            onChange={(e) => setRadius(RADIUS_OPTIONS[Number(e.target.value)])}
            className="w-full accent-[#3b82f6]"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>100m</span>
            <span>300m</span>
            <span>500m</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-[#f3f4f6] p-6 shadow-sm">
        <div className="h-full min-h-[280px] rounded-xl border-2 border-dashed border-slate-300 bg-white/80 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 text-[#3b82f6] flex items-center justify-center">
              <MapPin className="w-7 h-7" />
            </div>
            <p className="text-sm font-medium text-slate-700">محل نمایش نقشه</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepTwo({
  applyOfficialHolidays,
  setApplyOfficialHolidays,
  selectedShiftType,
  setSelectedShiftType,
  selectedTemplateId,
  setSelectedTemplateId,
  formValues,
  setFormValues,
}: {
  applyOfficialHolidays: boolean;
  setApplyOfficialHolidays: Dispatch<SetStateAction<boolean>>;
  selectedShiftType: ShiftTypeId;
  setSelectedShiftType: Dispatch<SetStateAction<ShiftTypeId>>;
  selectedTemplateId: string | null;
  setSelectedTemplateId: Dispatch<SetStateAction<string | null>>;
  formValues: FormValues;
  setFormValues: Dispatch<SetStateAction<FormValues>>;
}) {
  const templates = useMemo(() => TEMPLATES[selectedShiftType], [selectedShiftType]);

  const onSelectShiftType = (type: ShiftTypeId) => {
    setSelectedShiftType(type);
    setSelectedTemplateId(null);
    setFormValues(getDefaultFormValues(type));
  };

  const onTemplateSelect = (template: TemplateItem) => {
    setSelectedTemplateId(template.id);
    setFormValues((prev) => ({ ...prev, ...template.values }));
  };

  const renderDynamicFields = () => {
    if (selectedShiftType === "fixed") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="ساعت شروع">
            <input
              type="time"
              value={formValues.startTime}
              onChange={(e) => setFormValues((prev) => ({ ...prev, startTime: e.target.value }))}
              className={textInputClassName()}
            />
          </Field>
          <Field label="ساعت پایان">
            <input
              type="time"
              value={formValues.endTime}
              onChange={(e) => setFormValues((prev) => ({ ...prev, endTime: e.target.value }))}
              className={textInputClassName()}
            />
          </Field>
          <Field label="مدت استراحت (دقیقه)">
            <input
              type="number"
              min={0}
              value={formValues.restDuration}
              onChange={(e) => setFormValues((prev) => ({ ...prev, restDuration: Number(e.target.value || 0) }))}
              className={textInputClassName()}
            />
          </Field>
          <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3 self-end">
            <span className="text-sm font-medium text-slate-700">کسر استراحت از کارکرد</span>
            <button
              type="button"
              onClick={() => setFormValues((prev) => ({ ...prev, deductRest: !prev.deductRest }))}
              className={[
                "relative h-7 w-12 rounded-full transition-colors",
                formValues.deductRest ? "bg-[#3b82f6]" : "bg-slate-300",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-1 h-5 w-5 rounded-full bg-white transition-all",
                  formValues.deductRest ? "right-1" : "right-6",
                ].join(" ")}
              />
            </button>
          </label>
          <label className="md:col-span-2 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formValues.endsNextDay}
              onChange={(e) => setFormValues((prev) => ({ ...prev, endsNextDay: e.target.checked }))}
              className="h-4 w-4 accent-[#3b82f6]"
            />
            پایان شیفت در روز بعد
          </label>
        </div>
      );
    }

    if (selectedShiftType === "floating") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="دقایق کارکرد الزامی">
            <input
              type="number"
              min={0}
              value={formValues.requiredMinutes}
              onChange={(e) => setFormValues((prev) => ({ ...prev, requiredMinutes: Number(e.target.value || 0) }))}
              className={textInputClassName()}
            />
          </Field>
          <Field label="شروع بازه ورود">
            <input
              type="time"
              value={formValues.bandwidthStart}
              onChange={(e) => setFormValues((prev) => ({ ...prev, bandwidthStart: e.target.value }))}
              className={textInputClassName()}
            />
          </Field>
          <Field label="پایان بازه خروج">
            <input
              type="time"
              value={formValues.bandwidthEnd}
              onChange={(e) => setFormValues((prev) => ({ ...prev, bandwidthEnd: e.target.value }))}
              className={textInputClassName()}
            />
          </Field>
          <Field label="شروع هسته زمانی (اختیاری)">
            <input
              type="time"
              value={formValues.coreTimeStart}
              onChange={(e) => setFormValues((prev) => ({ ...prev, coreTimeStart: e.target.value }))}
              className={textInputClassName()}
            />
          </Field>
          <Field label="پایان هسته زمانی (اختیاری)">
            <input
              type="time"
              value={formValues.coreTimeEnd}
              onChange={(e) => setFormValues((prev) => ({ ...prev, coreTimeEnd: e.target.value }))}
              className={textInputClassName()}
            />
          </Field>
        </div>
      );
    }

    if (selectedShiftType === "split") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="بازه اول - شروع">
            <input
              type="time"
              value={formValues.segment1Start}
              onChange={(e) => setFormValues((prev) => ({ ...prev, segment1Start: e.target.value }))}
              className={textInputClassName()}
            />
          </Field>
          <Field label="بازه اول - پایان">
            <input
              type="time"
              value={formValues.segment1End}
              onChange={(e) => setFormValues((prev) => ({ ...prev, segment1End: e.target.value }))}
              className={textInputClassName()}
            />
          </Field>
          <Field label="بازه دوم - شروع">
            <input
              type="time"
              value={formValues.segment2Start}
              onChange={(e) => setFormValues((prev) => ({ ...prev, segment2Start: e.target.value }))}
              className={textInputClassName()}
            />
          </Field>
          <Field label="بازه دوم - پایان">
            <input
              type="time"
              value={formValues.segment2End}
              onChange={(e) => setFormValues((prev) => ({ ...prev, segment2End: e.target.value }))}
              className={textInputClassName()}
            />
          </Field>
          <label className="md:col-span-2 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formValues.segment2EndsNextDay}
              onChange={(e) => setFormValues((prev) => ({ ...prev, segment2EndsNextDay: e.target.checked }))}
              className="h-4 w-4 accent-[#3b82f6]"
            />
            پایان بازه دوم در روز بعد
          </label>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="نام الگو">
          <input
            value={formValues.patternName}
            onChange={(e) => setFormValues((prev) => ({ ...prev, patternName: e.target.value }))}
            className={textInputClassName()}
          />
        </Field>
        <Field label="تاریخ شروع چرخش">
          <input
            type="date"
            value={formValues.rotationStartDate}
            onChange={(e) => setFormValues((prev) => ({ ...prev, rotationStartDate: e.target.value }))}
            className={textInputClassName()}
          />
        </Field>
        <Field label="طول چرخه (روز)">
          <input
            type="number"
            min={1}
            value={formValues.cycleLengthDays}
            onChange={(e) => setFormValues((prev) => ({ ...prev, cycleLengthDays: Number(e.target.value || 1) }))}
            className={textInputClassName()}
          />
        </Field>
        <Field label="روزهای کار">
          <input
            type="number"
            min={0}
            value={formValues.workDays}
            onChange={(e) => setFormValues((prev) => ({ ...prev, workDays: Number(e.target.value || 0) }))}
            className={textInputClassName()}
          />
        </Field>
        <Field label="روزهای استراحت">
          <input
            type="number"
            min={0}
            value={formValues.offDays}
            onChange={(e) => setFormValues((prev) => ({ ...prev, offDays: Number(e.target.value || 0) }))}
            className={textInputClassName()}
          />
        </Field>
        <Field label="توضیح چرخه شیفت" className="md:col-span-2">
          <textarea
            rows={4}
            value={formValues.cycleDescription}
            onChange={(e) => setFormValues((prev) => ({ ...prev, cycleDescription: e.target.value }))}
            className={textInputClassName()}
          />
        </Field>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900">تقویم و شیفت</h2>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-900">تقویم رسمی ۱۴۰۴</p>
            <p className="text-xs text-blue-700">به‌صورت پیش‌فرض انتخاب شده است</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#3b82f6] text-white flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={applyOfficialHolidays}
            onChange={(e) => setApplyOfficialHolidays(e.target.checked)}
            className="h-4 w-4 accent-[#3b82f6]"
          />
          اعمال تعطیلات رسمی
        </label>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900">ثبت شیفت</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SHIFT_TYPES.map((item) => {
            const active = item.id === selectedShiftType;
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onSelectShiftType(item.id)}
                className={[
                  "rounded-xl border p-4 text-right transition-all",
                  active
                    ? "border-[#3b82f6] bg-blue-50 ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:border-blue-300",
                ].join(" ")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={[
                      "h-8 w-8 rounded-lg flex items-center justify-center",
                      active ? "bg-[#3b82f6] text-white" : "bg-slate-100 text-slate-600",
                    ].join(" ")}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{item.label}</p>
                </div>
                <p className="text-xs text-slate-600">{item.description}</p>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">تمپلیت‌های پیشنهادی</p>
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <button
                type="button"
                key={template.id}
                onClick={() => onTemplateSelect(template)}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  selectedTemplateId === template.id
                    ? "border-[#3b82f6] bg-blue-100 text-blue-800"
                    : "border-slate-300 bg-[#f3f4f6] text-slate-700 hover:border-[#3b82f6] hover:bg-blue-50",
                ].join(" ")}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-[#f3f4f6]/60 p-4">{renderDynamicFields()}</div>
      </section>
    </div>
  );
}

export default function OnboardingWizard({
  onSkip,
  onFinish,
}: {
  onSkip: () => void;
  onFinish: (data: OnboardingData) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [darkMode, setDarkMode] = useState(false);
  const [workplaceName, setWorkplaceName] = useState("");
  const [radius, setRadius] = useState<100 | 300 | 500>(300);
  const [applyOfficialHolidays, setApplyOfficialHolidays] = useState(true);
  const [selectedShiftType, setSelectedShiftType] = useState<ShiftTypeId>("fixed");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(() => getDefaultFormValues("fixed"));

  return (
    <div
      dir="rtl"
      className={[
        "relative min-h-full w-full p-4 sm:p-6 lg:p-8 font-vazir",
        darkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => setDarkMode((prev) => !prev)}
        className="absolute top-4 left-4 z-10 h-10 w-10 rounded-xl border border-slate-300 bg-white text-amber-500 shadow-sm flex items-center justify-center"
        aria-label="تغییر تم"
      >
        <Sun className="w-5 h-5" />
      </button>

      <div className="max-w-5xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-slate-500">گام {step} از 2</p>
            <h1 className="text-2xl font-black">راه‌اندازی سریع</h1>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4"
          >
            رد کردن
          </button>
        </div>

        {step === 1 ? (
          <StepOne
            workplaceName={workplaceName}
            setWorkplaceName={setWorkplaceName}
            radius={radius}
            setRadius={setRadius}
          />
        ) : (
          <StepTwo
            applyOfficialHolidays={applyOfficialHolidays}
            setApplyOfficialHolidays={setApplyOfficialHolidays}
            selectedShiftType={selectedShiftType}
            setSelectedShiftType={setSelectedShiftType}
            selectedTemplateId={selectedTemplateId}
            setSelectedTemplateId={setSelectedTemplateId}
            formValues={formValues}
            setFormValues={setFormValues}
          />
        )}

        <div dir="ltr" className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((prev) => (prev === 2 ? 1 : 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            بازگشت
          </button>
          <button
            type="button"
            onClick={() => {
              if (step === 1) {
                setStep(2);
                return;
              }
              onFinish({
                workplaceName,
                radius,
                calendarId: "official-1404",
                applyOfficialHolidays,
                selectedShiftType,
                formValues,
              });
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3b82f6] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {step === 1 ? "بعدی" : "پایان"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
