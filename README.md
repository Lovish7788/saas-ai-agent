# Meet.AI — SaaS AI Agent Platform

Meet.AI is a modern, full-stack SaaS platform designed for creating and managing intelligent AI assistants. This project was developed as part of Antonio Erdeljac's 2025 cohort course, *"Build and Deploy a SaaS AI Agent Platform"*, showcasing a production-ready technology stack and robust software engineering patterns.

---

## 🚀 Technology Stack

- **Core Framework**: [Next.js 15 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
- **Styling & UI Components**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), and [Vaul](https://github.com/emilkowalski/vaul) (mobile drawers)
- **API Layer**: [tRPC v11](https://trpc.io/) (end-to-end type safety) & [TanStack React Query v5](https://tanstack.com/query/latest)
- **ORM & Database**: [Drizzle ORM](https://orm.drizzle.team/) & [Neon (Serverless PostgreSQL)](https://neon.tech/)
- **Authentication**: [Better Auth](https://www.better-auth.com/) (credential logins & GitHub/Google OAuth)
- **Query Parameter Sync**: [nuqs](https://nuqs.dev/) (type-safe client/server query parameter state synchronization)

---

## 🗄️ Database Architecture (PostgreSQL Schema)

The database layers are mapped via Drizzle ORM to a PostgreSQL server:

1. **`user`**: Core user accounts.
2. **`session`**: Active login sessions managed securely by Better Auth.
3. **`account`**: Maps hashed passwords and OAuth keys back to the owner user.
4. **`verification`**: Security codes used for email validation or password resets.
5. **`agents`**: AI agents containing:
   - `id`: Auto-generated unique NanoID key.
   - `name`: Identifiable name of the assistant.
   - `instructions`: Persona constraints, tasks, and system prompts.
   - `userId`: Foreign key pointing to the user owner (`user.id` cascade delete).
   - Timestamps: `createdAt` and auto-updating `updatedAt`.

---

## 💡 Key Features & Engineering Patterns

### 1. Unified tRPC Procedures
* **End-to-End Types**: All client calls use the generated proxy client hook:
  `const [data] = trpc.agents.getMany.useSuspenseQuery(...)`
* **Session Context Middleware**: Enforces server-side authentication validation using Better Auth session checks (`protectedProcedure`), isolating agent records based on the logged-in user ID to prevent unauthorized data access.
* **Server-Side prefetching**: Pre-renders listing state on the server using Next.js prefetching helper functions (`prefetchQuery`) to seed TanStack query cache before hydration.

### 2. Hybrid Responsive Dialogs
* Implemented a custom `<ResponsiveDialog>` component that dynamically switches layouts:
  * **Desktop**: Centered modal box (`Dialog` primitive).
  * **Mobile**: Bottom slide-up sheet (`Drawer` primitive) for optimized touch interaction.
  * Extracted form fields into a standalone `<AgentForm />` component utilizing Zod validators and `<GeneratedAvatar>` dynamically seeded as the user types the agent's name.

### 3. Reactive Search Command Palette
* Implemented a global command palette triggered by the `Ctrl + K` / `Cmd + K` key combination, utilizing react hooks to handle listeners and cleanups.

### 4. Server-Client Synced Pagination
* Displays AI agents in a data grid using TanStack `<DataTable>` columns.
* Integrated the `<DataPagination />` component with `nuqs` to synchronize active page states dynamically with the browser's URL query string, ensuring browser history navigation remains intact.

---

## 🛠️ Getting Started

### 1. Prerequisites
Ensure you have Node.js installed, then clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db-name>?sslmode=require
BETTER_AUTH_SECRET=your_auth_secret_token
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Database Migration
Push your schema definitions directly to the Neon PostgreSQL database:
```bash
npm run db:push
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
