# Hestia Universal Backend API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Hestia is a unified **Modular Monolith** backend built to serve three distinct frontend applications. By centralizing the API infrastructure, we ensure code reusability (like shared authentication), simplify database management, and streamline CI/CD deployments.

## 🚀 Projects Served

This single API hub powers the following applications:

1. **🛒 ShopMaster**
   - **Focus:** Inventory management, barcode scanning, POS, and financial analytics for small businesses.
   - **Modules:** `inventory/`, `sales/`, `auth/`
   
2. **📍 VibeCheck (Coming Soon)**
   - **Focus:** Geospatial discovery engine and community hub for local events and places.
   - **Modules:** `places/`, `events/`, `reviews/`

3. **🤝 EliteAid (Coming Soon)**
   - **Focus:** Escrow-based marketplace connecting homeowners with vetted household professionals.
   - **Modules:** `tasks/`, `safety/`, `payments/`

---

## 🏗️ Technical Architecture

This backend is built utilizing enterprise-grade technologies:

- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Database:** [Neon.tech](https://neon.tech/) (Serverless PostgreSQL)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Security:** Passport.js + JWT (JSON Web Tokens)
- **Documentation:** Built-in Swagger OpenAPI (`/api`)

### Why a Modular Monolith?
Instead of managing three separate microservices, all business logic is isolated into domain-specific modules within one server. This allows:
- **Zero-Cost Scaling:** A single Render instance handles all API traffic.
- **Shared Context:** Global user authentication and role-based access control (RBAC).
- **Frontend Independence:** Frontends are decoupled and live in their own repositories, keeping the client codebases lightweight.

---

## 🛠️ Local Development

### Prerequisites
- [Bun](https://bun.sh/) (JavaScript runtime)
- A PostgreSQL connection string (via Neon.tech or local Docker)

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up your `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@host/db"
   PORT=3001
   ```
4. Generate the Prisma client:
   ```bash
   bunx prisma generate
   ```

### Running the App
```bash
# Development watch mode
bun run start:dev

# Production mode
bun run build
bun run start:prod
```

---

## 📚 API Documentation

When the server is running, interactive Swagger documentation is automatically generated.

- **Local Development:** `http://localhost:3001/api`
- **Production URL:** *(To be deployed via Render)*

Use the Swagger UI to inspect endpoint schemas, test queries, and verify JSON structures before integrating them into the frontend repositories.
