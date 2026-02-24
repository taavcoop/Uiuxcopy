import { Calculator, TrendingUp } from 'lucide-react';
import type { MonthlyFixedAgreement } from '../../contract/types';
import { formatCurrency, LEGAL_CONSTANTS_2026 } from '../../contract/salaryCalculations';

type CalculationPreviewProps = {
  agreement: MonthlyFixedAgreement;
};

export default function CalculationPreview({ agreement }: CalculationPreviewProps) {
  // ظ…ط­ط§ط³ط¨ظ‡ ظ…ط²ط¯ ظ…ط¨ظ†ط§
  const wageBaseComponents: { [key: string]: number } = {};
  let wageBase = 0;

  if (agreement.wageBaseComponents.baseSalary && agreement.baseSalary > 0) {
    wageBaseComponents['ط­ظ‚ظˆظ‚ ظ¾ط§غŒظ‡'] = agreement.baseSalary;
    wageBase += agreement.baseSalary;
  }
  if (agreement.wageBaseComponents.seniorityBase && agreement.seniorityBase > 0) {
    const seniorityMonthly = agreement.seniorityBase * 30;
    wageBaseComponents['ظ¾ط§غŒظ‡ ط³ظ†ظˆط§طھ'] = seniorityMonthly;
    wageBase += seniorityMonthly;
  }
  if (agreement.wageBaseComponents.attractionAllowance && agreement.attractionAllowance > 0) {
    wageBaseComponents['ط­ظ‚ ط¬ط°ط¨'] = agreement.attractionAllowance;
    wageBase += agreement.attractionAllowance;
  }
  if (agreement.wageBaseComponents.managementAllowance && agreement.managementAllowance > 0) {
    wageBaseComponents['ط­ظ‚ ظ…ط¯غŒط±غŒطھ'] = agreement.managementAllowance;
    wageBase += agreement.managementAllowance;
  }
  if (agreement.wageBaseComponents.transportAllowance && agreement.transportAllowance > 0) {
    wageBaseComponents['ط§غŒط§ط¨ ظˆ ط°ظ‡ط§ط¨'] = agreement.transportAllowance;
    wageBase += agreement.transportAllowance;
  }
  if (agreement.wageBaseComponents.hardshipAllowance && agreement.hardshipAllowance > 0) {
    wageBaseComponents['ط³ط®طھغŒ ع©ط§ط±'] = agreement.hardshipAllowance;
    wageBase += agreement.hardshipAllowance;
  }

  // ظ†ط±ط® ط³ط§ط¹طھغŒ
  const hourlyRate = wageBase / LEGAL_CONSTANTS_2026.calculationHoursPerMonth;

  // ظ…ط­ط§ط³ط¨ظ‡ ظ†ظ…ظˆظ†ظ‡ ط¨ط§ ظپط±ط¶ غ¸ ط³ط§ط¹طھ ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ
  const overtimeHours = 8;
  const overtimeAmount = overtimeHours * hourlyRate * agreement.coefficients.overtime;

  // ظ…ط­ط§ط³ط¨ظ‡ ظ†ظ…ظˆظ†ظ‡ ط´ط¨â€Œع©ط§ط±غŒ ط¨ط§ ظپط±ط¶ غ´ ط³ط§ط¹طھ
  const nightHours = 4;
  const nightAmount = nightHours * hourlyRate * agreement.coefficients.nightWork;

  // ظ…ط­ط§ط³ط¨ظ‡ ظ†ظ…ظˆظ†ظ‡ ط¬ظ…ط¹ظ‡â€Œع©ط§ط±غŒ ط¨ط§ ظپط±ط¶ غ· ط³ط§ط¹طھ
  const fridayHours = 7;
  const fridayAmount = fridayHours * hourlyRate * agreement.coefficients.fridayWork;

  // ط´غŒظپطھ ظپط¹ط§ظ„
  const activeShift = Object.entries(agreement.shiftModels).find(
    ([_, model]) => model.enabled
  );
  const shiftAmount = activeShift
    ? ((agreement.baseSalary + agreement.seniorityBase * 30) * activeShift[1].percent) / 100
    : 0;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-500/30 p-6 space-y-6">
      <div className="flex items-start gap-3 pb-4 border-b border-indigo-500/30">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Calculator className="text-white" size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg text-indigo-900 mb-1">ظ¾غŒط´â€Œظ†ظ…ط§غŒط´ ظ…ط­ط§ط³ط¨ط§طھ</h3>
          <p className="text-sm text-indigo-700">
            ظ…ط«ط§ظ„â€Œظ‡ط§غŒ ظ…ط­ط§ط³ط¨ط§طھغŒ ط¨ط±ط§ط³ط§ط³ ظ…ظ‚ط§ط¯غŒط± ظˆط§ط±ط¯ ط´ط¯ظ‡
          </p>
        </div>
      </div>

      {/* ظ…ط²ط¯ ظ…ط¨ظ†ط§ */}
      <div className="bg-slate-900/60 rounded-lg p-5 ">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-indigo-600" />
          <h4 className="font-medium text-indigo-900">ظ…ط²ط¯ ظ…ط¨ظ†ط§ (ط¨ط±ط§غŒ ظ…ط­ط§ط³ط¨ظ‡ ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡â€Œظ‡ط§)</h4>
        </div>

        {Object.keys(wageBaseComponents).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(wageBaseComponents).map(([name, value]) => (
              <div key={name} className="flex justify-between items-center text-sm">
                <span className="text-slate-400">{name}:</span>
                <span className="font-medium text-slate-100">
                  {formatCurrency(value)} ط±غŒط§ظ„
                </span>
              </div>
            ))}
            <div className="pt-3 border-t flex justify-between items-center">
              <span className="font-medium text-indigo-900">ط¬ظ…ط¹ ظ…ط²ط¯ ظ…ط¨ظ†ط§:</span>
              <span className="text-lg font-bold text-indigo-600">
                {formatCurrency(wageBase)} ط±غŒط§ظ„
              </span>
            </div>
            <div className="bg-indigo-500/10 rounded-lg p-3 mt-3">
              <p className="text-xs text-indigo-700 leading-relaxed">
                <strong>ظپط±ظ…ظˆظ„:</strong> ظ…ط²ط¯ ظ…ط¨ظ†ط§ = ظ…ط¬ظ…ظˆط¹ ظ…ظˆظ„ظپظ‡â€Œظ‡ط§غŒ ظپط¹ط§ظ„ ط´ط¯ظ‡ ط¯ط± ط¨ط®ط´
                "ظ…ظˆظ„ظپظ‡â€Œظ‡ط§غŒ ظ…ظˆط«ط± ط¯ط± ظ…ط²ط¯ ظ…ط¨ظ†ط§"
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            ظ‡غŒع† ظ…ظˆظ„ظپظ‡â€Œط§غŒ ط¨ط±ط§غŒ ظ…ط²ط¯ ظ…ط¨ظ†ط§ ط§ظ†طھط®ط§ط¨ ظ†ط´ط¯ظ‡ ط§ط³طھ
          </p>
        )}
      </div>

      {/* ظ†ط±ط® ط³ط§ط¹طھغŒ */}
      <div className="bg-slate-900/60 rounded-lg p-5 ">
        <h4 className="font-medium text-indigo-900 mb-3">ظ†ط±ط® ط³ط§ط¹طھغŒ</h4>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-400">ظ†ط±ط® ظ‡ط± ط³ط§ط¹طھ ع©ط§ط±:</span>
          <span className="text-xl font-bold text-indigo-600">
            {formatCurrency(hourlyRate)} ط±غŒط§ظ„
          </span>
        </div>
        <div className="bg-indigo-500/10 rounded-lg p-3 mt-3">
          <p className="text-xs text-indigo-700 leading-relaxed">
            <strong>ظپط±ظ…ظˆظ„:</strong> ظ†ط±ط® ط³ط§ط¹طھغŒ = ظ…ط²ط¯ ظ…ط¨ظ†ط§ أ· {LEGAL_CONSTANTS_2026.calculationHoursPerMonth}
            <br />
            <strong>ظ…ط«ط§ظ„:</strong> {formatCurrency(wageBase)} أ· {LEGAL_CONSTANTS_2026.calculationHoursPerMonth} ={' '}
            {formatCurrency(hourlyRate)} ط±غŒط§ظ„
          </p>
        </div>
      </div>

      {/* ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ */}
      <div className="bg-slate-900/60 rounded-lg p-5 ">
        <h4 className="font-medium text-indigo-900 mb-3">
          ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ (ظ…ط«ط§ظ„ ط¨ط§ {overtimeHours} ط³ط§ط¹طھ)
        </h4>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm text-slate-400">ط¶ط±غŒط¨ ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ:</span>
          <span className="font-medium text-slate-100">
            {agreement.coefficients.overtime}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-400">ظ…ط¨ظ„ط؛ ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ:</span>
          <span className="text-xl font-bold text-green-600">
            {formatCurrency(overtimeAmount)} ط±غŒط§ظ„
          </span>
        </div>
        <div className="bg-indigo-500/10 rounded-lg p-3 mt-3">
          <p className="text-xs text-indigo-700 leading-relaxed">
            <strong>ظپط±ظ…ظˆظ„:</strong> ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ = ط³ط§ط¹ط§طھ أ— ظ†ط±ط® ط³ط§ط¹طھغŒ أ— ط¶ط±غŒط¨
            <br />
            <strong>ظ…ط«ط§ظ„:</strong> {overtimeHours} أ— {formatCurrency(hourlyRate)} أ—{' '}
            {agreement.coefficients.overtime} = {formatCurrency(overtimeAmount)} ط±غŒط§ظ„
          </p>
        </div>
      </div>

      {/* ط´ط¨â€Œع©ط§ط±غŒ */}
      <div className="bg-slate-900/60 rounded-lg p-5 ">
        <h4 className="font-medium text-indigo-900 mb-3">
          ط´ط¨â€Œع©ط§ط±غŒ (ظ…ط«ط§ظ„ ط¨ط§ {nightHours} ط³ط§ط¹طھ)
        </h4>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm text-slate-400">ط¶ط±غŒط¨ ط´ط¨â€Œع©ط§ط±غŒ:</span>
          <span className="font-medium text-slate-100">
            {agreement.coefficients.nightWork}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-400">ظ…ط¨ظ„ط؛ ط´ط¨â€Œع©ط§ط±غŒ:</span>
          <span className="text-xl font-bold text-purple-600">
            {formatCurrency(nightAmount)} ط±غŒط§ظ„
          </span>
        </div>
        <div className="bg-indigo-500/10 rounded-lg p-3 mt-3">
          <p className="text-xs text-indigo-700 leading-relaxed">
            <strong>ظپط±ظ…ظˆظ„:</strong> ط´ط¨â€Œع©ط§ط±غŒ = ط³ط§ط¹ط§طھ (22 طھط§ 6 طµط¨ط­) أ— ظ†ط±ط® ط³ط§ط¹طھغŒ أ— ط¶ط±غŒط¨
            <br />
            <strong>ظ…ط«ط§ظ„:</strong> {nightHours} أ— {formatCurrency(hourlyRate)} أ—{' '}
            {agreement.coefficients.nightWork} = {formatCurrency(nightAmount)} ط±غŒط§ظ„
          </p>
        </div>
      </div>

      {/* ط¬ظ…ط¹ظ‡â€Œع©ط§ط±غŒ */}
      <div className="bg-slate-900/60 rounded-lg p-5 ">
        <h4 className="font-medium text-indigo-900 mb-3">
          ط¬ظ…ط¹ظ‡â€Œع©ط§ط±غŒ (ظ…ط«ط§ظ„ ط¨ط§ {fridayHours} ط³ط§ط¹طھ - ط¨ط§ ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ)
        </h4>
        <div className="space-y-2 mb-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-slate-400">ط¶ط±غŒط¨ ط¬ظ…ط¹ظ‡â€Œع©ط§ط±غŒ (ط¨ط§ ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ):</span>
            <span className="font-medium text-slate-100">
              {agreement.coefficients.fridayWork}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-slate-400">ط¶ط±غŒط¨ ط¬ظ…ط¹ظ‡â€Œع©ط§ط±غŒ (ط¨ط¯ظˆظ† ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ):</span>
            <span className="font-medium text-slate-100">
              {agreement.coefficients.fridayWorkNoOvertime}
            </span>
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-400">ظ…ط¨ظ„ط؛ ط¬ظ…ط¹ظ‡â€Œع©ط§ط±غŒ:</span>
          <span className="text-xl font-bold text-orange-600">
            {formatCurrency(fridayAmount)} ط±غŒط§ظ„
          </span>
        </div>
        <div className="bg-indigo-500/10 rounded-lg p-3 mt-3">
          <p className="text-xs text-indigo-700 leading-relaxed">
            <strong>ظپط±ظ…ظˆظ„:</strong> ط¬ظ…ط¹ظ‡â€Œع©ط§ط±غŒ = ط³ط§ط¹ط§طھ أ— ظ†ط±ط® ط³ط§ط¹طھغŒ أ— ط¶ط±غŒط¨ ظ…ظ†ط§ط³ط¨
            <br />
            <strong>ظ…ط«ط§ظ„ (ط¨ط§ ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒ):</strong> {fridayHours} أ—{' '}
            {formatCurrency(hourlyRate)} أ— {agreement.coefficients.fridayWork} ={' '}
            {formatCurrency(fridayAmount)} ط±غŒط§ظ„
            <br />
            <strong>ظ†ع©طھظ‡:</strong> ط§ع¯ط± ط¬ظ…ط¹ظ‡ ط¬ط§غŒع¯ط²غŒظ† ط±ظˆط² ط¯غŒع¯ط±غŒ ط´ظˆط¯طŒ ط¶ط±غŒط¨{' '}
            {agreement.coefficients.fridayWorkNoOvertime} ط§ط³طھظپط§ط¯ظ‡ ظ…غŒâ€Œط´ظˆط¯
          </p>
        </div>
      </div>

      {/* ظ†ظˆط¨طھâ€Œع©ط§ط±غŒ */}
      {activeShift && (
        <div className="bg-slate-900/60 rounded-lg p-5 ">
          <h4 className="font-medium text-indigo-900 mb-3">
            ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡ ظ†ظˆط¨طھâ€Œع©ط§ط±غŒ
          </h4>
          <div className="space-y-2 mb-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-slate-400">ظ…ط¯ظ„ ط´غŒظپطھ ظپط¹ط§ظ„:</span>
              <span className="font-medium text-slate-100">
                {activeShift[0] === 'twoShifts' && 'طµط¨ط­ ظˆ ط¹طµط±'}
                {activeShift[0] === 'threeShifts' && 'طµط¨ط­طŒ ط¹طµط± ظˆ ط´ط¨'}
                {activeShift[0] === 'dayNight' && 'طµط¨ط­ ظˆ ط´ط¨'}
                {activeShift[0] === 'afternoonNight' && 'ط¹طµط± ظˆ ط´ط¨'}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-slate-400">ط¯ط±طµط¯ ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡:</span>
              <span className="font-medium text-slate-100">{activeShift[1].percent}%</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-slate-400">ظ…ط¨ظ„ط؛ ظ…ط§ظ‡غŒط§ظ†ظ‡:</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(shiftAmount)} ط±غŒط§ظ„
            </span>
          </div>
          <div className="bg-indigo-500/10 rounded-lg p-3 mt-3">
            <p className="text-xs text-indigo-700 leading-relaxed">
              <strong>ظپط±ظ…ظˆظ„:</strong> ظ†ظˆط¨طھâ€Œع©ط§ط±غŒ = (ط­ظ‚ظˆظ‚ ظ¾ط§غŒظ‡ + ظ¾ط§غŒظ‡ ط³ظ†ظˆط§طھ) أ— ط¯ط±طµط¯
              <br />
              <strong>ظ…ط«ط§ظ„:</strong> ({formatCurrency(agreement.baseSalary)} +{' '}
              {formatCurrency(agreement.seniorityBase * 30)}) أ— {activeShift[1].percent}% ={' '}
              {formatCurrency(shiftAmount)} ط±غŒط§ظ„
            </p>
          </div>
        </div>
      )}

      {/* ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡ ظ…ط£ظ…ظˆط±غŒطھ */}
      {agreement.missionAllowance.enabled && (
        <div className="bg-slate-900/60 rounded-lg p-5 ">
          <h4 className="font-medium text-indigo-900 mb-3">ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡ ظ…ط£ظ…ظˆط±غŒطھ</h4>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-slate-400">ط­ط¯ط§ظ‚ظ„ ظ…ط²ط¯ ط±ظˆط²ط§ظ†ظ‡:</span>
            <span className="text-lg font-bold text-teal-600">
              {formatCurrency(agreement.missionAllowance.minimumDailyRate)} ط±غŒط§ظ„
            </span>
          </div>
          <div className="bg-indigo-500/10 rounded-lg p-3 mt-3">
            <p className="text-xs text-indigo-700 leading-relaxed">
              <strong>ظ‚ط§ظ†ظˆظ†:</strong> ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡ ظ…ط£ظ…ظˆط±غŒطھ ظ†ط¨ط§غŒط¯ ط§ط² ظ…ط²ط¯ ط«ط§ط¨طھ ط±ظˆط²ط§ظ†ظ‡ ع©ط§ط±ع¯ط±
              ع©ظ…طھط± ط¨ط§ط´ط¯. ظ‡ط²غŒظ†ظ‡ ط³ظپط± ظˆ ط§ظ‚ط§ظ…طھ ظ†غŒط² ط¨ط§ ع©ط§ط±ظپط±ظ…ط§ط³طھ.
              <br />
              <strong>ظ…ط«ط§ظ„:</strong> ط¨ط±ط§غŒ 3 ط±ظˆط² ظ…ط£ظ…ظˆط±غŒطھ ={' '}
              {formatCurrency(agreement.missionAllowance.minimumDailyRate * 3)} ط±غŒط§ظ„
              <br />
              <strong>ظ†ع©طھظ‡:</strong> ظ…ط¹ط§ظپ ط§ط² ط¨غŒظ…ظ‡ ظˆ ظ…ط§ظ„غŒط§طھ
            </p>
          </div>
        </div>
      )}

      {/* ط®ظ„ط§طµظ‡ */}
      <div className="bg-gradient-to-l from-indigo-600 to-purple-600 rounded-lg p-5 text-white">
        <h4 className="font-medium mb-3">ًں’، ظ†ع©ط§طھ ظ…ظ‡ظ…</h4>
        <ul className="space-y-2 text-sm">
          <li>â€¢ طھظ…ط§ظ… ظپظˆظ‚â€Œط§ظ„ط¹ط§ط¯ظ‡â€Œظ‡ط§ ط¨ط± ط§ط³ط§ط³ ظ…ط²ط¯ ظ…ط¨ظ†ط§ ظ…ط­ط§ط³ط¨ظ‡ ظ…غŒâ€Œط´ظˆظ†ط¯</li>
          <li>â€¢ ظ†ط±ط® ط³ط§ط¹طھغŒ ط¨ط±ط§غŒ ظ…ط­ط§ط³ط¨ظ‡ ط§ط¶ط§ظپظ‡â€Œع©ط§ط±غŒطŒ ط´ط¨â€Œع©ط§ط±غŒ ظˆ ط¬ظ…ط¹ظ‡â€Œع©ط§ط±غŒ ط§ط³طھظپط§ط¯ظ‡ ظ…غŒâ€Œط´ظˆط¯</li>
          <li>â€¢ ط¶ط±ط§غŒط¨ ظ‚ط§ط¨ظ„ طھظ†ط¸غŒظ… ظ‡ط³طھظ†ط¯ ظˆ ظ…غŒâ€Œطھظˆط§ظ†غŒط¯ ط¢ظ†â€Œظ‡ط§ ط±ط§ طھط؛غŒغŒط± ط¯ظ‡غŒط¯</li>
          <li>â€¢ ظ…ط­ط§ط³ط¨ط§طھ ط¨ط§ظ„ط§ ظپظ‚ط· ظ…ط«ط§ظ„ ظ‡ط³طھظ†ط¯ - ظ…ظ‚ط§ط¯غŒط± ظˆط§ظ‚ط¹غŒ ط¨ط³طھع¯غŒ ط¨ظ‡ ط¹ظ…ظ„ع©ط±ط¯ ظ…ط§ظ‡ط§ظ†ظ‡ ط¯ط§ط±ط¯</li>
        </ul>
      </div>
    </div>
  );
}

