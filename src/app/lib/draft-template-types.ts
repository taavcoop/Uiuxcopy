export type TemplateStatus = 'active' | 'archived';
export type PayrollInputMode = 'manual' | 'agreed';
export type FixedAdjustmentKind = 'addition' | 'deduction';
export type FixedAdjustmentCalcType = 'fixed' | 'base_wage_factor';

export interface TaxBracket {
  id: string;
  start: string;
  end: string;
  rate: string;
}

export interface PayrollField {
  value: string;
  insurance: boolean;
  tax: boolean;
  baseWage: boolean;
}

export interface FixedAdjustmentItem {
  id: string;
  title: string;
  kind: FixedAdjustmentKind;
  calcType: FixedAdjustmentCalcType;
  value: string;
  insurance: boolean;
  tax: boolean;
  baseWage: boolean;
}

export interface DraftTemplateAttendance {
  monthlyLeaveCap: string;
  maxLeaveCarryToNextYear: string;
  monthlyOvertimeCap: string;
}

export interface DraftTemplatePayroll {
  inputMode: PayrollInputMode;
  agreedWage: string;
  overMinWageBenefitTarget: string;
  monthlyRequiredHours: string;

  baseSalary: PayrollField;
  seniorityBase: PayrollField;
  housingAllowance: PayrollField;
  foodAllowance: PayrollField;
  childAllowancePerChild: PayrollField;
  marriageAllowance: PayrollField;

  attractionAllowance: PayrollField;
  managementAllowance: PayrollField;
  commuteAllowance: PayrollField;
  hardshipAllowance: PayrollField;
  otherBenefits: PayrollField;

  overtimeFactor: PayrollField;
  nightWorkFactor1: PayrollField;
  nightWorkFactor2: PayrollField;
  holidayWorkFactor: PayrollField;
  fridayWorkFactorWithOvertime: PayrollField;
  fridayWorkFactorWithoutOvertime: PayrollField;

  morningEveningShiftPercent: PayrollField;
  morningEveningNightShiftPercent: PayrollField;
  morningNightShiftPercent: PayrollField;
  eveningNightShiftPercent: PayrollField;

  eydi: PayrollField;
  severancePay: PayrollField;

  workerInsuranceRate: string;
  employerInsuranceRate: string;
  unemploymentInsuranceRate: string;
  insuranceCapMultiplier: string;
  monthlyTaxExemption: string;
  taxBrackets: TaxBracket[];

  fixedAdjustments: FixedAdjustmentItem[];
  agreedExtraAdditionIds: string[];
  agreedDeficitDeductionIds: string[];
}

export interface DraftTemplate {
  id: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  isPeriodEndOpen: boolean;
  description: string;
  attendance: DraftTemplateAttendance;
  payroll: DraftTemplatePayroll;
  status: TemplateStatus;
  createdAt: string;
  updatedAt: string;
  savedSections: Record<string, string>;
}

const createPayrollField = (value = ''): PayrollField => ({
  value,
  insurance: true,
  tax: true,
  baseWage: false,
});

export const createEmptyDraftTemplate = (): DraftTemplate => ({
  id: `tmpl-${Date.now()}`,
  title: '',
  periodStart: '',
  periodEnd: '',
  isPeriodEndOpen: false,
  description: '',
  attendance: {
    monthlyLeaveCap: '',
    maxLeaveCarryToNextYear: '',
    monthlyOvertimeCap: '',
  },
  payroll: {
    inputMode: 'manual',
    agreedWage: '',
    overMinWageBenefitTarget: '',
    monthlyRequiredHours: '',

    baseSalary: createPayrollField(),
    seniorityBase: createPayrollField(),
    housingAllowance: createPayrollField(),
    foodAllowance: createPayrollField(),
    childAllowancePerChild: createPayrollField(),
    marriageAllowance: createPayrollField(),

    attractionAllowance: createPayrollField(),
    managementAllowance: createPayrollField(),
    commuteAllowance: createPayrollField(),
    hardshipAllowance: createPayrollField(),
    otherBenefits: createPayrollField(),

    overtimeFactor: createPayrollField('1.4'),
    nightWorkFactor1: createPayrollField('1.35'),
    nightWorkFactor2: createPayrollField('1.10'),
    holidayWorkFactor: createPayrollField('1.4'),
    fridayWorkFactorWithOvertime: createPayrollField('1.4'),
    fridayWorkFactorWithoutOvertime: createPayrollField('1.2'),

    morningEveningShiftPercent: createPayrollField('10'),
    morningEveningNightShiftPercent: createPayrollField('22.5'),
    morningNightShiftPercent: createPayrollField('22.5'),
    eveningNightShiftPercent: createPayrollField('22.5'),

    eydi: createPayrollField('2'),
    severancePay: createPayrollField('1'),

    workerInsuranceRate: '7',
    employerInsuranceRate: '23',
    unemploymentInsuranceRate: '3',
    insuranceCapMultiplier: '7',
    monthlyTaxExemption: '',
    taxBrackets: [
      {
        id: `tax-${Date.now()}`,
        start: '',
        end: '',
        rate: '',
      },
    ],
    fixedAdjustments: [],
    agreedExtraAdditionIds: [],
    agreedDeficitDeductionIds: [],
  },
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  savedSections: {},
});

export const createMockDraftTemplates = (): DraftTemplate[] => {
  const first = createEmptyDraftTemplate();
  first.id = 'tmpl-1001';
  first.title = 'قرارداد آزمایشی کارمندان اداری';
  first.periodStart = '2025-03-21';
  first.periodEnd = '';
  first.isPeriodEndOpen = true;
  first.description = 'نسخه پیش‌نویس قرارداد سال جدید برای تیم اداری.';
  first.attendance.monthlyLeaveCap = '2.5';
  first.attendance.maxLeaveCarryToNextYear = '9';
  first.attendance.monthlyOvertimeCap = '60';
  first.savedSections.base = new Date().toISOString();
  first.savedSections.attendance = new Date().toISOString();

  const second = createEmptyDraftTemplate();
  second.id = 'tmpl-1002';
  second.title = 'پیش‌نویس قرارداد شیفتی واحد عملیات';
  second.periodStart = '2025-05-01';
  second.periodEnd = '2026-03-20';
  second.isPeriodEndOpen = false;
  second.description = 'برای واحد عملیات با ساختار شیفت و اضافه‌کاری محدود.';
  second.attendance.monthlyLeaveCap = '2';
  second.attendance.maxLeaveCarryToNextYear = '6';
  second.attendance.monthlyOvertimeCap = '80';
  second.status = 'archived';
  second.savedSections.base = new Date().toISOString();
  second.savedSections.attendance = new Date().toISOString();

  return [first, second];
};
