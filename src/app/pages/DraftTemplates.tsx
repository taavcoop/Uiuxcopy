import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Archive,
  ArchiveRestore,
  CalendarDays,
  ChevronRight,
  Copy,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';

type TemplateStatus = 'active' | 'archived';

interface DraftTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  assignees: number;
  updatedAt: string;
  status: TemplateStatus;
}

const INITIAL_TEMPLATES: DraftTemplate[] = [
  {
    id: 'temp-1',
    title: 'قالب پیش‌نویس شیفت اداری',
    description: 'پیش‌نویس اولیه برای کارمندان ستادی با ساعت ۸ تا ۱۷',
    category: 'حضور و غیاب',
    assignees: 24,
    updatedAt: '۱۴۰۴/۱۲/۰۳',
    status: 'active',
  },
  {
    id: 'temp-2',
    title: 'قالب پیش‌نویس اضافه‌کاری پروژه',
    description: 'محاسبه اضافه‌کاری بر اساس تایید مدیر پروژه',
    category: 'حقوق و دستمزد',
    assignees: 11,
    updatedAt: '۱۴۰۴/۱۱/۲۸',
    status: 'active',
  },
  {
    id: 'temp-3',
    title: 'قالب پیش‌نویس شعبه شمال',
    description: 'قوانین آزمایشی برای تیم عملیاتی شعبه شمال',
    category: 'حضور و غیاب',
    assignees: 8,
    updatedAt: '۱۴۰۴/۱۱/۲۳',
    status: 'archived',
  },
];

export default function DraftTemplates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState<DraftTemplate[]>(INITIAL_TEMPLATES);

  const filteredTemplates = useMemo(() => {
    const needle = search.trim();
    if (!needle) return templates;

    return templates.filter(
      (item) =>
        item.title.includes(needle) ||
        item.description.includes(needle) ||
        item.category.includes(needle),
    );
  }, [search, templates]);

  const activeCount = templates.filter((item) => item.status === 'active').length;
  const archivedCount = templates.length - activeCount;

  const addTemplate = () => {
    const nowId = Date.now().toString();
    const newTemplate: DraftTemplate = {
      id: nowId,
      title: `قالب پیش‌نویس جدید ${templates.length + 1}`,
      description: 'قالب جدید ایجاد شد و آماده ویرایش است.',
      category: 'عمومی',
      assignees: 0,
      updatedAt: 'امروز',
      status: 'active',
    };
    setTemplates((prev) => [newTemplate, ...prev]);
  };

  const duplicateTemplate = (template: DraftTemplate) => {
    const duplicated: DraftTemplate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      title: `${template.title} (کپی)`,
      updatedAt: 'امروز',
      status: 'active',
    };
    setTemplates((prev) => [duplicated, ...prev]);
  };

  const toggleArchive = (id: string) => {
    setTemplates((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'active' ? 'archived' : 'active', updatedAt: 'امروز' }
          : item,
      ),
    );
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">قالب‌های پیش‌نویس</h1>
              <p className="text-sm text-slate-400 mt-1">
                فهرست قالب‌های ساخته‌شده را مشاهده کنید و مدیریت آن‌ها را انجام دهید.
              </p>
            </div>
          </div>

          <button
            onClick={addTemplate}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">ایجاد قالب جدید</span>
            <span className="sm:hidden">قالب جدید</span>
          </button>
        </div>

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
            placeholder="جستجو در نام، توضیح یا دسته‌بندی قالب..."
            className="w-full bg-slate-900/40 border border-white/5 hover:border-white/10 rounded-xl py-3 pr-10 pl-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>

        {filteredTemplates.length === 0 && (
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">قالبی پیدا نشد</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              عبارت جستجو را تغییر دهید یا یک قالب پیش‌نویس جدید ایجاد کنید.
            </p>
            <button
              onClick={addTemplate}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              ایجاد قالب جدید
            </button>
          </div>
        )}

        {filteredTemplates.length > 0 && (
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.005, y: -2 }}
                className="bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 sm:p-6 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-white">{template.title}</h3>
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
                        <p className="text-sm text-slate-400">{template.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => duplicateTemplate(template)}
                          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                          title="تکثیر"
                        >
                          <Copy className="w-4 h-4" />
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
                          onClick={() => navigate('/policies/add')}
                          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                          title="ویرایش"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>دسته‌بندی:</span>
                        <span className="text-slate-300 font-medium">{template.category}</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-700 rounded-full" />
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        <span>{template.assignees} نفر تخصیص</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-700 rounded-full" />
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>آخرین بروزرسانی: {template.updatedAt}</span>
                      </div>
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
