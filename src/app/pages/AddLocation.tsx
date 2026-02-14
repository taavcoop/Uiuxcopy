import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Map } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AddLocation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    radius: '150',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form data:', formData);
    navigate('/locations');
  };

  const handleCancel = () => {
    navigate('/locations');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-5rem)]">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => navigate('/locations')}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-white">افزودن دفتر کار</h1>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Map Section */}
            <div>
              <div className="bg-slate-800/50 border border-white/5 rounded-xl h-48 flex items-center justify-center text-slate-500 text-sm mb-2">
                <div className="text-center">
                  <Map className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <span>نقشه در ارتباط نمایش داده می‌شود</span>
                </div>
              </div>
            </div>

            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                عنوان
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="شعبه صدر برای تیم تبریز (مثال)"
                className="w-full bg-slate-800/50 border border-white/5 hover:border-white/10 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            {/* Location and Radius Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  محل نقل مکان مرکزی
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="محل نقل مکان مرکزی"
                  className="w-full bg-slate-800/50 border border-white/5 hover:border-white/10 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              {/* Radius Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  حداکثر
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.radius}
                    onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                    placeholder="150"
                    className="w-full bg-slate-800/50 border border-white/5 hover:border-white/10 focus:border-indigo-500/50 rounded-xl py-3 px-4 pl-12 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    m
                  </span>
                </div>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                توضیحات
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="توضیحات محل کار"
                rows={4}
                className="w-full bg-slate-800/50 border border-white/5 hover:border-white/10 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 sm:flex-none sm:px-8 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
              >
                ذخیره
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 sm:flex-none sm:px-8 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-sm font-medium transition-all"
              >
                لغو/برگشت
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
