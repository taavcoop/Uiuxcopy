import {
  createMockDraftTemplates,
  type DraftTemplate,
} from './draft-template-types';

const DRAFT_TEMPLATES_KEY = 'draft-templates-v1';
const PAYROLL_PACKAGE_KEY = 'payroll-package-enabled-v1';

const safeRead = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const safeWrite = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // noop
  }
};

export const getDraftTemplates = (): DraftTemplate[] => {
  const seeded = safeRead<DraftTemplate[] | null>(DRAFT_TEMPLATES_KEY, null);
  if (seeded && Array.isArray(seeded)) return seeded;

  const initial = createMockDraftTemplates();
  safeWrite(DRAFT_TEMPLATES_KEY, initial);
  return initial;
};

export const saveDraftTemplates = (items: DraftTemplate[]) => {
  safeWrite(DRAFT_TEMPLATES_KEY, items);
};

export const getDraftTemplateById = (id: string): DraftTemplate | null => {
  const found = getDraftTemplates().find((item) => item.id === id);
  return found ?? null;
};

export const upsertDraftTemplate = (template: DraftTemplate): DraftTemplate[] => {
  const list = getDraftTemplates();
  const idx = list.findIndex((item) => item.id === template.id);
  const next = [...list];
  if (idx === -1) {
    next.unshift(template);
  } else {
    next[idx] = template;
  }
  saveDraftTemplates(next);
  return next;
};

export const deleteDraftTemplateById = (id: string): DraftTemplate[] => {
  const next = getDraftTemplates().filter((item) => item.id !== id);
  saveDraftTemplates(next);
  return next;
};

export const getPayrollPackageEnabled = (): boolean =>
  safeRead<boolean>(PAYROLL_PACKAGE_KEY, false);

export const setPayrollPackageEnabled = (enabled: boolean) => {
  safeWrite(PAYROLL_PACKAGE_KEY, enabled);
};
