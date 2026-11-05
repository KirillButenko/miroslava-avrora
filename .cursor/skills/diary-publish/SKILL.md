---
name: diary-publish
description: Commits and publishes the family diary to GitHub Pages. Use when Кирилл says выложи, опубликуй, закоммить, запушь, or publish the site.
---

# Публикация дневника

Только если Кирилл явно попросил выложить или закоммитить. Хук спросит подтверждение на `git commit` / `push` / `gh`.

## Шаги

1. `git status`, `git diff`, `git log -5` — параллельно.
2. Не коммить `.env` и ключи. Publishable-ключ в `app.js` уже в репо — его не трогать.
3. `git add` только нужные файлы сайта и `.cursor/`.
4. Коммит через HEREDOC, без `--no-verify` и без `--amend`, если коммит уже в remote.
5. Пуш в текущую ветку. GitHub Pages собирается workflow `.github/workflows/pages.yml` с `main`.
6. Не открывай PR и не force-push, пока не попросили.

Сообщи URL сайта: https://kirillbutenko.github.io/miroslava-avrora/
