import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  BadgeCheck,
  Phone,
  Mail,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Employee {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  workGroup: string;
  status: 'active' | 'inactive' | 'onboarding';
  phone?: string;
  email?: string;
  personnelCode?: string;
}

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'علی محمدی',
    role: 'مدیر فروش',
    workGroup: 'تیم فروش',
    status: 'active',
    phone: '0912 123 4567',
    email: 'ali@company.com',
    personnelCode: 'HR-1021',
  },
  {
    id: '2',
    name: 'فاطمه احمدی',
    role: 'کارشناس تجربه مشتری',
    workGroup: 'پشتیبانی',
    status: 'active',
    phone: '0935 451 8899',
    email: 'fatemeh@company.com',
    personnelCode: 'HR-0984',
  },
  {
    id: '3',
    name: 'رضا رضایی',
    role: 'توسعه دهنده بک اند',
    workGroup: 'تیم فنی',
    status: 'onboarding',
    phone: '0910 444 7777',
    email: 'rezaei@company.com',
    personnelCode: 'DEV-3310',
  },
  {
    id: '4',
    name: 'بهاره سعیدی',
    role: 'حسابدار',
    workGroup: 'مالی',
    status: 'inactive',
    phone: '0902 222 1234',
    email: 'bahareh@company.com',
    personnelCode: 'FIN-0065',
  },
];

const STATUS_STYLES = {
  active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  inactive: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  onboarding: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
};

const STATUS_LABELS = {
  active: 'فعال',
  inactive: 'غیرفعال',
  onboarding: 'در حال ورود',
};

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Employee['status']>('all');

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.includes(search) ||
      employee.workGroup.includes(search) ||
      employee.role.includes(search) ||
      (employee.personnelCode || '').includes(search);
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setEmployees((prev) => prev.filter((employee) => employee.id !== id));
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">مدیریت کاربران</h1>
            <p className="text-slate-400 text-sm mt-1">
              کاربران را جستجو، فیلتر و ویرایش کنید یا کاربر جدید اضافه کنید.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/employees/add')}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            افزودن کاربر
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-slate-900/60 border border-white/5 rounded-2xl p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="جستجو بر اساس نام، کد پرسنلی، نقش یا گروه کاری..."
                  className="input-field pr-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                {['all', 'active', 'onboarding', 'inactive'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status as typeof statusFilter)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                      statusFilter === status
                        ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40'
                        : 'bg-slate-800/60 text-slate-400 border-white/5 hover:text-slate-200'
                    )}
                  >
                    {status === 'all'
                      ? 'همه'
                      : STATUS_LABELS[status as Employee['status']]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900/70 to-slate-950 border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>تعداد کل کاربران</span>
              <span className="text-white font-bold">{employees.length}</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              {(['active', 'onboarding', 'inactive'] as const).map((status) => (
                <div key={status} className="bg-slate-800/60 border border-white/5 rounded-xl py-2">
                  <div className="text-white font-bold">
                    {employees.filter((employee) => employee.status === status).length}
                  </div>
                  <div className="text-slate-500 mt-1">{STATUS_LABELS[status]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-10 text-center">
            <Users className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-white">کاربری پیدا نشد</h2>
            <p className="text-sm text-slate-400 mt-2">فیلترها را تغییر دهید یا یک کاربر جدید ثبت کنید.</p>
            <button
              onClick={() => navigate('/employees/add')}
              className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              افزودن اولین کاربر
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEmployees.map((employee) => (
              <motion.div
                key={employee.id}
                whileHover={{ scale: 1.01, x: 4 }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/50 hover:border-indigo-500/40 rounded-2xl p-4 transition-all"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-200 font-bold">
                      {employee.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">{employee.name}</h3>
                        <span
                          className={cn(
                            'text-[11px] px-2 py-0.5 rounded-full border',
                            STATUS_STYLES[employee.status]
                          )}
                        >
                          {STATUS_LABELS[employee.status]}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{employee.role}</span>
                        <span className="text-slate-600">•</span>
                        <span>{employee.workGroup}</span>
                        {employee.personnelCode && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span>{employee.personnelCode}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center text-xs text-slate-400">
                    {employee.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                    {employee.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{employee.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/employees/${employee.id}`)}
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
