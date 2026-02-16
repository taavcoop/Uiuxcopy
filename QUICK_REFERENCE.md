# راهنمای سریع - بخش گروه های کاری

## دسترسی سریع

```
📍 صفحات:
├─ /work-groups        ← لیست گروه‌های کاری
├─ /work-groups/add    ← افزودن گروه جدید
└─ /work-groups/:id    ← ویرایش گروه موجود

📁 فایل‌ها:
├─ src/app/pages/WorkGroups.tsx
├─ src/app/pages/AddWorkGroup.tsx
├─ src/app/routes.ts
├─ src/app/pages/Root.tsx
└─ src/app/components/ui/tooltip.tsx (بهبود شده)
```

---

## کوتاه‌ترین نقاط

### تصویر درختی
```
گروه های کاری (Work Groups)
│
├─ صفحه لیست
│  ├─ نمایش کارت‌های گروه
│  ├─ عملیات (Edit/Delete)
│  └─ ایجاد گروه جدید
│
└─ صفحه فرم (4 مرحله)
   ├─ مرحله 1: عنوان، توضیح، برچسب
   ├─ مرحله 2: محل کار
   ├─ مرحله 3: کارمندان و نقش‌ها
   └─ مرحله 4: سیاست کاری
```

### Mock Data موجود
- ✅ 2 گروه نمونه در لیست
- ✅ 8 کارمند برای انتخاب
- ✅ 3 محل کار
- ✅ 3 سیاست کاری

---

## اصلاح یا توسعه؟

### برای تغییر Mock Data

**فایل**: `src/app/pages/WorkGroups.tsx` (خط 27-35)
```typescript
const MOCK_WORK_GROUPS: WorkGroup[] = [
  // اضافه کردن گروه جدید...
];
```

**فایل**: `src/app/pages/AddWorkGroup.tsx` (خط 56-105)
```typescript
const MOCK_EMPLOYEES: Employee[] = [ /* ... */ ];
const MOCK_LOCATIONS: Location[] = [ /* ... */ ];
const MOCK_POLICIES: Policy[] = [ /* ... */ ];
```

### برای تغییر Tooltips

تمام Tooltips از `SimpleTooltip` استفاده می‌کنند:
```tsx
<SimpleTooltip content="متن راهنما به فارسی">
  <Component />
</SimpleTooltip>
```

### برای تغییر رنگ‌ها

تمام رنگ‌ها از کلاس‌های Tailwind استفاده می‌کنند:
- `bg-indigo-600` ← رنگ اصلی (آبی)
- `bg-green-600` ← رنگ موفقیت (سبز)
- `bg-amber-500` ← رنگ هشدار (زرد)
- `bg-rose-400` ← رنگ خطر (قرمز)

---

## تست کردن

### 1. راه‌اندازی
```bash
npm run dev -- --port 3001
```

### 2. بازدید از صفحات
```
http://localhost:3001/work-groups        (لیست)
http://localhost:3001/work-groups/add    (افزودن)
```

### 3. تست کردن فرم
- [ ] مرحله 1: وارد کردن اطلاعات
- [ ] مرحله 2: انتخاب محل
- [ ] مرحله 3: افزودن حداقل 2 کارمند (یکی مدیر)
- [ ] مرحله 4: انتخاب سیاست
- [ ] دکمه ذخیره

### 4. تست Tooltips
- [ ] Hover روی دکمه‌ها
- [ ] Hover روی آیکن‌های کمک
- [ ] Hover روی کارت‌ها

---

## رفع مشکلات سریع

### خطا: "Tooltip not working"
```typescript
// درست ❌
<Tooltip content="text"> ... </Tooltip>

// صحیح ✅
<SimpleTooltip content="text"> ... </SimpleTooltip>
```

### خطا: "Port already in use"
```bash
npm run dev -- --port 3002  # یا پورت دیگری
```

### خطا: "فرم submit نمی‌کند"
- بررسی کنید تمام فیلدهای اجباری پر شده باشند
- بررسی کنید console.log را چک کنید (DevTools)
- بررسی کنید validation messages نمایش یابد

---

## کد نمونه‌های کاربردی

### اضافه کردن گروه جدید
```typescript
const newGroup: WorkGroup = {
  id: Date.now().toString(),
  name: 'نام گروه',
  description: 'توضیحات',
  location: 'محل انتخابی',
  membersCount: 0,
  manager: 'نام مدیر',
  policy: 'سیاست',
  tags: ['برچسب1', 'برچسب2'],
};
setWorkGroups([...workGroups, newGroup]);
```

### افزودن کارمند با نقش
```typescript
const member: EmployeeMember = {
  id: employee.id,
  name: employee.name,
  selectedRole: 'manager',  // یا 'staff', 'visit_manager'
  currentGroup: employee.currentGroup,
};
setFormData({
  ...formData,
  selectedEmployees: [...formData.selectedEmployees, member],
});
```

### نمایش الرت
```typescript
setAlertMessage({
  type: 'warning',  // یا 'success', 'info'
  text: 'پیام الرت در فارسی',
});
```

---

## Router Navigation

```typescript
// رفتن به لیست
navigate('/work-groups');

// رفتن به افزودن
navigate('/work-groups/add');

// رفتن به ویرایش
navigate(`/work-groups/${group.id}`);

// برگشت
navigate(-1);
```

---

## نام‌گذاری و Convention‌ها

- ✅ فایل‌ها: `PascalCase` (WorkGroups.tsx)
- ✅ متغیرها: `camelCase` (formData, selectedEmployees)
- ✅ State: `useState` hook
- ✅ Props: درون interfaces تعریف شده
- ✅ Constants: `UPPER_SNAKE_CASE` (MOCK_EMPLOYEES)
- ✅ CSS Classes: `lowercase-with-hyphens` (Tailwind)

---

## Performance Tips

1. **تعداد render کم**: استفاده از `useState` مناسب
2. **Tooltip delay**: `delayDuration={200}` پیش‌فرض مناسب
3. **بارگذاری تصاویر**: استفاده از `image` URL آپلود شده
4. **لیست بزرگ**: استفاده از virtualization اگر اعضا بسیار زیاد باشند

---

## منابع مفید

- `@radix-ui/react-tooltip` ← کتابخانه Tooltip
- `react-router` ← Navigation
- `lucide-react` ← آیکن‌ها
- `tailwind` ← Styling
- `motion/react` ← انیمیشن

---

## نسخه‌های اخیر

### نسخه 1.0 (فعلی)
- ✅ صفحه لیست گروه‌ها
- ✅ فرم 4 مرحله‌ای
- ✅ مدیریت کارمندان
- ✅ سیستم Tooltip جامع
- ✅ Alert و Dialog‌ها

### بهبودی‌های آتی
- 🔮 اتصال API
- 🔮 ذخیره‌سازی در server
- 🔮 تاریخچه تغییرات
- 🔮 تخصیص‌های پیشرفته

---

## تماس و کمک

اگر سوالی دارید:
1. بررسی `WORK_GROUPS_FEATURE.md` برای جزئیات کامل
2. بررسی console برای خطاها
3. بررسی DevTools برای state‌ها
4. ایجاد GitHub Issue اگر باگ پیدا کردید

---

