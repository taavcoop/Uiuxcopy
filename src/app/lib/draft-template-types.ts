export type TemplateStatus = 'active' | 'archived';
export type PayrollInputMode = 'manual' | 'agreed';
export type PayrollDraftKind = 'monthly_fixed' | 'daily_wage' | 'hourly' | 'project' | 'consulting';
export type FixedAdjustmentKind = 'addition' | 'deduction';
export type FixedAdjustmentCalcType = 'fixed' | 'base_wage_factor';
export type EydiPayoutMode = 'monthly' | 'yearly';
export type SeverancePayoutMode = 'monthly' | 'end_of_cooperation';
export type LaborOfficeReferencePayrollFieldKey =
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

export type LaborOfficeReferenceMode = 'apply' | 'warning';

export interface LaborOfficeReferenceSelection {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  appliedAt: string;
  mode: LaborOfficeReferenceMode;
}

export interface DraftTemplateAttendance {
  monthlyLeaveCap: string;
  maxLeaveCarryToNextYear: string;
  monthlyOvertimeCap: string;
}

export interface DraftTemplatePayroll {
  inputMode: PayrollInputMode;
  draftKind: PayrollDraftKind;
  agreedWage: string;
  overMinWageBenefitTarget: string;
  monthlyRequiredHours: string;
  hourlyRateOverrideDraft: string;
  hourlyRateOverride: string;
  globalInsuranceEnabled: boolean;
  globalTaxEnabled: boolean;

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
  eydiPayoutMode: EydiPayoutMode;
  severancePayoutMode: SeverancePayoutMode;

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
  description: string;
  laborOfficeReference: LaborOfficeReferenceSelection | null;
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
  description: '',
  laborOfficeReference: null,
  attendance: {
    monthlyLeaveCap: '',
    maxLeaveCarryToNextYear: '',
    monthlyOvertimeCap: '',
  },
  payroll: {
    inputMode: 'manual',
    draftKind: 'monthly_fixed',
    agreedWage: '',
    overMinWageBenefitTarget: '',
    monthlyRequiredHours: '',
    hourlyRateOverrideDraft: '',
    hourlyRateOverride: '',
    globalInsuranceEnabled: true,
    globalTaxEnabled: true,

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
    eydiPayoutMode: 'yearly',
    severancePayoutMode: 'end_of_cooperation',

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

export interface LaborOfficeReferencePreset {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  attendance: Partial<DraftTemplateAttendance>;
  payrollScalarValues: Partial<
    Pick<
      DraftTemplatePayroll,
      | 'monthlyRequiredHours'
      | 'workerInsuranceRate'
      | 'employerInsuranceRate'
      | 'unemploymentInsuranceRate'
      | 'insuranceCapMultiplier'
      | 'monthlyTaxExemption'
    >
  >;
  payrollFieldValues: Partial<Record<LaborOfficeReferencePayrollFieldKey, string>>;
  taxBrackets: Array<Pick<TaxBracket, 'start' | 'end' | 'rate'>>;
}

export const LABOR_OFFICE_REFERENCE_PRESETS: LaborOfficeReferencePreset[] = [
  {
    id: 'labor-office-1404',
    title: 'مرجع اداره کار ۱۴۰۴',
    startDate: '2025-03-21',
    endDate: '2026-03-20',
    attendance: {
      monthlyLeaveCap: '2.5',
      maxLeaveCarryToNextYear: '9',
      monthlyOvertimeCap: '60',
    },
    payrollScalarValues: {
      monthlyRequiredHours: '220',
      workerInsuranceRate: '7',
      employerInsuranceRate: '20',
      unemploymentInsuranceRate: '3',
      insuranceCapMultiplier: '7',
      monthlyTaxExemption: '240000000',
    },
    payrollFieldValues: {
      baseSalary: '71661840',
      seniorityBase: '2100000',
      housingAllowance: '9000000',
      foodAllowance: '14000000',
      childAllowancePerChild: '7166184',
      marriageAllowance: '5000000',
      overtimeFactor: '1.4',
      nightWorkFactor1: '1.35',
      nightWorkFactor2: '1.10',
      holidayWorkFactor: '1.4',
      fridayWorkFactorWithOvertime: '1.4',
      fridayWorkFactorWithoutOvertime: '1.2',
      morningEveningShiftPercent: '10',
      morningEveningNightShiftPercent: '22.5',
      morningNightShiftPercent: '22.5',
      eveningNightShiftPercent: '22.5',
      eydi: '2',
      severancePay: '1',
    },
    taxBrackets: [
      { start: '', end: '240000000', rate: '0' },
      { start: '', end: '300000000', rate: '10' },
      { start: '', end: '380000000', rate: '15' },
      { start: '', end: '', rate: '20' },
    ],
  },
  {
    id: 'labor-office-1403',
    title: 'مرجع اداره کار ۱۴۰۳',
    startDate: '2024-03-20',
    endDate: '2025-03-20',
    attendance: {
      monthlyLeaveCap: '2.5',
      maxLeaveCarryToNextYear: '9',
      monthlyOvertimeCap: '60',
    },
    payrollScalarValues: {
      monthlyRequiredHours: '220',
      workerInsuranceRate: '7',
      employerInsuranceRate: '20',
      unemploymentInsuranceRate: '3',
      insuranceCapMultiplier: '7',
      monthlyTaxExemption: '120000000',
    },
    payrollFieldValues: {
      baseSalary: '53082338',
      seniorityBase: '2100000',
      housingAllowance: '9000000',
      foodAllowance: '14000000',
      childAllowancePerChild: '5308233',
      marriageAllowance: '5000000',
      overtimeFactor: '1.4',
      nightWorkFactor1: '1.35',
      nightWorkFactor2: '1.10',
      holidayWorkFactor: '1.4',
      fridayWorkFactorWithOvertime: '1.4',
      fridayWorkFactorWithoutOvertime: '1.2',
      morningEveningShiftPercent: '10',
      morningEveningNightShiftPercent: '22.5',
      morningNightShiftPercent: '22.5',
      eveningNightShiftPercent: '22.5',
      eydi: '2',
      severancePay: '1',
    },
    taxBrackets: [
      { start: '', end: '120000000', rate: '0' },
      { start: '', end: '165000000', rate: '10' },
      { start: '', end: '270000000', rate: '15' },
      { start: '', end: '', rate: '20' },
    ],
  },
];

export const getLaborOfficeReferencePresetById = (id: string): LaborOfficeReferencePreset | null =>
  LABOR_OFFICE_REFERENCE_PRESETS.find((item) => item.id === id) ?? null;

export const createMockDraftTemplates = (): DraftTemplate[] => {
  const first = createEmptyDraftTemplate();
  first.id = 'tmpl-1001';
  first.title = 'قرارداد آزمایشی کارمندان اداری';
  first.description = 'نسخه پیش‌نویس قرارداد سال جدید برای تیم اداری.';
  first.attendance.monthlyLeaveCap = '2.5';
  first.attendance.maxLeaveCarryToNextYear = '9';
  first.attendance.monthlyOvertimeCap = '60';
  first.laborOfficeReference = {
    id: 'labor-office-1404',
    title: 'مرجع اداره کار ۱۴۰۴',
    startDate: '2025-03-21',
    endDate: '2026-03-20',
    appliedAt: new Date().toISOString(),
    mode: 'apply',
  };
  first.savedSections.base = new Date().toISOString();
  first.savedSections.attendance = new Date().toISOString();

  const second = createEmptyDraftTemplate();
  second.id = 'tmpl-1002';
  second.title = 'پیش‌نویس قرارداد شیفتی واحد عملیات';
  second.description = 'برای واحد عملیات با ساختار شیفت و اضافه‌کاری محدود.';
  second.attendance.monthlyLeaveCap = '2';
  second.attendance.maxLeaveCarryToNextYear = '6';
  second.attendance.monthlyOvertimeCap = '80';
  second.status = 'archived';
  second.savedSections.base = new Date().toISOString();
  second.savedSections.attendance = new Date().toISOString();

  return [first, second];
};
