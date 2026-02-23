// Employee Types
export type Employee = {
  id: string;
  name: string;
  position: string;
  nationalCode: string;
  hireDate: string;
  personnelCode: string;
  maritalStatus: 'single' | 'married';
  childrenCount: number;
};

// Agreement Types
export type AgreementType = 
  | 'monthly-fixed'      // ثابت ماهیانه
  | 'daily-wage'         // روزمزد
  | 'hourly'             // ساعتی
  | 'project-based'      // پروژه‌ای
  | 'consulting';        // مشاوره‌ای

// Monthly Fixed Agreement Components
export type MonthlyFixedAgreement = {
  type: 'monthly-fixed';
  entryMode: 'breakdown' | 'total-agreed'; // روش ورود: دستی یا مبلغ کل توافقی
  agreedTotalAmount: number; // مبلغ کل توافقی ماهانه
  surplusAllocation: 'attraction' | 'other'; // محل تخصیص باقیمانده در حالت مبلغ کل
  
  // مولفه‌های اصلی حکمی
  baseSalary: number;                    // مزد ماهانه (حقوق پایه)
  seniorityBase: number;                 // پایه سنوات (روزانه)
  housingAllowance: number;              // حق مسکن
  foodAllowance: number;                 // بن خواربار
  childAllowancePerChild: number;        // حق اولاد به ازای هر فرزند
  maritalAllowance: number;              // حق تاهل
  
  // مزایای به تبع شغل
  attractionAllowance: number;           // حق جذب / فوق‌العاده شغل
  managementAllowance: number;           // حق مدیریت و مسئولیت
  transportAllowance: number;            // حق ایاب و ذهاب
  hardshipAllowance: number;             // فوق‌العاده سختی کار
  otherAllowance: number;                // سایر مزایا
  
  // نوبت‌کاری (شیفت‌های مختلف)
  shiftModels: {
    twoShifts: { enabled: boolean; percent: number };        // صبح و عصر
    threeShifts: { enabled: boolean; percent: number };      // صبح، عصر و شب
    dayNight: { enabled: boolean; percent: number };         // صبح و شب
    afternoonNight: { enabled: boolean; percent: number };   // عصر و شب
  };
  
  // ضرایب فوق‌العاده‌ها
  coefficients: {
    overtime: number;           // اضافه‌کاری (پیش‌فرض: 1.4)
    nightWork: number;          // شب‌کاری (پیش‌فرض: 1.35)
    holidayWork: number;        // تعطیل‌کاری (پیش‌فرض: 1.4)
    fridayWork: number;         // جمعه‌کاری (پیش‌فرض: 1.8)
    fridayWorkNoOvertime: number; // جمعه‌کاری بدون اضافه‌کاری (پیش‌فرض: 1.4)
  };
  
  // فوق‌العاده مأموریت
  missionAllowance: {
    enabled: boolean;
    minimumDailyRate: number;   // حداقل مزد روزانه (پیش‌فرض قانونی)
  };
  
  // مولفه‌های موثر در مزد مبنا
  wageBaseComponents: {
    baseSalary: boolean;
    seniorityBase: boolean;
    attractionAllowance: boolean;
    managementAllowance: boolean;
    transportAllowance: boolean;
    hardshipAllowance: boolean;
  };
  
  // تنظیمات پرداخت
  bonusMonths: number;                   // تعداد ماه عیدی (معمولا 2)
  bonusPaymentType: 'monthly' | 'annual'; // نحوه پرداخت عیدی
  severancePaymentType: 'monthly' | 'end-of-service'; // نحوه پرداخت سنوات
  leavesBuyback: boolean;                // بازخرید مرخصی ماهانه
  
  // کسورات
  insuranceRate: number;                 // نرخ بیمه کارمند (معمولا 7%)
  taxExemption: number;                  // معافیت مالیاتی ماهانه
};

// Default Agreement (Year-based)
export type DefaultYearlyAgreement = {
  year: number;
  agreement: MonthlyFixedAgreement;
};

// Saved Template (Reusable, not year-specific)
export type SavedAgreementTemplate = {
  id: string;
  name: string;
  description?: string;
  agreement: MonthlyFixedAgreement;
  createdAt: string;
};

// Employee-specific Agreement
export type EmployeeAgreement = {
  id: string;
  employeeId: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD (optional => open-ended)
  agreement: MonthlyFixedAgreement;
  templateId?: string; // اگر از تمپلیت استفاده شده
};

// Calculation Results
export type SalaryCalculation = {
  // ناخالص
  grossSalary: number;
  
  // جزئیات درآمد
  baseSalary: number;
  seniorityPay: number;
  housingAllowance: number;
  foodAllowance: number;
  childAllowance: number;
  maritalAllowance: number;
  attractionAllowance: number;
  managementAllowance: number;
  transportAllowance: number;
  hardshipAllowance: number;
  otherAllowance: number;
  shiftAllowance: number;
  bonusMonthly: number;
  severanceMonthly: number;
  
  // کسورات
  insuranceDeduction: number;
  taxDeduction: number;
  totalDeductions: number;
  
  // نهایی
  netSalary: number;
  
  // هزینه کارفرما
  employerInsurance: number; // 23%
  totalCostToCompany: number;
  
  // نرخ‌ها
  hourlyRate: number;
};
