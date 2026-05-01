# Codex Frontend Rules

These rules are mandatory for all React + Tailwind UI generation tasks in this project.

The project is a truck parking application. UI must be practical, readable, responsive, and production-ready.

---

## 1. Source Code From Figma to Code

Code exported from Figma plugins must be treated only as a visual draft.

Never use exported Figma code as final production code.

When processing exported code:

- preserve the intended visual result
- rebuild the structure using clean React components
- remove unnecessary wrappers
- remove meaningless class names
- remove absolute positioning unless explicitly required
- replace fixed pixel positioning with responsive layout
- convert repeated UI blocks into reusable components
- separate layout, data, and presentation

---

## 2. Layout Rules

Do not use absolute positioning for normal UI layout.

Forbidden by default:

- `absolute`
- `fixed`
- inline `style={{ position: ... }}`
- pixel-perfect manual positioning
- random top/left/right/bottom values

Allowed only for:

- overlays
- modals
- floating buttons
- tooltips
- map controls
- badges
- loaders

Use Tailwind layout primitives:

- `flex`
- `grid`
- `gap-*`
- `p-*`
- `m-*`
- `items-*`
- `justify-*`
- `container`
- responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`

All screens must be responsive.

Mobile-first layout is required.

---

## 3. Component Structure

Every repeated block must be extracted into a component.

Examples:

- `ParkingCard`
- `ParkingList`
- `ParkingMap`
- `SearchBar`
- `FilterPanel`
- `FilterChip`
- `RatingBadge`
- `ServiceIcon`
- `PrimaryButton`
- `EmptyState`
- `LoadingState`
- `ErrorState`

Do not duplicate card markup, buttons, badges, or form controls.

Component files must have clear names.

Bad:

```text
Component1.tsx
Frame23.tsx
RectangleGroup.tsx

Good:

ParkingCard.tsx
ParkingDetailsHeader.tsx
TruckServicesList.tsx
4. Styling Rules

Use Tailwind classes as the default styling method.

Do not use inline styles unless required for dynamic values.

Colors, fonts, shadows, radii, and spacing must be centralized.

Use Tailwind config or design token constants for:

colors
font family
font sizes
border radius
shadows
spacing
breakpoints

Do not hardcode random hex values directly in components.

Bad:

<div className="bg-[#F7F7F7] text-[#1A1A1A]">

Good:

<div className="bg-surface text-text-primary">
5. Design Tokens

Create or reuse design tokens for the project.

Required token groups:

colors
typography
spacing
radius
shadow
zIndex

Suggested semantic color names:

primary
primary-dark
secondary
background
surface
surface-muted
border
text-primary
text-secondary
text-muted
success
warning
danger
map-marker

Do not use visual names like:

blue1
gray2
color123

Use semantic names.

6. Typography Rules

Use a consistent typography scale.

Do not use random text sizes.

Text styles should map to semantic roles:

page-title
section-title
card-title
body
body-sm
caption
button
label

Do not convert text into images.

Do not use SVG outlines for normal text.

7. Data Separation

UI components must not contain hardcoded business data directly inside markup.

Bad:

<h3>Truck Parking Berlin</h3>

Good:

<h3>{parking.name}</h3>

Use mock data when backend integration is not part of the task.

Mock data must be separated from UI components.

Example:

src/mock/parkings.ts
src/types/parking.ts
8. Truck Parking Domain Rules

The UI must support truck parking use cases.

Common parking fields:

id
name
address
latitude
longitude
distance
price
capacity
availableSpots
rating
reviewsCount
services
photos
isFavorite
isVerified

Common services:

shower
toilet
fuel
laundry
security
wifi
restaurant
repair
paymentCard

Parking UI must be optimized for quick scanning.

Parking cards should clearly show:

name
distance
address or region
rating
capacity / available places
key services
price if available
route/share/favorite actions where relevant
9. Accessibility

All interactive elements must be accessible.

Required:

buttons must be real <button> elements
inputs must have labels or aria-labels
icons used as buttons must have accessible labels
clickable cards must have clear focus states
color must not be the only indicator of state

Use semantic HTML.

Bad:

<div onClick={...}>Click</div>

Good:

<button onClick={...}>Click</button>
10. Responsive Behavior

All screens must work on:

mobile
tablet
desktop

Use mobile-first Tailwind classes.

Avoid fixed widths unless necessary.

Bad:

<div className="w-[390px]">

Good:

<div className="w-full max-w-md">

Use:

w-full
max-w-*
min-h-screen
grid-cols-*
flex-wrap
overflow-hidden
overflow-y-auto
11. State Handling

Separate UI states clearly:

loading
empty
error
success
normal content

Every list screen must support:

loading state
empty state
error state

Do not leave blank screens.

12. File Organization

Recommended structure:

src/
  components/
    ui/
    parking/
    layout/
  pages/
  features/
    parking/
  mock/
  types/
  constants/
  styles/

Domain-specific components go into:

src/components/parking/

Generic UI components go into:

src/components/ui/
13. Code Quality

Generated code must be clean and maintainable.

Required:

TypeScript
typed props
no unused imports
no dead code
no console logs in final code
no duplicated JSX blocks
no magic numbers
no meaningless variable names

Use interfaces or types for props.

Example:

type ParkingCardProps = {
  parking: Parking;
  onSelect?: (parking: Parking) => void;
};
14. Icons and Images

Use icon components where possible.

Do not embed large inline SVGs unless necessary.

Images must have:

alt
proper aspect ratio
object-fit behavior

Example:

<img
  src={parking.photoUrl}
  alt={parking.name}
  className="h-40 w-full rounded-xl object-cover"
/>
15. Map UI Rules

Map-related UI may use absolute positioning only for overlay controls.

Allowed map overlays:

zoom controls
current location button
filter button
parking marker popup
bottom sheet
floating search bar

Map overlay components must be separated from the map component.

Do not mix map logic with parking card rendering.

16. Output Requirements

When generating or refactoring UI, always:

Analyze the provided Figma/exported code.
Identify repeated UI patterns.
Rebuild the screen using clean React components.
Replace absolute positioning with responsive layout.
Extract colors, fonts, and spacing into tokens or Tailwind config.
Use typed props and mock data.
Preserve the intended visual design.
Explain briefly what was changed.

Never return raw unstructured Figma export as the final answer.

Architecture & Data Access Rules (перевод)
1. Не обращаться к Supabase напрямую из UI

UI-компоненты не должны напрямую вызывать Supabase.

Плохо:

const { data } = await supabase.from('users').select('*')

внутри страницы или компонента.

Хорошо:

const profile = await userService.getCurrentUserProfile()

👉 UI вызывает сервисы или хуки, а не базу.

2. Использовать слои

Архитектура должна быть:

UI компоненты
↓
хуки
↓
сервисы
↓
Supabase client

Ответственности:

UI — отображение и обработка действий пользователя
hooks — связывают UI и данные
services — работа с Supabase
types — описание моделей
constants — константы
3. Supabase client — один на весь проект

Файл:

src/lib/supabase.ts

👉 Нельзя создавать клиент внутри компонентов.

4. Использовать типы

Каждая сущность базы должна иметь TypeScript тип.

Пример:

type UserStatus = 'pending' | 'approved' | 'rejected';
type UserProfile = {
  id: string;
  created_at: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_premium: boolean;
  referral_code: string | null;
  theme: string;
  updated_at: string | null;
  status: UserStatus;
};

👉 Нельзя использовать any

5. Все запросы — через сервисы

Структура:

src/services/
  authService.ts
  userService.ts
  parkingService.ts

Примеры:

authService:
- регистрация
- вход
- выход
- сессия

userService:
- получить профиль
- создать профиль
- обновить профиль

parkingService:
- список парковок
- детали
- создание
- обновление
6. Использовать хуки

Структура:

src/hooks/
  useAuth.ts
  useUserProfile.ts
  useParkings.ts

Хуки отвечают за:

loading
ошибки
обновление данных
состояние UI
7. Разделять данные и UI состояние

Не смешивать:

Данные с сервера:

пользователь
профиль
парковки

UI состояние:

открыта ли модалка
выбранная вкладка
состояние формы
8. Не дублировать бизнес-логику

Плохо:

if (profile.status === 'approved')

в разных местах.

Хорошо:

function canAccessDashboard(profile) {
  return profile?.status === 'approved';
}

Файл:

src/domain/accessRules.ts
9. Использовать константы

Плохо:

if (status === 'approved')

Хорошо:

export const USER_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}
10. Обрабатывать состояния

Каждый экран должен иметь:

загрузка
пусто
ошибка
успех

👉 Нельзя оставлять пустой экран

11. Не обходить RLS на фронте

Если ошибка доступа:

не обходить
не использовать service_role
не отключать RLS

👉 Нужно объяснить, какая политика отсутствует

12. Правила доступа

Авторизация ≠ доступ

Доступ только если:

status === 'approved'
13. Не менять защищённые поля

Фронтенд не должен менять:

status
is_premium
role
created_at
14. Использовать env переменные

Обязательно:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

Запрещено:

хардкод ключей
service_role
пароль базы
15. Делить код на файлы

Нельзя делать один огромный файл.

Разделять:

components
services
hooks
types
constants
domain
16. Перед реализацией

Обязательно проверить:

структуру проекта
есть ли уже сервисы
есть ли auth
есть ли Supabase client

👉 не дублировать код

17. После реализации

Всегда показать:

какие файлы изменены
какие добавлены
где запросы к базе
какие типы добавлены
как тестировать
какие RLS нужны