import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Plus, MoreVertical, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Location {
  id: string;
  name: string;
  address: string;
  radius: number;
  description?: string;
}

// Mock data
const MOCK_LOCATIONS: Location[] = [
  {
    id: '1',
    name: 'دفتر مرکزی',
    address: 'تهران، خیابان ولیعصر',
    radius: 100,
    description: 'دفتر اصلی شرکت',
  },
  {
    id: '2',
    name: 'شعبه شمال',
    address: 'تهران، سعادت‌آباد',
    radius: 150,
    description: 'شعبه شمال تهران',
  },
];

export default function Locations() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
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
              <h1 className="text-2xl sm:text-3xl font-black text-white">محل‌های کار</h1>
              <p className="text-sm text-slate-400 mt-1">مدیریت محل‌های جغرافیایی مجاز برای ثبت حضور و غیاب</p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/locations/add')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">افزودن محل کار</span>
            <span className="sm:hidden">افزودن</span>
          </button>
        </div>

        {/* Empty State */}
        {locations.length === 0 && (
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">هنوز محلی تعریف نشده</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              برای شروع، محل کار خود را با تعیین موقعیت جغرافیایی و شعاع مجاز اضافه کنید.
            </p>
            <button 
              onClick={() => navigate('/locations/add')}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              افزودن اولین محل کار
            </button>
          </div>
        )}

        {/* Locations List */}
        {locations.length > 0 && (
          <div className="space-y-3">
            {locations.map((location) => (
              <motion.div
                key={location.id}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 sm:p-6 transition-all group"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">{location.name}</h3>
                        <p className="text-sm text-slate-400">{location.address}</p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">شعاع مجاز:</span>
                        <span className="text-slate-300 font-medium">{location.radius} متر</span>
                      </div>
                      {location.description && (
                        <>
                          <div className="w-1 h-1 bg-slate-700 rounded-full" />
                          <span className="text-xs text-slate-500">{location.description}</span>
                        </>
                      )}
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
