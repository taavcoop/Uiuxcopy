import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight,
  FileText,
  Wallet,
  CheckCircle2,
  CreditCard,
  User,
  Building2,
  Calendar,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

type PayrollState = {
  employeeName: string;
  nationalId: string;
  personnelCode: string;
  jobTitle: string;
  department: string;
  payPeriod: string;
  workDays: number;
  baseWage: number;
  jobAllowance: number;
  fixedAllowance: number;
  housingAllowance: number;
  foodAllowance: number;
  childAllowance: number;
  overtime: number;
  otherAdditions: number;
  insuranceDeduction: number;
  taxDeduction: number;
  otherDeductions: number;
};

const initialState: PayrollState = {
  employeeName: "علی محمدی",
  nationalId: "0012345678",
  personnelCode: "HR-0214",
  jobTitle: "کارشناس منابع انسانی",
  department: "منابع انسانی",
  payPeriod: "بهمن ۱۴۰۴",
  workDays: 30,
  baseWage: 180000000,
  jobAllowance: 15000000,
  fixedAllowance: 10000000,
  housingAllowance: 9000000,
  foodAllowance: 11000000,
  childAllowance: 5000000,
  overtime: 7000000,
  otherAdditions: 3000000,
  insuranceDeduction: 12000000,
  taxDeduction: 8000000,
  otherDeductions: 2000000,
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(Math.max(0, Math.round(value)));

const toNumber = (value: string) => {
  const cleaned = value.replace(/[^\d]/g, "");
  return cleaned ? Number(cleaned) : 0;
};

const NumberInput = ({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
}) => (
  <label className="flex flex-col gap-2 text-sm text-slate-200">
    <span className="font-medium">{label}</span>
    <input
      inputMode="numeric"
      value={formatMoney(value)}
      onChange={(event) => onChange(toNumber(event.target.value))}
      className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/50"
    />
    {hint ? <span className="text-[11px] text-slate-500">{hint}</span> : null}
  </label>
);

export default function PayrollContract() {
  const navigate = useNavigate();
  const [state, setState] = useState<PayrollState>(initialState);

  const totals = useMemo(() => {
    const fixedIncome = state.baseWage + state.jobAllowance + state.fixedAllowance;
    const variableIncome =
      state.housingAllowance +
      state.foodAllowance +
      state.childAllowance +
      state.overtime +
      state.otherAdditions;
    const gross = fixedIncome + variableIncome;
    const deductions =
      state.insuranceDeduction + state.taxDeduction + state.otherDeductions;
    const net = Math.max(0, gross - deductions);
    return { fixedIncome, variableIncome, gross, deductions, net };
  }, [state]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              فرم قرارداد حقوق و دستمزد
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              با تغییر فرم، پیش‌نمایش فیش حقوقی در سمت راست به‌روز می‌شود.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          {/* Form */}
          <div className="space-y-6">
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-white">
                <User className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold">مشخصات پرسنل</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  <span className="font-medium">نام و نام خانوادگی</span>
                  <input
                    value={state.employeeName}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, employeeName: e.target.value }))
                    }
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/50"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  <span className="font-medium">کد ملی</span>
                  <input
                    value={state.nationalId}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, nationalId: e.target.value }))
                    }
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/50"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  <span className="font-medium">کد پرسنلی</span>
                  <input
                    value={state.personnelCode}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, personnelCode: e.target.value }))
                    }
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/50"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  <span className="font-medium">واحد سازمانی</span>
                  <input
                    value={state.department}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, department: e.target.value }))
                    }
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/50"
                  />
                </label>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold">اطلاعات شغلی</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  <span className="font-medium">عنوان شغل</span>
                  <input
                    value={state.jobTitle}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, jobTitle: e.target.value }))
                    }
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/50"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  <span className="font-medium">دوره پرداخت</span>
                  <input
                    value={state.payPeriod}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, payPeriod: e.target.value }))
                    }
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/50"
                  />
                </label>
                <NumberInput
                  label="روزهای کارکرد"
                  value={state.workDays}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, workDays: value }))
                  }
                  hint="تعداد روزهای کارکرد در دوره"
                />
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 text-white">
                <Wallet className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold">اقلام حقوق ثابت</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberInput
                  label="مزد شغل (پایه حقوق)"
                  value={state.baseWage}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, baseWage: value }))
                  }
                />
                <NumberInput
                  label="مزایای ثابت به تبع شغل"
                  value={state.fixedAllowance}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, fixedAllowance: value }))
                  }
                />
                <NumberInput
                  label="حق شغل / سختی کار"
                  value={state.jobAllowance}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, jobAllowance: value }))
                  }
                />
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 text-white">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold">مزایا و پرداختی‌های متغیر</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberInput
                  label="کمک‌هزینه مسکن"
                  value={state.housingAllowance}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, housingAllowance: value }))
                  }
                />
                <NumberInput
                  label="بن خواربار"
                  value={state.foodAllowance}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, foodAllowance: value }))
                  }
                />
                <NumberInput
                  label="حق اولاد"
                  value={state.childAllowance}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, childAllowance: value }))
                  }
                />
                <NumberInput
                  label="اضافه‌کاری"
                  value={state.overtime}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, overtime: value }))
                  }
                />
                <NumberInput
                  label="سایر مزایا"
                  value={state.otherAdditions}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, otherAdditions: value }))
                  }
                />
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
                <h2 className="text-lg font-bold">کسورات قانونی</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberInput
                  label="بیمه"
                  value={state.insuranceDeduction}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, insuranceDeduction: value }))
                  }
                />
                <NumberInput
                  label="مالیات"
                  value={state.taxDeduction}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, taxDeduction: value }))
                  }
                />
                <NumberInput
                  label="سایر کسورات"
                  value={state.otherDeductions}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, otherDeductions: value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-bold">پیش‌نمایش فیش حقوقی</h2>
                </div>
                <span className="text-xs text-slate-400">{state.payPeriod}</span>
              </div>

              <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>نام پرسنل</span>
                  <span className="text-slate-100 font-semibold">
                    {state.employeeName || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>کد پرسنلی</span>
                  <span className="text-slate-100 font-semibold">
                    {state.personnelCode || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>واحد سازمانی</span>
                  <span className="text-slate-100 font-semibold">
                    {state.department || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>عنوان شغل</span>
                  <span className="text-slate-100 font-semibold">
                    {state.jobTitle || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>روزهای کارکرد</span>
                  <span className="text-slate-100 font-semibold">
                    {formatMoney(state.workDays)} روز
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  اقلام حقوق ثابت
                </div>
                <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 space-y-2 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>پایه حقوق</span>
                    <span>{formatMoney(state.baseWage)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>حق شغل</span>
                    <span>{formatMoney(state.jobAllowance)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>مزایای ثابت</span>
                    <span>{formatMoney(state.fixedAllowance)}</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 flex items-center justify-between font-semibold text-slate-100">
                    <span>جمع حقوق ثابت</span>
                    <span>{formatMoney(totals.fixedIncome)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <ClipboardList className="w-4 h-4 text-indigo-400" />
                  مزایای متغیر
                </div>
                <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 space-y-2 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>مسکن</span>
                    <span>{formatMoney(state.housingAllowance)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>بن خواربار</span>
                    <span>{formatMoney(state.foodAllowance)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>حق اولاد</span>
                    <span>{formatMoney(state.childAllowance)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>اضافه‌کاری</span>
                    <span>{formatMoney(state.overtime)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>سایر مزایا</span>
                    <span>{formatMoney(state.otherAdditions)}</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 flex items-center justify-between font-semibold text-slate-100">
                    <span>جمع مزایای متغیر</span>
                    <span>{formatMoney(totals.variableIncome)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  کسورات
                </div>
                <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 space-y-2 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>بیمه</span>
                    <span>{formatMoney(state.insuranceDeduction)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>مالیات</span>
                    <span>{formatMoney(state.taxDeduction)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>سایر کسورات</span>
                    <span>{formatMoney(state.otherDeductions)}</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 flex items-center justify-between font-semibold text-slate-100">
                    <span>جمع کسورات</span>
                    <span>{formatMoney(totals.deductions)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>جمع ناخالص</span>
                  <span className="font-semibold">{formatMoney(totals.gross)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>کسورات</span>
                  <span className="font-semibold">{formatMoney(totals.deductions)}</span>
                </div>
                <div className="border-t border-indigo-500/30 pt-2 flex items-center justify-between text-base text-white font-black">
                  <span>خالص پرداختی</span>
                  <span>{formatMoney(totals.net)}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                داده‌ها صرفا نمایشی هستند و با فرم سمت چپ همگام می‌شوند.
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          برای چاپ فیش، می‌توانیم نسخه PDF یا خروجی رسمی اضافه کنیم.
        </div>
      </div>
    </div>
  );
}
