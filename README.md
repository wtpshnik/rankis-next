# rankis-next

Нова витрина rankis.lt на Next.js 16 + TypeScript + Tailwind v4. Этап 1: витрина на данных, собранных с текущего сайта.

```bash
npm install          # зависимости
npm run scrape       # собрать data/categories.json и data/products.json (~3000 товаров, кеш в data/.cache)
npm run dev          # http://localhost:3000
npm test             # vitest: парсеры, каталог, параметры
npm run e2e          # playwright smoke (desktop + mobile), поднимает dev-сервер сам
npm run build        # продакшен-сборка
```

Документы: `docs/superpowers/specs/` (дизайн), `docs/superpowers/plans/` (план).
Данные читает только `lib/catalog.ts` — на этапе бэкенда заменяется на БД без правки страниц.
