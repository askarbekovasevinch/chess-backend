# ♟️ Chess Platform Backend

NestJS + PostgreSQL + Swagger

---

## 🚀 Ishga tushirish

```bash
# 1. O'rnatish
npm install

# 2. Env sozlash
cp .env.example .env
# .env ichidagi qiymatlarni to'ldiring

# 3. PostgreSQL database yarating
createdb chess_db

# 4. Ishga tushiring
npm run start:dev
```

**Swagger:** `http://localhost:3000/api/docs`

---

## 🗂 Modul tuzilmasi

```
src/
├── common/
│   ├── decorators/     @GetUser, @Roles, @Public
│   ├── entities/       BaseEntity (id, createdAt, updatedAt)
│   ├── enums/          Role, LoginType, OtpType, MatchType, WinnerType, ReportType
│   ├── filters/        AllExceptionsFilter
│   └── guards/         JwtAuthGuard, RolesGuard
│
└── modules/
    ├── auth/           Register, Login (email+password / phone+OTP), Verify, ForgotPassword, Refresh, Logout
    ├── users/          CRUD, rol o'zgartirish
    ├── languages/      CRUD
    ├── authors/        CRUD
    ├── difficulties/   CRUD
    ├── otp/            OtpCode entity
    ├── courses/
    │   ├── categories/ Kurs kategoriyalari CRUD
    │   ├── sections/   Bo'limlar CRUD (sectionsCount auto)
    │   ├── lessons/    Darslar CRUD + progress tracking (lessonsCount auto)
    │   ├── likes/      CourseLike entity
    │   ├── reviews/    CourseReview + rating recalc
    │   └── purchases/  PurchasedCourse + isCompleted auto
    ├── books/
    │   ├── categories/ Kitob kategoriyalari CRUD
    │   ├── likes/      BookLike entity
    │   ├── reviews/    BookReview + rating recalc
    │   └── purchases/  PurchasedBook
    ├── matches/        O'yin yaratish, yakunlash, tarix
    └── reports/        Shikoyat yuborish, admin ko'rib chiqish
```

---

## 🔌 API Endpointlar

### 🔐 Auth
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/v1/auth/register` | Ro'yxatdan o'tish |
| POST | `/api/v1/auth/login` | Kirish |
| POST | `/api/v1/auth/verify-otp` | OTP tasdiqlash |
| POST | `/api/v1/auth/forgot-password` | Parolni unutdim |
| POST | `/api/v1/auth/reset-password` | Parolni tiklash |
| POST | `/api/v1/auth/refresh` | Token yangilash 🔒 |
| POST | `/api/v1/auth/logout` | Chiqish 🔒 |

### 👤 Users
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/v1/users/me` | O'z profili 🔒 |
| PUT | `/api/v1/users/me` | Profilni yangilash 🔒 |
| GET | `/api/v1/users` | Barcha users (Admin) 🔒 |
| GET | `/api/v1/users/:id` | User profili 🔒 |
| PUT | `/api/v1/users/:id/role` | Rol o'zgartirish 🔒 |
| DELETE | `/api/v1/users/:id` | Deaktivatsiya 🔒 |

### 📚 Courses
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/v1/courses` | Kurslar (filter: category, language, difficulty, search) |
| GET | `/api/v1/courses/:id` | Kurs tafsiloti |
| POST | `/api/v1/courses` | Kurs yaratish 🔒 |
| PUT | `/api/v1/courses/:id` | Kurs yangilash 🔒 |
| DELETE | `/api/v1/courses/:id` | Kurs o'chirish 🔒 |
| POST | `/api/v1/courses/:id/purchase` | Sotib olish 🔒 |
| GET | `/api/v1/courses/me/purchases` | Mening kurslarim 🔒 |
| POST | `/api/v1/courses/:id/like` | Like/Unlike 🔒 |
| GET | `/api/v1/courses/:id/reviews` | Sharhlar |
| POST | `/api/v1/courses/:id/reviews` | Sharh yozish 🔒 |
| DELETE | `/api/v1/courses/:id/reviews` | Sharh o'chirish 🔒 |
| GET | `/api/v1/courses/:courseId/sections` | Bo'limlar |
| POST | `/api/v1/courses/:courseId/sections` | Bo'lim qo'shish 🔒 |
| PUT | `/api/v1/lessons/:id/progress` | Progress saqlash 🔒 |
| GET | `/api/v1/courses/:courseId/progress` | Kurs progressi 🔒 |

### 📖 Books
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/v1/books` | Kitoblar (filter) |
| GET | `/api/v1/books/:id` | Kitob tafsiloti |
| POST | `/api/v1/books` | Kitob qo'shish 🔒 |
| POST | `/api/v1/books/:id/purchase` | Sotib olish 🔒 |
| GET | `/api/v1/books/me/purchases` | Mening kitoblarim 🔒 |
| POST | `/api/v1/books/:id/like` | Like/Unlike 🔒 |
| POST | `/api/v1/books/:id/reviews` | Sharh yozish 🔒 |

### ♟️ Matches
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/v1/matches` | O'yinlar ro'yxati |
| GET | `/api/v1/matches/:id` | O'yin tafsiloti |
| GET | `/api/v1/matches/user/me` | Mening o'yinlarim 🔒 |
| POST | `/api/v1/matches` | O'yin boshlash 🔒 |
| PUT | `/api/v1/matches/:id/finish` | O'yinni yakunlash 🔒 |

### 🚨 Reports
| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/v1/reports` | Shikoyat yuborish 🔒 |
| GET | `/api/v1/reports` | Barcha shikoyatlar (Admin) 🔒 |
| PUT | `/api/v1/reports/:id/review` | Ko'rib chiqildi (Admin) 🔒 |

---

## 🛡 Autentifikatsiya

- **Email login:** `login + password` → JWT token
- **Phone login:** `login` → OTP yuboriladi → OTP tasdiqlash → JWT token
- Barcha 🔒 endpointlar `Authorization: Bearer <token>` talab qiladi
- `@Public()` decorator bilan endpointni ochiq qilsa bo'ladi

---

## ⚙️ Avtomatik hisob-kitoblar

| Maydon | Qachon yangilanadi |
|--------|--------------------|
| `courses.sectionsCount` | CourseSection qo'shilganda/o'chirilganda |
| `courses.lessonsCount` | CourseLesson qo'shilganda/o'chirilganda |
| `courses.likesCount` | Like/Unlike qilinganda |
| `courses.rating` | Review qo'shilganda/o'chirilganda |
| `courses.reviewsCount` | Review qo'shilganda/o'chirilganda |
| `purchasedCourses.isCompleted` | Har bir lesson completed bo'lganda tekshiriladi |
| `books.likesCount` | Like/Unlike qilinganda |
| `books.rating` | Review qo'shilganda/o'chirilganda |
