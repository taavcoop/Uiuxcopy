import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FileCode2, MapPin, Pencil, Plus, Trash2, UserCheck, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { SimpleTooltip } from '../components/ui/tooltip';

interface WorkGroup {
  id: string;
  name: string;
  description?: string;
  image?: string;
  location: string;
  membersCount: number;
  manager: string;
  policy: string;
  tags: string[];
}

// Mock data
const MOCK_WORK_GROUPS: WorkGroup[] = [
  {
    id: '1',
    name: 'تیم طراحی',
    description: 'تیم طراحی و تجربه کاربری',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
    location: 'دفتر مرکزی',
    membersCount: 5,
    manager: 'علی احمدی',
    policy: 'سیاست شیفت ثابت',
    tags: ['طراحی', 'UI/UX'],
  },
  {
    id: '2',
    name: 'تیم توسعه بک‌اند',
    description: 'تیم توسعه و نگهداری سیستم‌های بک‌اند',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop',
    location: 'شعبه شمال',
    membersCount: 8,
    manager: 'محمد رضایی',
    policy: 'سیاست شیفت شناور',
    tags: ['backend', 'Node.js'],
  },
];

export default function WorkGroups() {
  const navigate = useNavigate();
  const [workGroups, setWorkGroups] = useState<WorkGroup[]>(MOCK_WORK_GROUPS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setWorkGroups(workGroups.filter(group => group.id !== id));
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">گروه‌های کاری</h1>
            <p className="text-slate-400 text-sm mt-1">مدیریت و سازماندهی تیم‌های کاری</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/work-groups/add')}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            افزودن گروه کاری
          </motion.button>
        </div>

        {/* Empty State */}
        {workGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-slate-800/30 rounded-2xl p-8 text-center max-w-md">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-bold text-white mb-2">هنوز گروه کاری ایجاد نشده است</h2>
              <p className="text-sm text-slate-400 mb-6">
                برای شروع، گروه کاری خود را با افزودن اعضا و تعیین سیاست کاری اضافه کنید.
              </p>
              <button 
                onClick={() => navigate('/work-groups/add')}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all"
              >
                <Plus className="w-4 h-4" />
                افزودن اولین گروه کاری
              </button>
            </div>
          </div>
        )}

        {/* Work Groups List */}
        {workGroups.length > 0 && (
          <div className="space-y-3">
            {workGroups.map((group) => (
              <motion.div
                key={group.id}
                onMouseEnter={() => setHoveredId(group.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ scale: 1.01, x: 4 }}
                className="relative group cursor-pointer"
              >
                {/* Gradient Background */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition duration-300" />
                
                {/* Card - Compact Layout */}
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/50 hover:border-indigo-500/50 rounded-lg overflow-hidden transition-all shadow-lg hover:shadow-xl hover:shadow-indigo-500/10">
                  
                  <div className="flex items-center justify-between px-4 py-3">
                    {/* Left: Icon + Title Section */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Category Icon */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600/30 to-purple-600/30 flex items-center justify-center border border-indigo-500/20">
                        <Users className="w-5 h-5 text-indigo-400" />
                      </div>

                      {/* Title + Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{group.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {group.description && (
                            <p className="text-xs text-slate-400 truncate">{group.description}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Stats Section */}
                    <div className="hidden md:flex items-center gap-4 flex-shrink-0 px-3 border-l border-slate-700/50">
                      {/* Location */}
                      <SimpleTooltip content="محل">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-semibold text-slate-300">{group.location}</span>
                        </div>
                      </SimpleTooltip>

                      {/* Members */}
                      <SimpleTooltip content="تعداد اعضا">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-purple-400" />
                          <span className="text-xs font-bold text-purple-300">{group.membersCount}</span>
                        </div>
                      </SimpleTooltip>

                      {/* Manager */}
                      <SimpleTooltip content="مدیر گروه">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-green-400" />
                          <span className="text-xs font-semibold text-slate-300 truncate max-w-[80px]">{group.manager}</span>
                        </div>
                      </SimpleTooltip>

                      {/* Policy */}
                      <SimpleTooltip content="سیاست کاری">
                        <div className="flex items-center gap-1.5">
                          <FileCode2 className="w-4 h-4 text-pink-400" />
                          <span className="text-xs font-semibold text-slate-300 truncate max-w-[100px]">{group.policy}</span>
                        </div>
                      </SimpleTooltip>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                      {hoveredId === group.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex gap-1"
                        >
                          <SimpleTooltip content="ویرایش">
                            <button
                              onClick={() => navigate(`/work-groups/${group.id}`)}
                              className="p-1.5 text-slate-300 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition-all"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </SimpleTooltip>
                          <SimpleTooltip content="حذف">
                            <button
                              onClick={() => handleDelete(group.id)}
                              className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </SimpleTooltip>
                        </motion.div>
                      )}
                      
                      {hoveredId === group.id && (
                        <motion.button
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={() => navigate(`/work-groups/${group.id}`)}
                          className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded font-semibold text-xs transition-all shadow-lg whitespace-nowrap"
                        >
                          ویرایش
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Tags - Mobile Version (shown on smaller screens) */}
                  {group.tags.length > 0 && (
                    <div className="md:hidden px-4 pb-3 flex flex-wrap gap-1.5">
                      {group.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-indigo-500/15 border border-indigo-500/25 rounded text-xs font-medium text-indigo-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
