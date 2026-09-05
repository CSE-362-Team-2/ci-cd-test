# Anindya Auth - JWT Authentication & RBAC Documentation

This document describes the isolated authentication and authorization system implemented for `anindya_users`. The post CRUD API (`/api/posts`) is intentionally **not** wired to auth and remains unrelated.

## User Model & Database

**Table:** `anindya_users` (`server/src/config/db.ts:28`)

```sql
CREATE TABLE anindya_users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Dhaka'),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Dhaka')
);
```

Wiped on `initDb()` via `DROP TABLE IF EXISTS anindya_users CASCADE` before creation — no backward compatibility with previous `username` schema.

**Types:** `server/src/types/userType.ts:1`

```ts
type UserRole = "user" | "admin";
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
};
type SafeUser = Omit<User, "password">;
type JwtPayload = { id: number; name: string; email: string; role: UserRole };
```

**Model:** `server/src/models/userModel.ts:4` `UserModel.create(name,email,hashedPassword,role)`, `findByEmail(email)`, `findById(id)`, `findAll()` — all case-sensitive (`WHERE email = $1`).

## JWT

`server/src/utils/jwt.ts:5` uses `jsonwebtoken@9.0.3`:

- Secret: `process.env.JWT_SECRET || "dev_jwt_secret_change_in_production"` (`docker-compose.yml:37`, `.env.example:5`)
- Expiry: `process.env.JWT_EXPIRES_IN || "7d"`
- Payload: `{id, name, email, role}`
- Functions: `signToken(payload)`, `verifyToken(token)`, `getJwtSecret()`

Tokens are returned on register/login and must be sent as `Authorization: Bearer <token>`.

## Middleware

**Authentication:** `server/src/middleware/authMiddleware.ts:4` `authMiddleware`

- Checks `Authorization` header starts with `Bearer `
- Missing/invalid → `401 {errCode:200, errMsg:"Unauthorized: Missing or invalid token"}`
- Empty token after `Bearer ` → `401 errCode 200`
- Invalid/expired via `verifyToken` → `401 {errCode:201, errMsg:"Unauthorized: Invalid or expired token"}`
- On success `c.set("user", payload)` and `await next()`

**RBAC:** `server/src/middleware/roleMiddleware.ts:3` `authorize(...allowedRoles)`

- Requires `c.get("user")` exists, else `401 errCode 200`
- If `user.role` not in `allowedRoles` → `403 {errCode:240, errMsg:"Forbidden: Insufficient permissions"}`

## Routes

All auth routes mounted at `/api/anindya/auth` (`server/src/index.ts:18`), isolated from `/api/posts`.

`server/src/routes/authRoutes.ts:1`:

```ts
authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", authMiddleware, getMe);
authRoutes.get("/profile", authMiddleware, getMe);
authRoutes.get("/admin", authMiddleware, authorize("admin"), getAdminData);
authRoutes.get("/users", authMiddleware, authorize("admin"), getAllUsers);
```

### POST /api/anindya/auth/register

Public. Controller `server/src/controllers/authController.ts:7` validates, checks existing email, hashes with `bcryptjs` (10 rounds), creates user, signs JWT.

**Request Body:**

| Field      | Type   | Required | Constraints                                                          |
| ---------- | ------ | -------- | -------------------------------------------------------------------- |
| `name`     | string | Yes      | 3-100 chars, trimmed                                                 |
| `email`    | string | Yes      | valid format `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, case-sensitive, trimmed |
| `password` | string | Yes      | 6-255 chars                                                          |
| `role`     | string | No       | `user` or `admin` (lowercased), defaults to `user`                   |

**Example Request:**

```json
{
  "name": "Anindya Test",
  "email": "Anindya_Test@Example.COM",
  "password": "Password123!",
  "role": "user"
}
```

**Success 201:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Anindya Test",
    "email": "Anindya_Test@Example.COM",
    "role": "user",
    "created_at": "2026-09-05T12:00:00.000Z",
    "updated_at": "2026-09-05T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**

- `400 errCode 210` Invalid JSON body
- `400 errCode 211` Name is required
- `400 errCode 212` Name must be at least 3 characters
- `400 errCode 213` Name must be at most 100 characters
- `400 errCode 214` Email is required
- `400 errCode 215` Invalid email format
- `400 errCode 216` Password is required
- `400 errCode 217` Password must be at least 6 characters
- `400 errCode 218` Password must be at most 255 characters
- `400 errCode 220` Role must be either 'user' or 'admin'
- `409 errCode 219` Email already registered (case-sensitive)
- `500 errCode 222` Internal error

Case-sensitive: `Anindya@Example.COM` and `anindya@example.com` are distinct.

### POST /api/anindya/auth/login

Public. `server/src/controllers/authController.ts:111` verifies email (case-sensitive) and password, generates JWT.

**Request Body:**

| Field      | Type   | Required                      |
| ---------- | ------ | ----------------------------- |
| `email`    | string | Yes (trimmed, case-sensitive) |
| `password` | string | Yes                           |

**Example Request:**

```json
{
  "email": "Anindya_Test@Example.COM",
  "password": "Password123!"
}
```

**Success 200:**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Anindya Test",
    "email": "Anindya_Test@Example.COM",
    "role": "user",
    "created_at": "...",
    "updated_at": "..."
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**

- `400 errCode 230` Invalid JSON body
- `400 errCode 231` Email is required
- `400 errCode 232` Password is required
- `401 errCode 233` Invalid credentials (email not found or password mismatch)
- `500 errCode 234` Internal error

Wrong case email (`anindya_test@example.com` vs `Anindya_Test@Example.COM`) returns 401 due to case-sensitive lookup.

### GET /api/anindya/auth/me

Protected (any authenticated user). `server/src/controllers/authController.ts:178` `getMe` via `authMiddleware`.

**Headers:**

| Header          | Value            | Required |
| --------------- | ---------------- | -------- |
| `Authorization` | `Bearer <token>` | Yes      |

**Example Request:**

```
GET /api/anindya/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Success 200:**

```json
{
  "user": {
    "id": 1,
    "name": "Anindya Test",
    "email": "Anindya_Test@Example.COM",
    "role": "user",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

**Alias:** `GET /api/anindya/auth/profile` same handler.

**Errors:**

- `401 errCode 200` Missing or invalid token (no header, no Bearer prefix, empty token)
- `401 errCode 201` Invalid or expired token
- `404 errCode 235` User not found
- `500 errCode 236` Failed to fetch user

### GET /api/anindya/auth/admin

Protected + RBAC `admin` only. `server/src/controllers/authController.ts:197` `getAdminData` via `authMiddleware` + `authorize("admin")`.

**Headers:** Same `Authorization: Bearer <token>` with `role: admin`

**Success 200 (admin):**

```json
{
  "message": "Admin access granted",
  "user": {
    "id": 2,
    "name": "Admin User",
    "email": "Admin@Example.COM",
    "role": "admin",
    "created_at": "...",
    "updated_at": "..."
  },
  "adminData": "Sensitive admin-only data"
}
```

**Errors:**

- `401 errCode 200/201` as above for auth failures
- `403 errCode 240` Forbidden: Insufficient permissions (when `role !== "admin"`)
- `404 errCode 235` User not found
- `500 errCode 241` Failed to fetch admin data

### GET /api/anindya/auth/users

Protected + RBAC `admin` only. `server/src/controllers/authController.ts:220` `getAllUsers`.

**Success 200 (admin):**

```json
{
  "users": [
    {
      "id": 2,
      "name": "Admin User",
      "email": "Admin@Example.COM",
      "role": "admin",
      "created_at": "...",
      "updated_at": "..."
    },
    {
      "id": 1,
      "name": "Anindya Test",
      "email": "Anindya_Test@Example.COM",
      "role": "user",
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "count": 2
}
```

**Errors:** Same 401/403 as `/admin`, `500 errCode 242`.

## Postman Tests

**File:** `server/tests/postman/anindya_auth.json` (3 requests, `pm.sendRequest` for full coverage, 62 assertions)

- **Register - POST /api/anindya/auth/register** prerequest generates `testName`/`testEmail` (`Anindya_<ts>_<rand>` / `Anindya_<ts>_<rand>@Example.COM`) and `adminName`/`adminEmail`. Tests: success 201, duplicate email 409 errCode 219, case-sensitive distinct email (separate `CaseEmail_*@Example.COM` pair both 201), missing/short name 400 errCode 211/212, missing/invalid email 400 errCode 214/215, missing/short password 400 errCode 216/217, invalid role 400 errCode 220, duplicate name allowed 201 (name not unique), admin register 201 role admin.

- **Login - POST /api/anindya/auth/login** main request login with `testEmail` success 200 (saves `authToken`), then `sendRequest` for admin login 200 (saves `adminToken`), wrong case email 401 errCode 233 (case-sensitive), wrong password 401, missing email 400 errCode 231, missing password 400 errCode 232, non-existent 401.

- **Protected - GET /api/anindya/auth/me & RBAC** main `GET /me` with `Bearer {{authToken}}` success 200, then `sendRequest` for missing token 401 errCode 200, invalid token 401 errCode 201, malformed header (no Bearer) 401, empty Bearer 401, `GET /admin` with user token 403 errCode 240, `GET /users` with user token 403, `GET /admin` with admin token 200 + `adminData`, `GET /users` with admin token 200 + users array, missing/invalid token on `/admin` 401.

Run: `pnpm dlx newman run server/tests/postman/anindya_auth.json` (also in CI `.github/workflows/ci.yml:77`).

Post CRUD tests (`post_*_endpoint.json`) remain untouched and are not protected, demonstrating separation.

## Example cURL

```bash
# Register user
curl -X POST http://localhost:5000/api/anindya/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Anindya","email":"Anindya@Example.COM","password":"Password123!","role":"user"}'

# Register admin
curl -X POST http://localhost:5000/api/anindya/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"Admin@Example.COM","password":"AdminPass123!","role":"admin"}'

# Login
curl -X POST http://localhost:5000/api/anindya/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"Anindya@Example.COM","password":"Password123!"}'

# Me (protected)
curl http://localhost:5000/api/anindya/auth/me \
  -H "Authorization: Bearer <token>"

# Admin only (RBAC)
curl http://localhost:5000/api/anindya/auth/admin \
  -H "Authorization: Bearer <admin_token>"
curl http://localhost:5000/api/anindya/auth/users \
  -H "Authorization: Bearer <admin_token>"
```
