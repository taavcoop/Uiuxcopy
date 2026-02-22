import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Archive,
  ArchiveRestore,
  ChevronRight,
  Copy,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  deleteDraftTemplateById,
  getDraftTemplates,
  getPayrollPackageEnabled,
  saveDraftTemplates,
} from '../lib/draft-template-store';
import type { DraftTemplate } from '../lib/draft-template-types';

export default function DraftTemplates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState<DraftTemplate[]>(() => getDraftTemplates());
  const payrollPackageEnabled = getPayrollPackageEnabled();

  const filteredTemplates = useMemo(() => {
    const needle = search.trim();
    if (!needle) return templates;
    return templates.filter(
      (item) =>
        item.title.includes(needle) ||
        item.description.includes(needle),
    );
  }, [search, templates]);

  const activeCount = templates.filter((item) => item.status === 'active').length;
  const archivedCount = templates.length - activeCount;

  const duplicateTemplate = (template: DraftTemplate) => {
    const duplicated: DraftTemplate = {
      ...template,
      id: `tmpl-${Date.now()}`,
      title: `${template.title} (کپی)`,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const next = [duplicated, ...templates];
    setTemplates(next);
    saveDraftTemplates(next);
  };

  const toggleArchive = (id: string) => {
    const next = templates.map((item) =>
      item.id === id
        ? {
            ...item,
            status: item.status === 'active' ? 'archived' : 'active',
            updatedAt: new Date().toISOString(),
          }
        : item,
    );
    setTemplates(next);
    saveDraftTemplates(next);
  };

  const removeTemplate = (id: string) => {
    const next = deleteDraftTemplateById(id);
    setTemplates(next);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">قالب‌های پیش‌نویس قرارداد</h1>
              <p className="text-sm text-slate-400 mt-1">
                نسخه‌های پیش‌نویس قرارداد کارمندان قبل از تایید نهایی را اینجا مدیریت کنید.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/draft-templates/add')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">ایجاد قالب پیش‌نویس</span>
            <span className="sm:hidden">ایجاد</span>
          </button>
        </div>

        {!payrollPackageEnabled && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-sm text-amber-200">
              برای ثبت آیتم‌های حقوق و دستمزد در قالب‌ها، ابتدا پکیج حقوق و دستمزد را فعال کنید.
            </p>
            <button
              onClick={() => navigate('/draft-templates/payroll-package?returnTo=/draft-templates')}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-amber-400 text-slate-900 hover:bg-amber-300 transition-colors"
            >
              خرید/فعال‌سازی پکیج
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
            <div className="text-xs text-slate-500 mb-1">کل قالب‌ها</div>
            <div className="text-2xl font-black text-white">{templates.length}</div>
          </div>
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
            <div className="text-xs text-slate-500 mb-1">فعال</div>
            <div className="text-2xl font-black text-emerald-400">{activeCount}</div>
          </div>
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
            <div className="text-xs text-slate-500 mb-1">آرشیو</div>
            <div className="text-2xl font-black text-amber-400">{archivedCount}</div>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در عنوان یا توضیحات..."
            className="w-full bg-slate-900/40 border border-white/5 hover:border-white/10 rounded-xl py-3 pr-10 pl-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>

        {filteredTemplates.length === 0 && (
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">قالبی پیدا نشد</h3>
          </div>
        )}

        {filteredTemplates.length > 0 && (
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.004, y: -1 }}
                className="bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 sm:p-6 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{template.title || 'بدون عنوان'}</h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] border ${
                              template.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {template.status === 'active' ? 'فعال' : 'آرشیو'}
                          </span>
                        </div>

                        <p className="text-sm text-slate-300">{template.description || 'توضیحی ثبت نشده است.'}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => duplicateTemplate(template)}
                          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                          title="کپی"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/draft-templates/${template.id}`)}
                          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                          title="ویرایش"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleArchive(template.id)}
                          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                          title={template.status === 'active' ? 'آرشیو' : 'بازگردانی'}
                        >
                          {template.status === 'active' ? (
                            <Archive className="w-4 h-4" />
                          ) : (
                            <ArchiveRestore className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => removeTemplate(template.id)}
                          className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <InfoItem label="سقف مرخصی ماهیانه" value={`${template.attendance.monthlyLeaveCap || '-'} روز`} />
                      <InfoItem
                        label="حداکثر انتقال مرخصی به سال بعد"
                        value={`${template.attendance.maxLeaveCarryToNextYear || '-'} روز`}
                      />
                      <InfoItem
                        label="سقف ساعت اضافه‌کاری ماهانه"
                        value={`${template.attendance.monthlyOvertimeCap || '-'} ساعت`}
                      />
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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-xl p-3">
      <div className="text-[11px] text-slate-500 mb-1">{label}</div>
      <div className="text-sm font-semibold text-slate-100">{value}</div>
    </div>
  );
}
