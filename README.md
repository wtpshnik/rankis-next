# rankis-next

Нова витрина rankis.lt на Next.js 16 + TypeScript + Tailwind v4. Этап 1: витрина на данных, собранных с текущего сайта.

```bash
npm install          # зависимости
npm run scrape       # собрать data/categories.json и data/products.json (~3000 товаров, кеш в data/.cache)
npm run dev          # http://localhost:3000
npm test             # vitest: парсеры, каталог, параметры
npm run e2e          # playwright smoke (desktop + mobile), поднимает dev-сервер сам
npm run build        # статический экспорт в out/ (на GitHub Pages собирается с NEXT_PUBLIC_BASE_PATH=/rankis-next)
```

Онлайн: https://wtpshnik.github.io/rankis-next/ — деплой через GitHub Actions при пуше в master (.github/workflows/deploy.yml).

Документы: `docs/superpowers/specs/` (дизайн), `docs/superpowers/plans/` (план).
Данные читает только `lib/catalog.ts` — на этапе бэкенда заменяется на БД без правки страниц.
