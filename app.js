const STORAGE_KEY = "pet1-daughters";
const CHILDREN = [
  { id: "miroslava", name: "Мирослава", color: "#c4a882", bornAt: "2026-09-29T10:38" },
  { id: "avrora", name: "Аврора", color: "#e8a0b0", bornAt: "2026-09-29T10:39" },
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
];

const MARKS = [
  { id: "none", label: "Ещё нет" },
  { id: "trying", label: "Пробует" },
  { id: "yes", label: "Получается" },
];

const ui = {
  tabs: [...document.querySelectorAll(".tab")],
  panels: {
    today: document.querySelector("#panel-today"),
    girls: document.querySelector("#panel-girls"),
    weight: document.querySelector("#panel-weight"),
    stages: document.querySelector("#panel-stages"),
    charts: document.querySelector("#panel-charts"),
  },
};

let state = loadState();
let tab = "today";
let childFilter = "all";
let feedOpen = null;

function emptyProfile(child) {
  return {
    bornAt: child.bornAt,
    birthGrams: "",
    birthHeight: "",
    height: "",
    headCm: "",
    clothes: "",
    milkNote: "",
    vitaminD: "",
    nextVisit: "",
    notes: "",
  };
}

function defaultState() {
  return {
    profiles: Object.fromEntries(CHILDREN.map((child) => [child.id, emptyProfile(child)])),
    feedings: [],
    weights: [],
    stages: {},
  };
}

function loadState() {
  const base = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw);
    base.feedings = saved.feedings || [];
    base.weights = saved.weights || [];
    base.stages = saved.stages || {};
    for (const child of CHILDREN) {
      base.profiles[child.id] = { ...emptyProfile(child), ...(saved.profiles?.[child.id] || {}) };
      if (!base.profiles[child.id].bornAt) base.profiles[child.id].bornAt = child.bornAt;
    }
    return base;
  } catch {
    return base;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function childById(id) {
  return CHILDREN.find((child) => child.id === id);
}

function ageText(bornAt) {
  const start = new Date(bornAt);
  if (Number.isNaN(start.getTime())) return "нет даты";
  const days = Math.floor((Date.now() - start) / 86400000);
  if (days < 0) return "дата в будущем";
  const months = Math.floor(days / 30.4375);
  const rest = Math.round(days - months * 30.4375);
  if (months <= 0) return `${days} дн.`;
  return `${months} мес. ${rest} дн.`;
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
  return new Date(iso).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function lastOf(list, childId) {
  return list.filter((item) => item.childId === childId).sort((a, b) => b.at.localeCompare(a.at))[0];
}

function lastFeed(childId) {
  let best = null;
  for (const item of state.feedings) {
    let rec = null;
    if (item.childId === childId) rec = item;
    else if (item[childId]?.ml != null) rec = { ...item[childId], at: item.at, kind: item.kind };
    if (rec && (!best || rec.at > best.at)) best = rec;
  }
  return best;
}

function feedBlock(feed) {
  if (!feed) return `<p class="feed-empty">Ещё не записывали</p>`;
  const kind = feed.kind === "formula" ? "Смесь" : "Молоко";
  const bits = [
    feed.ml != null ? `${feed.ml} мл` : "",
    feed.mood ? `настроение ${feed.mood}/10` : "",
    feed.slept === true ? "спала" : feed.slept === false ? "не спала" : "",
  ].filter(Boolean);
  return `<p class="feed-when">${formatWhen(feed.at)}</p><p class="feed-meta">${[kind, ...bits].join(" · ")}</p>`;
}

function weightGain(childId) {
  const items = state.weights.filter((item) => item.childId === childId).sort((a, b) => a.at.localeCompare(b.at));
  if (!items.length) return { latest: null, delta: null };
  const latest = items[items.length - 1];
  const target = new Date(latest.at).getTime() - 14 * 86400000;
  let ref = items[0];
  for (const item of items) {
    if (new Date(item.at).getTime() <= target) ref = item;
  }
  if (ref === latest) return { latest, delta: null };
  return { latest, delta: latest.grams - ref.grams, from: ref };
}

function filtered(list) {
  return childFilter === "all" ? list : list.filter((item) => item.childId === childFilter);
}

function childSelect(selected) {
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
  if (tab === "today") renderToday();
  if (tab === "girls") renderGirls();
  if (tab === "weight") renderWeight();
  if (tab === "stages") renderStages();
  if (tab === "charts") renderCharts();
}

function signedGrams(n) {
  if (n > 0) return `+${n} г`;
  return `${n} г`;
}

function renderToday() {
  ui.panels.today.innerHTML = `
    <div class="grid home-grid">
      ${CHILDREN.map((child) => {
        const profile = state.profiles[child.id];
        const tone = child.id === "miroslava" ? "mira" : "avrora";
        return `
          <article class="card girl-card ${tone}">
            <h2>${child.name}</h2>
            <p class="age">${ageText(profile.bornAt)}</p>
            <div class="last-feed">
              <p class="last-feed-label">Последнее кормление</p>
              ${feedBlock(lastFeed(child.id))}
            </div>
          </article>
        `;
      }).join("")}
    </div>
    <button type="button" class="btn primary feed-one" data-open-feed>Записать кормление</button>
    ${
      feedOpen
        ? `<div class="overlay">
            <form class="card feed-modal" data-one-feed>
              <h2>Кормление</h2>
              <div class="form">
                <label>Кто
                  <select name="childId">${childSelect("miroslava")}</select>
                </label>
                <label>Когда
                  <input name="at" type="datetime-local" value="${localDateTimeValue()}" required />
                </label>
                <label>Еда
                  <select name="kind">
                    <option value="milk">Молоко</option>
                    <option value="formula">Смесь</option>
                  </select>
                </label>
                <label>Мл
                  <input name="ml" type="number" min="0" max="300" required />
                </label>
                <label>Поведение 1–10
                  <input name="mood" type="number" min="1" max="10" value="7" required />
                </label>
                <label class="check wide">
                  <input name="slept" type="checkbox" />
                  Спала между кормлениями
                </label>
              </div>
              <div class="form-actions">
                <button class="btn primary" type="submit">Сохранить</button>
                <button class="btn ghost" type="button" data-close-feed>Закрыть</button>
              </div>
            </form>
          </div>`
        : ""
    }
  `;
}

function renderGirls() {
  ui.panels.girls.innerHTML = `
    <div class="grid">
      ${CHILDREN.map((child) => {
        const p = state.profiles[child.id];
        const gain = weightGain(child.id);
        return `
          <form class="card" data-profile="${child.id}">
            <p class="tag ${child.id === "miroslava" ? "mira" : "avrora"}">${child.name}</p>
            <p class="stat">${ageText(p.bornAt)}</p>
            <p class="muted">Сейчас: ${gain.latest ? `${gain.latest.grams} г` : "вес не записан"}</p>
            <div class="form">
              <label>Дата и время рождения
                <input name="bornAt" type="datetime-local" value="${p.bornAt}" required />
              </label>
              <label>Вес при рождении, г
                <input name="birthGrams" type="number" min="1000" max="6000" value="${p.birthGrams}" />
              </label>
              <label>Рост при рождении, см
                <input name="birthHeight" type="number" min="30" max="70" step="0.1" value="${p.birthHeight}" />
              </label>
              <label>Рост сейчас, см
                <input name="height" type="number" min="30" max="90" step="0.1" value="${p.height}" />
              </label>
              <label>Голова, см
                <input name="headCm" type="number" min="25" max="55" step="0.1" value="${p.headCm}" />
              </label>
              <label>Размер одежды
                <input name="clothes" value="${escapeHtml(String(p.clothes || ""))}" placeholder="56 / 62" />
              </label>
              <label>Смесь / молоко
                <input name="milkNote" value="${escapeHtml(String(p.milkNote || ""))}" placeholder="какая смесь, как ест" />
              </label>
              <label>Витамин D
                <input name="vitaminD" value="${escapeHtml(String(p.vitaminD || ""))}" placeholder="капля утром" />
              </label>
              <label>Следующий осмотр
                <input name="nextVisit" type="date" value="${p.nextVisit || ""}" />
              </label>
              <label class="wide">Заметки
                <textarea name="notes" rows="3">${escapeHtml(String(p.notes || ""))}</textarea>
              </label>
            </div>
            <button class="btn primary" type="submit">Сохранить карточку</button>
          </form>
        `;
      }).join("")}
    </div>
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
        <input name="grams" type="number" min="1500" max="12000" step="5" required />
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
        : `<p class="empty">Добавьте взвешивание — на старте появится рост за 2 недели.</p>`
    }
  `;
}

function renderStages() {
  const born = state.profiles.miroslava.bornAt;
  const monthNow = Math.max(1, Math.floor((Date.now() - new Date(born)) / (30.4375 * 86400000)) + 1);
  ui.panels.stages.innerHTML = `
    <p class="muted">Ориентиры, не диагноз.</p>
    ${STAGES.map((group) => {
      const current = group.month === monthNow;
      return `
        <section class="stage">
          <div class="stage-head">
            <h2 class="section-title">${group.title}${current ? " · сейчас" : ""}</h2>
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
  `;
}

function renderCharts() {
  ui.panels.charts.innerHTML = `
    <article class="card">
      <h2>Вес</h2>
      ${drawLineChart(state.weights)}
    </article>
  `;
}

function drawLineChart(weights) {
  if (weights.length < 2) return `<p class="empty">Нужно два взвешивания.</p>`;
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
    if (!series.length) return "";
    const d = series.map((p) => `${x(new Date(p.at).getTime())},${y(p.grams)}`).join(" ");
    const dots = series.map((p) => `<circle cx="${x(new Date(p.at).getTime())}" cy="${y(p.grams)}" r="4" fill="${child.color}"></circle>`).join("");
    return `<polyline fill="none" stroke="${child.color}" stroke-width="3" points="${d}"></polyline>${dots}`;
  }).join("");
  return `<svg class="chart" viewBox="0 0 ${width} ${height}">${polylines}</svg>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

document.body.addEventListener("click", (event) => {
  const openFeed = event.target.closest("[data-open-feed]");
  if (openFeed) {
    feedOpen = true;
    render();
    return;
  }
  if (event.target.closest("[data-close-feed]")) {
    feedOpen = null;
    render();
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
  if (form.matches("[data-one-feed]")) {
    event.preventDefault();
    const data = new FormData(form);
    state.feedings.unshift({
      id: crypto.randomUUID(),
      childId: data.get("childId"),
      at: new Date(data.get("at")).toISOString(),
      kind: data.get("kind"),
      ml: Number(data.get("ml") || 0),
      mood: Number(data.get("mood") || 0),
      slept: data.get("slept") === "on",
    });
    feedOpen = null;
    saveState();
    render();
  }
  if (form.matches("[data-profile]")) {
    event.preventDefault();
    const data = new FormData(form);
    const id = form.dataset.profile;
    state.profiles[id] = {
      ...state.profiles[id],
      bornAt: data.get("bornAt"),
      birthGrams: data.get("birthGrams"),
      birthHeight: data.get("birthHeight"),
      height: data.get("height"),
      headCm: data.get("headCm"),
      clothes: data.get("clothes"),
      milkNote: data.get("milkNote"),
      vitaminD: data.get("vitaminD"),
      nextVisit: data.get("nextVisit"),
      notes: data.get("notes"),
    };
    saveState();
    render();
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

render();
