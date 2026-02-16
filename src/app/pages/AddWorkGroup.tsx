import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Plus, X, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { SimpleTooltip } from '../components/ui/tooltip';

interface FormData {
  // Step 1: Basic Info
  title: string;
  description: string;
  tags: string[];
  tagInput: string;
  image: string;

  // Step 2: Location
  selectedLocation: string;

  // Step 3: Employees
  selectedEmployees: EmployeeMember[];
  employeeSearch: string;

  // Step 4: Policies (multiple)
  selectedPolicies: string[];
}

interface EmployeeMember {
  id: string;
  name: string;
  selectedRole: 'manager' | 'staff' | 'visit_manager';
  currentGroup?: string;
}

interface Employee {
  id: string;
  name: string;
  currentGroup?: string;
}

interface Location {
  id: string;
  name: string;
}

interface Policy {
  id: string;
  name: string;
  calendar: string;
  isActive?: boolean;  // آیا این سیاست قبلاً برای گروه فعال بوده است
  yearUsed?: string;   // سالی که این سیاست استفاده شد
}

// Mock data
const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'علی احمدی' },
  { id: '2', name: 'محمد رضایی', currentGroup: 'تیم طراحی' },
  { id: '3', name: 'فاطمه حسنی' },
  { id: '4', name: 'ایمان علیزاده', currentGroup: 'تیم بازاریابی' },
  { id: '5', name: 'نسرین رفیعی' },
  { id: '6', name: 'بهرام کریمی' },
  { id: '7', name: 'مریم نوری' },
  { id: '8', name: 'رضا شاهین' },
];

const MOCK_LOCATIONS: Location[] = [
  { id: '1', name: 'دفتر مرکزی' },
  { id: '2', name: 'شعبه شمال' },
  { id: '3', name: 'شعبه جنوب' },
];

const MOCK_POLICIES: Policy[] = [
  { id: '1', name: 'سیاست شیفت ثابت ۱۴۰۳', calendar: 'تقویم عمومی ۱۴۰۳', isActive: true, yearUsed: '۱۴۰۳' },
  { id: '2', name: 'سیاست شیفت شناور ۱۴۰۳', calendar: 'تقویم شرکتی', isActive: false },
  { id: '3', name: 'سیاست شیفت چرخشی ۱۴۰۴', calendar: 'تقویم پروژه خاص', isActive: false },
  { id: '4', name: 'سیاست شیفت ثابت ۱۴۰۴', calendar: 'تقویم عمومی ۱۴۰۴', isActive: false },
];

export default function AddWorkGroup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    tags: [],
    tagInput: '',
    image: '',
    selectedLocation: '',
    selectedEmployees: [],
    employeeSearch: '',
    selectedPolicies: [],
  });

  const [alertMessage, setAlertMessage] = useState<{ type: 'info' | 'warning' | 'success'; text: string } | null>(null);
  const [showEmployeeAlert, setShowEmployeeAlert] = useState<{ employeeName: string; currentGroup: string } | null>(null);
  const [showPolicyDeleteAlert, setShowPolicyDeleteAlert] = useState<{ policyId: string; policyName: string; yearUsed: string } | null>(null);
  const [calendarPreview, setCalendarPreview] = useState<{ policyId: string; policyName: string; calendar: string } | null>(null);

  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: '',
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleAddEmployee = (employee: Employee, role: 'manager' | 'staff' | 'visit_manager') => {
    if (employee.currentGroup) {
      setShowEmployeeAlert({
        employeeName: employee.name,
        currentGroup: employee.currentGroup,
      });
    }

    if (!formData.selectedEmployees.find(e => e.id === employee.id)) {
      setFormData({
        ...formData,
        selectedEmployees: [
          ...formData.selectedEmployees,
          {
            id: employee.id,
            name: employee.name,
            selectedRole: role,
            currentGroup: employee.currentGroup,
          },
        ],
      });
    }
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setFormData({
      ...formData,
      selectedEmployees: formData.selectedEmployees.filter(e => e.id !== employeeId),
    });
  };

  const handleChangeRole = (employeeId: string, newRole: 'manager' | 'staff' | 'visit_manager') => {
    setFormData({
      ...formData,
      selectedEmployees: formData.selectedEmployees.map(e =>
        e.id === employeeId ? { ...e, selectedRole: newRole } : e
      ),
    });
  };

  const handleConfirmAddEmployee = (employee: Employee) => {
    // Remove from previous group and add to current
    handleAddEmployee(employee, 'staff');
    setShowEmployeeAlert(null);
  };

  const handleRemovePolicy = (policyId: string) => {
    const policy = MOCK_POLICIES.find(p => p.id === policyId);
    
    // اگر این سیاست قبلاً فعال بوده است
    if (policy?.isActive) {
      setShowPolicyDeleteAlert({
        policyId,
        policyName: policy.name,
        yearUsed: policy.yearUsed || '۱۴۰۳'
      });
    } else {
      // حذف مستقیم اگر فعال نبوده
      setFormData({
        ...formData,
        selectedPolicies: formData.selectedPolicies.filter(id => id !== policyId)
      });
    }
  };

  const handleConfirmPolicyDelete = () => {
    if (showPolicyDeleteAlert) {
      setFormData({
        ...formData,
        selectedPolicies: formData.selectedPolicies.filter(id => id !== showPolicyDeleteAlert.policyId)
      });
      setShowPolicyDeleteAlert(null);
    }
  };

  const handleCancel = () => {
    navigate('/work-groups');
  };

  const handleSave = () => {
    if (!formData.title) {
      setAlertMessage({ type: 'warning', text: 'لطفاً عنوان گروه کاری را وارد کنید' });
      return;
    }
    if (!formData.selectedLocation) {
      setAlertMessage({ type: 'warning', text: 'لطفاً محل کار را انتخاب کنید' });
      return;
    }
    if (formData.selectedEmployees.length === 0) {
      setAlertMessage({ type: 'warning', text: 'لطفاً حداقل یک کارمند را اضافه کنید' });
      return;
    }
    if (formData.selectedEmployees.filter(e => e.selectedRole === 'manager').length === 0) {
      setAlertMessage({ type: 'warning', text: 'لطفاً حداقل یک مدیر را تعیین کنید' });
      return;
    }
    if (formData.selectedPolicies.length === 0) {
      setAlertMessage({ type: 'warning', text: 'لطفاً حداقل یک سیاست کاری را انتخاب کنید' });
      return;
    }

    console.log('Saving work group:', formData);
    setAlertMessage({ type: 'success', text: 'گروه کاری با موفقیت ذخیره شد' });
    setTimeout(() => navigate('/work-groups'), 1500);
  };

  const filteredEmployees = MOCK_EMPLOYEES.filter(emp =>
    emp.name.includes(formData.employeeSearch) &&
    !formData.selectedEmployees.find(sel => sel.id === emp.id)
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => currentStep === 1 ? handleCancel() : setCurrentStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            title={currentStep === 1 ? 'بازگشت' : 'مرحله قبل'}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">افزودن گروه کاری</h1>
            <p className="text-sm text-slate-400 mt-1">مرحله {currentStep} از 4</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 space-y-2">
          <div className="flex gap-2">
            {(
              [
                { step: 1, title: 'اطلاعات پایه' },
                { step: 2, title: 'انتخاب محل' },
                { step: 3, title: 'کارمندان' },
                { step: 4, title: 'سیاست کاری' },
              ] as const
            ).map((item) => (
              <div key={item.step} className="flex-1">
                <button
                  onClick={() => item.step <= currentStep && setCurrentStep(item.step as 1 | 2 | 3 | 4)}
                  className={cn(
                    'w-full py-2 px-3 rounded-lg text-xs font-medium transition-all text-center',
                    item.step === currentStep
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : item.step < currentStep
                      ? 'bg-green-600/20 text-green-400 border border-green-500/20'
                      : 'bg-slate-800/50 text-slate-400 border border-white/5'
                  )}
                >
                  {item.step < currentStep && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                  {item.title}
                </button>
              </div>
            ))}
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Alert Messages */}
        {alertMessage && (
          <div className={cn(
            'p-4 rounded-lg mb-6 flex items-start gap-3 animate-in fade-in',
            alertMessage.type === 'success' && 'bg-green-500/10 border border-green-500/20 text-green-400',
            alertMessage.type === 'warning' && 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
            alertMessage.type === 'info' && 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
          )}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{alertMessage.text}</p>
          </div>
        )}

        {/* Employee Alert */}
        {showEmployeeAlert && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm mx-4 space-y-4 animate-in fade-in zoom-in">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white">کارمند در گروه دیگر</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    <strong>{showEmployeeAlert.employeeName}</strong> در حال حاضر در گروه <strong>{showEmployeeAlert.currentGroup}</strong> است.
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    اگر تایید کنید، این کارمند از گروه قبلی حذف و به این گروه اضافه خواهد شد.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={() => setShowEmployeeAlert(null)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  لغو
                </button>
                <button
                  onClick={() => handleConfirmAddEmployee(
                    MOCK_EMPLOYEES.find(e => e.name === showEmployeeAlert.employeeName)!
                  )}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  تایید
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Policy Delete Warning Alert */}
        {showPolicyDeleteAlert && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm mx-4 space-y-4 animate-in fade-in zoom-in">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white">⚠️ هشدار برداشتن سیاست فعال</h3>
                  <p className="text-sm text-slate-300 mt-2">
                    سیاست <strong className="text-red-400">{showPolicyDeleteAlert.policyName}</strong> در سال <strong className="text-red-400">{showPolicyDeleteAlert.yearUsed}</strong> برای این گروه کاری فعال بوده است.
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    برداشتن این سیاست ممکن است منجر به <strong>حذف داده‌های تاریخی و رکوردهایی</strong> شود که طبق این سیاست ثبت شده‌اند.
                  </p>
                  <p className="text-sm text-amber-400 mt-3 font-medium">
                    آیا مطمئن هستید که می‌خواهید این سیاست را برداشته‌این سال حذف کنید؟
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={() => setShowPolicyDeleteAlert(null)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  لغو (نگه‌داشتن سیاست)
                </button>
                <button
                  onClick={handleConfirmPolicyDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  تایید (برداشتن سیاست)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  تصویر گروه کاری
                  <SimpleTooltip content="تصویر نماینده‌ی تیم شما را آپلود کنید">
                    <HelpCircleIcon className="w-4 h-4 text-slate-500" />
                  </SimpleTooltip>
                </label>
                <div className="relative">
                  <div className="bg-slate-800/50 border border-dashed border-white/10 rounded-xl p-8 text-center hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all cursor-pointer group">
                    <div className="text-slate-400 group-hover:text-indigo-400 transition-colors">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="font-medium">کلیک کنید یا تصویر را بکشید</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG تا 5MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  عنوان گروه کاری
                  <SimpleTooltip content="نام منحصربه‌فرد برای تیم شما">
                    <HelpCircleIcon className="w-4 h-4 text-slate-500" />
                  </SimpleTooltip>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: تیم طراحی و تجربه کاربری"
                  className="w-full bg-slate-800/50 border border-white/5 hover:border-white/10 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  توضیحات
                  <SimpleTooltip content="شرح مختصری در مورد اهداف و فعالیت‌های این گروه">
                    <HelpCircleIcon className="w-4 h-4 text-slate-500" />
                  </SimpleTooltip>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="شرح مختصری درباره انجام‌دهنده‌های این گروه..."
                  rows={4}
                  className="w-full bg-slate-800/50 border border-white/5 hover:border-white/10 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  برچسب‌ها (تگ‌ها)
                  <SimpleTooltip content="برچسب‌های توصیفی برای دسته‌بندی بهتر گروه">
                    <HelpCircleIcon className="w-4 h-4 text-slate-500" />
                  </SimpleTooltip>
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.tagInput}
                      onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="برچسب را وارد کنید و Enter بزنید"
                      className="flex-1 bg-slate-800/50 border border-white/5 hover:border-white/10 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                    <button
                      onClick={handleAddTag}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5 text-xs font-medium text-indigo-400"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-indigo-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location Selection */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                  انتخاب محل کار
                  <SimpleTooltip content="محل کار اصلی این گروه را انتخاب کنید">
                    <HelpCircleIcon className="w-4 h-4 text-slate-500" />
                  </SimpleTooltip>
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {MOCK_LOCATIONS.map((location) => (
                    <SimpleTooltip key={location.id} content={`محل کار: ${location.name}`}>
                      <button
                        onClick={() => setFormData({ ...formData, selectedLocation: location.id })}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all text-left',
                          formData.selectedLocation === location.id
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                            : 'bg-slate-800/50 border-white/5 hover:border-indigo-500/30 hover:bg-slate-800/70'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-white">{location.name}</h4>
                            <p className="text-xs text-slate-400 mt-1">محل کار مرکزی این گروه</p>
                          </div>
                          <div className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                            formData.selectedLocation === location.id
                              ? 'bg-indigo-600 border-indigo-400'
                              : 'border-slate-600'
                          )}>
                            {formData.selectedLocation === location.id && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    </SimpleTooltip>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Employees */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  جستجو و اضافه کردن کارمندان
                  <SimpleTooltip content="کارمندان را جستجو کرده و به گروه اضافه کنید. اگر کارمند در گروه دیگری است, می‌توانید او را منتقل کنید">
                    <HelpCircleIcon className="w-4 h-4 text-slate-500" />
                  </SimpleTooltip>
                </label>
                <input
                  type="text"
                  value={formData.employeeSearch}
                  onChange={(e) => setFormData({ ...formData, employeeSearch: e.target.value })}
                  placeholder="نام کارمند را تایپ کنید..."
                  className="w-full bg-slate-800/50 border border-white/5 hover:border-white/10 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all mb-4"
                />

                {filteredEmployees.length > 0 && (
                  <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4 space-y-2 max-h-48 overflow-y-auto">
                    {filteredEmployees.map((emp) => (
                      <SimpleTooltip
                        key={emp.id}
                        content={emp.currentGroup ? `فعلاً در گروه: ${emp.currentGroup}` : 'در دسترس'}
                      >
                        <div className="flex items-center justify-between gap-3 p-3 bg-slate-800/50 rounded-lg group hover:bg-slate-800 transition-colors">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-200">{emp.name}</p>
                            {emp.currentGroup && (
                              <p className="text-xs text-amber-400">{emp.currentGroup}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddEmployee(emp, 'staff')}
                            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </SimpleTooltip>
                    ))}
                  </div>
                )}
              </div>

              {formData.selectedEmployees.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    اعضای انتخاب شده ({formData.selectedEmployees.length})
                    <SimpleTooltip content="برای هر عضو نقش مناسب را انتخاب کنید">
                      <HelpCircleIcon className="w-4 h-4 text-slate-500" />
                    </SimpleTooltip>
                  </label>
                  <div className="space-y-2">
                    {formData.selectedEmployees.map((emp) => (
                      <div key={emp.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-indigo-500/20">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-200">{emp.name}</p>
                          {emp.currentGroup && (
                            <p className="text-xs text-amber-300 mt-1">قبلاً: {emp.currentGroup}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="group relative">
                            <select
                              value={emp.selectedRole}
                              onChange={(e) => handleChangeRole(emp.id, e.target.value as 'manager' | 'staff' | 'visit_manager')}
                              className="bg-slate-700 border border-white/5 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all"
                              title="انتخاب نقش برای این عضو"
                            >
                              <option value="manager">مدیر</option>
                              <option value="staff">کارمند</option>
                              <option value="visit_manager">مدیر تردد</option>
                            </select>
                            <SimpleTooltip content="انتخاب نقش برای این عضو">
                              <div className="hidden group-hover:block absolute inset-0 rounded-lg pointer-events-none" />
                            </SimpleTooltip>
                          </div>
                          <button
                            onClick={() => handleRemoveEmployee(emp.id)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.selectedEmployees.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">هنوز کارمندی اضافه نشده</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Policy Selection */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                  انتخاب سیاست‌های کاری (برای سال‌های مختلف)
                  <SimpleTooltip content="می‌توانید سیاست‌های مختلف برای سال‌های مختلف انتخاب کنید. مثلاً سیاست ۱۴۰۳ و ۱۴۰۴">
                    <HelpCircleIcon className="w-4 h-4 text-slate-500" />
                  </SimpleTooltip>
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {MOCK_POLICIES.map((policy) => (
                    <SimpleTooltip key={policy.id} content={`تقویم: ${policy.calendar}`}>
                      <button
                        onClick={() => {
                          const isSelected = formData.selectedPolicies.includes(policy.id);
                          setFormData({
                            ...formData,
                            selectedPolicies: isSelected
                              ? formData.selectedPolicies.filter(id => id !== policy.id)
                              : [...formData.selectedPolicies, policy.id]
                          });
                        }}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all text-left',
                          formData.selectedPolicies.includes(policy.id)
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                            : 'bg-slate-800/50 border-white/5 hover:border-indigo-500/30 hover:bg-slate-800/70'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-white">{policy.name}</h4>
                            <p className="text-xs text-slate-400 mt-1">تقویم: {policy.calendar}</p>
                          </div>
                          <div className={cn(
                            'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-colors',
                            formData.selectedPolicies.includes(policy.id)
                              ? 'bg-indigo-600 border-indigo-400'
                              : 'border-slate-600 hover:border-indigo-500/50'
                          )}>
                            {formData.selectedPolicies.includes(policy.id) && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    </SimpleTooltip>
                  ))}
                </div>
              </div>

              {formData.selectedPolicies.length > 0 && (
                <div className="space-y-3">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-green-300">سیاست‌های انتخاب شده</h4>
                        <p className="text-xs text-green-400 mt-1">
                          {formData.selectedPolicies.length} سیاست کاری برای این گروه انتخاب شده است.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">سیاست‌های انتخاب‌شده:</label>
                    <div className="space-y-2">
                      {formData.selectedPolicies.map((policyId) => {
                        const policy = MOCK_POLICIES.find(p => p.id === policyId);
                        return policy ? (
                          <div key={policyId} className={cn(
                            'flex items-center justify-between p-3 rounded-lg border transition-colors',
                            policy.isActive
                              ? 'bg-red-500/10 border-red-500/30'
                              : 'bg-slate-800/50 border-indigo-500/20'
                          )}>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-indigo-300">{policy.name}</p>
                                {policy.isActive && (
                                  <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-xs font-semibold text-red-400">
                                    ⚠️ فعال (سال {policy.yearUsed})
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400">{policy.calendar}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setCalendarPreview({ policyId, policyName: policy.name, calendar: policy.calendar })}
                                className="px-3 py-1.5 text-xs font-medium text-indigo-300 hover:text-indigo-200 hover:bg-indigo-500/10 rounded-lg transition-colors border border-indigo-500/30 hover:border-indigo-500/50"
                              >
                                📅 مشاهده تقویم
                              </button>
                              <button
                                onClick={() => handleRemovePolicy(policyId)}
                                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                title="حذف این سیاست"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6 border-t border-white/5">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all"
            >
              لغو
            </button>
            {currentStep < 4 && (
              <button
                onClick={() => setCurrentStep((s) => (s + 1) as 1 | 2 | 3 | 4)}
                className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
              >
                مرحله بعد
              </button>
            )}
            {currentStep === 4 && (
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                ذخیره و افزودن
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Preview Modal */}
      {calendarPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{calendarPreview.policyName}</h2>
                  <p className="text-sm text-slate-400 mt-1">📅 {calendarPreview.calendar}</p>
                </div>
                <button
                  onClick={() => setCalendarPreview(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Preview Content */}
            <div className="p-6 space-y-4">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                <h3 className="font-semibold text-indigo-300 mb-3 text-sm">اطلاعات تقویم</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">نام تقویم:</span>
                    <span className="text-slate-200 font-medium">{calendarPreview.calendar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">نام سیاست:</span>
                    <span className="text-slate-200 font-medium">{calendarPreview.policyName}</span>
                  </div>
                </div>
              </div>

              {/* Mock Calendar */}
              <div className="bg-slate-800/30 rounded-xl p-4">
                <h3 className="font-semibold text-slate-300 mb-3 text-sm">پیش‌نمایش زمان‌بندی</h3>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(day => (
                    <div key={day} className="text-center font-semibold text-slate-500 py-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'text-center py-2 rounded text-xs',
                        i < 5
                          ? 'text-slate-500 bg-slate-800/20'
                          : i % 7 === 0 || i % 7 === 1
                          ? 'bg-red-500/20 text-red-300 font-medium'
                          : 'bg-indigo-500/10 text-slate-300'
                      )}
                    >
                      {i < 5 ? '' : i - 4}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center">
                  💡 این تقویم می‌تواند میانگین روزهای شغلی و تعطیلات را مشخص کند
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2 bg-indigo-500/10 rounded">
                  <div className="w-2 h-2 rounded bg-indigo-400" />
                  <span className="text-slate-300">روز کاری</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded">
                  <div className="w-2 h-2 rounded bg-red-400" />
                  <span className="text-slate-300">تعطیل</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700 flex gap-2">
              <button
                onClick={() => setCalendarPreview(null)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                بستن
              </button>
              <button
                onClick={() => setCalendarPreview(null)}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors"
              >
                قبول و ادامه
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Help Circle Icon
function HelpCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
