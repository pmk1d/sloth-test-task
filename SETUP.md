# Sloth Exchange — тестовое задание

## Предварительные требования

- Node.js 20+
- Docker

## Установка

```bash
git clone <repo-url>
cd sloth-test-task
```

Поднимает PostgreSQL + NestJS API одной командой:

```bash
docker compose up -d
```

API будет доступен на `http://localhost:3001`.

Эндпоинты:
- `GET http://localhost:3001/api/users/me`
- `GET http://localhost:3001/api/exchange-config`
- `GET http://localhost:3001/api/rates`

---



---

## Структура проекта

```
sloth-test-task/
├── apps/
│   ├── api/          — NestJS API (Prisma + PostgreSQL)
│   └── mobile/       — Expo приложение (React Native)
├── mock/             — эталонные JSON ответы API
├── docker-compose.yml
└── SETUP.md
```

### apps/api/

NestJS 11, TypeScript, Prisma ORM.

- `src/modules/users/` — `GET /api/users/me`
- `src/modules/exchange-config/` — `GET /api/exchange-config`
- `src/modules/rates/` — `GET /api/rates`
- `prisma/schema.prisma` — схема БД
- `prisma/seed.ts` — загрузка данных из `mock/` в БД

### apps/mobile/

Expo Router (file-based navigation).

- `app/_layout.tsx` — Stack навигация
- `app/(tabs)/index.tsx` — главный экран
- `app/orders.tsx`, `create-order.tsx`, `support.tsx`, `referral.tsx` — экраны
- `mock/` — копии JSON файлов для разработки без бекенда
