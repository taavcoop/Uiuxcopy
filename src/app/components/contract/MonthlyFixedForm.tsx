import {
  Info,
  TrendingUp,
  Shield,
  Award,
  Clock,
  DollarSign,
  Zap,
  CheckCircle2,
  XCircle,
  Plane,
} from 'lucide-react';
import type { MonthlyFixedAgreement } from '../../contract/types';
import {
  autoArrangeAgreementByTotal,
  formatCurrency,
  LEGAL_CONSTANTS_2026,
} from '../../contract/salaryCalculations';
import CalculationPreview from './CalculationPreview';

type MonthlyFixedFormProps = {
  agreement: MonthlyFixedAgreement;
  onChange: (agreement: MonthlyFixedAgreement) => void;
  disabled?: boolean;
};

export default function MonthlyFixedForm({
  agreement,
  onChange,
  disabled,
}: MonthlyFixedFormProps) {
  const update = (field: Partial<MonthlyFixedAgreement>) => {
    onChange({ ...agreement, ...field });
  };

  const totalFixedEarnings =
    agreement.baseSalary +
    agreement.seniorityBase * 30 +
    agreement.housingAllowance +
    agreement.foodAllowance +
    agreement.maritalAllowance;

  const totalJobRelated =
    agreement.attractionAllowance +
    agreement.managementAllowance +
    agreement.transportAllowance +
    agreement.hardshipAllowance +
    agreement.otherAllowance;

  const legalMinimumTotal =
    LEGAL_CONSTANTS_2026.minimumDailyWage * 30 +
    LEGAL_CONSTANTS_2026.seniorityBaseDailyRate * 30 +
    LEGAL_CONSTANTS_2026.housingAllowanceMonthly +
    LEGAL_CONSTANTS_2026.foodAllowanceMonthly +
    LEGAL_CONSTANTS_2026.maritalAllowanceMonthly;
  const agreedGap = agreement.agreedTotalAmount - legalMinimumTotal;
  const isTotalMode = agreement.entryMode === 'total-agreed';
  const legalComponentsLocked = disabled || isTotalMode;

  const handleAutoArrange = () => {
    const result = autoArrangeAgreementByTotal(
      agreement,
      agreement.agreedTotalAmount,
      agreement.surplusAllocation
    );
    if (!result.isFeasible) return;
    onChange(result.updatedAgreement);
  };

  // ط¨ط±ط±ط³غŒ ط´غŒظپطھ ظپط¹ط§ظ„
  const hasActiveShift = Object.values(agreement.shiftModels).some((m) => m.enabled);

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/60 rounded-xl border border-cyan-500/30 p-6 space-y-4">
        <div className="flex items-start gap-3 pb-4 border-b">
          <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
            <Zap className="text-cyan-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-cyan-900 mb-1">ط­ط§ظ„طھ طھظˆط§ظپظ‚ ظ…ط§ظ„غŒ</h3>
            <p className="text-sm text-cyan-700">
              ظ…غŒâ€Œطھظˆط§ظ†غŒط¯ ط¬ط²ط¦غŒط§طھ ط±ط§ ط¯ط³طھغŒ ظˆط§ط±ط¯ ع©ظ†غŒط¯ غŒط§ ظپظ‚ط· ظ…ط¨ظ„ط؛ ع©ظ„ طھظˆط§ظپظ‚غŒ ط±ط§ ط¨ط¯ظ‡غŒط¯
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => !disabled && update({ entryMode: 'breakdown' })}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              agreement.entryMode === 'breakdown'
                ? 'bg-cyan-600 text-white border-cyan-600'
                : 'bg-slate-900/60 text-cyan-700 border-cyan-300 hover:bg-cyan-500/10'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ظˆط±ظˆط¯ ط¯ط³طھغŒ ط§ط¬ط²ط§
          </button>
          <button
            type="button"
            onClick={() => !disabled && update({ entryMode: 'total-agreed' })}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              agreement.entryMode === 'total-agreed'
                ? 'bg-cyan-600 text-white border-cyan-600'
                : 'bg-slate-900/60 text-cyan-700 border-cyan-300 hover:bg-cyan-500/10'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ظ…ط¨ظ„ط؛ ع©ظ„ طھظˆط§ظپظ‚غŒ
          </button>
        </div>

        {isTotalMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">ظ…ط¨ظ„ط؛ ع©ظ„ طھظˆط§ظپظ‚غŒ ظ…ط§ظ‡ط§ظ†ظ‡ (ط±غŒط§ظ„)</label>
              <input
                type="number"
                value={agreement.agreedTotalAmount}
                onChange={(e) =>
                  update({ agreedTotalAmount: parseInt(e.target.value) || 0 })
                }
                disabled={disabled}
                className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
              />
              <p className="text-xs text-slate-500 mt-1">
                ط­ط¯ط§ظ‚ظ„ ظ‚ط§ط¨ظ„ طھط®طµغŒطµ ظ‚ط§ظ†ظˆظ†غŒ: {formatCurrency(legalMinimumTotal)} ط±غŒط§ظ„
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2">طھط®طµغŒطµ ط¨ط§ظ‚غŒظ…ط§ظ†ط¯ظ‡ ط¨ظ‡</label>
              <select
                value={agreement.surplusAllocation}
                onChange={(e) =>
                  update({
                    surplusAllocation: e.target.value as 'attraction' | 'other',
                  })
                }
                disabled={disabled}
                className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
              >
                <option value="attraction">ط­ظ‚ ط¬ط°ط¨</option>
                <option value="other">ط³ط§غŒط± ظ…ط²ط§غŒط§</option>
              </select>
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <p className="text-sm text-cyan-900">
                {agreedGap >= 0
                  ? `ظ…ط§ط²ط§ط¯ ظ‚ط§ط¨ظ„ طھط®طµغŒطµ: ${formatCurrency(agreedGap)} ط±غŒط§ظ„`
                  : `ع©ط³ط±غŒ ظ†ط³ط¨طھ ط¨ظ‡ ط­ط¯ط§ظ‚ظ„ ظ‚ط§ظ†ظˆظ†غŒ: ${formatCurrency(Math.abs(agreedGap))} ط±غŒط§ظ„`}
              </p>
              <button
                type="button"
                onClick={handleAutoArrange}
                disabled={disabled || agreedGap < 0}
                className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                ع†غŒط¯ظ…ط§ظ† ط®ظˆط¯ع©ط§ط± ظ…ظˆظ„ظپظ‡â€Œظ‡ط§
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ط¨ط®ط´ ط§ظˆظ„: ظ…ظˆظ„ظپظ‡â€Œظ‡ط§غŒ ط§طµظ„غŒ ط­ع©ظ…غŒ */}
      <div className="bg-slate-900/60 rounded-xl border border-blue-500/30 p-6 space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <DollarSign className="text-blue-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-blue-900 mb-1">ظ…ظˆظ„ظپظ‡â€Œظ‡ط§غŒ ط§طµظ„غŒ ط­ع©ظ…غŒ</h3>
            <p className="text-sm text-blue-700">
              ط§ظ‚ظ„ط§ظ…غŒ ع©ظ‡ ط¯ط± ظ‚ط±ط§ط±ط¯ط§ط¯ ط°ع©ط± ظ…غŒâ€Œط´ظˆظ†ط¯ ظˆ ظ…ط¨ظ†ط§غŒ ظ…ط­ط§ط³ط¨ظ‡ ط³ط§غŒط± ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡â€Œظ‡ط§ ظ‡ط³طھظ†ط¯
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ط­ظ‚ظˆظ‚ ظ¾ط§غŒظ‡ */}
          <div>
            <label className="block text-sm mb-2 flex items-center gap-2">
              ظ…ط²ط¯ ظ…ط§ظ‡ط§ظ†ظ‡ (ط­ظ‚ظˆظ‚ ظ¾ط§غŒظ‡)
              <button
                className="text-blue-500 hover:text-blue-700"
                title="ط­ط¯ط§ظ‚ظ„ ط¯ط³طھظ…ط²ط¯: غ¶غ²,غµغ°غ°,غ°غ°غ° ط±غŒط§ظ„"
              >
                <Info size={14} />
              </button>
            </label>
            <input
              type="number"
              value={agreement.baseSalary}
              onChange={(e) => update({ baseSalary: parseInt(e.target.value) || 0 })}
              disabled={legalComponentsLocked}
              min={LEGAL_CONSTANTS_2026.minimumDailyWage * 30}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(agreement.baseSalary)} ط±غŒط§ظ„ â€¢ ط­ط¯ط§ظ‚ظ„ ظ‚ط§ظ†ظˆظ†غŒ:{' '}
              {formatCurrency(LEGAL_CONSTANTS_2026.minimumDailyWage * 30)} ط±غŒط§ظ„
            </p>
          </div>

          {/* ظ¾ط§غŒظ‡ ط³ظ†ظˆط§طھ */}
          <div>
            <label className="block text-sm mb-2 flex items-center gap-2">
              ظ¾ط§غŒظ‡ ط³ظ†ظˆط§طھ (ط±ظˆط²ط§ظ†ظ‡)
              <button
                className="text-blue-500 hover:text-blue-700"
                title="ط¨ط±ط§غŒ ع©ط§ط±ظ…ظ†ط¯ط§ظ† ط¨ط§ ط¨غŒط´ ط§ط² 1 ط³ط§ظ„ ط³ط§ط¨ظ‚ظ‡"
              >
                <Info size={14} />
              </button>
            </label>
            <input
              type="number"
              value={agreement.seniorityBase}
              onChange={(e) => update({ seniorityBase: parseInt(e.target.value) || 0 })}
              disabled={legalComponentsLocked}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(agreement.seniorityBase)} ط±غŒط§ظ„/ط±ظˆط² â€¢ ظ…ط§ظ‡غŒط§ظ†ظ‡:{' '}
              {formatCurrency(agreement.seniorityBase * 30)} ط±غŒط§ظ„
            </p>
          </div>

          {/* ط­ظ‚ ظ…ط³ع©ظ† */}
          <div>
            <label className="block text-sm mb-2">ط­ظ‚ ظ…ط³ع©ظ†</label>
            <input
              type="number"
              value={agreement.housingAllowance}
              onChange={(e) => update({ housingAllowance: parseInt(e.target.value) || 0 })}
              disabled={legalComponentsLocked}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(agreement.housingAllowance)} ط±غŒط§ظ„ â€¢ ظ¾غŒط´ظ†ظ‡ط§ط¯غŒ:{' '}
              {formatCurrency(LEGAL_CONSTANTS_2026.housingAllowanceMonthly)} ط±غŒط§ظ„
            </p>
          </div>

          {/* ط¨ظ† ط®ظˆط§ط±ط¨ط§ط± */}
          <div>
            <label className="block text-sm mb-2">ط¨ظ† ط®ظˆط§ط±ط¨ط§ط± (ع©ظ…ع© ظ‡ط²غŒظ†ظ‡ ط§ظ‚ظ„ط§ظ… ظ…طµط±ظپغŒ)</label>
            <input
              type="number"
              value={agreement.foodAllowance}
              onChange={(e) => update({ foodAllowance: parseInt(e.target.value) || 0 })}
              disabled={legalComponentsLocked}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(agreement.foodAllowance)} ط±غŒط§ظ„ â€¢ ظ¾غŒط´ظ†ظ‡ط§ط¯غŒ:{' '}
              {formatCurrency(LEGAL_CONSTANTS_2026.foodAllowanceMonthly)} ط±غŒط§ظ„
            </p>
          </div>

          {/* ط­ظ‚ ط§ظˆظ„ط§ط¯ */}
          <div>
            <label className="block text-sm mb-2 flex items-center gap-2">
              ط­ظ‚ ط§ظˆظ„ط§ط¯ (ط¨ظ‡ ط§ط²ط§غŒ ظ‡ط± ظپط±ط²ظ†ط¯)
              <button
                className="text-blue-500 hover:text-blue-700"
                title="3 ط¨ط±ط§ط¨ط± ط­ط¯ط§ظ‚ظ„ ط¯ط³طھظ…ط²ط¯ ط±ظˆط²ط§ظ†ظ‡"
              >
                <Info size={14} />
              </button>
            </label>
            <input
              type="number"
              value={agreement.childAllowancePerChild}
              onChange={(e) =>
                update({ childAllowancePerChild: parseInt(e.target.value) || 0 })
              }
              disabled={legalComponentsLocked}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(agreement.childAllowancePerChild)} ط±غŒط§ظ„/ظپط±ط²ظ†ط¯ â€¢ ظ¾غŒط´ظ†ظ‡ط§ط¯غŒ:{' '}
              {formatCurrency(LEGAL_CONSTANTS_2026.minimumDailyWage * 3)} ط±غŒط§ظ„
            </p>
          </div>

          {/* ط­ظ‚ طھط§ظ‡ظ„ */}
          <div>
            <label className="block text-sm mb-2">ط­ظ‚ طھط§ظ‡ظ„ (ظ…ط§ظ‡غŒط§ظ†ظ‡)</label>
            <input
              type="number"
              value={agreement.maritalAllowance}
              onChange={(e) => update({ maritalAllowance: parseInt(e.target.value) || 0 })}
              disabled={legalComponentsLocked}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(agreement.maritalAllowance)} ط±غŒط§ظ„ â€¢ ظ¾غŒط´ظ†ظ‡ط§ط¯غŒ:{' '}
              {formatCurrency(LEGAL_CONSTANTS_2026.maritalAllowanceMonthly)} ط±غŒط§ظ„
            </p>
          </div>
        </div>

        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
          <p className="text-sm text-blue-800">
            <strong>ظ…ط¬ظ…ظˆط¹ ظ…ظˆظ„ظپظ‡â€Œظ‡ط§غŒ ط§طµظ„غŒ:</strong>{' '}
            {formatCurrency(totalFixedEarnings)} ط±غŒط§ظ„
          </p>
        </div>
      </div>

      {/* ط¨ط®ط´ ط¯ظˆظ…: ظ…ط²ط§غŒط§غŒ ط¨ظ‡ طھط¨ط¹ ط´ط؛ظ„ */}
      <div className="bg-slate-900/60 rounded-xl border border-emerald-500/30 p-6 space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Award className="text-green-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-green-900 mb-1">ظ…ط²ط§غŒط§غŒ ط¨ظ‡ طھط¨ط¹ ط´ط؛ظ„</h3>
            <p className="text-sm text-green-700">
              ظ…ط¨ط§ظ„ط؛ ط«ط§ط¨طھ ط¨ط±ط§غŒ طھط´ظˆغŒظ‚ غŒط§ ط¬ط¨ط±ط§ظ† ط³ط®طھغŒ ع©ط§ط±
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">ط­ظ‚ ط¬ط°ط¨ / ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡ ط´ط؛ظ„</label>
            <input
              type="number"
              value={agreement.attractionAllowance}
              onChange={(e) =>
                update({ attractionAllowance: parseInt(e.target.value) || 0 })
              }
              disabled={legalComponentsLocked}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(agreement.attractionAllowance)} ط±غŒط§ظ„
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2">ط­ظ‚ ظ…ط¯غŒط±غŒطھ ظˆ ظ…ط³ط¦ظˆظ„غŒطھ</label>
            <input
              type="number"
              value={agreement.managementAllowance}
              onChange={(e) =>
                update({ managementAllowance: parseInt(e.target.value) || 0 })
              }
              disabled={legalComponentsLocked}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(agreement.managementAllowance)} ط±غŒط§ظ„
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2">ط­ظ‚ ط§غŒط§ط¨ ظˆ ط°ظ‡ط§ط¨</label>
            <input
              type="number"
              value={agreement.transportAllowance}
              onChange={(e) =>
                update({ transportAllowance: parseInt(e.target.value) || 0 })
              }
              disabled={legalComponentsLocked}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(agreement.transportAllowance)} ط±غŒط§ظ„
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2">ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡ ط³ط®طھغŒ ع©ط§ط±</label>
            <input
              type="number"
              value={agreement.hardshipAllowance}
              onChange={(e) =>
                update({ hardshipAllowance: parseInt(e.target.value) || 0 })
              }
              disabled={legalComponentsLocked}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(agreement.hardshipAllowance)} ط±غŒط§ظ„
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2">ط³ط§غŒط± ظ…ط²ط§غŒط§</label>
            <input
              type="number"
              value={agreement.otherAllowance}
              onChange={(e) => update({ otherAllowance: parseInt(e.target.value) || 0 })}
              disabled={legalComponentsLocked}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(agreement.otherAllowance)} ط±غŒط§ظ„
            </p>
          </div>
        </div>

        {totalJobRelated > 0 && (
          <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/30">
            <p className="text-sm text-green-800">
              <strong>ظ…ط¬ظ…ظˆط¹ ظ…ط²ط§غŒط§غŒ ط¨ظ‡ طھط¨ط¹ ط´ط؛ظ„:</strong>{' '}
              {formatCurrency(totalJobRelated)} ط±غŒط§ظ„
            </p>
          </div>
        )}
      </div>

      {/* ط¨ط®ط´ ط³ظˆظ…: ظ…ظˆظ„ظپظ‡â€Œظ‡ط§غŒ ظ…ظˆط«ط± ط¯ط± ظ…ط²ط¯ ظ…ط¨ظ†ط§ */}
      <div className="bg-slate-900/60 rounded-xl border-2 border-purple-100 p-6 space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Zap className="text-purple-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-purple-900 mb-1">ظ…ظˆظ„ظپظ‡â€Œظ‡ط§غŒ ظ…ظˆط«ط± ط¯ط± ظ…ط²ط¯ ظ…ط¨ظ†ط§</h3>
            <p className="text-sm text-purple-700">
              ظ…ط´ط®طµ ع©ظ†غŒط¯ ع©ط¯ط§ظ… ظ…ظˆظ„ظپظ‡â€Œظ‡ط§ ط¯ط± ظ…ط­ط§ط³ط¨ظ‡ ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡â€Œظ‡ط§ (ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒطŒ ط´ط¨â€Œع©ط§ط±غŒطŒ
              ...) ظ„ط­ط§ط¸ ط´ظˆظ†ط¯
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 mb-4">
          <Info className="text-amber-600 flex-shrink-0" size={20} />
          <p className="text-sm text-amber-800">
            ظ…ط²ط¯ ظ…ط¨ظ†ط§ = ظ…ط¬ظ…ظˆط¹ ظ…ظˆظ„ظپظ‡â€Œظ‡ط§غŒ ظپط¹ط§ظ„ ط´ط¯ظ‡ ط²غŒط±. ط§غŒظ† ظ…ظ‚ط¯ط§ط± ط¨ط±ط§غŒ ظ…ط­ط§ط³ط¨ظ‡ ظ†ط±ط® ط³ط§ط¹طھغŒ
            ظˆ ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡â€Œظ‡ط§ ط§ط³طھظپط§ط¯ظ‡ ظ…غŒâ€Œط´ظˆط¯.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'baseSalary', label: 'ط­ظ‚ظˆظ‚ ظ¾ط§غŒظ‡', value: agreement.baseSalary },
            {
              key: 'seniorityBase',
              label: 'ظ¾ط§غŒظ‡ ط³ظ†ظˆط§طھ',
              value: agreement.seniorityBase * 30,
            },
            {
              key: 'attractionAllowance',
              label: 'ط­ظ‚ ط¬ط°ط¨',
              value: agreement.attractionAllowance,
            },
            {
              key: 'managementAllowance',
              label: 'ط­ظ‚ ظ…ط¯غŒط±غŒطھ',
              value: agreement.managementAllowance,
            },
            {
              key: 'transportAllowance',
              label: 'ط§غŒط§ط¨ ظˆ ط°ظ‡ط§ط¨',
              value: agreement.transportAllowance,
            },
            {
              key: 'hardshipAllowance',
              label: 'ط³ط®طھغŒ ع©ط§ط±',
              value: agreement.hardshipAllowance,
            },
          ].map((item) => {
            const isEnabled =
              agreement.wageBaseComponents[
                item.key as keyof typeof agreement.wageBaseComponents
              ];
            return (
              <button
                key={item.key}
                onClick={() =>
                  !disabled &&
                  update({
                    wageBaseComponents: {
                      ...agreement.wageBaseComponents,
                      [item.key]: !isEnabled,
                    },
                  })
                }
                disabled={disabled}
                className={`
                  p-4 rounded-lg border-2 transition-all text-right
                  ${
                    isEnabled
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-gray-50'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-100">{item.label}</p>
                    <p className="text-sm text-slate-400">
                      {formatCurrency(item.value)} ط±غŒط§ظ„
                    </p>
                  </div>
                  {isEnabled ? (
                    <CheckCircle2 className="text-purple-600" size={24} />
                  ) : (
                    <XCircle className="text-gray-400" size={24} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ط¨ط®ط´ ع†ظ‡ط§ط±ظ…: ظ†ظˆط¨طھâ€Œع©ط§ط±غŒ */}
      <div className="bg-slate-900/60 rounded-xl border-2 border-indigo-100 p-6 space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Clock className="text-indigo-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-indigo-900 mb-1">ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡ ظ†ظˆط¨طھâ€Œع©ط§ط±غŒ (ط´غŒظپطھ)</h3>
            <p className="text-sm text-indigo-700">
              طھظ†ط¸غŒظ…ط§طھ ظ…ط¯ظ„â€Œظ‡ط§غŒ ظ…ط®طھظ„ظپ ط´غŒظپطھâ€Œط¨ظ†ط¯غŒ ظˆ ط¯ط±طµط¯ ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡ ظ‡ط± غŒع©
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'twoShifts' as const, label: 'ط¯ظˆ ط´غŒظپطھ (طµط¨ط­ ظˆ ط¹طµط±)', default: 10 },
            {
              key: 'threeShifts' as const,
              label: 'ط³ظ‡ ط´غŒظپطھ (طµط¨ط­طŒ ط¹طµط± ظˆ ط´ط¨)',
              default: 15,
            },
            { key: 'dayNight' as const, label: 'طµط¨ط­ ظˆ ط´ط¨', default: 22.5 },
            { key: 'afternoonNight' as const, label: 'ط¹طµط± ظˆ ط´ط¨', default: 22.5 },
          ].map((shift) => {
            const model = agreement.shiftModels[shift.key];
            return (
              <div
                key={shift.key}
                className={`p-4 rounded-lg border-2 transition-all ${
                  model.enabled
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <label className="font-medium text-slate-100 cursor-pointer">
                    {shift.label}
                  </label>
                  <button
                    onClick={() =>
                      !disabled &&
                      update({
                        shiftModels: {
                          ...agreement.shiftModels,
                          [shift.key]: {
                            ...model,
                            enabled: !model.enabled,
                          },
                        },
                      })
                    }
                    disabled={disabled}
                    className={`
                      relative w-12 h-7 rounded-full transition-colors
                      ${model.enabled ? 'bg-indigo-600' : 'bg-gray-300'}
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <span
                      className={`
                        absolute top-0.5 w-6 h-6 bg-slate-900/60 rounded-full shadow-md transition-transform
                        ${model.enabled ? 'left-0.5' : 'right-0.5'}
                      `}
                    />
                  </button>
                </div>

                {model.enabled && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      ط¯ط±طµط¯ ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡
                    </label>
                    <input
                      type="number"
                      value={model.percent}
                      onChange={(e) =>
                        update({
                          shiftModels: {
                            ...agreement.shiftModels,
                            [shift.key]: {
                              ...model,
                              percent: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      disabled={disabled}
                      step={0.5}
                      className="w-full px-3 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm disabled:bg-slate-800/40"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      ظ…ط¨ظ„ط؛ ظ…ط§ظ‡غŒط§ظ†ظ‡:{' '}
                      {formatCurrency(
                        ((agreement.baseSalary + agreement.seniorityBase * 30) *
                          model.percent) /
                          100
                      )}{' '}
                      ط±غŒط§ظ„
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {hasActiveShift && (
          <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/30">
            <p className="text-sm text-indigo-800">
              ًں’، ظپظ‚ط· غŒع© ظ…ط¯ظ„ ط´غŒظپطھ ط¨ط±ط§غŒ ظ‡ط± ظ†غŒط±ظˆغŒ ع©ط§ط± ط¯ط± ظ‡ط± ط²ظ…ط§ظ† ظپط¹ط§ظ„ ط§ط³طھ. ط§ع¯ط± ظ…ط¯ظ„ ط´غŒظپطھ
              طھط؛غŒغŒط± ع©ظ†ط¯طŒ ظ…غŒâ€Œطھظˆط§ظ†غŒط¯ ظ…ط¯ظ„ ط¯غŒع¯ط±غŒ ط±ط§ ظپط¹ط§ظ„ ع©ظ†غŒط¯.
            </p>
          </div>
        )}
      </div>

      {/* ط¨ط®ط´ ظ¾ظ†ط¬ظ…: ط¶ط±ط§غŒط¨ ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡â€Œظ‡ط§ */}
      <div className="bg-slate-900/60 rounded-xl border-2 border-orange-100 p-6 space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-orange-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-orange-900 mb-1">ط¶ط±ط§غŒط¨ ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡â€Œظ‡ط§</h3>
            <p className="text-sm text-orange-700">
              طھظ†ط¸غŒظ… ط¶ط±ط§غŒط¨ ظ…ط­ط§ط³ط¨ط§طھغŒ ط¨ط±ط§غŒ ط§ظ†ظˆط§ط¹ ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡â€Œظ‡ط§
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">ط¶ط±غŒط¨ ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ</label>
            <input
              type="number"
              value={agreement.coefficients.overtime}
              onChange={(e) =>
                update({
                  coefficients: {
                    ...agreement.coefficients,
                    overtime: parseFloat(e.target.value) || 0,
                  },
                })
              }
              disabled={disabled}
              step={0.1}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              ظ¾غŒط´â€Œظپط±ط¶ ظ‚ط§ظ†ظˆظ†غŒ: 1.4 (40% ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡)
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2">ط¶ط±غŒط¨ ط´ط¨â€Œع©ط§ط±غŒ (22 طھط§ 6 طµط¨ط­)</label>
            <input
              type="number"
              value={agreement.coefficients.nightWork}
              onChange={(e) =>
                update({
                  coefficients: {
                    ...agreement.coefficients,
                    nightWork: parseFloat(e.target.value) || 0,
                  },
                })
              }
              disabled={disabled}
              step={0.1}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              ظ¾غŒط´â€Œظپط±ط¶ ظ‚ط§ظ†ظˆظ†غŒ: 1.35 (35% ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡)
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2">ط¶ط±غŒط¨ طھط¹ط·غŒظ„â€Œع©ط§ط±غŒ (طھط¹ط·غŒظ„ط§طھ ط±ط³ظ…غŒ)</label>
            <input
              type="number"
              value={agreement.coefficients.holidayWork}
              onChange={(e) =>
                update({
                  coefficients: {
                    ...agreement.coefficients,
                    holidayWork: parseFloat(e.target.value) || 0,
                  },
                })
              }
              disabled={disabled}
              step={0.1}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              ظ¾غŒط´â€Œظپط±ط¶ ظ‚ط§ظ†ظˆظ†غŒ: 1.4 (40% ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡)
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2">ط¶ط±غŒط¨ ط¬ظ…ط¹ظ‡â€Œع©ط§ط±غŒ (ط¨ط§ ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ)</label>
            <input
              type="number"
              value={agreement.coefficients.fridayWork}
              onChange={(e) =>
                update({
                  coefficients: {
                    ...agreement.coefficients,
                    fridayWork: parseFloat(e.target.value) || 0,
                  },
                })
              }
              disabled={disabled}
              step={0.1}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              ظ¾غŒط´â€Œظپط±ط¶ ظ‚ط§ظ†ظˆظ†غŒ: 1.8 (40% ط¬ظ…ط¹ظ‡ + 40% ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ)
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-2">
              ط¶ط±غŒط¨ ط¬ظ…ط¹ظ‡â€Œع©ط§ط±غŒ (ط¨ط¯ظˆظ† ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ - ط¬ط§غŒع¯ط²غŒظ† ط±ظˆط² ط¯غŒع¯ط±)
            </label>
            <input
              type="number"
              value={agreement.coefficients.fridayWorkNoOvertime}
              onChange={(e) =>
                update({
                  coefficients: {
                    ...agreement.coefficients,
                    fridayWorkNoOvertime: parseFloat(e.target.value) || 0,
                  },
                })
              }
              disabled={disabled}
              step={0.1}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              ظ¾غŒط´â€Œظپط±ط¶ ظ‚ط§ظ†ظˆظ†غŒ: 1.4 (ظپظ‚ط· 40% ط¬ظ…ط¹ظ‡)
            </p>
          </div>
        </div>
      </div>

      {/* ط¨ط®ط´ ط´ط´ظ…: ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡ ظ…ط£ظ…ظˆط±غŒطھ */}
      <div className="bg-slate-900/60 rounded-xl border-2 border-teal-100 p-6 space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Plane className="text-teal-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-teal-900 mb-1">ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡ ظ…ط£ظ…ظˆط±غŒطھ</h3>
            <p className="text-sm text-teal-700">
              طھظ†ط¸غŒظ…ط§طھ ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡ ط¨ط±ط§غŒ ع©ط§ط±ظ…ظ†ط¯ط§ظ† ط¯ط± ظ…ط£ظ…ظˆط±غŒطھ
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
          <div>
            <p className="font-medium text-teal-900">ظپط¹ط§ظ„â€Œط³ط§ط²غŒ ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡ ظ…ط£ظ…ظˆط±غŒطھ</p>
            <p className="text-sm text-teal-700">
              ط·ط¨ظ‚ ظ‚ط§ظ†ظˆظ†طŒ ط­ط¯ط§ظ‚ظ„ ظ…ط²ط¯ ط±ظˆط²ط§ظ†ظ‡ ع©ط§ط±ظ…ظ†ط¯
            </p>
          </div>
          <button
            onClick={() =>
              !disabled &&
              update({
                missionAllowance: {
                  ...agreement.missionAllowance,
                  enabled: !agreement.missionAllowance.enabled,
                },
              })
            }
            disabled={disabled}
            className={`
              relative w-14 h-8 rounded-full transition-colors duration-200
              ${agreement.missionAllowance.enabled ? 'bg-teal-600' : 'bg-gray-300'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span
              className={`
                absolute top-1 w-6 h-6 bg-slate-900/60 rounded-full shadow-md transition-transform duration-200
                ${agreement.missionAllowance.enabled ? 'left-1' : 'right-1'}
              `}
            />
          </button>
        </div>

        {agreement.missionAllowance.enabled && (
          <div>
            <label className="block text-sm mb-2">ط­ط¯ط§ظ‚ظ„ ظ…ط²ط¯ ط±ظˆط²ط§ظ†ظ‡ ظ…ط£ظ…ظˆط±غŒطھ (ط±غŒط§ظ„)</label>
            <input
              type="number"
              value={agreement.missionAllowance.minimumDailyRate}
              onChange={(e) =>
                update({
                  missionAllowance: {
                    ...agreement.missionAllowance,
                    minimumDailyRate: parseInt(e.target.value) || 0,
                  },
                })
              }
              disabled={disabled}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(agreement.missionAllowance.minimumDailyRate)} ط±غŒط§ظ„/ط±ظˆط² â€¢
              ظ¾غŒط´ظ†ظ‡ط§ط¯غŒ: {formatCurrency(agreement.baseSalary / 30)} ط±غŒط§ظ„
            </p>
            <div className="bg-teal-50 rounded-lg p-3 mt-3 border border-teal-200">
              <p className="text-xs text-teal-800 leading-relaxed">
                ًں’، ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡ ظ…ط£ظ…ظˆط±غŒطھ ظ…ط¹ط§ظپ ط§ط² ط¨غŒظ…ظ‡ ظˆ ظ…ط§ظ„غŒط§طھ ط§ط³طھ. ظ‡ط²غŒظ†ظ‡ ط³ظپط± ظˆ ط§ظ‚ط§ظ…طھ ظ†غŒط²
                ط¨ط§ ع©ط§ط±ظپط±ظ…ط§ط³طھ.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ط¨ط®ط´ ظ‡ظپطھظ…: طھظ†ط¸غŒظ…ط§طھ ظ¾ط±ط¯ط§ط®طھ */}
      <div className="bg-slate-900/60 rounded-xl border-2 border-amber-100 p-6 space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-amber-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-amber-900 mb-1">طھظ†ط¸غŒظ…ط§طھ ط¹غŒط¯غŒ ظˆ ط³ظ†ظˆط§طھ</h3>
            <p className="text-sm text-amber-700">
              ظ†ط­ظˆظ‡ ظ¾ط±ط¯ط§ط®طھ ط¹غŒط¯غŒ ظˆ ط³ظ†ظˆط§طھ ظ¾ط§غŒط§ظ† ط®ط¯ظ…طھ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">طھط¹ط¯ط§ط¯ ظ…ط§ظ‡ ط¹غŒط¯غŒ</label>
            <input
              type="number"
              value={agreement.bonusMonths}
              onChange={(e) => update({ bonusMonths: parseInt(e.target.value) || 0 })}
              disabled={disabled}
              min={0}
              max={3}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">ظ…ط¹ظ…ظˆظ„ط§ 2 ظ…ط§ظ‡ (ط­ط¯ط§ع©ط«ط± 3 ظ…ط§ظ‡)</p>
          </div>

          <div>
            <label className="block text-sm mb-2">ظ†ط­ظˆظ‡ ظ¾ط±ط¯ط§ط®طھ ط¹غŒط¯غŒ</label>
            <select
              value={agreement.bonusPaymentType}
              onChange={(e) =>
                update({
                  bonusPaymentType: e.target.value as 'monthly' | 'annual',
                })
              }
              disabled={disabled}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            >
              <option value="annual">ط³ط§ظ„ط§ظ†ظ‡ (ظ¾ط§غŒط§ظ† ط³ط§ظ„)</option>
              <option value="monthly">ظ…ط§ظ‡غŒط§ظ†ظ‡ (طھظˆط²غŒط¹ ط´ط¯ظ‡)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-2">ظ†ط­ظˆظ‡ ظ¾ط±ط¯ط§ط®طھ ط³ظ†ظˆط§طھ</label>
            <select
              value={agreement.severancePaymentType}
              onChange={(e) =>
                update({
                  severancePaymentType: e.target.value as
                    | 'monthly'
                    | 'end-of-service',
                })
              }
              disabled={disabled}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            >
              <option value="end-of-service">ظ¾ط§غŒط§ظ† ط®ط¯ظ…طھ</option>
              <option value="monthly">ظ…ط§ظ‡غŒط§ظ†ظ‡ (طھظˆط²غŒط¹ ط´ط¯ظ‡)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ط¨ط®ط´ ظ‡ط´طھظ…: ع©ط³ظˆط±ط§طھ */}
      <div className="bg-slate-900/60 rounded-xl border-2 border-red-100 p-6 space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Shield className="text-red-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-red-900 mb-1">ع©ط³ظˆط±ط§طھ ظ‚ط§ظ†ظˆظ†غŒ</h3>
            <p className="text-sm text-red-700">ط¨غŒظ…ظ‡ ظˆ ظ…ط§ظ„غŒط§طھ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">ظ†ط±ط® ط¨غŒظ…ظ‡ ع©ط§ط±ظ…ظ†ط¯ (%)</label>
            <input
              type="number"
              value={agreement.insuranceRate * 100}
              onChange={(e) =>
                update({ insuranceRate: parseFloat(e.target.value) / 100 || 0 })
              }
              disabled={disabled}
              step={0.1}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              ظ†ط±ط® ظ‚ط§ظ†ظˆظ†غŒ: 7% (ط³ظ‡ظ… ع©ط§ط±ظپط±ظ…ط§: 23%)
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2">ظ…ط¹ط§ظپغŒطھ ظ…ط§ظ„غŒط§طھغŒ ظ…ط§ظ‡ط§ظ†ظ‡ (ط±غŒط§ظ„)</label>
            <input
              type="number"
              value={agreement.taxExemption}
              onChange={(e) => update({ taxExemption: parseInt(e.target.value) || 0 })}
              disabled={disabled}
              className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none disabled:bg-slate-800/40"
            />
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(agreement.taxExemption)} ط±غŒط§ظ„ â€¢ ظ¾غŒط´ظ†ظ‡ط§ط¯غŒ:{' '}
              {formatCurrency(LEGAL_CONSTANTS_2026.monthlyTaxExemption)} ط±غŒط§ظ„
            </p>
          </div>
        </div>
      </div>

      {/* ظ¾غŒط´â€Œظ†ظ…ط§غŒط´ ظ…ط­ط§ط³ط¨ط§طھ */}
      <CalculationPreview agreement={agreement} />
    </div>
  );
}

