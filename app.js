const STORAGE_KEY = "pet1-daughters";
const CHILDREN = [
  { id: "miroslava", name: "Мирослава", short: "Мира", color: "#c45c26" },
  { id: "avrora", name: "Аврора", short: "Аврора", color: "#3f7a6b" },
];

const FEED_TYPES = [
  { id: "breast-left", label: "Грудь слева", kind: "breast" },
  { id: "breast-right", label: "Грудь справа", kind: "breast" },
  { id: "breast-both", label: "Обе груди", kind: "breast" },
  { id: "formula", label: "Смесь", kind: "bottle" },
  { id: "pumped", label: "Сцеженное молоко", kind: "bottle" },
];

const STAGES = [
  {
    month: 1,
    title: "Первый месяц",
    items: [
      { id: "head-lift", title: "Кратко поднимает головку на животе", hint: "Несколько секунд, без усталости." },
      { id: "face-follow", title: "Смотрит на лицо рядом", hint: "Особенно на маму и папу с близкого расстояния." },
      { id: "sound-startle", title: "Реагирует на голос и звук", hint: "Замирает, вздрагивает или ищет источник." },
      { id: "hands-fists", title: "Держит ручки в кулачках и тянет к лицу", hint: "Типичный тонус новорождённой." },
    ],
  },
  {
    month: 2,
    title: "Второй месяц",
    items: [
      { id: "social-smile", title: "Социальная улыбка", hint: "Улыбается в ответ, не только во сне." },
      { id: "track-object", title: "Следит взглядом за предметом", hint: "Медленное движение игрушки перед глазами." },
      { id: "cooing", title: "Гулит и издает протяжные звуки", hint: "Не только плач." },
      { id: "head-control", title: "Увереннее держит голову", hint: "На руках и на животе чуть дольше." },
    ],
  },
  {
    month: 3,
    title: "Третий месяц",
    items: [
      { id: "reach", title: "Тянется к игрушке", hint: "Может ещё не захватывать точно." },
      { id: "forearms", title: "Опирается на предплечья", hint: "На животе поднимает грудку." },
      { id: "knows-parents", title: "Узнаёт близких", hint: "Иначе реагирует на знакомые лица и голоса." },
      { id: "hands-open", title: "Чаще раскрывает ладошки", hint: "Кулачки уже не всё время сжаты." },
    ],
  },
  {
    month: 4,
    title: "Четвёртый месяц",
    items: [
      { id: "laugh", title: "Смеётся в голос", hint: "На игры, щекотку, лица." },
      { id: "grasp", title: "Захватывает игрушку", hint: "Держит и тянет в рот." },
      { id: "roll-start", title: "Пробует переворот", hint: "Часто сначала с живота на спину." },
      { id: "sounds-dialog", title: "«Отвечает» звуками", hint: "Диалог гулением." },
    ],
  },
  {
    month: 6,
    title: "Полгода",
    items: [
      { id: "sit-support", title: "Сидит с поддержкой", hint: "Спинка ещё может уставать." },
      { id: "transfer", title: "Перекладывает игрушку из руки в руку", hint: "Двуручные игры." },
      { id: "babble", title: "Лепет: ба-ба, ма-ма", hint: "Повтор слогов, ещё без смысла." },
      { id: "roll-both", title: "Переворачивается в обе стороны", hint: "Спина ↔ живот." },
    ],
  },
];

const MARKS = [
  { id: "none", label: "Ещё нет" },
  { id: "trying", label: "Пробует" },
  { id: "yes", label: "Получается" },
];

const ui = {
  birth: document.querySelector("#birth-date"),
  tabs: [...document.querySelectorAll(".tab")],
  panels: {
    today: document.querySelector("#panel-today"),
    feedings: document.querySelector("#panel-feedings"),
    weight: document.querySelector("#panel-weight"),
    stages: document.querySelector("#panel-stages"),
    charts: document.querySelector("#panel-charts"),
  },
};

let state = loadState();
let tab = "today";
let childFilter = "all";

function defaultState() {
  return {
    birthDate: "2026-10-02",
    feedings: [],
    weights: [],
    stages: {},
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function childById(id) {
  return CHILDREN.find((child) => child.id === id);
}

function feedLabel(id) {
  return FEED_TYPES.find((item) => item.id === id)?.label ?? id;
}

function ageText(fromDate) {
  const start = new Date(`${fromDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) return "укажите дату рождения";
  const now = new Date();
  let days = Math.floor((now - start) / 86400000);
  if (days < 0) return "дата в будущем";
  const months = Math.floor(days / 30.4375);
  days = Math.round(days - months * 30.4375);
  if (months === 0) return `${days} дн.`;
  return `${months} мес. ${days} дн.`;
}

function localDateTimeValue(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function dayKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatWhen(iso) {
  const date = new Date(iso);
  return date.toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function lastOf(list, childId) {
  return list.filter((item) => item.childId === childId).sort((a, b) => b.at.localeCompare(a.at))[0];
}

function filtered(list) {
  return childFilter === "all" ? list : list.filter((item) => item.childId === childFilter);
}

function childSelect(selected, name = "childId") {
  return CHILDREN.map(
    (child) => `<option value="${child.id}" ${child.id === selected ? "selected" : ""}>${child.name}</option>`
  ).join("");
}

function childChips() {
  const options = [{ id: "all", name: "Обе", className: "" }, ...CHILDREN.map((c) => ({ ...c, className: c.id === "miroslava" ? "mira" : "avrora" }))];
  return options
    .map(
      (item) =>
        `<button type="button" class="chip ${item.className} ${childFilter === item.id ? "is-active" : ""}" data-child="${item.id}">${item.name}</button>`
    )
    .join("");
}

function setTab(next) {
  tab = next;
  ui.tabs.forEach((button) => button.classList.toggle("is-active", button.dataset.tab === next));
  Object.entries(ui.panels).forEach(([key, panel]) => {
    const active = key === next;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
  render();
}

function render() {
  ui.birth.value = state.birthDate;
  if (tab === "today") renderToday();
  if (tab === "feedings") renderFeedings();
  if (tab === "weight") renderWeight();
  if (tab === "stages") renderStages();
  if (tab === "charts") renderCharts();
}

function renderToday() {
  ui.panels.today.innerHTML = `
    <div class="grid">
      ${CHILDREN.map((child) => {
        const feed = lastOf(state.feedings, child.id);
        const weight = lastOf(state.weights, child.id);
        return `
          <article class="card">
            <p class="tag ${child.id === "miroslava" ? "mira" : "avrora"}">${child.name}</p>
            <h2>${ageText(state.birthDate)}</h2>
            <p class="muted">Последнее кормление: ${feed ? `${formatWhen(feed.at)} · ${feedLabel(feed.type)}` : "ещё не записывали"}</p>
            <p class="muted">Вес: ${weight ? `${weight.grams} г · ${formatWhen(weight.at)}` : "ещё не записывали"}</p>
          </article>
        `;
      }).join("")}
    </div>
    <form class="form" data-quick-feed>
      <label>Кого кормили
        <select name="childId">${childSelect("miroslava")}</select>
      </label>
      <label>Чем
        <select name="type">${FEED_TYPES.map((t) => `<option value="${t.id}">${t.label}</option>`).join("")}</select>
      </label>
      <label>Минуты (грудь)
        <input name="minutes" type="number" min="0" max="90" placeholder="15" />
      </label>
      <label>Миллилитры (бутылочка)
        <input name="ml" type="number" min="0" max="300" placeholder="90" />
      </label>
      <div class="form-actions wide">
        <button class="btn primary" type="submit">Записать кормление сейчас</button>
      </div>
    </form>
  `;
}

function renderFeedings() {
  const items = filtered(state.feedings).sort((a, b) => b.at.localeCompare(a.at));
  ui.panels.feedings.innerHTML = `
    <div class="marks">${childChips()}</div>
    <form class="form" data-feed-form>
      <label>Кто
        <select name="childId">${childSelect(childFilter === "all" ? "miroslava" : childFilter)}</select>
      </label>
      <label>Когда
        <input name="at" type="datetime-local" value="${localDateTimeValue()}" required />
      </label>
      <label>Тип
        <select name="type">${FEED_TYPES.map((t) => `<option value="${t.id}">${t.label}</option>`).join("")}</select>
      </label>
      <label>Минуты
        <input name="minutes" type="number" min="0" max="90" />
      </label>
      <label>Миллилитры
        <input name="ml" type="number" min="0" max="300" />
      </label>
      <label>Заметка
        <input name="note" maxlength="140" placeholder="Как ела, срыгнула, заснула..." />
      </label>
      <div class="form-actions wide">
        <button class="btn primary" type="submit">Сохранить кормление</button>
      </div>
    </form>
    ${
      items.length
        ? `<ul class="list">${items
            .map((item) => {
              const child = childById(item.childId);
              const extra = item.minutes ? `${item.minutes} мин` : item.ml ? `${item.ml} мл` : "";
              return `<li class="row">
                <div>
                  <span class="tag ${child.id === "miroslava" ? "mira" : "avrora"}">${child.name}</span>
                  <strong>${feedLabel(item.type)}</strong>
                  <p class="muted">${formatWhen(item.at)}${extra ? ` · ${extra}` : ""}${item.note ? ` · ${escapeHtml(item.note)}` : ""}</p>
                </div>
                <button class="btn ghost" data-delete-feed="${item.id}" type="button">Удалить</button>
              </li>`;
            })
            .join("")}</ul>`
        : `<p class="empty">Пока нет кормлений. Запишите первое — так проще держать ритм двоих.</p>`
    }
  `;
}

function renderWeight() {
  const items = filtered(state.weights).sort((a, b) => b.at.localeCompare(a.at));
  ui.panels.weight.innerHTML = `
    <div class="marks">${childChips()}</div>
    <form class="form" data-weight-form>
      <label>Кто
        <select name="childId">${childSelect(childFilter === "all" ? "miroslava" : childFilter)}</select>
      </label>
      <label>Когда
        <input name="at" type="datetime-local" value="${localDateTimeValue()}" required />
      </label>
      <label>Вес, граммы
        <input name="grams" type="number" min="1500" max="12000" step="5" required placeholder="4200" />
      </label>
      <div class="form-actions">
        <button class="btn primary" type="submit">Сохранить вес</button>
      </div>
    </form>
    ${
      items.length
        ? `<ul class="list">${items
            .map((item) => {
              const child = childById(item.childId);
              return `<li class="row">
                <div>
                  <span class="tag ${child.id === "miroslava" ? "mira" : "avrora"}">${child.name}</span>
                  <span class="stat">${item.grams} г</span>
                  <p class="muted">${formatWhen(item.at)}</p>
                </div>
                <button class="btn ghost" data-delete-weight="${item.id}" type="button">Удалить</button>
              </li>`;
            })
            .join("")}</ul>`
        : `<p class="empty">Добавьте взвешивание. Для месяца удобно раз в несколько дней в одно и то же время.</p>`
    }
  `;
}

function renderStages() {
  const monthNow = Math.max(1, Math.floor((Date.now() - new Date(`${state.birthDate}T00:00:00`)) / (30.4375 * 86400000)) + 1);
  ui.panels.stages.innerHTML = `
    <p class="muted">Отмечайте, как идёт этап у каждой. Это ориентиры, а не диагноз.</p>
    ${STAGES.map((group) => {
      const current = group.month === monthNow;
      return `
        <section class="stage">
          <div class="stage-head">
            <h2 class="section-title">${group.title}${current ? " · сейчас" : ""}</h2>
            <span class="muted">${group.month} мес.</span>
          </div>
          ${group.items
            .map(
              (item) => `
            <article class="card" style="margin-top:12px">
              <h3>${item.title}</h3>
              <p class="muted">${item.hint}</p>
              <div class="marks">
                ${CHILDREN.map((child) => {
                  const key = `${child.id}:${item.id}`;
                  const currentMark = state.stages[key]?.status ?? "none";
                  return `<div class="mark">
                    <p>${child.name}</p>
                    <select data-stage="${key}">
                      ${MARKS.map((mark) => `<option value="${mark.id}" ${mark.id === currentMark ? "selected" : ""}>${mark.label}</option>`).join("")}
                    </select>
                  </div>`;
                }).join("")}
              </div>
            </article>
          `
            )
            .join("")}
        </section>
      `;
    }).join("")}
    <p class="disclaimer muted">Если что-то беспокоит, сверяйтесь с педиатром. Здесь только ваш семейный дневник.</p>
  `;
}

function renderCharts() {
  ui.panels.charts.innerHTML = `
    <article class="card">
      <h2>Вес</h2>
      <p class="legend">
        ${CHILDREN.map((c) => `<span><i class="dot" style="background:${c.color}"></i>${c.name}</span>`).join("")}
      </p>
      ${drawLineChart(state.weights)}
    </article>
    <article class="card" style="margin-top:16px">
      <h2>Кормления за 14 дней</h2>
      ${drawBarChart(state.feedings)}
    </article>
  `;
}

function drawLineChart(weights) {
  if (weights.length < 2) {
    return `<p class="empty">Нужно хотя бы два взвешивания, чтобы появилась линия.</p>`;
  }
  const width = 840;
  const height = 240;
  const pad = { l: 44, r: 16, t: 16, b: 28 };
  const points = [...weights].sort((a, b) => a.at.localeCompare(b.at));
  const times = points.map((p) => new Date(p.at).getTime());
  const grams = points.map((p) => p.grams);
  const minX = Math.min(...times);
  const maxX = Math.max(...times);
  const minY = Math.min(...grams) - 50;
  const maxY = Math.max(...grams) + 50;
  const x = (t) => pad.l + ((t - minX) / Math.max(maxX - minX, 1)) * (width - pad.l - pad.r);
  const y = (g) => height - pad.b - ((g - minY) / Math.max(maxY - minY, 1)) * (height - pad.t - pad.b);
  const polylines = CHILDREN.map((child) => {
    const series = points.filter((p) => p.childId === child.id);
    if (series.length === 0) return "";
    const d = series.map((p) => `${x(new Date(p.at).getTime())},${y(p.grams)}`).join(" ");
    const dots = series.map((p) => `<circle cx="${x(new Date(p.at).getTime())}" cy="${y(p.grams)}" r="4" fill="${child.color}"></circle>`).join("");
    return `<polyline fill="none" stroke="${child.color}" stroke-width="3" points="${d}"></polyline>${dots}`;
  }).join("");
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="График веса">
    <line x1="${pad.l}" y1="${height - pad.b}" x2="${width - pad.r}" y2="${height - pad.b}" stroke="#e6d9c8"></line>
    <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${height - pad.b}" stroke="#e6d9c8"></line>
    <text x="8" y="${pad.t + 8}" font-size="12" fill="#6f645a">${Math.round(maxY)} г</text>
    <text x="8" y="${height - pad.b}" font-size="12" fill="#6f645a">${Math.round(minY)} г</text>
    ${polylines}
  </svg>`;
}

function drawBarChart(feedings) {
  const days = [];
  for (let i = 13; i >= 0; i -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    days.push(date);
  }
  const width = 840;
  const height = 240;
  const pad = { l: 36, r: 12, t: 16, b: 36 };
  const counts = days.map((day) => {
    const key = dayKey(day);
    return {
      label: day.toLocaleDateString("ru-RU", { day: "numeric", month: "numeric" }),
      mira: feedings.filter((f) => f.childId === "miroslava" && dayKey(f.at) === key).length,
      avrora: feedings.filter((f) => f.childId === "avrora" && dayKey(f.at) === key).length,
    };
  });
  const max = Math.max(1, ...counts.flatMap((c) => [c.mira, c.avrora]));
  const groupW = (width - pad.l - pad.r) / days.length;
  const bars = counts
    .map((c, i) => {
      const x = pad.l + i * groupW;
      const h1 = (c.mira / max) * (height - pad.t - pad.b);
      const h2 = (c.avrora / max) * (height - pad.t - pad.b);
      return `
        <rect x="${x + 6}" y="${height - pad.b - h1}" width="${groupW / 3}" height="${h1}" fill="#c45c26" rx="3"></rect>
        <rect x="${x + 10 + groupW / 3}" y="${height - pad.b - h2}" width="${groupW / 3}" height="${h2}" fill="#3f7a6b" rx="3"></rect>
        <text x="${x + groupW / 2}" y="${height - 12}" font-size="10" text-anchor="middle" fill="#6f645a">${c.label}</text>
      `;
    })
    .join("");
  const total = feedings.length;
  if (!total) return `<p class="empty">Когда появятся кормления, здесь будут столбики по дням.</p>`;
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Кормления по дням">${bars}</svg>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function addFeeding(form) {
  const data = new FormData(form);
  const type = FEED_TYPES.find((item) => item.id === data.get("type"));
  const minutes = Number(data.get("minutes") || 0);
  const ml = Number(data.get("ml") || 0);
  state.feedings.unshift({
    id: crypto.randomUUID(),
    childId: data.get("childId"),
    type: type.id,
    minutes: type.kind === "breast" && minutes ? minutes : undefined,
    ml: type.kind === "bottle" && ml ? ml : undefined,
    note: String(data.get("note") || "").trim(),
    at: data.get("at") ? new Date(data.get("at")).toISOString() : new Date().toISOString(),
  });
  saveState();
  render();
}

ui.birth.addEventListener("change", () => {
  state.birthDate = ui.birth.value;
  saveState();
  render();
});

document.body.addEventListener("click", (event) => {
  const tabButton = event.target.closest("nav.tabs [data-tab]");
  if (tabButton) {
    setTab(tabButton.dataset.tab);
    return;
  }
  if (event.target.closest("[data-export]")) {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dnevnik-devochek.json";
    link.click();
    URL.revokeObjectURL(url);
    return;
  }
  const child = event.target.closest("[data-child]");
  if (child) {
    childFilter = child.dataset.child;
    render();
  }
  const delFeed = event.target.closest("[data-delete-feed]");
  if (delFeed) {
    state.feedings = state.feedings.filter((item) => item.id !== delFeed.dataset.deleteFeed);
    saveState();
    render();
  }
  const delWeight = event.target.closest("[data-delete-weight]");
  if (delWeight) {
    state.weights = state.weights.filter((item) => item.id !== delWeight.dataset.deleteWeight);
    saveState();
    render();
  }
});

document.body.addEventListener("change", (event) => {
  const stage = event.target.closest("[data-stage]");
  if (!stage) return;
  state.stages[stage.dataset.stage] = { status: stage.value, at: new Date().toISOString() };
  saveState();
});

document.body.addEventListener("submit", (event) => {
  const form = event.target;
  if (form.matches("[data-quick-feed], [data-feed-form]")) {
    event.preventDefault();
    addFeeding(form);
  }
  if (form.matches("[data-weight-form]")) {
    event.preventDefault();
    const data = new FormData(form);
    state.weights.unshift({
      id: crypto.randomUUID(),
      childId: data.get("childId"),
      grams: Number(data.get("grams")),
      at: new Date(data.get("at")).toISOString(),
    });
    saveState();
    render();
  }
});

document.querySelector("#import-file").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const next = JSON.parse(await file.text());
    if (!next || !Array.isArray(next.feedings) || !Array.isArray(next.weights)) {
      throw new Error("bad file");
    }
    state = { ...defaultState(), ...next };
    saveState();
    render();
  } catch {
    alert("Не получилось прочитать файл. Нужен JSON, сохранённый из этого дневника.");
  }
  event.target.value = "";
});

render();
