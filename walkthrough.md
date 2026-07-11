# Walkthrough — Code Cleanup

Every file in both `Backend/` and `Frontend/` has been cleaned up. Here's what changed and why.

---

## What was removed

| Removed | Files affected | Why |
|---|---|---|
| `console.log(...)` debug messages | repo, service, controller | Errors bubble up to the controller which sends a proper HTTP response — no need to log at every layer |
| `console.error(...)` | App.jsx, SignIn.jsx | Unnecessary noise in the browser console |
| `alert(...)` calls | SignIn.jsx, SignUp.jsx, Home.jsx | Replaced with inline UI messages that look professional |
| `// import { response } from "express"` | controller | Dead commented-out code |
| `// import './index.css'` | main.jsx | Dead commented-out import |
| Empty `catch (error) {}` blocks | old service | Errors were being silently swallowed |
| `err: {}` in success responses | controller | Unnecessary noise — a success response shouldn't include an error field |

---

## What was improved

### Backend

| File | Changes |
|---|---|
| [index.js](file:///d:/Programming/web%20dev/projects/airline%20booking/Backend/src/index.js) | Clean formatting, beginner-friendly comments on each section |
| [config.js](file:///d:/Programming/web%20dev/projects/airline%20booking/Backend/src/Configuration/config.js) | Added comment explaining what dotenv does |
| [connectToDB.js](file:///d:/Programming/web%20dev/projects/airline%20booking/Backend/src/Connections/connectToDB.js) | Replaced messy `.then().catch()` chain with clean `async/await` + `try/catch`. Added `process.exit(1)` so the server doesn't silently run with a broken DB |
| [users-model.js](file:///d:/Programming/web%20dev/projects/airline%20booking/Backend/src/Models/users-model.js) | Renamed export from `users` → `User` (PascalCase for models). Added JSDoc explaining the schema and pre-save hook |
| [user-repo.js](file:///d:/Programming/web%20dev/projects/airline%20booking/Backend/src/Repository/user-repo.js) | Renamed class `userRepository` → `UserRepository`. Removed all console.logs from catch blocks. Added JSDoc method comments |
| [user-service.js](file:///d:/Programming/web%20dev/projects/airline%20booking/Backend/src/Services/user-service.js) | Renamed class `userService` → `UserService`, method `signin` → `signIn`. Removed redundant try/catch wrappers. Replaced `bcrypt.compareSync` with async `bcrypt.compare`. Added step-by-step comments. Removed unused `jwt` import |
| [user-controller.js](file:///d:/Programming/web%20dev/projects/airline%20booking/Backend/src/Controllers/user-controller.js) | Renamed `signin` → `signIn`. Used correct HTTP status codes (`201` for create, `401` for auth failure). Simplified error response shape. Added JSDoc route comments |
| [auth-middleware.js](file:///d:/Programming/web%20dev/projects/airline%20booking/Backend/src/Middlewares/auth-middleware.js) | Removed unnecessary `async`. Replaced callback-style `jwt.verify` with synchronous try/catch. Added detailed step-by-step JSDoc explaining middleware flow |
| [user-router.js](file:///d:/Programming/web%20dev/projects/airline%20booking/Backend/src/Routers/user-router.js) | Updated import to use `signIn`. Added section divider comments (public vs protected routes) |

### Frontend

| File | Changes |
|---|---|
| [main.jsx](file:///d:/Programming/web%20dev/projects/airline%20booking/Frontend/src/main.jsx) | Removed commented-out import and trailing blank lines |
| [App.jsx](file:///d:/Programming/web%20dev/projects/airline%20booking/Frontend/src/App.jsx) | Extracted `clearAuth()` helper to remove duplication. Removed all `console.error` calls. Added JSDoc explaining the routing logic |
| [SignIn.jsx](file:///d:/Programming/web%20dev/projects/airline%20booking/Frontend/src/signUp%20and%20SignIn/SignIn.jsx) | Replaced `alert('wrong credentials')` with inline `<p>` error message in the UI. Added JSDoc props documentation |
| [SignUp.jsx](file:///d:/Programming/web%20dev/projects/airline%20booking/Frontend/src/signUp%20and%20SignIn/SignUp.jsx) | Replaced `alert()` with inline success/error messages. Fixed inconsistent naming (`setemail` → `setEmail`, `setpassword` → `setPassword`). Added try/catch for error handling. Fixed indentation |
| [Home.jsx](file:///d:/Programming/web%20dev/projects/airline%20booking/Frontend/src/Home.jsx) | Removed unused `React` import. Removed `alert()` from Find Flights button. Added JSDoc and section comments |

---

## Verification

All endpoints tested and passing:
- `POST /api/signup` → `201` ✅
- `POST /api/signin` → `200` with token ✅
- `GET /api/home` without token → `401` ✅
- `GET /api/home` with bad token → `401` ✅
- `GET /api/home` with valid token → `200` ✅
