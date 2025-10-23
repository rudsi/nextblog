## Directory Breakdown

### **`app/`**

- Contains all UI and routing logic.
- Uses the Next.js 15 App Router.
- Components are organized for clear separation of concerns.

#### `layout.tsx`

Defines the base layout structure shared across all pages.

#### `page.tsx`

Home page that renders primary content sections like the hero, Header and paginationSection list.

#### `components/`

- `Initializer.tsx` — initializes the global state from backend data.
- `Hero.tsx` — displays the featured post and a few recent posts.
- `MainPost.tsx` — displays the highlighted post with full details.
- `SidePost.tsx` — renders smaller post cards for recent or related posts.
- `PaginationSection.tsx` — handles pagination of the posts list.

### **`lib/`**

Holds reusable client-side utilities.

#### `trpc.ts`

Sets up the tRPC client for type-safe API calls.

#### `store.ts`

Defines the Zustand global store for holding posts and categories across the app.

#### `supabase.ts`

Initializes the drizzle client for interacting with the supabase based postgreSQL database.

---

### **`server/`**

Contains all backend logic including database access and API routing.

#### `trpc/`

Contains all tRPC routers used to fetch and mutate data.

- `post.ts` — handles CRUD operations for blog posts.
- `category.ts` — manages blog categories.
- `router.ts` — combines all individual routers into a single tRPC app router.

---

### **`db/`**

Contains the database schema and migration files.

#### `schema.ts`

Defines database models, relationships, and types for Prisma and PostgreSQL.

---

## Architectural Layers

1. **Frontend (Next.js + Zustand)**  
   Responsible for rendering pages, managing client-side state, and presenting fetched data.

2. **API Layer (tRPC)**  
   Serves as the bridge between frontend and backend with end-to-end type safety.

3. **Data Layer (drizzle + supabase)**  
   Manages structured data storage, migrations, and relations between entities.

---

## Data Flow Summary

1. The **frontend** triggers a tRPC query (e.g., `post.getAll`).
2. The **tRPC router** handles the request, fetching data via Prisma.
3. The **drizzle client** queries PostgreSQL and returns results.
4. The **tRPC layer** sends typed data back to the client.
5. The **Initializer** stores it in **Zustand** for global access.
6. UI components like `Hero` and `SidePost` render using the Zustand state.

---

## Styling and Design

- **Tailwind CSS** provides utility-first responsive design.
- **shadcn/ui** adds modern pre-styled UI components.
- The layout is minimal, content-focused, and mobile-friendly.

---

## Development Workflow

| Task                     | Command                                            |
| ------------------------ | -------------------------------------------------- |
| Install dependencies     | `npm install`                                      |
| Run drizzle migrations   | `npx drizzle-kit generate && npx drizzle-kit push` |
| Start development server | `npm run dev`                                      |
| Build for production     | `npm run build`                                    |

---

## Deployment Ready

- deployed on vercel

---

## Author

**Rudra Pratap Singh**

---
