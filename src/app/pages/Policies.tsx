import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Briefcase, Plus, Edit2, Trash2, ChevronRight, Clock, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Policy {
  id: string;
  name: string;
  description: string;
  shiftsCount: number;
  employeesCount: number;
  createdAt: string;
}

// Mock data
const MOCK_POLICIES: Policy[] = [
  {
    id: '1',
    name: 'سیاست کاری استاندارد',
    description: 'سیاست پیش‌فرض برای کارمندان اداری',
    shiftsCount: 1,
    employeesCount: 45,
    createdAt: '۱۴۰۳/۱۱/۲۵',
  },
  {
    id: '2',
    name: 'سیاست شیفتی',
    description: 'برای کارمندان با شیفت‌های صبح، عصر و شب',
    shiftsCount: 3,
    employeesCount: 28,
    createdAt: '۱۴۰۳/۱۱/۲۰',
  },
];

export default function Policies() {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<Policy[]>(MOCK_POLICIES);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">سیاست‌های کاری</h1>
              <p className="text-sm text-slate-400 mt-1">مدیریت قوانین و سیاست‌های حضور و غیاب کارمندان</p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/policies/add')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">افزودن سیاست</span>
            <span className="sm:hidden">افزودن</span>
          </button>
        </div>

        {/* Empty State */}
        {policies.length === 0 && (
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">هنوز سیاستی تعریف نشده</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              برای شروع، سیاست کاری خود را با تعیین شیفت‌ها، قوانین تاخیر و تعجیل تعریف کنید.
            </p>
            <button 
              onClick={() => navigate('/policies/add')}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              افزودن اولین سیاست
            </button>
          </div>
        )}

        {/* Policies List */}
        {policies.length > 0 && (
          <div className="space-y-3">
            {policies.map((policy) => (
              <motion.div
                key={policy.id}
                whileHover={{ scale: 1.005, y: -2 }}
                className="bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 sm:p-6 transition-all group cursor-pointer"
                onClick={() => navigate(`/policies/${policy.id}`)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                    <Briefcase className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">{policy.name}</h3>
                        <p className="text-sm text-slate-400">{policy.description}</p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/policies/${policy.id}`);
                          }}
                          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete
                          }}
                          className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-500">تعداد شیفت:</span>
                        <span className="text-slate-300 font-medium">{policy.shiftsCount}</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-700 rounded-full" />
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-500">کارمندان:</span>
                        <span className="text-slate-300 font-medium">{policy.employeesCount} نفر</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-700 rounded-full" />
                      <span className="text-xs text-slate-500">ایجاد شده: {policy.createdAt}</span>
                    </div>
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
