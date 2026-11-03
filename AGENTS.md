# Агентам

Семейный дневник близнецов. Правь точечно. Публикация, коммит, пуш и PR — только если явно попросили.

## Файлы

- `index.html` — оболочка, стартовая секция `#panel-today`
- `styles.css` — цвета девочек и вёрстка карточек
- `app.js` — состояние, кормления, вес, графики, sync с Supabase
- `.cursor/rules/` — постоянные правила чатов

Скрытые панели `#panel-girls`, `#panel-weight`, `#panel-stages`, `#panel-charts` в разметке ещё есть, верхнего меню у них нет.

## База

Проект Supabase `sinwpqyjjsocceybwbsq`.

```sql
create table if not exists public.diary (
  id int primary key,
  payload jsonb not null default '{}'::jsonb
);
```

`payload` — тот же объект, что в `localStorage`: `profiles`, `feedings`, `weights`, `stages`.
Чтение/запись: REST `/rest/v1/diary`, заголовки `apikey` и `Authorization: Bearer` с publishable-ключом из `app.js`.
RLS: select/insert/update разрешены всем (семья, без логина).

## Локальный запуск

```bash
python3 -m http.server 8765
```

Открыть `http://127.0.0.1:8765/`. GitHub Pages собирается workflow `.github/workflows/pages.yml` с ветки `main`.
