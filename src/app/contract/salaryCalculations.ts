import type { MonthlyFixedAgreement, SalaryCalculation, Employee } from './types';

// ثابت‌های قانونی سال ۱۴۰۳
export const LEGAL_CONSTANTS_2026 = {
  minimumDailyWage: 2083333, // حداقل دستمزد روزانه (ریال)
  seniorityBaseDailyRate: 233333, // پایه سنوات روزانه (ریال)
  housingAllowanceMonthly: 9000000, // حق مسکن ماهیانه (ریال)
  foodAllowanceMonthly: 14000000, // بن خواربار ماهیانه (ریال)
  maritalAllowanceMonthly: 5000000, // حق تاهل ماهیانه (ریال)
  workingHoursPerMonth: 176, // ساعات موظفی در ماه
  calculationHoursPerMonth: 220, // ساعات محاسباتی (شامل تعطیلات)
  employeeInsuranceRate: 0.07, // نرخ بیمه کارمند (7%)
  employerInsuranceRate: 0.23, // نرخ بیمه کارفرما (23%)
  insuranceCeiling: 7, // سقف بیمه (7 برابر حداقل دستمزد)
  monthlyTaxExemption: 12500000, // معافیت مالیاتی ماهانه (ریال)
};

export type SurplusAllocationTarget = 'attraction' | 'other';

type GrossUpArrangementResult = {
  updatedAgreement: MonthlyFixedAgreement;
  minimumRequiredTotal: number;
  allocatedSurplus: number;
  isFeasible: boolean;
};

export function autoArrangeAgreementByTotal(
  agreement: MonthlyFixedAgreement,
  agreedTotalAmount: number,
  surplusAllocation: SurplusAllocationTarget
): GrossUpArrangementResult {
  const minimumBaseSalary = LEGAL_CONSTANTS_2026.minimumDailyWage * 30;
  const minimumRequiredTotal =
    minimumBaseSalary +
    LEGAL_CONSTANTS_2026.seniorityBaseDailyRate * 30 +
    LEGAL_CONSTANTS_2026.housingAllowanceMonthly +
    LEGAL_CONSTANTS_2026.foodAllowanceMonthly +
    LEGAL_CONSTANTS_2026.maritalAllowanceMonthly;

  const normalizedTotal = Math.max(0, Math.floor(agreedTotalAmount));
  const allocatedSurplus = Math.max(0, normalizedTotal - minimumRequiredTotal);

  const updatedAgreement: MonthlyFixedAgreement = {
    ...agreement,
    entryMode: 'total-agreed',
    agreedTotalAmount: normalizedTotal,
    surplusAllocation,
    baseSalary: minimumBaseSalary,
    seniorityBase: LEGAL_CONSTANTS_2026.seniorityBaseDailyRate,
    housingAllowance: LEGAL_CONSTANTS_2026.housingAllowanceMonthly,
    foodAllowance: LEGAL_CONSTANTS_2026.foodAllowanceMonthly,
    maritalAllowance: LEGAL_CONSTANTS_2026.maritalAllowanceMonthly,
    attractionAllowance: surplusAllocation === 'attraction' ? allocatedSurplus : 0,
    managementAllowance: 0,
    transportAllowance: 0,
    hardshipAllowance: 0,
    otherAllowance: surplusAllocation === 'other' ? allocatedSurplus : 0,
  };

  return {
    updatedAgreement,
    minimumRequiredTotal,
    allocatedSurplus,
    isFeasible: normalizedTotal >= minimumRequiredTotal,
  };
}

/**
 * محاسبه حقوق کامل براساس توافق ثابت ماهیانه
 */
export function calculateMonthlySalary(
  agreement: MonthlyFixedAgreement,
  employee: Employee,
  workingDays: number = 30,
  yearsOfService: number = 0
): SalaryCalculation {
  const constants = LEGAL_CONSTANTS_2026;
  
  // 1. مولفه‌های اصلی حکمی
  const baseSalary = (agreement.baseSalary / 30) * workingDays;
  
  // محاسبه پایه سنوات تجمیعی (براساس سال‌های سابقه)
  const seniorityPay = yearsOfService > 0 
    ? (agreement.seniorityBase * workingDays) 
    : 0;
  
  const housingAllowance = (agreement.housingAllowance / 30) * workingDays;
  const foodAllowance = (agreement.foodAllowance / 30) * workingDays;
  
  // حق اولاد: 3 برابر حداقل دستمزد روزانه به ازای هر فرزند
  const childAllowance = employee.childrenCount > 0
    ? employee.childrenCount * agreement.childAllowancePerChild * workingDays
    : 0;
  
  // حق تاهل: فقط برای متاهلین
  const maritalAllowance = employee.maritalStatus === 'married'
    ? (agreement.maritalAllowance / 30) * workingDays
    : 0;
  
  // 2. مزایای به تبع شغل
  const attractionAllowance = (agreement.attractionAllowance / 30) * workingDays;
  const managementAllowance = (agreement.managementAllowance / 30) * workingDays;
  const transportAllowance = (agreement.transportAllowance / 30) * workingDays;
  const hardshipAllowance = (agreement.hardshipAllowance / 30) * workingDays;
  const otherAllowance = (agreement.otherAllowance / 30) * workingDays;
  
  // 3. فوق‌العاده نوبت‌کاری
  const activeShift = Object.entries(agreement.shiftModels).find(
    ([_, model]) => model.enabled
  );
  const shiftAllowance = activeShift
    ? ((baseSalary + seniorityPay) * activeShift[1].percent) / 100
    : 0;
  
  // 4. مزد مبنا (برای محاسبه نرخ ساعتی) - براساس مولفه‌های فعال شده
  let wageBase = 0;
  if (agreement.wageBaseComponents.baseSalary) wageBase += baseSalary;
  if (agreement.wageBaseComponents.seniorityBase) wageBase += seniorityPay;
  if (agreement.wageBaseComponents.attractionAllowance) wageBase += attractionAllowance;
  if (agreement.wageBaseComponents.managementAllowance) wageBase += managementAllowance;
  if (agreement.wageBaseComponents.transportAllowance) wageBase += transportAllowance;
  if (agreement.wageBaseComponents.hardshipAllowance) wageBase += hardshipAllowance;
  
  // 5. نرخ ساعتی
  const hourlyRate = wageBase / constants.calculationHoursPerMonth;
  
  // 6. جمع ناخالص (بدون عیدی و سنوات)
  let grossSalary = baseSalary + seniorityPay + housingAllowance + 
                    foodAllowance + childAllowance + maritalAllowance +
                    attractionAllowance + managementAllowance + 
                    transportAllowance + hardshipAllowance + otherAllowance +
                    shiftAllowance;
  
  // 7. عیدی ماهانه (اگر فعال باشد)
  let bonusMonthly = 0;
  if (agreement.bonusPaymentType === 'monthly') {
    const bonusAmount = Math.min(
      baseSalary * agreement.bonusMonths,
      constants.minimumDailyWage * 3 * 30
    );
    bonusMonthly = bonusAmount / 12;
    grossSalary += bonusMonthly;
  }
  
  // 8. سنوات ماهانه (اگر فعال باشد)
  let severanceMonthly = 0;
  if (agreement.severancePaymentType === 'monthly' && yearsOfService > 0) {
    severanceMonthly = (baseSalary * yearsOfService) / 12;
    grossSalary += severanceMonthly;
  }
  
  // 9. کسورات - بیمه
  // اقلام مشمول بیمه: همه به جز حق اولاد و سنوات پایان خدمت
  const insurableAmount = baseSalary + seniorityPay + housingAllowance + 
                          foodAllowance + maritalAllowance + attractionAllowance +
                          managementAllowance + transportAllowance + 
                          hardshipAllowance + otherAllowance + shiftAllowance;
  
  // سقف بیمه
  const insuranceCeiling = constants.minimumDailyWage * constants.insuranceCeiling * 30;
  const cappedInsurableAmount = Math.min(insurableAmount, insuranceCeiling);
  
  const insuranceDeduction = cappedInsurableAmount * constants.employeeInsuranceRate;
  
  // 10. کسورات - مالیات
  // اقلام مشمول مالیات: همه به جز سنوات پایان خدمت
  const taxableAmount = grossSalary - severanceMonthly;
  const taxableAfterExemption = Math.max(0, taxableAmount - agreement.taxExemption);
  
  // محاسبه مالیات پلکانی (ساده‌شده)
  let taxDeduction = 0;
  if (taxableAfterExemption > 0) {
    if (taxableAfterExemption <= 50000000) {
      taxDeduction = taxableAfterExemption * 0.10;
    } else if (taxableAfterExemption <= 100000000) {
      taxDeduction = 5000000 + (taxableAfterExemption - 50000000) * 0.15;
    } else {
      taxDeduction = 12500000 + (taxableAfterExemption - 100000000) * 0.20;
    }
  }
  
  // 11. حقوق خالص
  const totalDeductions = insuranceDeduction + taxDeduction;
  const netSalary = grossSalary - totalDeductions;
  
  // 12. هزینه کارفرما
  const employerInsurance = cappedInsurableAmount * constants.employerInsuranceRate;
  const totalCostToCompany = grossSalary + employerInsurance;
  
  return {
    grossSalary,
    baseSalary,
    seniorityPay,
    housingAllowance,
    foodAllowance,
    childAllowance,
    maritalAllowance,
    attractionAllowance,
    managementAllowance,
    transportAllowance,
    hardshipAllowance,
    otherAllowance,
    shiftAllowance,
    bonusMonthly,
    severanceMonthly,
    insuranceDeduction,
    taxDeduction,
    totalDeductions,
    netSalary,
    employerInsurance,
    totalCostToCompany,
    hourlyRate,
  };
}

/**
 * محاسبه اضافه‌کاری با ضریب سفارشی
 */
export function calculateOvertime(
  hourlyRate: number,
  overtimeHours: number,
  coefficient: number = 1.4
): number {
  return overtimeHours * hourlyRate * coefficient;
}

/**
 * محاسبه جمعه‌کاری با ضریب سفارشی
 */
export function calculateFridayWork(
  hourlyRate: number,
  fridayHours: number,
  isOvertime: boolean,
  coefficientWithOvertime: number = 1.8,
  coefficientNoOvertime: number = 1.4
): number {
  const multiplier = isOvertime ? coefficientWithOvertime : coefficientNoOvertime;
  return fridayHours * hourlyRate * multiplier;
}

/**
 * محاسبه شب‌کاری با ضریب سفارشی
 */
export function calculateNightWork(
  hourlyRate: number,
  nightHours: number,
  coefficient: number = 1.35
): number {
  return nightHours * hourlyRate * coefficient;
}

/**
 * محاسبه تعطیل‌کاری با ضریب سفارشی
 */
export function calculateHolidayWork(
  hourlyRate: number,
  holidayHours: number,
  coefficient: number = 1.4
): number {
  return holidayHours * hourlyRate * coefficient;
}

/**
 * فرمت کردن اعداد به فارسی
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fa-IR').format(Math.round(value));
}

/**
 * تبدیل ریال به تومان
 */
export function toToman(rials: number): number {
  return rials / 10;
}
