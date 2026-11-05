---
name: diary-feature
description: Adds or changes a feature on the family twins diary (feedings, weight, history, PWA, styles) in the static site. Use when Кирилл asks to develop, add, or rework a screen or data field on Мирослава и Аврора.
---

# Новая фича дневника

Три файла: `index.html`, `styles.css`, `app.js`. Без фреймворков, пакетов и бэкенда.

## Данные

- Состояние: `localStorage` `pet1-daughters` + Supabase `diary` `id=1` поле `payload`.
- Новые записи клади в массив со `id` (`crypto.randomUUID()`), `childId`, `at`.
- `defaultState`, `loadState`, `mergeState` должны знать новый массив. Иначе sync затрёт его.
- Профили, `weights`, `stages` уже в payload — не выкидывай при merge.
- Ключ в `app.js` не менять. `service_role` не использовать.

## UI

- Семья смотрит один экран: карточки, кнопка, `<details>`.
- Новое либо на этом экране, либо в ещё одном `<details>`, либо в существующей модалке.
- Телефон: две колонки карточек, текст от 13px, поля ввода 16px.

## Как править

1. Grep имя функции, Read ~80 строк. Не читай `app.js` целиком.
2. Кормление: `renderToday`, `lastFeed`, `feedBlock`. График: `dynamicsChart`. Sync: `syncShared`, `mergeState`. Цвета: `styles.css` `:root`.
3. После правки обнови карту в `.cursor/rules/diary.mdc`, если появилась новая функция.
4. Не коммить и не пушить, пока не попросили. Браузер — только если Кирилл попросил посмотреть.
5. Ответ: что изменилось и где смотреть.
