import { type ReactNode, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CheckCircle2, ChevronRight, FileText, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import MonthlyFixedForm from '../components/contract/MonthlyFixedForm';
import type { MonthlyFixedAgreement } from '../contract/types';
import { LEGAL_CONSTANTS_2026 } from '../contract/salaryCalculations';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';

type PageKey = 'management' | 'extra' | 'bank' | 'draft';
type AgreementType = 'monthly-fixed' | 'daily-wage' | 'hourly' | 'project-based' | 'consulting';
type BankAccount = {
  id: number;
  accountNumber: string;
  cardNumber: string;
  sheba: string;
  isPrimary: boolean;
};
type NewBankAccount = {
  accountNumber: string;
  cardNumber: string;
  sheba: string;
};

const PAGES: { key: PageKey; title: string }[] = [
  { key: 'management', title: 'اطلاعات مدیریت کاربران' },
  { key: 'extra', title: 'اطلاعات تکمیلی' },
  { key: 'bank', title: 'اطلاعات حساب بانکی' },
  { key: 'draft', title: 'پیش نویس قرارداد' },
];

const createDefaultAgreement = (): MonthlyFixedAgreement => ({
  type: 'monthly-fixed',
  entryMode: 'breakdown',
  agreedTotalAmount: 0,
  surplusAllocation: 'attraction',
  baseSalary: LEGAL_CONSTANTS_2026.minimumDailyWage * 30,
  seniorityBase: LEGAL_CONSTANTS_2026.seniorityBaseDailyRate,
  housingAllowance: LEGAL_CONSTANTS_2026.housingAllowanceMonthly,
  foodAllowance: LEGAL_CONSTANTS_2026.foodAllowanceMonthly,
  childAllowancePerChild: LEGAL_CONSTANTS_2026.minimumDailyWage * 3,
  maritalAllowance: LEGAL_CONSTANTS_2026.maritalAllowanceMonthly,
  attractionAllowance: 0,
  managementAllowance: 0,
  transportAllowance: 0,
  hardshipAllowance: 0,
  otherAllowance: 0,
  shiftModels: {
    twoShifts: { enabled: false, percent: 10 },
    threeShifts: { enabled: false, percent: 15 },
    dayNight: { enabled: false, percent: 22.5 },
    afternoonNight: { enabled: false, percent: 22.5 },
  },
  coefficients: {
    overtime: 1.4,
    nightWork: 1.35,
    holidayWork: 1.4,
    fridayWork: 1.8,
    fridayWorkNoOvertime: 1.4,
  },
  missionAllowance: {
    enabled: false,
    minimumDailyRate: LEGAL_CONSTANTS_2026.minimumDailyWage,
  },
  wageBaseComponents: {
    baseSalary: true,
    seniorityBase: true,
    attractionAllowance: true,
    managementAllowance: true,
    transportAllowance: false,
    hardshipAllowance: true,
  },
  bonusMonths: 2,
  bonusPaymentType: 'annual',
  severancePaymentType: 'end-of-service',
  leavesBuyback: false,
  insuranceRate: LEGAL_CONSTANTS_2026.employeeInsuranceRate,
  taxExemption: LEGAL_CONSTANTS_2026.monthlyTaxExemption,
});

const createInitialBankAccounts = (): BankAccount[] => [
  {
    id: 1,
    accountNumber: '',
    cardNumber: '',
    sheba: '',
    isPrimary: true,
  },
  {
    id: 2,
    accountNumber: '',
    cardNumber: '',
    sheba: '',
    isPrimary: false,
  },
];

const createEmptyBankAccount = (): NewBankAccount => ({
  accountNumber: '',
  cardNumber: '',
  sheba: '',
});

export default function EmployeeDetailPage() {
  const navigate = useNavigate();
  const { id, page } = useParams();

  const [agreementType, setAgreementType] = useState<AgreementType>('monthly-fixed');
  const [agreement, setAgreement] = useState<MonthlyFixedAgreement>(createDefaultAgreement());
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(createInitialBankAccounts);
  const [isAddBankDialogOpen, setIsAddBankDialogOpen] = useState(false);
  const [newBankAccount, setNewBankAccount] = useState<NewBankAccount>(createEmptyBankAccount);

  const currentPage = useMemo<PageKey>(() => {
    if (page && PAGES.some((p) => p.key === page)) return page as PageKey;
    return 'management';
  }, [page]);

  const currentIndex = PAGES.findIndex((p) => p.key === currentPage);

  const goTo = (target: PageKey) => navigate(`/employees/${id}/${target}`);

  const handleBack = () => {
    if (currentIndex <= 0) {
      navigate(`/employees/${id}`);
      return;
    }
    goTo(PAGES[currentIndex - 1].key);
  };

  const handleNext = () => {
    if (currentIndex >= PAGES.length - 1) {
      navigate(`/employees/${id}`);
      return;
    }
    goTo(PAGES[currentIndex + 1].key);
  };

  const handleOpenAddBankDialog = () => {
    setNewBankAccount(createEmptyBankAccount());
    setIsAddBankDialogOpen(true);
  };

  const handleAddBankAccount = () => {
    setBankAccounts((prev) => [
      ...prev,
      {
        id: Date.now(),
        accountNumber: newBankAccount.accountNumber,
        cardNumber: newBankAccount.cardNumber,
        sheba: newBankAccount.sheba,
        isPrimary: false,
      },
    ]);
    setIsAddBankDialogOpen(false);
    setNewBankAccount(createEmptyBankAccount());
  };

  const handleChangeBankAccount = (accountId: number, field: 'accountNumber' | 'cardNumber' | 'sheba', value: string) => {
    setBankAccounts((prev) => prev.map((item) => (item.id === accountId ? { ...item, [field]: value } : item)));
  };

  const handleSetPrimaryBank = (accountId: number) => {
    setBankAccounts((prev) => prev.map((item) => ({ ...item, isPrimary: item.id === accountId })));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-600/15 via-slate-900 to-cyan-600/10 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{PAGES[currentIndex].title}</h1>
                <p className="text-sm text-slate-300/90 mt-1">صفحه {currentIndex + 1} از {PAGES.length}</p>
              </div>
            </div>
            <div className="text-xs text-slate-300">ID: {id}</div>
          </div>
        </section>

        {currentPage === 'management' && (
          <section className="bg-slate-900/65 border border-white/10 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="وضعیت کارمند">
              <select className="input-field">
                <option>فعال</option>
                <option>غیرفعال</option>
                <option>در حال ورود</option>
              </select>
            </Field>
            <Field label="نوع دسترسی">
              <select className="input-field">
                <option>کاربر عادی</option>
                <option>سرپرست</option>
                <option>مدیر</option>
              </select>
            </Field>
            <Field label="ایمیل سازمانی">
              <input className="input-field" placeholder="example@company.com" />
            </Field>
            <Field label="شماره تماس اضطراری">
              <input className="input-field" placeholder="0912..." />
            </Field>
          </section>
        )}

        {currentPage === 'extra' && (
          <section className="bg-slate-900/65 border border-white/10 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="وضعیت تاهل">
              <select className="input-field">
                <option>مجرد</option>
                <option>متاهل</option>
                <option>مطلقه</option>
              </select>
            </Field>
            <Field label="تعداد فرزند">
              <input className="input-field" type="number" placeholder="0" />
            </Field>
            <Field label="واحدهای سازمانی" className="sm:col-span-2">
              <input className="input-field" placeholder="واحدهای سازمانی انتخاب شده..." />
            </Field>
            <Field label="توضیحات تکمیلی" className="sm:col-span-2">
              <textarea className="input-field min-h-[110px]" placeholder="توضیحات" />
            </Field>
          </section>
        )}

        {currentPage === 'bank' && (
          <section className="bg-slate-900/65 border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">فهرست حساب‌های بانکی</h3>
              <button
                type="button"
                onClick={handleOpenAddBankDialog}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                aria-label="افزودن حساب بانکی"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {bankAccounts.map((account, index) => (
                <div key={account.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-white font-semibold">حساب {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryBank(account.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-colors',
                        account.isPrimary
                          ? 'bg-emerald-600/20 text-emerald-300 border-emerald-400/40'
                          : 'bg-slate-800 text-slate-300 border-white/10 hover:border-emerald-300/40'
                      )}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {account.isPrimary ? 'حساب اصلی' : 'انتخاب به عنوان اصلی'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="شماره حساب">
                      <input
                        className="input-field"
                        placeholder="شماره حساب"
                        value={account.accountNumber}
                        onChange={(e) => handleChangeBankAccount(account.id, 'accountNumber', e.target.value)}
                      />
                    </Field>
                    <Field label="شماره کارت بانکی">
                      <input
                        className="input-field"
                        placeholder="شماره کارت بانکی"
                        value={account.cardNumber}
                        onChange={(e) => handleChangeBankAccount(account.id, 'cardNumber', e.target.value)}
                      />
                    </Field>
                    <Field label="شماره شبا" className="sm:col-span-2">
                      <input
                        className="input-field"
                        placeholder="IR..."
                        value={account.sheba}
                        onChange={(e) => handleChangeBankAccount(account.id, 'sheba', e.target.value)}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <Dialog open={isAddBankDialogOpen} onOpenChange={setIsAddBankDialogOpen}>
              <DialogContent dir="rtl" className="bg-slate-900 border-white/10 text-slate-100">
                <DialogHeader className="text-right">
                  <DialogTitle className="text-white">ثبت حساب بانکی جدید</DialogTitle>
                  <DialogDescription className="text-slate-300">مشخصات حساب جدید را وارد کنید.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="شماره حساب">
                    <input
                      className="input-field"
                      placeholder="شماره حساب"
                      value={newBankAccount.accountNumber}
                      onChange={(e) => setNewBankAccount((prev) => ({ ...prev, accountNumber: e.target.value }))}
                    />
                  </Field>
                  <Field label="شماره کارت بانکی">
                    <input
                      className="input-field"
                      placeholder="شماره کارت بانکی"
                      value={newBankAccount.cardNumber}
                      onChange={(e) => setNewBankAccount((prev) => ({ ...prev, cardNumber: e.target.value }))}
                    />
                  </Field>
                  <Field label="شماره شبا" className="sm:col-span-2">
                    <input
                      className="input-field"
                      placeholder="IR..."
                      value={newBankAccount.sheba}
                      onChange={(e) => setNewBankAccount((prev) => ({ ...prev, sheba: e.target.value }))}
                    />
                  </Field>
                </div>
                <DialogFooter>
                  <button
                    type="button"
                    className="px-3 py-1.5 border border-white/15 rounded-lg text-slate-200 hover:bg-slate-800"
                    onClick={() => setIsAddBankDialogOpen(false)}
                  >
                    انصراف
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                    onClick={handleAddBankAccount}
                  >
                    ثبت حساب
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>
        )}
        {currentPage === 'draft' && (
          <div className="space-y-4">
            <section className="bg-slate-900/65 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4 text-white">
                <FileText className="w-4 h-4 text-indigo-300" />
                <h2 className="font-bold">پیش نویس قرارداد</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400">نوع قرارداد مالی</label>
                  <select className="input-field mt-2" value={agreementType} onChange={(e) => setAgreementType(e.target.value as AgreementType)}>
                    <option value="monthly-fixed">ثابت ماهیانه</option>
                    <option value="daily-wage">روزمزد</option>
                    <option value="hourly">ساعتی</option>
                    <option value="project-based">پروژه ای</option>
                    <option value="consulting">مشاوره ای</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400">تاریخ شروع قرارداد</label>
                  <input className="input-field mt-2" type="date" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">تاریخ پایان قرارداد (اختیاری)</label>
                  <input className="input-field mt-2" type="date" />
                </div>
              </div>
            </section>

            {agreementType === 'monthly-fixed' ? (
              <MonthlyFixedForm agreement={agreement} onChange={setAgreement} />
            ) : (
              <section className="bg-slate-900/65 border border-white/10 rounded-3xl p-6 text-sm text-slate-300">
                این نوع قرارداد هنوز به موتور محاسبات حقوق متصل نشده است.
              </section>
            )}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 bg-slate-900/65 border border-white/10 rounded-2xl p-4">
          <button onClick={handleBack} className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            {currentIndex === 0 ? 'بازگشت به لیست جزئیات' : 'صفحه قبل'}
          </button>
          <button onClick={handleNext} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:brightness-110 text-white font-semibold transition-all shadow-lg shadow-indigo-500/25">
            {currentIndex === PAGES.length - 1 ? 'اتمام' : 'صفحه بعد'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-xs text-slate-400">{label}</label>
      {children}
    </div>
  );
}
