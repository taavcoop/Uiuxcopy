import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { BarChart3, ChevronRight, Info, Lock, Plus, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  getDraftTemplateById,
  getPayrollPackageEnabled,
  upsertDraftTemplate,
} from '../lib/draft-template-store';
import {
  LABOR_OFFICE_REFERENCE_PRESETS,
  createEmptyDraftTemplate,
  getLaborOfficeReferencePresetById,
  type DraftTemplate,
  type EydiPayoutMode,
  type FixedAdjustmentItem,
  type LaborOfficeReferenceMode,
  type LaborOfficeReferencePreset,
  type PayrollDraftKind,
  type PayrollField,
  type SeverancePayoutMode,
  type TaxBracket,
} from '../lib/draft-template-types';

type SectionId =
  | 'base'
  | 'attendance'
  | 'payroll_setup'
  | 'payroll_main'
  | 'payroll_job_benefits'
  | 'payroll_other_benefits'
  | 'payroll_fixed_adjustments'
  | 'payroll_time_coeffs'
  | 'payroll_shift'
  | 'payroll_legal'
  | 'payroll_deductions';

type PayrollFieldKey =
  | 'baseSalary'
  | 'seniorityBase'
  | 'housingAllowance'
  | 'foodAllowance'
  | 'childAllowancePerChild'
  | 'marriageAllowance'
  | 'attractionAllowance'
  | 'managementAllowance'
  | 'commuteAllowance'
  | 'hardshipAllowance'
  | 'otherBenefits'
  | 'overtimeFactor'
  | 'nightWorkFactor1'
  | 'nightWorkFactor2'
  | 'holidayWorkFactor'
  | 'fridayWorkFactorWithOvertime'
  | 'fridayWorkFactorWithoutOvertime'
  | 'morningEveningShiftPercent'
  | 'morningEveningNightShiftPercent'
  | 'morningNightShiftPercent'
  | 'eveningNightShiftPercent'
  | 'eydi'
  | 'severancePay';

type PayrollScalarKey =
  | 'agreedWage'
  | 'monthlyRequiredHours'
  | 'workerInsuranceRate'
  | 'employerInsuranceRate'
  | 'unemploymentInsuranceRate'
  | 'insuranceCapMultiplier'
  | 'monthlyTaxExemption'
  | 'overMinWageBenefitTarget';

const SECTION_TITLES: Record<SectionId, string> = {
  base: 'اطلاعات پایه',
  attendance: 'اطلاعات حضور و غیاب',
  payroll_setup: 'روش ورود اطلاعات حقوق و دستمزد',
  payroll_main: 'مولفه‌های اصلی حکمی',
  payroll_job_benefits: 'مزایای به تبع شغل',
  payroll_other_benefits: 'سایر مزایا',
  payroll_fixed_adjustments: 'اضافات و کسورات ثابت',
  payroll_time_coeffs: 'فوق‌العاده ضرایب زمانی',
  payroll_shift: 'فوق‌العاده نوبت کاری',
  payroll_legal: 'مبالغ عیدی و حق سنوات',
  payroll_deductions: 'کسورات قانونی و حدود بیمه / مالیات',
};

const MAIN_COMPONENTS: Array<{ key: PayrollFieldKey; label: string }> = [
  { key: 'baseSalary', label: 'حقوق پایه ماهانه' },
  { key: 'seniorityBase', label: 'پایه سنوات ماهانه' },
  { key: 'housingAllowance', label: 'حق مسکن' },
  { key: 'foodAllowance', label: 'بن خواربار/کارگری' },
  { key: 'childAllowancePerChild', label: 'حق اولاد (هر فرزند)' },
  { key: 'marriageAllowance', label: 'حق تاهل' },
];

const JOB_BENEFITS: Array<{ key: PayrollFieldKey; label: string }> = [
  { key: 'attractionAllowance', label: 'حق جذب' },
  { key: 'managementAllowance', label: 'حق مدیریت' },
  { key: 'commuteAllowance', label: 'ایاب و ذهاب' },
  { key: 'hardshipAllowance', label: 'سختی کار' },
];

const TIME_COEFFS: Array<{ key: PayrollFieldKey; label: string }> = [
  { key: 'overtimeFactor', label: 'ضریب اضافه کاری' },
  { key: 'nightWorkFactor1', label: 'ضریب شب کاری' },
  { key: 'holidayWorkFactor', label: 'ضریب تعطیل کاری' },
  { key: 'fridayWorkFactorWithOvertime', label: 'ضریب جمعه کاری' },
  { key: 'fridayWorkFactorWithoutOvertime', label: 'ضریب جمعه کاری بدون اضافه کاری' },
];

const SHIFT_BENEFITS: Array<{ key: PayrollFieldKey; label: string }> = [
  { key: 'morningEveningShiftPercent', label: 'درصد شیفت صبح و عصر' },
  { key: 'morningEveningNightShiftPercent', label: 'درصد شیفت صبح و عصر و شب' },
  { key: 'morningNightShiftPercent', label: 'درصد شیفت صبح و شب' },
  { key: 'eveningNightShiftPercent', label: 'درصد شیفت عصر و شب' },
];

const LEGAL_FIELDS: Array<{ key: PayrollFieldKey; label: string }> = [
  { key: 'eydi', label: 'عیدی' },
  { key: 'severancePay', label: 'حق سنوات' },
];

const DEDUCTION_FIELDS: Array<{ key: PayrollScalarKey; label: string }> = [
  { key: 'workerInsuranceRate', label: 'نرخ بیمه سهم کارگر (%)' },
  { key: 'employerInsuranceRate', label: 'نرخ بیمه سهم کارفرما (%)' },
  { key: 'unemploymentInsuranceRate', label: 'نرخ بیمه بیکاری (%) (به عهده کارفرما)' },
  { key: 'insuranceCapMultiplier', label: 'ضریب سقف مشمول بیمه' },
  { key: 'monthlyTaxExemption', label: 'معافیت مالیاتی ماهانه' },
];
const INSURANCE_DEDUCTION_FIELD_KEYS = new Set<PayrollScalarKey>([
  'workerInsuranceRate',
  'employerInsuranceRate',
  'unemploymentInsuranceRate',
  'insuranceCapMultiplier',
]);
const TAX_DEDUCTION_FIELD_KEYS = new Set<PayrollScalarKey>(['monthlyTaxExemption']);

const OVER_MIN_WAGE_TARGET_LABELS: Record<string, string> = {
  attractionAllowance: 'حق جذب',
  managementAllowance: 'حق مدیریت',
  commuteAllowance: 'ایاب و ذهاب',
  hardshipAllowance: 'سختی کار',
  otherBenefits: 'سایر مزایا',
};

const DRAFT_KIND_OPTIONS: Array<{ value: PayrollDraftKind; label: string; desc: string; enabled: boolean }> = [
  { value: 'monthly_fixed', label: 'ثابت ماهیانه', desc: 'پرداخت ثابت ماهانه با مزد مبنا و مزایا', enabled: true },
  { value: 'daily_wage', label: 'روزمزد', desc: 'پرداخت بر مبنای روزهای کارکرد', enabled: false },
  { value: 'hourly', label: 'ساعتی', desc: 'پرداخت بر مبنای ساعات کارکرد', enabled: false },
  { value: 'project', label: 'پروژه ای', desc: 'پرداخت توافقی بر اساس پروژه', enabled: false },
  { value: 'consulting', label: 'مشاوره ای', desc: 'پرداخت بر اساس قرارداد مشاوره', enabled: false },
];

const ENABLED_DRAFT_KINDS = new Set<PayrollDraftKind>(DRAFT_KIND_OPTIONS.filter((item) => item.enabled).map((item) => item.value));

const BASE_FIELD_TOOLTIPS = {
  title: 'عنوان قالب برای شناسایی نسخه پیش‌نویس قرارداد در سیستم استفاده می‌شود.',
  description: 'توضیحات تکمیلی درباره کاربرد قالب؛ ثبت آن اختیاری است.',
} as const;

const ATTENDANCE_TOOLTIPS = {
  monthlyLeaveCap: 'سقف مرخصی استحقاقی قابل استفاده در هر ماه برای این قالب قرارداد.',
  maxLeaveCarryToNextYear: 'حداکثر مانده مرخصی که طبق سیاست شرکت/قوانین داخلی به سال بعد منتقل می‌شود.',
  monthlyOvertimeCap: 'حداکثر ساعت اضافه‌کاری مجاز ماهانه برای جلوگیری از ثبت مازاد غیرمجاز.',
} as const;

const ATTENDANCE_FIELD_LABELS: Record<keyof DraftTemplate['attendance'], string> = {
  monthlyLeaveCap: 'سقف مرخصی ماهیانه',
  maxLeaveCarryToNextYear: 'حداکثر انتقال مرخصی به سال بعد',
  monthlyOvertimeCap: 'سقف ساعت اضافه کاری ماهانه',
};

const PAYROLL_FIELD_TOOLTIPS: Partial<Record<PayrollFieldKey, string>> = {
  baseSalary: 'حقوق پایه ماهانه مطابق حکم/قرارداد که مبنای اصلی محاسبات مزدی است.',
  seniorityBase: 'پایه سنوات ماهانه مطابق مقررات کار برای کارکنان مشمول سنوات.',
  housingAllowance: 'حق مسکن مصوب شورای عالی کار (در صورت شمول).',
  foodAllowance: 'بن خواربار/کارگری مصوب سالانه برای کارکنان مشمول.',
  childAllowancePerChild: 'حق اولاد برای هر فرزند واجد شرایط طبق ضوابط قانون کار و تامین اجتماعی.',
  marriageAllowance: 'مزیت/کمک‌هزینه تاهل در صورت اعمال در سیاست پرداخت شرکت.',
  attractionAllowance: 'مزایای جذب/نگهداشت نیروی کار که شرکت به صورت حکمی تعریف می‌کند.',
  managementAllowance: 'مزایای مرتبط با مسئولیت مدیریتی/سرپرستی.',
  commuteAllowance: 'کمک‌هزینه ایاب و ذهاب در صورت پرداخت توسط کارفرما.',
  hardshipAllowance: 'فوق‌العاده سختی کار در مشاغل واجد شرایط یا سیاست شرکت.',
  otherBenefits: 'سایر مزایای ماهانه که در گروه‌های دیگر قرار نمی‌گیرند.',
  overtimeFactor: 'ضریب محاسبه هر ساعت اضافه‌کاری نسبت به مزد ساعتی عادی.',
  nightWorkFactor1: 'ضریب پرداخت کار در ساعات شب مطابق ضوابط/سیاست محاسبه انتخاب‌شده.',
  holidayWorkFactor: 'ضریب پرداخت کار در روزهای تعطیل رسمی نسبت به مزد عادی.',
  fridayWorkFactorWithOvertime: 'ضریب پرداخت جمعه‌کاری در حالتی که اضافه‌کاری نیز محاسبه می‌شود.',
  fridayWorkFactorWithoutOvertime: 'ضریب پرداخت جمعه‌کاری بدون اعمال هم‌زمان اضافه‌کاری.',
  morningEveningShiftPercent: 'درصد فوق‌العاده نوبت‌کاری برای الگوی صبح و عصر.',
  morningEveningNightShiftPercent: 'درصد فوق‌العاده نوبت‌کاری برای الگوی صبح، عصر و شب.',
  morningNightShiftPercent: 'درصد فوق‌العاده نوبت‌کاری برای الگوی صبح و شب.',
  eveningNightShiftPercent: 'درصد فوق‌العاده نوبت‌کاری برای الگوی عصر و شب.',
  eydi: 'ضریب/مقدار مبنای محاسبه عیدی سالانه طبق حدود قانونی و سیاست شرکت.',
  severancePay: 'ضریب/مقدار مبنای محاسبه حق سنوات (مزایای پایان کار).',
};

const PAYROLL_SCALAR_TOOLTIPS: Partial<Record<PayrollScalarKey, string>> = {
  agreedWage: 'مبلغ دریافتی توافقی ماهانه برای مقایسه با دریافتی قانونی 30 روزه.',
  monthlyRequiredHours: 'ساعت موظفی ماهانه برای محاسبه نرخ ساعتی و تبدیل‌های روزانه/هفتگی.',
  workerInsuranceRate: 'نرخ بیمه سهم کارگر که از حقوق کارگر کسر می‌شود.',
  employerInsuranceRate: 'نرخ بیمه سهم کارفرما که توسط کارفرما پرداخت می‌شود.',
  unemploymentInsuranceRate: 'نرخ بیمه بیکاری (به عهده کارفرما) در محاسبات بیمه.',
  insuranceCapMultiplier: 'ضریب سقف دستمزد مشمول بیمه نسبت به حداقل مزد مصوب.',
  monthlyTaxExemption: 'سقف معافیت مالیاتی ماهانه قبل از اعمال پله‌های مالیات.',
  overMinWageBenefitTarget: 'محل ثبت مازاد مبلغ توافقی نسبت به دریافتی قانونی.',
};

const AGREED_TARGETS = new Set(['attractionAllowance', 'managementAllowance', 'commuteAllowance', 'hardshipAllowance', 'otherBenefits']);

const LEGAL_TOTAL_COMPONENT_KEYS: PayrollFieldKey[] = [
  ...MAIN_COMPONENTS.map((item) => item.key),
  ...JOB_BENEFITS.map((item) => item.key),
  'otherBenefits',
];

const DERIVED_FROM_BASE_WAGE_FIELD_KEYS: PayrollFieldKey[] = [
  ...TIME_COEFFS.map((item) => item.key),
  ...SHIFT_BENEFITS.map((item) => item.key),
  ...LEGAL_FIELDS.map((item) => item.key),
];

const ALL_PAYROLL_FIELD_KEYS: PayrollFieldKey[] = [
  ...LEGAL_TOTAL_COMPONENT_KEYS,
  ...TIME_COEFFS.map((item) => item.key),
  ...SHIFT_BENEFITS.map((item) => item.key),
  ...LEGAL_FIELDS.map((item) => item.key),
];
const STANDARD_MONTHLY_WORK_HOURS_FOR_HOURLY_RATE = 220;

const toNumber = (value: string): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (value: number): string => `${Math.round(value).toLocaleString('fa-IR')} تومان`;

const formatHourMinute = (hours: number): string => {
  const totalMinutes = Math.max(0, Math.round(hours * 60));
  const hh = Math.floor(totalMinutes / 60);
  const mm = totalMinutes % 60;
  return `${hh.toLocaleString('fa-IR')} ساعت و ${mm.toLocaleString('fa-IR')} دقیقه`;
};

const estimateMonthlyTax = (gross: number, exemption: string, brackets: TaxBracket[]): number => {
  const ex = Math.max(0, toNumber(exemption));
  if (gross <= ex) return 0;
  let tax = 0;
  for (const bracket of brackets) {
    const rate = toNumber(bracket.rate);
    if (rate <= 0) continue;
    const start = Math.max(ex, toNumber(bracket.start));
    const rawEnd = bracket.end ? toNumber(bracket.end) : Number.POSITIVE_INFINITY;
    const end = rawEnd > start ? rawEnd : Number.POSITIVE_INFINITY;
    const taxable = Math.max(0, Math.min(gross, end) - start);
    tax += taxable * (rate / 100);
    if (gross <= end) break;
  }
  return Math.max(0, tax);
};

const createFixedAdjustment = (kind: 'addition' | 'deduction'): FixedAdjustmentItem => ({
  id: `adj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: '',
  kind,
  calcType: 'fixed',
  value: '',
  insurance: true,
  tax: true,
  baseWage: false,
});

const normalizeBaseWageFlags = (payroll: DraftTemplate['payroll']): DraftTemplate['payroll'] => {
  const next = { ...payroll };
  DERIVED_FROM_BASE_WAGE_FIELD_KEYS.forEach((key) => {
    next[key] = { ...next[key], baseWage: false };
  });
  next.fixedAdjustments = next.fixedAdjustments.map((item) =>
    item.calcType === 'base_wage_factor' ? { ...item, baseWage: false } : item,
  );
  return next;
};

const hydrateTemplate = (input: DraftTemplate): DraftTemplate => {
  const base = createEmptyDraftTemplate();
  const rawPayroll = input.payroll ?? base.payroll;
  const mergedPayroll = {
    ...base.payroll,
    ...rawPayroll,
    draftKind: ENABLED_DRAFT_KINDS.has(rawPayroll.draftKind) ? rawPayroll.draftKind : 'monthly_fixed',
    globalInsuranceEnabled: rawPayroll.globalInsuranceEnabled ?? true,
    globalTaxEnabled: rawPayroll.globalTaxEnabled ?? true,
    fixedAdjustments: Array.isArray(rawPayroll.fixedAdjustments)
      ? rawPayroll.fixedAdjustments.map((item) => ({
          ...item,
          insurance: item.insurance ?? true,
          tax: item.tax ?? true,
          baseWage: item.baseWage ?? false,
        }))
      : [],
    agreedExtraAdditionIds: Array.isArray(rawPayroll.agreedExtraAdditionIds) ? rawPayroll.agreedExtraAdditionIds : [],
    agreedDeficitDeductionIds: Array.isArray(rawPayroll.agreedDeficitDeductionIds)
      ? rawPayroll.agreedDeficitDeductionIds
      : [],
  };

  const payrollWithFields = ALL_PAYROLL_FIELD_KEYS.reduce<typeof mergedPayroll>((acc, key) => {
    acc[key] = { ...base.payroll[key], ...(rawPayroll as DraftTemplate['payroll'])[key] };
    return acc;
  }, mergedPayroll);

  return {
    ...base,
    ...input,
    laborOfficeReference: input.laborOfficeReference
      ? {
          ...input.laborOfficeReference,
          mode: input.laborOfficeReference.mode ?? 'apply',
        }
      : null,
    attendance: { ...base.attendance, ...input.attendance },
    payroll: normalizeBaseWageFlags(payrollWithFields),
    savedSections: { ...base.savedSections, ...input.savedSections },
  };
};

type AgreedAnalysis = {
  legalTotal: number;
  agreedTotal: number;
  diff: number;
  finalFieldValues: Record<PayrollFieldKey, number>;
  selectedExtraAdditions: FixedAdjustmentItem[];
  selectedDeficitDeductions: FixedAdjustmentItem[];
};

const calculateAgreedAnalysis = (template: DraftTemplate): AgreedAnalysis => {
  const finalFieldValues = ALL_PAYROLL_FIELD_KEYS.reduce<Record<PayrollFieldKey, number>>((acc, key) => {
    acc[key] = toNumber(template.payroll[key].value);
    return acc;
  }, {} as Record<PayrollFieldKey, number>);

  const legalTotal = LEGAL_TOTAL_COMPONENT_KEYS.reduce((sum, key) => sum + finalFieldValues[key], 0);
  const agreedTotal = toNumber(template.payroll.agreedWage);
  const diff = agreedTotal - legalTotal;

  if (diff > 0 && AGREED_TARGETS.has(template.payroll.overMinWageBenefitTarget)) {
    const target = template.payroll.overMinWageBenefitTarget as PayrollFieldKey;
    finalFieldValues[target] += diff;
  }

  const selectedExtraAdditions = template.payroll.fixedAdjustments.filter(
    (item) =>
      item.kind === 'addition' &&
      item.calcType === 'fixed' &&
      template.payroll.agreedExtraAdditionIds.includes(item.id),
  );

  const selectedDeficitDeductions = template.payroll.fixedAdjustments.filter(
    (item) =>
      item.kind === 'deduction' &&
      item.calcType === 'fixed' &&
      template.payroll.agreedDeficitDeductionIds.includes(item.id),
  );

  return {
    legalTotal,
    agreedTotal,
    diff,
    finalFieldValues,
    selectedExtraAdditions,
    selectedDeficitDeductions,
  };
};

const requiredBaseError = (item: DraftTemplate): string | null => {
  if (!item.title.trim()) return 'عنوان اطلاعات پایه الزامی است.';
  return null;
};

const normalizeTaxBrackets = (exemption: string, brackets: TaxBracket[]): TaxBracket[] => {
  const out: TaxBracket[] = [];
  for (let i = 0; i < brackets.length; i += 1) {
    out.push({
      ...brackets[i],
      start: i === 0 ? exemption : out[i - 1]?.end ?? '',
    });
  }
  return out;
};

const getSavedLabel = (date?: string) => {
  if (!date) return 'ذخیره نشده';
  try {
    return new Date(date).toLocaleString('fa-IR');
  } catch {
    return 'ذخیره شده';
  }
};

const formatReferenceDate = (date?: string) => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('fa-IR');
  } catch {
    return date;
  }
};

const getReferenceDateRangeLabel = (ref: { startDate: string; endDate: string }) =>
  `${formatReferenceDate(ref.startDate)} تا ${formatReferenceDate(ref.endDate)}`;

const buildPreparedDraftTemplate = (template: DraftTemplate, calculatedHourlyRate: number): DraftTemplate => {
  const normalizedPayroll = normalizeBaseWageFlags({
    ...template.payroll,
    taxBrackets: normalizeTaxBrackets(template.payroll.monthlyTaxExemption, template.payroll.taxBrackets),
  });

  return {
    ...template,
    payroll: {
      ...normalizedPayroll,
      hourlyRateOverride:
        normalizedPayroll.hourlyRateOverrideDraft.trim() ||
        (calculatedHourlyRate > 0 ? String(Number(calculatedHourlyRate.toFixed(2))) : ''),
    },
    updatedAt: new Date().toISOString(),
  };
};

const PAYROLL_SCALAR_LABELS: Partial<Record<PayrollScalarKey, string>> = {
  monthlyRequiredHours: 'ساعت موظفی در ماه',
  workerInsuranceRate: 'نرخ بیمه سهم کارگر (%)',
  employerInsuranceRate: 'نرخ بیمه سهم کارفرما (%)',
  unemploymentInsuranceRate: 'نرخ بیمه بیکاری (%)',
  insuranceCapMultiplier: 'ضریب سقف مشمول بیمه',
  monthlyTaxExemption: 'معافیت مالیاتی ماهانه',
};

const PAYROLL_FIELD_LABELS: Record<PayrollFieldKey, string> = {
  baseSalary: 'حقوق پایه ماهانه',
  seniorityBase: 'پایه سنوات ماهانه',
  housingAllowance: 'حق مسکن',
  foodAllowance: 'بن خواربار/کارگری',
  childAllowancePerChild: 'حق اولاد (هر فرزند)',
  marriageAllowance: 'حق تاهل',
  attractionAllowance: 'حق جذب',
  managementAllowance: 'حق مدیریت',
  commuteAllowance: 'ایاب و ذهاب',
  hardshipAllowance: 'سختی کار',
  otherBenefits: 'سایر مزایا',
  overtimeFactor: 'ضریب اضافه کاری',
  nightWorkFactor1: 'ضریب شب کاری',
  nightWorkFactor2: 'ضریب شب کاری ۲',
  holidayWorkFactor: 'ضریب تعطیل کاری',
  fridayWorkFactorWithOvertime: 'ضریب جمعه کاری',
  fridayWorkFactorWithoutOvertime: 'ضریب جمعه کاری بدون اضافه کاری',
  morningEveningShiftPercent: 'درصد شیفت صبح و عصر',
  morningEveningNightShiftPercent: 'درصد شیفت صبح و عصر و شب',
  morningNightShiftPercent: 'درصد شیفت صبح و شب',
  eveningNightShiftPercent: 'درصد شیفت عصر و شب',
  eydi: 'عیدی',
  severancePay: 'حق سنوات',
};

type ReferenceDeviation = {
  label: string;
  current: number;
  reference: number;
  kind: 'below' | 'above';
};

const LABOR_OFFICE_REFERENCE_MODE_LABELS: Record<LaborOfficeReferenceMode, string> = {
  apply: 'تنظیم قالب با مقادیر مرجع',
  warning: 'فقط هشدار و مقایسه',
};

export default function DraftTemplateEditor() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const isEdit = Boolean(id && id !== 'add');
  const existing = isEdit ? getDraftTemplateById(id as string) : null;
  const [template, setTemplate] = useState<DraftTemplate>(() => hydrateTemplate(existing ?? createEmptyDraftTemplate()));
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<string | null>(existing?.updatedAt ?? null);
  const [isMobileReportOpen, setIsMobileReportOpen] = useState(false);
  const [isLaborOfficeRefModeDialogOpen, setIsLaborOfficeRefModeDialogOpen] = useState(false);
  const [pendingLaborOfficeReferencePreset, setPendingLaborOfficeReferencePreset] = useState<LaborOfficeReferencePreset | null>(
    null,
  );
  const didMountAutoSaveRef = useRef(false);
  const hasPayrollPackage = getPayrollPackageEnabled();

  const baseError = useMemo(() => requiredBaseError(template), [template]);
  const baseReady = !baseError;
  const agreedAnalysis = useMemo(() => calculateAgreedAnalysis(template), [template]);
  const activeLaborOfficeReferencePreset = useMemo(
    () => (template.laborOfficeReference ? getLaborOfficeReferencePresetById(template.laborOfficeReference.id) : null),
    [template.laborOfficeReference],
  );
  const shiftCoverage = useMemo(
    () => ({
      insurance: SHIFT_BENEFITS.every((item) => template.payroll[item.key].insurance),
      tax: SHIFT_BENEFITS.every((item) => template.payroll[item.key].tax),
    }),
    [template.payroll],
  );
  const insuranceRateTotal =
    toNumber(template.payroll.workerInsuranceRate) +
    toNumber(template.payroll.employerInsuranceRate) +
    toNumber(template.payroll.unemploymentInsuranceRate);
  const showInsuranceCoverageOptions = template.payroll.globalInsuranceEnabled;
  const showTaxCoverageOptions = template.payroll.globalTaxEnabled;
  const visibleDeductionFields = DEDUCTION_FIELDS.filter(
    (item) =>
      (showInsuranceCoverageOptions && INSURANCE_DEDUCTION_FIELD_KEYS.has(item.key)) ||
      (showTaxCoverageOptions && TAX_DEDUCTION_FIELD_KEYS.has(item.key)),
  );

  if (isEdit && !existing) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-slate-900/40 border border-white/5 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">قالب موردنظر پیدا نشد</h2>
          <button
            onClick={() => navigate('/draft-templates')}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
          >
            بازگشت به فهرست
          </button>
        </div>
      </div>
    );
  }

  const setPayrollScalar = (key: PayrollScalarKey, value: string) => {
    setTemplate((prev) => ({
      ...prev,
      payroll: {
        ...prev.payroll,
        [key]: value,
        taxBrackets:
          key === 'monthlyTaxExemption'
            ? normalizeTaxBrackets(value, prev.payroll.taxBrackets)
            : prev.payroll.taxBrackets,
      },
    }));
  };

  const setPayrollField = (key: PayrollFieldKey, patch: Partial<PayrollField>) => {
    const lockBaseWage = DERIVED_FROM_BASE_WAGE_FIELD_KEYS.includes(key);
    setTemplate((prev) => ({
      ...prev,
      payroll: {
        ...prev.payroll,
        [key]: {
          ...prev.payroll[key],
          ...patch,
          ...(lockBaseWage ? { baseWage: false } : {}),
        },
      },
    }));
  };

  const applyLaborOfficeReference = (preset: LaborOfficeReferencePreset | null, mode: LaborOfficeReferenceMode = 'apply') => {
    setTemplate((prev) => {
      if (!preset) {
        return {
          ...prev,
          laborOfficeReference: null,
        };
      }

      if (mode === 'warning') {
        return {
          ...prev,
          laborOfficeReference: {
            id: preset.id,
            title: preset.title,
            startDate: preset.startDate,
            endDate: preset.endDate,
            appliedAt: new Date().toISOString(),
            mode,
          },
        };
      }

      const nextPayroll = { ...prev.payroll, ...preset.payrollScalarValues };

      Object.entries(preset.payrollFieldValues).forEach(([key, value]) => {
        if (!value) return;
        const fieldKey = key as PayrollFieldKey;
        nextPayroll[fieldKey] = {
          ...nextPayroll[fieldKey],
          value,
        };
      });

      const taxExemption = preset.payrollScalarValues.monthlyTaxExemption ?? nextPayroll.monthlyTaxExemption;
      nextPayroll.taxBrackets = normalizeTaxBrackets(
        taxExemption,
        preset.taxBrackets.map((row, index) => ({
          id: `tax-ref-${preset.id}-${index + 1}`,
          start: row.start,
          end: row.end,
          rate: row.rate,
        })),
      );

      return {
        ...prev,
        laborOfficeReference: {
          id: preset.id,
          title: preset.title,
          startDate: preset.startDate,
          endDate: preset.endDate,
          appliedAt: new Date().toISOString(),
          mode,
        },
        attendance: {
          ...prev.attendance,
          ...preset.attendance,
        },
        payroll: nextPayroll,
      };
    });

    if (preset) {
      setNotice(
        mode === 'apply'
          ? {
              type: 'success',
              text: `مقادیر مرجع «${preset.title}» در فیلدهای مرتبط اعمال شد.`,
            }
          : {
              type: 'success',
              text: `مرجع «${preset.title}» فقط برای هشدار و مقایسه متصل شد و مقادیر فرم تغییر نکرد.`,
            },
      );
    } else {
      setNotice({
        type: 'success',
        text: 'اتصال قالب به مرجع اداره کار حذف شد. مقادیر فعلی فرم بدون تغییر باقی ماند.',
      });
    }
  };

  const handleLaborOfficeReferenceSelect = (presetId: string) => {
    if (!presetId) {
      setPendingLaborOfficeReferencePreset(null);
      setIsLaborOfficeRefModeDialogOpen(false);
      applyLaborOfficeReference(null);
      return;
    }

    const preset = getLaborOfficeReferencePresetById(presetId);
    if (!preset) {
      setNotice({ type: 'error', text: 'مرجع اداره کار انتخاب‌شده معتبر نیست.' });
      return;
    }

    setPendingLaborOfficeReferencePreset(preset);
    setIsLaborOfficeRefModeDialogOpen(true);
  };

  const handleLaborOfficeRefModeDialogChange = (open: boolean) => {
    setIsLaborOfficeRefModeDialogOpen(open);
    if (!open) setPendingLaborOfficeReferencePreset(null);
  };

  const handleConfirmLaborOfficeReferenceMode = (mode: LaborOfficeReferenceMode) => {
    if (!pendingLaborOfficeReferencePreset) return;
    applyLaborOfficeReference(pendingLaborOfficeReferencePreset, mode);
    setIsLaborOfficeRefModeDialogOpen(false);
    setPendingLaborOfficeReferencePreset(null);
  };

  const setShiftCoverage = (kind: 'insurance' | 'tax', value: boolean) => {
    setTemplate((prev) => {
      const nextPayroll = { ...prev.payroll };
      SHIFT_BENEFITS.forEach((item) => {
        nextPayroll[item.key] = {
          ...nextPayroll[item.key],
          [kind]: value,
        };
      });
      return { ...prev, payroll: nextPayroll };
    });
  };

  const addFixedAdjustment = (kind: 'addition' | 'deduction') => {
    setTemplate((prev) => ({
      ...prev,
      payroll: {
        ...prev.payroll,
        fixedAdjustments: [...prev.payroll.fixedAdjustments, createFixedAdjustment(kind)],
      },
    }));
  };

  const updateFixedAdjustment = (id: string, patch: Partial<FixedAdjustmentItem>) => {
    setTemplate((prev) => ({
      ...prev,
      payroll: {
        ...prev.payroll,
        fixedAdjustments: prev.payroll.fixedAdjustments.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      },
    }));
  };

  const removeFixedAdjustment = (id: string) => {
    setTemplate((prev) => ({
      ...prev,
      payroll: {
        ...prev.payroll,
        fixedAdjustments: prev.payroll.fixedAdjustments.filter((item) => item.id !== id),
        agreedExtraAdditionIds: prev.payroll.agreedExtraAdditionIds.filter((itemId) => itemId !== id),
        agreedDeficitDeductionIds: prev.payroll.agreedDeficitDeductionIds.filter((itemId) => itemId !== id),
      },
    }));
  };

  const toggleAgreedExtraAddition = (id: string) => {
    setTemplate((prev) => {
      const exists = prev.payroll.agreedExtraAdditionIds.includes(id);
      return {
        ...prev,
        payroll: {
          ...prev.payroll,
          agreedExtraAdditionIds: exists
            ? prev.payroll.agreedExtraAdditionIds.filter((itemId) => itemId !== id)
            : [...prev.payroll.agreedExtraAdditionIds, id],
        },
      };
    });
  };

  const toggleAgreedDeficitDeduction = (id: string) => {
    setTemplate((prev) => {
      const exists = prev.payroll.agreedDeficitDeductionIds.includes(id);
      return {
        ...prev,
        payroll: {
          ...prev.payroll,
          agreedDeficitDeductionIds: exists
            ? prev.payroll.agreedDeficitDeductionIds.filter((itemId) => itemId !== id)
            : [...prev.payroll.agreedDeficitDeductionIds, id],
        },
      };
    });
  };

  const getSectionSaveError = (section: SectionId): string | null => {
    if (section !== 'base' && !baseReady) return 'ابتدا اطلاعات پایه را کامل کنید.';
    if (section === 'base' && baseError) return baseError;
    if (section.startsWith('payroll') && !hasPayrollPackage) {
      return 'برای ثبت آیتم‌های حقوق و دستمزد باید پکیج مربوطه فعال شود.';
    }
    if (section === 'payroll_setup' && template.payroll.inputMode === 'agreed') {
      if (!template.payroll.agreedWage) return 'در حالت توافقی، وارد کردن مبلغ حقوق توافقی الزامی است.';

      if (agreedAnalysis.diff > 0) {
        if (!AGREED_TARGETS.has(template.payroll.overMinWageBenefitTarget)) {
          return 'برای مازاد مبلغ توافقی، محل ثبت مازاد را انتخاب کنید.';
        }
        if (
          template.payroll.overMinWageBenefitTarget === 'otherBenefits' &&
          agreedAnalysis.selectedExtraAdditions.length === 0
        ) {
          return 'برای «سایر مزایا» حداقل یک اضافه ثابت (مبلغ ثابت) را انتخاب یا ایجاد کنید.';
        }
      }

      if (agreedAnalysis.diff < 0 && agreedAnalysis.selectedDeficitDeductions.length === 0) {
        return 'برای کسری مبلغ توافقی، حداقل یک کسور ثابت (مبلغ ثابت) را انتخاب یا ایجاد کنید.';
      }
    }

    return null;
  };

  const saveSection = (section: SectionId) => {
    const sectionError = getSectionSaveError(section);
    if (sectionError) {
      setNotice({ type: 'error', text: sectionError });
      return;
    }

    const normalizedPayroll = normalizeBaseWageFlags({
      ...template.payroll,
      taxBrackets: normalizeTaxBrackets(template.payroll.monthlyTaxExemption, template.payroll.taxBrackets),
    });
    const payrollForSave =
      section === 'payroll_setup'
        ? {
            ...normalizedPayroll,
            hourlyRateOverride:
              normalizedPayroll.hourlyRateOverrideDraft.trim() ||
              (calculatedHourlyRate > 0 ? String(Number(calculatedHourlyRate.toFixed(2))) : ''),
          }
        : normalizedPayroll;

    const prepared: DraftTemplate = {
      ...template,
      payroll: payrollForSave,
      updatedAt: new Date().toISOString(),
      savedSections: {
        ...template.savedSections,
        [section]: new Date().toISOString(),
      },
    };
    upsertDraftTemplate(prepared);
    setTemplate(prepared);
    setNotice({ type: 'success', text: `بخش «${SECTION_TITLES[section]}» ذخیره شد.` });
    if (!isEdit) navigate(`/draft-templates/${prepared.id}`, { replace: true });
  };

  const monthly = toNumber(template.payroll.monthlyRequiredHours);
  const perDay = monthly ? formatHourMinute(monthly / 30) : '۰ ساعت و ۰ دقیقه';
  const perWeek = monthly ? formatHourMinute((monthly / 30) * 6) : '۰ ساعت و ۰ دقیقه';
  const baseWageFromFields = ALL_PAYROLL_FIELD_KEYS.reduce(
    (sum, key) => sum + (template.payroll[key].baseWage ? agreedAnalysis.finalFieldValues[key] : 0),
    0,
  );
  const baseWageFromFixedAdjustments = template.payroll.fixedAdjustments.reduce((sum, item) => {
    if (!item.baseWage || item.calcType !== 'fixed') return sum;
    const signed = item.kind === 'deduction' ? -toNumber(item.value) : toNumber(item.value);
    return sum + signed;
  }, 0);
  const baseWageMonthly = Math.max(0, baseWageFromFields + baseWageFromFixedAdjustments);
  const legalGross30 = LEGAL_TOTAL_COMPONENT_KEYS.reduce((sum, key) => sum + toNumber(template.payroll[key].value), 0);
  const grossPay30 =
    template.payroll.inputMode === 'agreed' && toNumber(template.payroll.agreedWage) > 0
      ? toNumber(template.payroll.agreedWage)
      : legalGross30;
  const calculatedHourlyRate =
    baseWageMonthly > 0 ? baseWageMonthly / STANDARD_MONTHLY_WORK_HOURS_FOR_HOURLY_RATE : 0;
  const workerInsuranceAmount = showInsuranceCoverageOptions
    ? grossPay30 * (toNumber(template.payroll.workerInsuranceRate) / 100)
    : 0;
  const estimatedTaxAmount = showTaxCoverageOptions
    ? estimateMonthlyTax(grossPay30, template.payroll.monthlyTaxExemption, template.payroll.taxBrackets)
    : 0;
  const netPay30 = Math.max(0, grossPay30 - workerInsuranceAmount - estimatedTaxAmount);
  const hasAppliedHourlyOverride = Boolean(template.payroll.hourlyRateOverrideDraft.trim());
  const appliedHourlyRate = toNumber(
    template.payroll.hourlyRateOverrideDraft.trim() || template.payroll.hourlyRateOverride,
  );
  const laborReferenceDeviations = useMemo(() => {
    if (!activeLaborOfficeReferencePreset) return { below: [] as ReferenceDeviation[], above: [] as ReferenceDeviation[] };

    const below: ReferenceDeviation[] = [];
    const above: ReferenceDeviation[] = [];
    const epsilon = 1e-9;

    const pushCompare = (label: string, currentRaw: string | undefined, referenceRaw: string | undefined) => {
      if (referenceRaw == null || referenceRaw === '') return;
      const reference = toNumber(referenceRaw);
      const current = toNumber(currentRaw ?? '');
      if (!Number.isFinite(reference) || !Number.isFinite(current)) return;
      if (current < reference - epsilon) {
        below.push({ label, current, reference, kind: 'below' });
      } else if (current > reference + epsilon) {
        above.push({ label, current, reference, kind: 'above' });
      }
    };

    (Object.keys(activeLaborOfficeReferencePreset.attendance) as Array<keyof DraftTemplate['attendance']>).forEach((key) => {
      pushCompare(ATTENDANCE_FIELD_LABELS[key], template.attendance[key], activeLaborOfficeReferencePreset.attendance[key]);
    });

    Object.entries(activeLaborOfficeReferencePreset.payrollScalarValues).forEach(([rawKey, referenceRaw]) => {
      const key = rawKey as PayrollScalarKey;
      if (!(key in template.payroll)) return;
      pushCompare(PAYROLL_SCALAR_LABELS[key] ?? rawKey, template.payroll[key], referenceRaw);
    });

    Object.entries(activeLaborOfficeReferencePreset.payrollFieldValues).forEach(([rawKey, referenceRaw]) => {
      const key = rawKey as PayrollFieldKey;
      pushCompare(PAYROLL_FIELD_LABELS[key] ?? rawKey, template.payroll[key]?.value, referenceRaw);
    });

    return { below, above };
  }, [activeLaborOfficeReferencePreset, template.attendance, template.payroll]);
  const calculatedHourlyRateDraftValue = calculatedHourlyRate > 0 ? String(Number(calculatedHourlyRate.toFixed(2))) : '';
  const effectiveHourlyRateDraft = template.payroll.hourlyRateOverrideDraft || calculatedHourlyRateDraftValue;
  const showSectionsAfterBase = isEdit || baseReady;
  const canShowLiveReport = hasPayrollPackage && showSectionsAfterBase;

  useEffect(() => {
    if (!didMountAutoSaveRef.current) {
      didMountAutoSaveRef.current = true;
      return;
    }
    const prepared = buildPreparedDraftTemplate(template, calculatedHourlyRate);
    upsertDraftTemplate(prepared);
    setLastAutoSavedAt(prepared.updatedAt);
  }, [template, calculatedHourlyRate]);

  useEffect(() => {
    if (!canShowLiveReport && isMobileReportOpen) {
      setIsMobileReportOpen(false);
    }
  }, [canShowLiveReport, isMobileReportOpen]);

  const handleFinalSubmit = () => {
    const baseValidationError = getSectionSaveError('base');
    if (baseValidationError) {
      setNotice({ type: 'error', text: baseValidationError });
      return;
    }
    if (hasPayrollPackage) {
      const payrollSetupError = getSectionSaveError('payroll_setup');
      if (payrollSetupError) {
        setNotice({ type: 'error', text: payrollSetupError });
        return;
      }
    }

    const prepared = buildPreparedDraftTemplate(template, calculatedHourlyRate);
    upsertDraftTemplate(prepared);
    setTemplate(prepared);
    setLastAutoSavedAt(prepared.updatedAt);
    setNotice({ type: 'success', text: 'ثبت نهایی قالب پیش‌نویس انجام شد.' });
    if (!isEdit) navigate(`/draft-templates/${prepared.id}`, { replace: true });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-28">
      <div className="max-w-[88rem] mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/draft-templates')}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {isEdit ? 'ویرایش قالب پیش‌نویس قرارداد' : 'ثبت قالب پیش‌نویس قرارداد'}
              </h1>
              <p className="text-sm text-slate-400 mt-1">تغییرات هر فیلد به‌صورت خودکار ذخیره می‌شود.</p>
            </div>
          </div>
        </div>

        {notice && (
          <div
            className={`rounded-xl p-3 text-sm border ${
              notice.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
            }`}
          >
            {notice.text}
          </div>
        )}

        <Dialog open={isLaborOfficeRefModeDialogOpen} onOpenChange={handleLaborOfficeRefModeDialogChange}>
          <DialogContent dir="rtl" className="bg-slate-900 border-white/10 text-slate-100 sm:max-w-xl">
            <DialogHeader className="text-right">
              <DialogTitle className="text-white">نحوه استفاده از مرجع اداره کار</DialogTitle>
              <DialogDescription className="text-slate-300 leading-6">
                {pendingLaborOfficeReferencePreset
                  ? `مرجع «${pendingLaborOfficeReferencePreset.title}» را چگونه می‌خواهید استفاده کنید؟`
                  : 'نحوه استفاده از مرجع اداره کار را انتخاب کنید.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => handleConfirmLaborOfficeReferenceMode('apply')}
                className="text-right rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 p-3"
              >
                <div className="text-sm font-semibold text-emerald-100">تنظیم قالب با مقادیر اداره کار</div>
                <div className="text-xs text-emerald-200/80 mt-1">
                  مقادیر مرتبط (مزایا، ضرایب، بیمه/مالیات و بخشی از حضور و غیاب) روی فرم اعمال می‌شوند.
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleConfirmLaborOfficeReferenceMode('warning')}
                className="text-right rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/15 p-3"
              >
                <div className="text-sm font-semibold text-sky-100">فقط برای هشدار و مقایسه</div>
                <div className="text-xs text-sky-200/80 mt-1">
                  مرجع ذخیره می‌شود اما مقادیر فعلی فرم تغییر نمی‌کنند و فقط هشدار اختلاف نمایش داده می‌شود.
                </div>
              </button>
            </div>
            <DialogFooter className="sm:justify-start">
              <button
                type="button"
                onClick={() => handleLaborOfficeRefModeDialogChange(false)}
                className="px-3 py-2 rounded-lg border border-white/15 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
              >
                انصراف
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div
          className={`grid grid-cols-1 gap-4 items-start ${canShowLiveReport ? 'xl:grid-cols-[minmax(0,1fr)_23rem]' : ''}`}
        >
          <div className="space-y-5">
        <div className="sticky top-3 z-30">
          <div className="bg-slate-900/85 backdrop-blur border border-white/10 rounded-2xl p-3 sm:p-4 shadow-lg shadow-black/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs text-slate-400">
                ذخیره خودکار: فعال {lastAutoSavedAt ? `• آخرین ذخیره: ${getSavedLabel(lastAutoSavedAt)}` : ''}
              </div>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                ثبت نهایی
              </button>
            </div>
          </div>
        </div>
        <SectionCard
          title="اطلاعات پایه"
          subtitle="تعریف عنوان و توضیحات"
          savedAt={template.savedSections.base}
          onSave={() => saveSection('base')}
        >
          <div className="grid grid-cols-1 gap-4">
            <Field label="عنوان" required tooltip={BASE_FIELD_TOOLTIPS.title}>
              <input
                type="text"
                value={template.title}
                onChange={(e) => setTemplate((prev) => ({ ...prev, title: e.target.value }))}
                className="input-field"
              />
            </Field>
            <div>
              <Field label="توضیحات" tooltip={BASE_FIELD_TOOLTIPS.description}>
                <textarea
                  value={template.description}
                  onChange={(e) => setTemplate((prev) => ({ ...prev, description: e.target.value }))}
                  className="input-field min-h-24"
                />
              </Field>
            </div>
            <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 space-y-3">
              <Field label="مقادیر مرجع اداره کار">
                <select
                  value={template.laborOfficeReference?.id ?? ''}
                  onChange={(e) => handleLaborOfficeReferenceSelect(e.target.value)}
                  className="input-field"
                >
                  <option value="">عدم استفاده از مرجع اداره کار</option>
                  {LABOR_OFFICE_REFERENCE_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.title} | {getReferenceDateRangeLabel(preset)}
                    </option>
                  ))}
                </select>
              </Field>
              <p className="text-[11px] text-slate-400">
                پس از انتخاب مرجع، از شما پرسیده می‌شود که مقادیر مرجع روی فرم اعمال شوند یا فقط برای هشدار و مقایسه
                استفاده شوند.
              </p>
              <div
                className={`rounded-lg border p-3 text-xs ${
                  template.laborOfficeReference
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100'
                    : 'bg-slate-900/40 border-white/5 text-slate-300'
                }`}
              >
                {template.laborOfficeReference ? (
                  <div className="space-y-1">
                    <div className="font-semibold">مرجع انتخاب‌شده: {template.laborOfficeReference.title}</div>
                    <div>
                      بازه اعتبار: {getReferenceDateRangeLabel(template.laborOfficeReference)} | زمان اعمال:{' '}
                      {formatReferenceDate(template.laborOfficeReference.appliedAt)}
                    </div>
                    <div>نوع استفاده: {LABOR_OFFICE_REFERENCE_MODE_LABELS[template.laborOfficeReference.mode ?? 'apply']}</div>
                  </div>
                ) : (
                  <span>برای این قالب از مقادیر مرجع اداره کار استفاده نشده است.</span>
                )}
              </div>
              {activeLaborOfficeReferencePreset && (
                <div className="space-y-2">
                  {laborReferenceDeviations.below.length > 0 && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3">
                      <div className="text-xs font-semibold text-rose-200 mb-2">
                        هشدار: برخی مقادیر از حداقل مرجع اداره کار کمتر هستند.
                      </div>
                      <div className="space-y-1">
                        {laborReferenceDeviations.below.slice(0, 6).map((item) => (
                          <div key={`below-${item.label}`} className="text-[11px] text-rose-100/90">
                            {item.label}: فعلی {item.current.toLocaleString('fa-IR')} | مرجع {item.reference.toLocaleString('fa-IR')}
                          </div>
                        ))}
                        {laborReferenceDeviations.below.length > 6 && (
                          <div className="text-[11px] text-rose-200/80">
                            و {laborReferenceDeviations.below.length - 6} مورد دیگر...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {laborReferenceDeviations.above.length > 0 && (
                    <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-3">
                      <div className="text-xs font-semibold text-sky-200 mb-2">
                        اطلاع: برخی مقادیر از حد نرمال مرجع بالاتر هستند.
                      </div>
                      <div className="space-y-1">
                        {laborReferenceDeviations.above.slice(0, 6).map((item) => (
                          <div key={`above-${item.label}`} className="text-[11px] text-sky-100/90">
                            {item.label}: فعلی {item.current.toLocaleString('fa-IR')} | مرجع {item.reference.toLocaleString('fa-IR')}
                          </div>
                        ))}
                        {laborReferenceDeviations.above.length > 6 && (
                          <div className="text-[11px] text-sky-200/80">
                            و {laborReferenceDeviations.above.length - 6} مورد دیگر...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {showSectionsAfterBase ? (
          <>
        <SectionCard
          title="اطلاعات حضور و غیاب"
          subtitle="تنظیم مرخصی و اضافه‌کاری"
          savedAt={template.savedSections.attendance}
          onSave={() => saveSection('attendance')}
          disabledSave={!baseReady}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="سقف مرخصی ماهیانه" tooltip={ATTENDANCE_TOOLTIPS.monthlyLeaveCap}>
              <input
                type="number"
                value={template.attendance.monthlyLeaveCap}
                onChange={(e) =>
                  setTemplate((prev) => ({
                    ...prev,
                    attendance: { ...prev.attendance, monthlyLeaveCap: e.target.value },
                  }))
                }
                className="input-field"
              />
            </Field>
            <Field label="حداکثر انتقال مرخصی به سال بعد" tooltip={ATTENDANCE_TOOLTIPS.maxLeaveCarryToNextYear}>
              <input
                type="number"
                value={template.attendance.maxLeaveCarryToNextYear}
                onChange={(e) =>
                  setTemplate((prev) => ({
                    ...prev,
                    attendance: { ...prev.attendance, maxLeaveCarryToNextYear: e.target.value },
                  }))
                }
                className="input-field"
              />
            </Field>
            <Field label="سقف ساعت اضافه کاری ماهانه" tooltip={ATTENDANCE_TOOLTIPS.monthlyOvertimeCap}>
              <input
                type="number"
                value={template.attendance.monthlyOvertimeCap}
                onChange={(e) =>
                  setTemplate((prev) => ({
                    ...prev,
                    attendance: { ...prev.attendance, monthlyOvertimeCap: e.target.value },
                  }))
                }
                className="input-field"
              />
            </Field>
          </div>
        </SectionCard>

        {!hasPayrollPackage && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-200 mb-1">بخش حقوق و دستمزد قفل است</h3>
                <p className="text-xs text-amber-100/90 mb-3">
                  برای ثبت آیتم‌های حقوق و دستمزد ابتدا پکیج حقوق و دستمزد را خریداری کنید.
                </p>
                <button
                  onClick={() =>
                    navigate(
                      `/draft-templates/payroll-package?returnTo=${encodeURIComponent(
                        isEdit ? `/draft-templates/${template.id}` : '/draft-templates/add',
                      )}`,
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300 text-sm font-semibold"
                >
                  رفتن به خرید پکیج حقوق و دستمزد
                </button>
              </div>
            </div>
          </div>
        )}

        {hasPayrollPackage && (
          <>
            <SectionCard
              title="روش ورود اطلاعات حقوق و دستمزد"
              subtitle="انتخاب ثبت دستی یا حقوق توافقی"
              savedAt={template.savedSections.payroll_setup}
              onSave={() => saveSection('payroll_setup')}
              disabledSave={!baseReady}
            >
              <div className="mb-4">
                <div className="text-sm font-bold text-white mb-2">نوع پیش‌نویس حقوق و دستمزد</div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2">
                  {DRAFT_KIND_OPTIONS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      disabled={!item.enabled}
                      onClick={() =>
                        item.enabled &&
                        setTemplate((prev) => ({
                          ...prev,
                          payroll: { ...prev.payroll, draftKind: item.value },
                        }))
                      }
                      className={`rounded-xl border p-3 text-right transition-all ${
                        template.payroll.draftKind === item.value
                          ? 'bg-indigo-500/15 border-indigo-400/60 shadow-lg shadow-indigo-500/20'
                          : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                      } ${!item.enabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-bold text-white">{item.label}</div>
                        {!item.enabled && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200">
                            در حال توسعه
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTemplate((prev) => ({ ...prev, payroll: { ...prev.payroll, inputMode: 'manual' } }))}
                  className={`rounded-2xl border p-4 text-right transition-all ${
                    template.payroll.inputMode === 'manual'
                      ? 'bg-indigo-500/15 border-indigo-400/60 shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-sm font-bold text-white">ورود دستی همه اطلاعات</div>
                  <div className="text-xs text-slate-400 mt-1">تمام بخش‌ها قابل ویرایش هستند.</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTemplate((prev) => ({ ...prev, payroll: { ...prev.payroll, inputMode: 'agreed' } }))}
                  className={`rounded-2xl border p-4 text-right transition-all ${
                    template.payroll.inputMode === 'agreed'
                      ? 'bg-indigo-500/15 border-indigo-400/60 shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-sm font-bold text-white">تعیین حقوق توافقی</div>
                  <div className="text-xs text-slate-400 mt-1">فقط گزارش نمایش داده می‌شود.</div>
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-4 mt-4 space-y-3">
                <div className="text-sm font-bold text-white">انتخاب پرداخت‌های قانونی این قالب</div>
                <div className="text-xs text-slate-400">
                  هر گزینه را روشن/خاموش کنید. با خاموش شدن، تنظیمات همان بخش در فرم هم پنهان می‌شود.
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ToggleChip
                    checked={template.payroll.globalInsuranceEnabled}
                    label="پرداخت بیمه"
                    onChange={(checked) =>
                      setTemplate((prev) => ({
                        ...prev,
                        payroll: { ...prev.payroll, globalInsuranceEnabled: checked },
                      }))
                    }
                  />
                  <ToggleChip
                    checked={template.payroll.globalTaxEnabled}
                    label="پرداخت مالیات"
                    onChange={(checked) =>
                      setTemplate((prev) => ({
                        ...prev,
                        payroll: { ...prev.payroll, globalTaxEnabled: checked },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4">
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-3 space-y-2">
                  <div className="text-xs text-slate-400">
                    نرخ ساعتی (مزد مبنا ماهانه ÷ {STANDARD_MONTHLY_WORK_HOURS_FOR_HOURLY_RATE} ساعت)
                  </div>
                  {hasAppliedHourlyOverride ? (
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500 line-through">
                        {calculatedHourlyRate.toLocaleString('fa-IR', { maximumFractionDigits: 2 })} تومان
                      </div>
                      <div className="text-sm font-bold text-emerald-300">
                        {appliedHourlyRate.toLocaleString('fa-IR', { maximumFractionDigits: 2 })} تومان
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-white">
                      {calculatedHourlyRate.toLocaleString('fa-IR', { maximumFractionDigits: 2 })} تومان
                    </div>
                  )}
                  <div className="text-[11px] text-slate-500">مزد مبنا ماهانه: {formatMoney(baseWageMonthly)}</div>
                  <input
                    type="number"
                    value={effectiveHourlyRateDraft}
                    onChange={(e) =>
                      setTemplate((prev) => ({
                        ...prev,
                        payroll: { ...prev.payroll, hourlyRateOverrideDraft: e.target.value },
                      }))
                    }
                    placeholder="نرخ ساعتی (پیش‌فرض: محاسبه‌شده)"
                    className="input-field"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-slate-500">
                      فرمول پیش‌فرض نرخ ساعتی: مزد مبنا ماهانه ÷ {STANDARD_MONTHLY_WORK_HOURS_FOR_HOURLY_RATE}. در صورت
                      نیاز می‌توانید مقدار دستی ثبت کنید.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setTemplate((prev) => ({
                          ...prev,
                          payroll: { ...prev.payroll, hourlyRateOverrideDraft: calculatedHourlyRateDraftValue },
                        }))
                      }
                      className="shrink-0 px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20 text-[11px] text-slate-200"
                    >
                      اعمال مقدار محاسبه‌شده
                    </button>
                  </div>
                </div>
                <MiniStat label="حقوق ناخالص پرداختی (30 روز)" value={formatMoney(grossPay30)} />
                <MiniStat label="حقوق خالص پرداختی (30 روز)" value={formatMoney(netPay30)} />
              </div>

              {template.payroll.inputMode === 'agreed' && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="حقوق توافقی" tooltip={PAYROLL_SCALAR_TOOLTIPS.agreedWage}>
                      <input
                        type="number"
                        value={template.payroll.agreedWage}
                        onChange={(e) => setPayrollScalar('agreedWage', e.target.value)}
                        className="input-field"
                      />
                    </Field>
                    <Field label="مازاد حد اداره کار در کدام مزایا ثبت شود؟" tooltip={PAYROLL_SCALAR_TOOLTIPS.overMinWageBenefitTarget}>
                      <select
                        value={template.payroll.overMinWageBenefitTarget}
                        onChange={(e) => setPayrollScalar('overMinWageBenefitTarget', e.target.value)}
                        className="input-field"
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="attractionAllowance">حق جذب</option>
                        <option value="managementAllowance">حق مدیریت</option>
                        <option value="commuteAllowance">ایاب و ذهاب</option>
                        <option value="hardshipAllowance">سختی کار</option>
                        <option value="otherBenefits">سایر مزایا</option>
                      </select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <MiniStat label="جمع قانونی دریافتی" value={agreedAnalysis.legalTotal.toLocaleString('fa-IR')} />
                    <MiniStat label="حقوق توافقی" value={agreedAnalysis.agreedTotal.toLocaleString('fa-IR')} />
                    <MiniStat
                      label="مابه‌التفاوت توافقی"
                      value={agreedAnalysis.diff.toLocaleString('fa-IR')}
                    />
                  </div>

                  {agreedAnalysis.diff > 0 && template.payroll.overMinWageBenefitTarget === 'otherBenefits' && (
                    <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-100">انتخاب یا ایجاد اضافات ثابت برای مابه‌التفاوت</h4>
                        <button
                          type="button"
                          onClick={() => addFixedAdjustment('addition')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          اضافه ثابت جدید
                        </button>
                      </div>
                      {template.payroll.fixedAdjustments.filter((item) => item.kind === 'addition').length === 0 && (
                        <p className="text-xs text-slate-400">هنوز اضافه ثابتی ثبت نشده است.</p>
                      )}
                      {template.payroll.fixedAdjustments
                        .filter((item) => item.kind === 'addition')
                        .map((item) => (
                          <div key={item.id} className="bg-slate-900/40 border border-white/5 rounded-lg p-3 space-y-3">
                            <label className="flex items-center gap-2 text-xs text-slate-300">
                              <input
                                type="checkbox"
                                checked={template.payroll.agreedExtraAdditionIds.includes(item.id)}
                                onChange={() => toggleAgreedExtraAddition(item.id)}
                                disabled={item.calcType !== 'fixed'}
                              />
                              استفاده در مابه‌التفاوت توافقی
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                              <Field label="عنوان">
                                <input
                                  type="text"
                                  className="input-field"
                                  value={item.title}
                                  onChange={(e) => updateFixedAdjustment(item.id, { title: e.target.value })}
                                />
                              </Field>
                              <Field label="نوع محاسبه">
                                <select
                                  className="input-field"
                                  value={item.calcType}
                                  onChange={(e) => {
                                    const calcType = e.target.value as FixedAdjustmentItem['calcType'];
                                    updateFixedAdjustment(item.id, {
                                      calcType,
                                      baseWage: calcType === 'base_wage_factor' ? false : item.baseWage,
                                    });
                                  }}
                                >
                                  <option value="fixed">مبلغ ثابت</option>
                                  <option value="base_wage_factor">ضریبی از مزد مبنا</option>
                                </select>
                              </Field>
                              <Field label={item.calcType === 'fixed' ? 'مبلغ' : 'ضریب'}>
                                <input
                                  type="number"
                                  className="input-field"
                                  value={item.value}
                                  onChange={(e) => updateFixedAdjustment(item.id, { value: e.target.value })}
                                />
                              </Field>
                              <button
                                type="button"
                                onClick={() => removeFixedAdjustment(item.id)}
                                className="h-11 px-3 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-sm inline-flex items-center justify-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                حذف
                              </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                              {showInsuranceCoverageOptions && (
                                <ToggleChip
                                  checked={item.insurance}
                                  label="مشمول بیمه"
                                  onChange={(checked) => updateFixedAdjustment(item.id, { insurance: checked })}
                                />
                              )}
                              {showTaxCoverageOptions && (
                                <ToggleChip
                                  checked={item.tax}
                                  label="مشمول مالیات"
                                  onChange={(checked) => updateFixedAdjustment(item.id, { tax: checked })}
                                />
                              )}
                              <ToggleChip
                                checked={item.calcType === 'base_wage_factor' ? false : item.baseWage}
                                label="قابل احتساب در مزد مبنا"
                                onChange={(checked) => updateFixedAdjustment(item.id, { baseWage: checked })}
                                disabled={item.calcType === 'base_wage_factor'}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {agreedAnalysis.diff < 0 && (
                    <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-100">انتخاب یا ایجاد کسورات ثابت برای کسری توافقی</h4>
                        <button
                          type="button"
                          onClick={() => addFixedAdjustment('deduction')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          کسور ثابت جدید
                        </button>
                      </div>
                      {template.payroll.fixedAdjustments.filter((item) => item.kind === 'deduction').length === 0 && (
                        <p className="text-xs text-slate-400">هنوز کسور ثابتی ثبت نشده است.</p>
                      )}
                      {template.payroll.fixedAdjustments
                        .filter((item) => item.kind === 'deduction')
                        .map((item) => (
                          <div key={item.id} className="bg-slate-900/40 border border-white/5 rounded-lg p-3 space-y-3">
                            <label className="flex items-center gap-2 text-xs text-slate-300">
                              <input
                                type="checkbox"
                                checked={template.payroll.agreedDeficitDeductionIds.includes(item.id)}
                                onChange={() => toggleAgreedDeficitDeduction(item.id)}
                                disabled={item.calcType !== 'fixed'}
                              />
                              استفاده در کسری توافقی
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                              <Field label="عنوان">
                                <input
                                  type="text"
                                  className="input-field"
                                  value={item.title}
                                  onChange={(e) => updateFixedAdjustment(item.id, { title: e.target.value })}
                                />
                              </Field>
                              <Field label="نوع محاسبه">
                                <select
                                  className="input-field"
                                  value={item.calcType}
                                  onChange={(e) => {
                                    const calcType = e.target.value as FixedAdjustmentItem['calcType'];
                                    updateFixedAdjustment(item.id, {
                                      calcType,
                                      baseWage: calcType === 'base_wage_factor' ? false : item.baseWage,
                                    });
                                  }}
                                >
                                  <option value="fixed">مبلغ ثابت</option>
                                  <option value="base_wage_factor">ضریبی از مزد مبنا</option>
                                </select>
                              </Field>
                              <Field label={item.calcType === 'fixed' ? 'مبلغ' : 'ضریب'}>
                                <input
                                  type="number"
                                  className="input-field"
                                  value={item.value}
                                  onChange={(e) => updateFixedAdjustment(item.id, { value: e.target.value })}
                                />
                              </Field>
                              <button
                                type="button"
                                onClick={() => removeFixedAdjustment(item.id)}
                                className="h-11 px-3 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-sm inline-flex items-center justify-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                حذف
                              </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                              {showInsuranceCoverageOptions && (
                                <ToggleChip
                                  checked={item.insurance}
                                  label="مشمول بیمه"
                                  onChange={(checked) => updateFixedAdjustment(item.id, { insurance: checked })}
                                />
                              )}
                              {showTaxCoverageOptions && (
                                <ToggleChip
                                  checked={item.tax}
                                  label="مشمول مالیات"
                                  onChange={(checked) => updateFixedAdjustment(item.id, { tax: checked })}
                                />
                              )}
                              <ToggleChip
                                checked={item.calcType === 'base_wage_factor' ? false : item.baseWage}
                                label="قابل احتساب در مزد مبنا"
                                onChange={(checked) => updateFixedAdjustment(item.id, { baseWage: checked })}
                                disabled={item.calcType === 'base_wage_factor'}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </SectionCard>
            {template.payroll.inputMode === 'agreed' ? (
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 text-sm text-slate-300">
                در حالت «تعیین حقوق توافقی»، گزارش حقوق و دستمزد به‌صورت زنده در ستون سمت چپ نمایش داده می‌شود.
              </div>
            ) : (
              <>
                <SectionCard
                  title="مولفه‌های اصلی حکمی"
                  subtitle="ساعت موظفی و مزایای اصلی"
                  savedAt={template.savedSections.payroll_main}
                  onSave={() => saveSection('payroll_main')}
                  disabledSave={!baseReady}
                >
                  <Field label="ساعت موظفی در ماه (برای محاسبه نرخ ساعتی)" tooltip={PAYROLL_SCALAR_TOOLTIPS.monthlyRequiredHours}>
                    <input
                      type="number"
                      value={template.payroll.monthlyRequiredHours}
                      onChange={(e) => setPayrollScalar('monthlyRequiredHours', e.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                    <MiniStat label="معادل روزانه" value={perDay} />
                    <MiniStat label="معادل هفتگی (بر مبنای 6 روز)" value={perWeek} />
                  </div>
                  <div className="space-y-3">
                    {MAIN_COMPONENTS.map((item) => (
                      <PayrollFieldRow
                        key={item.key}
                        label={item.label}
                        tooltip={PAYROLL_FIELD_TOOLTIPS[item.key]}
                        field={template.payroll[item.key]}
                        showInsuranceToggle={showInsuranceCoverageOptions}
                        showTaxToggle={showTaxCoverageOptions}
                        onChange={(patch) => setPayrollField(item.key, patch)}
                      />
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="مزایای به تبع شغل"
                  subtitle="مزایای شغلی"
                  savedAt={template.savedSections.payroll_job_benefits}
                  onSave={() => saveSection('payroll_job_benefits')}
                  disabledSave={!baseReady}
                >
                  <div className="space-y-3">
                    {JOB_BENEFITS.map((item) => (
                      <PayrollFieldRow
                        key={item.key}
                        label={item.label}
                        tooltip={PAYROLL_FIELD_TOOLTIPS[item.key]}
                        field={template.payroll[item.key]}
                        showInsuranceToggle={showInsuranceCoverageOptions}
                        showTaxToggle={showTaxCoverageOptions}
                        onChange={(patch) => setPayrollField(item.key, patch)}
                      />
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="سایر مزایا"
                  subtitle="مزایای مستقل خارج از گروه مزایای شغلی"
                  savedAt={template.savedSections.payroll_other_benefits}
                  onSave={() => saveSection('payroll_other_benefits')}
                  disabledSave={!baseReady}
                >
                  <PayrollFieldRow
                    label="سایر مزایا"
                    tooltip={PAYROLL_FIELD_TOOLTIPS.otherBenefits}
                    field={template.payroll.otherBenefits}
                    showInsuranceToggle={showInsuranceCoverageOptions}
                    showTaxToggle={showTaxCoverageOptions}
                    onChange={(patch) => setPayrollField('otherBenefits', patch)}
                  />
                </SectionCard>

                <SectionCard
                  title="اضافات و کسورات ثابت"
                  subtitle="تعریف آیتم‌های مبلغ ثابت یا ضریب مزد مبنا"
                  savedAt={template.savedSections.payroll_fixed_adjustments}
                  onSave={() => saveSection('payroll_fixed_adjustments')}
                  disabledSave={!baseReady}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => addFixedAdjustment('addition')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      افزودن اضافه
                    </button>
                    <button
                      type="button"
                      onClick={() => addFixedAdjustment('deduction')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      افزودن کسور
                    </button>
                  </div>

                  {template.payroll.fixedAdjustments.length === 0 && (
                    <p className="text-xs text-slate-400">هنوز آیتمی ثبت نشده است.</p>
                  )}

                  <div className="space-y-3">
                    {template.payroll.fixedAdjustments.map((item) => (
                      <div key={item.id} className="bg-slate-800/40 border border-white/5 rounded-xl p-3 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                          <Field label="عنوان">
                            <input
                              type="text"
                              className="input-field"
                              value={item.title}
                              onChange={(e) => updateFixedAdjustment(item.id, { title: e.target.value })}
                            />
                          </Field>
                          <Field label="نوع آیتم">
                            <select
                              className="input-field"
                              value={item.kind}
                              onChange={(e) =>
                                updateFixedAdjustment(item.id, {
                                  kind: e.target.value as FixedAdjustmentItem['kind'],
                                })
                              }
                            >
                              <option value="addition">اضافه</option>
                              <option value="deduction">کسور</option>
                            </select>
                          </Field>
                          <Field label="روش محاسبه">
                            <select
                              className="input-field"
                              value={item.calcType}
                              onChange={(e) => {
                                const calcType = e.target.value as FixedAdjustmentItem['calcType'];
                                updateFixedAdjustment(item.id, {
                                  calcType,
                                  baseWage: calcType === 'base_wage_factor' ? false : item.baseWage,
                                });
                              }}
                            >
                              <option value="fixed">مبلغ ثابت</option>
                              <option value="base_wage_factor">ضریبی از مزد مبنا</option>
                            </select>
                          </Field>
                          <Field label={item.calcType === 'fixed' ? 'مبلغ' : 'ضریب'}>
                            <input
                              type="number"
                              className="input-field"
                              value={item.value}
                              onChange={(e) => updateFixedAdjustment(item.id, { value: e.target.value })}
                            />
                          </Field>
                          <button
                            type="button"
                            onClick={() => removeFixedAdjustment(item.id)}
                            className="h-11 px-3 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-sm inline-flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                          {showInsuranceCoverageOptions && (
                            <ToggleChip
                              checked={item.insurance}
                              label="مشمول بیمه"
                              onChange={(checked) => updateFixedAdjustment(item.id, { insurance: checked })}
                            />
                          )}
                          {showTaxCoverageOptions && (
                            <ToggleChip
                              checked={item.tax}
                              label="مشمول مالیات"
                              onChange={(checked) => updateFixedAdjustment(item.id, { tax: checked })}
                            />
                          )}
                          <ToggleChip
                            checked={item.calcType === 'base_wage_factor' ? false : item.baseWage}
                            label="قابل احتساب در مزد مبنا"
                            onChange={(checked) => updateFixedAdjustment(item.id, { baseWage: checked })}
                            disabled={item.calcType === 'base_wage_factor'}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="فوق العاده ضرایب زمانی"
                  subtitle="ضرایب اضافه‌کاری و شب‌کاری"
                  savedAt={template.savedSections.payroll_time_coeffs}
                  onSave={() => saveSection('payroll_time_coeffs')}
                  disabledSave={!baseReady}
                >
                  <div className="space-y-3">
                    {TIME_COEFFS.map((item) => (
                      <PayrollFieldRow
                        key={item.key}
                        label={item.label}
                        tooltip={PAYROLL_FIELD_TOOLTIPS[item.key]}
                        field={template.payroll[item.key]}
                        showInsuranceToggle={showInsuranceCoverageOptions}
                        showTaxToggle={showTaxCoverageOptions}
                        allowBaseWageToggle={false}
                        onChange={(patch) => setPayrollField(item.key, patch)}
                      />
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="فوق العاده نوبت کاری"
                  subtitle="درصد شیفت‌های نوبتی"
                  savedAt={template.savedSections.payroll_shift}
                  onSave={() => saveSection('payroll_shift')}
                  disabledSave={!baseReady}
                >
                  {(showInsuranceCoverageOptions || showTaxCoverageOptions) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      {showInsuranceCoverageOptions && (
                        <button
                          type="button"
                          onClick={() => setShiftCoverage('insurance', !shiftCoverage.insurance)}
                          className={`rounded-xl border p-3 text-right transition-all ${
                            shiftCoverage.insurance
                              ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-100'
                              : 'bg-rose-500/15 border-rose-400/50 text-rose-100'
                          }`}
                        >
                          <div className="text-sm font-semibold">
                            مشمول بیمه {shiftCoverage.insurance ? 'فعال' : 'غیرفعال'}
                          </div>
                          <div className="text-xs opacity-80 mt-1">این تنظیم برای تمام آیتم‌های نوبت‌کاری اعمال می‌شود.</div>
                        </button>
                      )}
                      {showTaxCoverageOptions && (
                        <button
                          type="button"
                          onClick={() => setShiftCoverage('tax', !shiftCoverage.tax)}
                          className={`rounded-xl border p-3 text-right transition-all ${
                            shiftCoverage.tax
                              ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-100'
                              : 'bg-rose-500/15 border-rose-400/50 text-rose-100'
                          }`}
                        >
                          <div className="text-sm font-semibold">
                            مشمول مالیات {shiftCoverage.tax ? 'فعال' : 'غیرفعال'}
                          </div>
                          <div className="text-xs opacity-80 mt-1">این تنظیم برای تمام آیتم‌های نوبت‌کاری اعمال می‌شود.</div>
                        </button>
                      )}
                    </div>
                  )}
                  {((showInsuranceCoverageOptions && !shiftCoverage.insurance) ||
                    (showTaxCoverageOptions && !shiftCoverage.tax)) && (
                    <div className="mb-3 text-xs text-rose-200 bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
                      هشدار: غیرفعال کردن بیمه یا مالیات در نوبت‌کاری می‌تواند منجر به جریمه مالیاتی شود.
                    </div>
                  )}
                  <div className="space-y-3">
                    {SHIFT_BENEFITS.map((item) => (
                      <PayrollFieldRow
                        key={item.key}
                        label={item.label}
                        tooltip={PAYROLL_FIELD_TOOLTIPS[item.key]}
                        field={template.payroll[item.key]}
                        allowInsuranceToggle={false}
                        allowTaxToggle={false}
                        allowBaseWageToggle={false}
                        onChange={(patch) => setPayrollField(item.key, patch)}
                      />
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  title="مبالغ عیدی و حق سنوات"
                  subtitle="تنظیمات عیدی و سنوات"
                  savedAt={template.savedSections.payroll_legal}
                  onSave={() => saveSection('payroll_legal')}
                  disabledSave={!baseReady}
                >
                  <p className="text-xs text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-3">
                    عیدی پیش‌فرض: حداقل دو برابر آخرین مزد مبنا و حداکثر معادل 90 روز حداقل مزد روزانه. قابل ویرایش است.
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <PayrollFieldRow
                        label="عیدی"
                        tooltip={PAYROLL_FIELD_TOOLTIPS.eydi}
                        field={template.payroll.eydi}
                        showInsuranceToggle={showInsuranceCoverageOptions}
                        showTaxToggle={showTaxCoverageOptions}
                        allowBaseWageToggle={false}
                        onChange={(patch) => setPayrollField('eydi', patch)}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setTemplate((prev) => ({
                              ...prev,
                              payroll: { ...prev.payroll, eydiPayoutMode: 'monthly' as EydiPayoutMode },
                            }))
                          }
                          className={`rounded-xl border p-3 text-sm text-right transition-all ${
                            template.payroll.eydiPayoutMode === 'monthly'
                              ? 'bg-indigo-500/15 border-indigo-400/60 text-white'
                              : 'bg-slate-800/40 border-white/10 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          پرداخت ماهانه
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setTemplate((prev) => ({
                              ...prev,
                              payroll: { ...prev.payroll, eydiPayoutMode: 'yearly' as EydiPayoutMode },
                            }))
                          }
                          className={`rounded-xl border p-3 text-sm text-right transition-all ${
                            template.payroll.eydiPayoutMode === 'yearly'
                              ? 'bg-indigo-500/15 border-indigo-400/60 text-white'
                              : 'bg-slate-800/40 border-white/10 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          پرداخت سالانه
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <PayrollFieldRow
                        label="حق سنوات"
                        tooltip={PAYROLL_FIELD_TOOLTIPS.severancePay}
                        field={template.payroll.severancePay}
                        showInsuranceToggle={showInsuranceCoverageOptions}
                        showTaxToggle={showTaxCoverageOptions}
                        allowBaseWageToggle={false}
                        onChange={(patch) => setPayrollField('severancePay', patch)}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setTemplate((prev) => ({
                              ...prev,
                              payroll: { ...prev.payroll, severancePayoutMode: 'monthly' as SeverancePayoutMode },
                            }))
                          }
                          className={`rounded-xl border p-3 text-sm text-right transition-all ${
                            template.payroll.severancePayoutMode === 'monthly'
                              ? 'bg-indigo-500/15 border-indigo-400/60 text-white'
                              : 'bg-slate-800/40 border-white/10 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          پرداخت ماهانه
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setTemplate((prev) => ({
                              ...prev,
                              payroll: {
                                ...prev.payroll,
                                severancePayoutMode: 'end_of_cooperation' as SeverancePayoutMode,
                              },
                            }))
                          }
                          className={`rounded-xl border p-3 text-sm text-right transition-all ${
                            template.payroll.severancePayoutMode === 'end_of_cooperation'
                              ? 'bg-indigo-500/15 border-indigo-400/60 text-white'
                              : 'bg-slate-800/40 border-white/10 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          پرداخت پایان همکاری
                        </button>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  title="کسورات قانونی و حدود بیمه / مالیات"
                  subtitle="نرخ‌های بیمه و مالیات"
                  savedAt={template.savedSections.payroll_deductions}
                  onSave={() => saveSection('payroll_deductions')}
                  disabledSave={!baseReady}
                >
                  {!showInsuranceCoverageOptions && !showTaxCoverageOptions && (
                    <div className="text-xs text-slate-300 bg-slate-800/50 border border-white/10 rounded-lg p-3">
                      چون «پرداخت بیمه» و «پرداخت مالیات» خاموش هستند، تنظیمات این بخش نمایش داده نمی‌شود.
                    </div>
                  )}

                  {showInsuranceCoverageOptions && (
                    <>
                      <div className="mb-3 text-xs text-slate-200 bg-slate-800/50 border border-white/10 rounded-lg p-3">
                        سهم بیمه کارگر و کارفرما سرجمع باید 30 درصد باشد.
                      </div>
                      {insuranceRateTotal !== 30 && (
                        <div className="mb-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-200 rounded-lg p-3">
                          {insuranceRateTotal < 30
                            ? `هشدار: جمع نرخ بیمه‌ها ${insuranceRateTotal}٪ است و کمتر از 30٪ می‌باشد.`
                            : `هشدار: جمع نرخ بیمه‌ها ${insuranceRateTotal}٪ است و بیشتر از 30٪ می‌باشد.`}
                        </div>
                      )}
                    </>
                  )}

                  {visibleDeductionFields.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {visibleDeductionFields.map((item) => (
                        <Field key={item.key} label={item.label} tooltip={PAYROLL_SCALAR_TOOLTIPS[item.key]}>
                          <input
                            type="number"
                            value={template.payroll[item.key]}
                            onChange={(e) => setPayrollScalar(item.key, e.target.value)}
                            className="input-field"
                          />
                        </Field>
                      ))}
                    </div>
                  )}

                  {showTaxCoverageOptions && (
                    <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-100">پله های مالیات حقوق</h4>
                        <button
                          onClick={() =>
                            setTemplate((prev) => ({
                              ...prev,
                              payroll: {
                                ...prev.payroll,
                                taxBrackets: normalizeTaxBrackets(prev.payroll.monthlyTaxExemption, [
                                  ...prev.payroll.taxBrackets,
                                  { id: `tax-${Date.now()}`, start: '', end: '', rate: '' },
                                ]),
                              },
                            }))
                          }
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          افزودن پله
                        </button>
                      </div>

                      {template.payroll.taxBrackets.map((bracket, idx) => (
                        <div key={bracket.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                          <Field label={`پله ${idx + 1} - مبلغ شروع`}>
                            <input type="text" className="input-field opacity-70" value={bracket.start} readOnly />
                          </Field>
                          <Field label="مبلغ پایان">
                            <input
                              type="number"
                              className="input-field"
                              value={bracket.end}
                              onChange={(e) =>
                                setTemplate((prev) => {
                                  const next = prev.payroll.taxBrackets.map((row) =>
                                    row.id === bracket.id ? { ...row, end: e.target.value } : row,
                                  );
                                  return {
                                    ...prev,
                                    payroll: {
                                      ...prev.payroll,
                                      taxBrackets: normalizeTaxBrackets(prev.payroll.monthlyTaxExemption, next),
                                    },
                                  };
                                })
                              }
                            />
                          </Field>
                          <Field label="درصد">
                            <input
                              type="number"
                              className="input-field"
                              value={bracket.rate}
                              onChange={(e) =>
                                setTemplate((prev) => ({
                                  ...prev,
                                  payroll: {
                                    ...prev.payroll,
                                    taxBrackets: prev.payroll.taxBrackets.map((row) =>
                                      row.id === bracket.id ? { ...row, rate: e.target.value } : row,
                                    ),
                                  },
                                }))
                              }
                            />
                          </Field>
                          <button
                            onClick={() =>
                              setTemplate((prev) => {
                                if (prev.payroll.taxBrackets.length <= 1) return prev;
                                return {
                                  ...prev,
                                  payroll: {
                                    ...prev.payroll,
                                    taxBrackets: normalizeTaxBrackets(
                                      prev.payroll.monthlyTaxExemption,
                                      prev.payroll.taxBrackets.filter((row) => row.id !== bracket.id),
                                    ),
                                  },
                                };
                              })
                            }
                            disabled={template.payroll.taxBrackets.length <= 1}
                            className="h-11 px-3 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف پله
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>
              </>
            )}
          </>
        )}
          </>
        ) : (
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 text-sm text-slate-300">
            برای ادامه، ابتدا «عنوان» و «توضیحات» بخش اطلاعات پایه را وارد کنید.
          </div>
        )}
          </div>
          {canShowLiveReport && <div className="hidden xl:block" aria-hidden />}
        </div>
        {canShowLiveReport && (
          <div className="hidden xl:block fixed left-4 top-24 bottom-4 w-[23rem] z-30">
            <PayrollLiveReportPanel
              template={template}
              agreedAnalysis={agreedAnalysis}
              grossPay30={grossPay30}
              workerInsuranceAmount={workerInsuranceAmount}
              estimatedTaxAmount={estimatedTaxAmount}
              netPay30={netPay30}
              showInsuranceCoverageOptions={showInsuranceCoverageOptions}
              showTaxCoverageOptions={showTaxCoverageOptions}
            />
          </div>
        )}
        {canShowLiveReport && (
          <>
            <button
              type="button"
              onClick={() => setIsMobileReportOpen((prev) => !prev)}
              className="xl:hidden fixed left-4 bottom-20 z-40 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-slate-900/90 backdrop-blur text-slate-100 shadow-lg"
            >
              <BarChart3 className="w-4 h-4" />
              گزارش
            </button>

            <div
              className={`xl:hidden fixed inset-0 z-50 transition-opacity ${isMobileReportOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <button
                type="button"
                aria-label="بستن گزارش"
                onClick={() => setIsMobileReportOpen(false)}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px]"
              />
              <div
                className={`absolute inset-y-0 left-0 w-[min(24rem,88vw)] p-3 transition-transform duration-300 ${
                  isMobileReportOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                <div className="h-full bg-slate-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5">
                    <div className="text-sm font-bold text-white">گزارش حقوق و دستمزد</div>
                    <button
                      type="button"
                      onClick={() => setIsMobileReportOpen(false)}
                      className="p-2 rounded-lg hover:bg-white/5 text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-hidden p-3">
                    <PayrollLiveReportPanel
                      template={template}
                      agreedAnalysis={agreedAnalysis}
                      grossPay30={grossPay30}
                      workerInsuranceAmount={workerInsuranceAmount}
                      estimatedTaxAmount={estimatedTaxAmount}
                      netPay30={netPay30}
                      showInsuranceCoverageOptions={showInsuranceCoverageOptions}
                      showTaxCoverageOptions={showTaxCoverageOptions}
                      compact
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  sticky,
  children,
}: {
  title: string;
  subtitle: string;
  savedAt?: string;
  onSave?: () => void;
  disabledSave?: boolean;
  sticky?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`bg-slate-900/40 border border-white/5 rounded-2xl p-4 sm:p-6 ${
        sticky ? 'sticky top-3 z-30 backdrop-blur-sm' : ''
      }`}
    >
      <div className="mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function PayrollLiveReportPanel({
  template,
  agreedAnalysis,
  grossPay30,
  workerInsuranceAmount,
  estimatedTaxAmount,
  netPay30,
  showInsuranceCoverageOptions,
  showTaxCoverageOptions,
  compact = false,
}: {
  template: DraftTemplate;
  agreedAnalysis: AgreedAnalysis;
  grossPay30: number;
  workerInsuranceAmount: number;
  estimatedTaxAmount: number;
  netPay30: number;
  showInsuranceCoverageOptions: boolean;
  showTaxCoverageOptions: boolean;
  compact?: boolean;
}) {
  const groups: Array<{ title: string; items: Array<{ key: PayrollFieldKey; label: string }> }> = [
    { title: 'مولفه‌های اصلی', items: MAIN_COMPONENTS },
    { title: 'مزایای شغلی', items: JOB_BENEFITS },
    { title: 'عیدی و سنوات', items: LEGAL_FIELDS },
  ];
  const fixedAdjustments = template.payroll.fixedAdjustments;

  return (
    <section className={`bg-slate-900/40 border border-white/5 rounded-2xl ${compact ? 'p-3' : 'p-3.5'} h-full flex flex-col gap-3`}>
      <div>
        <h2 className="text-sm font-bold text-white">گزارش حقوق و دستمزد</h2>
        <p className="text-[11px] text-slate-400 mt-1">نمایش زنده مقادیر با هر تغییر فرم</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <CompactReportCell label="ناخالص ۳۰ روز" value={formatMoney(grossPay30)} />
        <CompactReportCell
          label="بیمه سهم کارگر"
          value={showInsuranceCoverageOptions ? formatMoney(workerInsuranceAmount) : 'غیرفعال'}
        />
        <CompactReportCell label="مالیات تخمینی" value={showTaxCoverageOptions ? formatMoney(estimatedTaxAmount) : 'غیرفعال'} />
        <CompactReportCell label="خالص ۳۰ روز" value={formatMoney(netPay30)} />
      </div>

      {template.payroll.inputMode === 'agreed' && (
        <div className="grid grid-cols-1 gap-2">
          <CompactReportRow label="جمع قانونی دریافتی" value={agreedAnalysis.legalTotal.toLocaleString('fa-IR')} />
          <CompactReportRow label="حقوق توافقی" value={agreedAnalysis.agreedTotal.toLocaleString('fa-IR')} />
          <CompactReportRow label="مابه‌التفاوت توافقی" value={agreedAnalysis.diff.toLocaleString('fa-IR')} />
        </div>
      )}

      <div className="space-y-2 min-h-0 flex-1 overflow-y-auto scrollbar-hidden pr-1">
        {groups.map((group) => (
          <div key={group.title} className="bg-slate-800/40 border border-white/5 rounded-xl p-2.5">
            <h3 className="text-xs font-bold text-slate-100 mb-2">{group.title}</h3>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const supportsBaseWage = !DERIVED_FROM_BASE_WAGE_FIELD_KEYS.includes(item.key);
                return (
                  <div key={item.key} className="rounded-lg border border-white/5 bg-slate-900/30 px-2 py-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="text-slate-100 font-semibold">
                        {agreedAnalysis.finalFieldValues[item.key].toLocaleString('fa-IR')}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      <CoverageBadge
                        label="بیمه"
                        active={showInsuranceCoverageOptions && template.payroll[item.key].insurance}
                        disabled={!showInsuranceCoverageOptions}
                      />
                      <CoverageBadge
                        label="مالیات"
                        active={showTaxCoverageOptions && template.payroll[item.key].tax}
                        disabled={!showTaxCoverageOptions}
                      />
                      {supportsBaseWage && <CoverageBadge label="مزد مبنا" active={template.payroll[item.key].baseWage} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-slate-800/40 border border-white/5 rounded-xl p-2.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-400">سایر مزایا</span>
            <span className="text-slate-100 font-semibold">
              {agreedAnalysis.finalFieldValues.otherBenefits.toLocaleString('fa-IR')}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1">
            <CoverageBadge
              label="بیمه"
              active={showInsuranceCoverageOptions && template.payroll.otherBenefits.insurance}
              disabled={!showInsuranceCoverageOptions}
            />
            <CoverageBadge
              label="مالیات"
              active={showTaxCoverageOptions && template.payroll.otherBenefits.tax}
              disabled={!showTaxCoverageOptions}
            />
            <CoverageBadge label="مزد مبنا" active={template.payroll.otherBenefits.baseWage} />
          </div>
        </div>

        {fixedAdjustments.length > 0 && (
          <div className="bg-slate-800/40 border border-white/5 rounded-xl p-2.5">
            <h3 className="text-xs font-bold text-slate-100 mb-2">اضافات و کسورات ثابت</h3>
            <div className="space-y-1.5">
              {fixedAdjustments.map((item) => {
                const kindLabel = item.kind === 'addition' ? 'اضافه' : 'کسور';
                const calcLabel = item.calcType === 'fixed' ? 'مبلغ' : 'ضریب';
                return (
                  <div key={item.id} className="rounded-lg border border-white/5 bg-slate-900/30 px-2 py-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-300 truncate">{item.title || `بدون عنوان (${kindLabel})`}</span>
                      <span className="text-slate-100 font-semibold whitespace-nowrap">
                        {calcLabel}: {toNumber(item.value).toLocaleString('fa-IR')}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      <span
                        className={`px-1.5 py-0.5 rounded border text-[10px] ${
                          item.kind === 'addition'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        }`}
                      >
                        {kindLabel}
                      </span>
                      <CoverageBadge label="بیمه" active={showInsuranceCoverageOptions && item.insurance} disabled={!showInsuranceCoverageOptions} />
                      <CoverageBadge label="مالیات" active={showTaxCoverageOptions && item.tax} disabled={!showTaxCoverageOptions} />
                      <CoverageBadge
                        label="مزد مبنا"
                        active={item.calcType === 'fixed' && item.baseWage}
                        disabled={item.calcType !== 'fixed'}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CompactReportCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/45 border border-white/5 rounded-lg p-2">
      <div className="text-[10px] text-slate-500 mb-1 leading-4">{label}</div>
      <div className="text-xs font-semibold text-slate-100 leading-5">{value}</div>
    </div>
  );
}

function CompactReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/35 border border-white/5 rounded-lg px-2.5 py-2 flex items-center justify-between gap-2 text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-100 font-semibold">{value}</span>
    </div>
  );
}

function CoverageBadge({ label, active, disabled }: { label: string; active: boolean; disabled?: boolean }) {
  if (disabled) {
    return (
      <span className="px-1.5 py-0.5 rounded border border-white/10 text-[10px] text-slate-500 bg-slate-800/40">
        {label}: غیرفعال
      </span>
    );
  }
  return (
    <span
      className={`px-1.5 py-0.5 rounded border text-[10px] ${
        active
          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
          : 'bg-slate-700/30 text-slate-300 border-white/10'
      }`}
    >
      {label}: {active ? 'دارد' : 'ندارد'}
    </span>
  );
}

function PayrollReadonlyReport({
  template,
  agreedAnalysis,
  perDay,
  perWeek,
}: {
  template: DraftTemplate;
  agreedAnalysis: AgreedAnalysis;
  perDay: string;
  perWeek: string;
}) {
  const selectedTarget = OVER_MIN_WAGE_TARGET_LABELS[template.payroll.overMinWageBenefitTarget] ?? 'ثبت نشده';
  const eydiModeLabel = template.payroll.eydiPayoutMode === 'monthly' ? 'پرداخت ماهانه' : 'پرداخت سالانه';
  const severanceModeLabel =
    template.payroll.severancePayoutMode === 'monthly' ? 'پرداخت ماهانه' : 'پرداخت پایان همکاری';
  const insuranceEnabled = template.payroll.globalInsuranceEnabled ?? true;
  const taxEnabled = template.payroll.globalTaxEnabled ?? true;
  const visibleDeductionFields = DEDUCTION_FIELDS.filter(
    (item) =>
      (insuranceEnabled && INSURANCE_DEDUCTION_FIELD_KEYS.has(item.key)) ||
      (taxEnabled && TAX_DEDUCTION_FIELD_KEYS.has(item.key)),
  );
  const reportGroups: Array<{ title: string; items: Array<{ key: PayrollFieldKey; label: string }> }> = [
    { title: 'مولفه‌های اصلی حکمی', items: MAIN_COMPONENTS },
    { title: 'مزایای به تبع شغل', items: JOB_BENEFITS },
    { title: 'فوق العاده ضرایب زمانی', items: TIME_COEFFS },
    { title: 'فوق العاده نوبت کاری', items: SHIFT_BENEFITS },
    { title: 'مبالغ عیدی و حق سنوات', items: LEGAL_FIELDS },
  ];

  return (
    <section className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 sm:p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">گزارش حقوق و دستمزد</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          در حالت «تعیین حقوق توافقی»، بخش‌های زیر فقط نمایشی هستند و امکان ویرایش ندارند.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ReportItem label="جمع قانونی دریافتی" value={agreedAnalysis.legalTotal.toLocaleString('fa-IR')} />
        <ReportItem label="حقوق توافقی" value={agreedAnalysis.agreedTotal.toLocaleString('fa-IR')} />
        <ReportItem label="مابه‌التفاوت توافقی" value={agreedAnalysis.diff.toLocaleString('fa-IR')} />
        <ReportItem label="ثبت مازاد حد اداره کار در" value={selectedTarget} />
        <ReportItem label="روش پرداخت عیدی" value={eydiModeLabel} />
        <ReportItem label="روش پرداخت سنوات" value={severanceModeLabel} />
        <ReportItem label="پرداخت بیمه" value={insuranceEnabled ? 'فعال' : 'غیرفعال'} />
        <ReportItem label="پرداخت مالیات" value={taxEnabled ? 'فعال' : 'غیرفعال'} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MiniStat label="معادل روزانه" value={perDay} />
        <MiniStat label="معادل هفتگی (بر مبنای 6 روز)" value={perWeek} />
              </div>

      {reportGroups.map((group) => (
        <div key={group.title} className="bg-slate-800/40 border border-white/5 rounded-xl p-4">
          <h3 className="text-sm font-bold text-slate-100 mb-3">{group.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.items.map((item) => (
              <ReportItem
                key={item.key}
                label={item.label}
                value={agreedAnalysis.finalFieldValues[item.key].toLocaleString('fa-IR')}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4">
        <h3 className="text-sm font-bold text-slate-100 mb-3">سایر مزایا</h3>
        <ReportItem label="سایر مزایا" value={agreedAnalysis.finalFieldValues.otherBenefits.toLocaleString('fa-IR')} />
      </div>

      <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4">
        <h3 className="text-sm font-bold text-slate-100 mb-3">کسورات قانونی و حدود بیمه / مالیات</h3>
        {!insuranceEnabled && !taxEnabled ? (
          <p className="text-xs text-slate-400">
            چون «پرداخت بیمه» و «پرداخت مالیات» غیرفعال هستند، تنظیمات این بخش در گزارش نمایش داده نمی‌شود.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] border ${
                  insuranceEnabled
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    : 'bg-slate-700/30 text-slate-300 border-white/10'
                }`}
              >
                پرداخت بیمه: {insuranceEnabled ? 'فعال' : 'غیرفعال'}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] border ${
                  taxEnabled
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    : 'bg-slate-700/30 text-slate-300 border-white/10'
                }`}
              >
                پرداخت مالیات: {taxEnabled ? 'فعال' : 'غیرفعال'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {visibleDeductionFields.map((item) => (
                <ReportItem key={item.key} label={item.label} value={template.payroll[item.key] || '-'} />
              ))}
            </div>
          </div>
        )}
      </div>

      {taxEnabled ? (
        <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-bold text-slate-100">پله های مالیات حقوق</h3>
          {template.payroll.taxBrackets.map((bracket, idx) => (
            <div key={bracket.id} className="text-xs text-slate-300">
              پله {idx + 1}: شروع {bracket.start || '-'} | پایان {bracket.end || '-'} | درصد {bracket.rate || '-'}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4">
          <p className="text-xs text-slate-400">پرداخت مالیات غیرفعال است؛ پله‌های مالیات در گزارش نمایش داده نمی‌شود.</p>
        </div>
      )}

      {agreedAnalysis.diff > 0 && template.payroll.overMinWageBenefitTarget === 'otherBenefits' && (
        <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-bold text-slate-100">اضافات ثابت انتخاب‌شده برای مابه‌التفاوت</h3>
          {agreedAnalysis.selectedExtraAdditions.length === 0 ? (
            <p className="text-xs text-slate-400">آیتمی انتخاب نشده است.</p>
          ) : (
            agreedAnalysis.selectedExtraAdditions.map((item) => (
              <div key={item.id} className="text-xs text-slate-300">
                {item.title || 'بدون عنوان'} | مبلغ ثابت: {toNumber(item.value).toLocaleString('fa-IR')} | بیمه:{' '}
                {item.insurance ? 'بله' : 'خیر'} | مالیات: {item.tax ? 'بله' : 'خیر'} | مزد مبنا:{' '}
                {item.baseWage ? 'بله' : 'خیر'}
              </div>
            ))
          )}
        </div>
      )}

      {agreedAnalysis.diff < 0 && (
        <div className="bg-slate-800/40 border border-white/5 rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-bold text-slate-100">کسورات ثابت انتخاب‌شده برای کسری توافقی</h3>
          {agreedAnalysis.selectedDeficitDeductions.length === 0 ? (
            <p className="text-xs text-slate-400">آیتمی انتخاب نشده است.</p>
          ) : (
            agreedAnalysis.selectedDeficitDeductions.map((item) => (
              <div key={item.id} className="text-xs text-slate-300">
                {item.title || 'بدون عنوان'} | مبلغ ثابت: {toNumber(item.value).toLocaleString('fa-IR')} | بیمه:{' '}
                {item.insurance ? 'بله' : 'خیر'} | مالیات: {item.tax ? 'بله' : 'خیر'} | مزد مبنا:{' '}
                {item.baseWage ? 'بله' : 'خیر'}
              </div>
            ))
          )}
        </div>
      )}

      <p className="text-xs text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
        برای ویرایش جزئیات حقوق و دستمزد، روش ورود را روی «ورود دستی همه اطلاعات» قرار دهید.
      </p>
    </section>
  );
}

function Field({
  label,
  required,
  tooltip,
  children,
}: {
  label: string;
  required?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-slate-300 inline-flex items-center gap-1.5">
        <span>{label}</span>
        {tooltip && <InfoHint text={tooltip} />}
        {required && <span className="text-rose-400 mr-1">*</span>}
      </span>
      {children}
    </label>
  );
}

function ReportItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-3">
      <div className="text-[11px] text-slate-500 mb-1">{label}</div>
      <div className="text-sm font-semibold text-slate-100">{value}</div>
    </div>
  );
}

function ToggleChip({
  checked,
  label,
  onChange,
  disabled,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
        checked
          ? 'bg-emerald-500/15 border-emerald-400/60 text-emerald-100'
          : 'bg-slate-800/50 border-white/15 text-slate-300 hover:border-white/30'
      } ${disabled ? 'opacity-45 cursor-not-allowed' : ''}`}
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className={`w-4 h-4 rounded-full border inline-flex items-center justify-center text-[10px] ${
            checked ? 'border-emerald-300 text-emerald-200' : 'border-slate-500 text-slate-400'
          }`}
        >
          {checked ? '✓' : ''}
        </span>
        {label}
      </span>
    </button>
  );
}

function InfoHint({ text }: { text: string }) {
  return (
    <span
      title={text}
      className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-white/20 text-slate-400 hover:text-slate-200 hover:border-white/40 cursor-help"
    >
      <Info className="w-3 h-3" />
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-3">
      <div className="text-[11px] text-slate-500 mb-1">{label}</div>
      <div className="text-sm font-semibold text-slate-100">{value}</div>
    </div>
  );
}

function PayrollFieldRow({
  label,
  tooltip,
  field,
  allowInsuranceToggle = true,
  allowTaxToggle = true,
  showInsuranceToggle = true,
  showTaxToggle = true,
  allowBaseWageToggle = true,
  onChange,
}: {
  label: string;
  tooltip?: string;
  field: PayrollField;
  allowInsuranceToggle?: boolean;
  allowTaxToggle?: boolean;
  showInsuranceToggle?: boolean;
  showTaxToggle?: boolean;
  allowBaseWageToggle?: boolean;
  onChange: (patch: Partial<PayrollField>) => void;
}) {
  return (
    <div className="bg-slate-800/40 border border-white/5 rounded-xl p-3 space-y-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-center">
        <div className="text-sm text-slate-200 font-medium inline-flex items-center gap-1.5">
          <span>{label}</span>
          {tooltip && <InfoHint text={tooltip} />}
        </div>
        <input
          type="number"
          className="input-field"
          value={field.value}
          onChange={(e) => onChange({ value: e.target.value })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
        {allowInsuranceToggle && showInsuranceToggle && (
          <ToggleChip checked={field.insurance} label="مشمول بیمه" onChange={(checked) => onChange({ insurance: checked })} />
        )}
        {allowTaxToggle && showTaxToggle && (
          <ToggleChip checked={field.tax} label="مشمول مالیات" onChange={(checked) => onChange({ tax: checked })} />
        )}
        {allowBaseWageToggle && (
          <ToggleChip
            checked={field.baseWage}
            label="قابل احتساب در مزد مبنا"
            onChange={(checked) => onChange({ baseWage: checked })}
          />
        )}
      </div>
    </div>
  );
}
