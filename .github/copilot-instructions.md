# Copilot Instructions for project-bolt-sb1-glgvkrqj

## Project Architecture
- This is a Vite + React + TypeScript monorepo with a backend Express server and Supabase integration.
- Main app code is in `project/src/` (React components, hooks, context, services, types, utils).
- Backend logic and scripts are in `project/` (e.g., `server.js`, migration scripts, mailer config).
- Data flows from Supabase tables (`custom_categories`, `custom_products`) to frontend via custom hooks and service modules.
- Static product/category data is in `project/src/data/products.ts` and merged with dynamic Supabase data for display.

## Key Patterns & Conventions
- **Dynamic Data:** Use hooks like `useCategories` and `useProducts` to fetch/add categories/products from Supabase. See `src/hooks/` and `src/services/adminService.ts`.
- **Static + Dynamic Merge:** Always merge static and dynamic data for categories/products before rendering (see `adminService.ts`).
- **Admin Workflows:** Only users signed in as `firassmrabet111@gmail.com` can access admin features (see RLS policies in migrations and frontend checks).
- **Component Structure:** Major UI sections are in `src/components/` (e.g., `Header.tsx`, `CategoriesSection.tsx`, `AdminPage.tsx`).
- **Type Safety:** Types for products/categories are in `src/types/index.ts` and should match Supabase schema.
- **Supabase Client:** Configured in `src/supabaseClient.ts` using environment variables.

## Developer Workflows
- **Start Dev Server:** `npm run dev` (frontend), `npm run server` (backend Express).
- **Build:** `npm run build` (Vite).
- **Lint:** `npm run lint` (ESLint config in `eslint.config.js`).
- **Preview:** `npm run preview` (Vite preview).
- **Supabase:** All DB access via `@supabase/supabase-js`. Migration SQL in `supabase-migrations.sql`.
- **Testing:** No formal test suite detected; manual testing via UI and scripts.

## Integration Points
- **Supabase:** All CRUD for categories/products via Supabase tables. RLS restricts admin actions to a specific email.
- **Express Server:** Used for backend logic, email sending, and PDF generation. See `server.js`, `config/mailer.ts`, `controllers/emailController.ts`.
- **Tailwind CSS:** Used for styling, configured in `tailwind.config.js` and `postcss.config.js`.
- **React Router:** Routing via `react-router-dom`.

## Examples
- To add a category: use `useCategories().addCategory()` in admin page, then display via merged data in header and main page.
- To add a product: use `useProducts().addProduct()` with selected category, then display in category section.
- To restrict admin: check user email in frontend and rely on Supabase RLS for backend.

## Key Files & Directories
- `project/src/components/` — UI components
- `project/src/hooks/` — Data fetching hooks
- `project/src/services/adminService.ts` — Data merge/service logic
- `project/src/types/index.ts` — Type definitions
- `project/src/supabaseClient.ts` — Supabase client config
- `project/supabase-migrations.sql` — DB schema & policies
- `project/server.js` — Express backend

---

If any section is unclear or missing details, please specify what you want to improve or clarify!
