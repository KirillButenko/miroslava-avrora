const STORAGE_KEY = "pet1-daughters";
const CHILDREN = [
  { id: "miroslava", name: "Мирослава", color: "#c4a882", bornAt: "2026-09-29T10:38" },
  { id: "avrora", name: "Аврора", color: "#e8a0b0", bornAt: "2026-09-29T10:39" },
];
const DUE_DATE = "2026-11-09";
const FEED_HOURS = [1, 4, 7, 10, 13, 16, 19, 22];
const FEED_START = "2026-11-01";
const WEIGHT_SHEET = 2;
const NOTEBOOK_WEIGHTS = [
  ["2026-10-18", 2060, false, 2740, false],
  ["2026-10-19", 2065, true, 2850, false],
  ["2026-10-20", 2040, false, 2935, false],
  ["2026-10-21", 2105, null, 2880, null],
  ["2026-10-23", 2210, null, 3000, null],
  ["2026-10-24", 2330, false, 2920, false],
  ["2026-10-25", 2280, true, 2950, true],
  ["2026-10-27", 2350, false, 3140, true],
  ["2026-10-28", 2350, true, 3100, true],
  ["2026-10-29", 2440, false, 3190, true],
  ["2026-10-30", 2446, false, 3290, true],
  ["2026-11-01", 2520, false, 3430, true],
  ["2026-11-03", 2640, false, 3510, false],
  ["2026-11-04", 2700, true, 3580, true],
  ["2026-11-05", 2800, false, 3660, false],
];

const panelToday = document.querySelector("#panel-today");

let state = loadState();
let feedOpen = null;
let cardOpen = null;
let historyOpen = false;
let weightHistoryOpen = false;
let calendarOpen = false;
let calendarMonth = dayKey(new Date()).slice(0, 7);
let calendarDay = dayKey(new Date());

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
    tasks: [],
    stages: {},
  };
}

function loadState() {
  const base = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      base.feedings = saved.feedings || [];
      base.weights = saved.weights || [];
      base.tasks = saved.tasks || [];
      base.stages = saved.stages || {};
      for (const child of CHILDREN) {
        base.profiles[child.id] = { ...emptyProfile(child), ...(saved.profiles?.[child.id] || {}) };
        if (!base.profiles[child.id].bornAt) base.profiles[child.id].bornAt = child.bornAt;
      }
    }
  } catch {
    /* оставляем пустое состояние */
  }
  const scheduled = ensureSchedule(base);
  const weighed = ensureDailyWeights(base);
  if (scheduled || weighed) localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
  return base;
}

const DB_URL = "https://sinwpqyjjsocceybwbsq.supabase.co/rest/v1/diary";
const DB_KEY = "sb_publishable_nsRahA_jkPjNk6SHAsKgSg_-IDmywa9";
const dbHeaders = {
  apikey: DB_KEY,
  Authorization: `Bearer ${DB_KEY}`,
  "Content-Type": "application/json",
};
let syncing = false;
let syncAgain = false;
let syncNote = "Подключаю базу…";

async function pullCloud() {
  const res = await fetch(`${DB_URL}?id=eq.1&select=payload`, { headers: dbHeaders });
  if (!res.ok) throw new Error("cloud");
  const rows = await res.json();
  return rows[0]?.payload ?? null;
}

async function pushCloud(data) {
  const res = await fetch(`${DB_URL}?id=eq.1`, {
    method: "PATCH",
    headers: { ...dbHeaders, Prefer: "return=representation" },
    body: JSON.stringify({ payload: data }),
  });
  if (!res.ok) throw new Error("cloud");
  const rows = await res.json();
  if (rows.length) return;
  const ins = await fetch(DB_URL, {
    method: "POST",
    headers: dbHeaders,
    body: JSON.stringify({ id: 1, payload: data }),
  });
  if (!ins.ok) throw new Error("cloud");
}

function mergeState(local, remote) {
  const base = defaultState();
  const union = (left, right) => {
    const map = new Map();
    for (const item of [...(right || []), ...(left || [])]) {
      if (item?.id) map.set(item.id, item);
    }
    return [...map.values()].sort((a, b) => String(b.at).localeCompare(String(a.at)));
  };
  const feeds = new Map();
  for (const item of [...(remote?.feedings || []), ...(local.feedings || [])]) {
    if (!item?.id) continue;
    const key = feedingSlot(item);
    const prev = feeds.get(key);
    if (!prev || (recordedFeed(item) && !recordedFeed(prev))) feeds.set(key, item);
    else if (recordedFeed(prev) && !recordedFeed(item)) feeds.set(key, prev);
    else feeds.set(key, item);
  }
  base.feedings = [...feeds.values()].sort((a, b) => String(b.at).localeCompare(String(a.at)));
  base.weights = union(local.weights, remote?.weights);
  base.tasks = union(local.tasks, remote?.tasks);
  base.stages = { ...(remote?.stages || {}), ...(local.stages || {}) };
  for (const child of CHILDREN) {
    const profile = emptyProfile(child);
    const fromRemote = remote?.profiles?.[child.id] || {};
    const fromLocal = local.profiles?.[child.id] || {};
    for (const key of Object.keys(profile)) profile[key] = fromLocal[key] || fromRemote[key] || profile[key];
    base.profiles[child.id] = profile;
  }
  ensureSchedule(base);
  ensureDailyWeights(base);
  return base;
}

async function syncShared() {
  if (syncing) {
    syncAgain = true;
    return;
  }
  syncing = true;
  try {
    do {
      syncAgain = false;
      state = mergeState(state, await pullCloud());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      await pushCloud(state);
    } while (syncAgain);
    syncNote = "База подключена";
    if (!feedOpen && !cardOpen && !historyBusy()) renderToday();
  } catch {
    syncNote = "Связи нет: пока только этот телефон";
    if (!feedOpen && !cardOpen && !historyBusy()) renderToday();
  } finally {
    syncing = false;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncShared();
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

function daysFromDue() {
  const [year, month, date] = DUE_DATE.split("-").map(Number);
  const due = new Date(year, month - 1, date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today - due) / 86400000);
}

function correctedAgeText() {
  const days = daysFromDue();
  if (days < 0) return `−${-days} дн.`;
  if (days === 0) return "0 дн.";
  const months = Math.floor(days / 30.4375);
  const rest = Math.round(days - months * 30.4375);
  if (months <= 0) return `${days} дн.`;
  return `${months} мес. ${rest} дн.`;
}

function recordedFeed(item) {
  if (!item) return false;
  if (item.kind === "milk" || item.kind === "formula") return true;
  return item.ml !== "" && item.ml != null && !Number.isNaN(Number(item.ml));
}

function slotDate(day, hour) {
  const [year, month, date] = String(day).split("-").map(Number);
  const next = new Date(year, month - 1, date, Number(hour), 0, 0, 0);
  return Number.isNaN(next.getTime()) ? null : next;
}

function scheduleKey(item) {
  const date = new Date(item?.at);
  if (!item?.childId || Number.isNaN(date.getTime()) || !FEED_HOURS.includes(date.getHours())) return "";
  return `${item.childId}|${dayKey(date)}|${date.getHours()}`;
}

function feedingSlot(item) {
  const date = new Date(item?.at);
  if (!item?.childId || Number.isNaN(date.getTime())) return item?.id || "";
  if (date.getMinutes() || date.getSeconds()) return item.id;
  return scheduleKey(item) || item.id;
}

function nearestHour(date = new Date()) {
  const minutes = date.getHours() * 60 + date.getMinutes();
  let best = FEED_HOURS[0];
  let bestDist = Infinity;
  for (const hour of FEED_HOURS) {
    const dist = Math.abs(hour * 60 - minutes);
    if (dist < bestDist || (dist === bestDist && hour > best)) {
      best = hour;
      bestDist = dist;
    }
  }
  return best;
}

function hourSelect(selected) {
  const hour = Number(selected);
  const hours = FEED_HOURS.includes(hour) ? FEED_HOURS : [...FEED_HOURS, hour].sort((a, b) => a - b);
  return hours
    .map((value) => {
      const label = String(value).padStart(2, "0");
      return `<option value="${value}" ${value === hour ? "selected" : ""}>${label}</option>`;
    })
    .join("");
}

function ensureSchedule(data) {
  const today = dayKey(new Date());
  if (today < FEED_START) return false;
  const taken = new Set(data.feedings.map((item) => scheduleKey(item)).filter(Boolean));
  let added = false;
  const cursor = slotDate(FEED_START, 0);
  const end = slotDate(today, 0);
  while (cursor <= end) {
    const day = dayKey(cursor);
    for (const child of CHILDREN) {
      for (const hour of FEED_HOURS) {
        const key = `${child.id}|${day}|${hour}`;
        if (taken.has(key)) continue;
        data.feedings.push({
          id: `${child.id}-${day}-${String(hour).padStart(2, "0")}`,
          childId: child.id,
          at: slotDate(day, hour).toISOString(),
          kind: "",
          ml: "",
          mood: "",
          slept: null,
        });
        taken.add(key);
        added = true;
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return added;
}

function daysBetween(start, end) {
  const days = [];
  const cursor = slotDate(start, 12);
  const last = slotDate(end, 12);
  if (!cursor || !last) return days;
  cursor.setDate(cursor.getDate() + 1);
  while (cursor < last) {
    days.push(dayKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function ensureDailyWeights(data) {
  let changed = false;
  for (const [day, avroraGrams, avroraStool, miraGrams, miraStool] of NOTEBOOK_WEIGHTS) {
    const byChild = {
      avrora: [avroraGrams, avroraStool],
      miroslava: [miraGrams, miraStool],
    };
    for (const child of CHILDREN) {
      const [grams, stool] = byChild[child.id];
      const id = `notebook-${child.id}-${day}`;
      const item = data.weights.find((row) => row.id === id);
      if (item) {
        if (item.sheet !== WEIGHT_SHEET) {
          item.grams = grams;
          item.stool = stool;
          item.auto = false;
          item.sheet = WEIGHT_SHEET;
          if (dayKey(item.at) !== day) item.at = slotDate(day, 12).toISOString();
          changed = true;
        }
        continue;
      }
      const autoIndex = data.weights.findIndex(
        (row) => row.childId === child.id && row.auto && dayKey(row.at) === day
      );
      if (autoIndex >= 0) data.weights.splice(autoIndex, 1);
      data.weights.push({
        id,
        childId: child.id,
        grams,
        stool,
        sheet: WEIGHT_SHEET,
        at: slotDate(day, 12).toISOString(),
        auto: false,
      });
      changed = true;
    }
  }
  for (const child of CHILDREN) {
    const byDay = new Map();
    for (const item of data.weights) {
      if (item.childId !== child.id || item.auto) continue;
      const day = dayKey(item.at);
      const prev = byDay.get(day);
      if (!prev || item.at > prev.at) byDay.set(day, item);
    }
    const known = [...byDay.keys()].sort();
    const wanted = new Map();
    for (let i = 0; i < known.length - 1; i += 1) {
      const between = daysBetween(known[i], known[i + 1]);
      const left = Number(byDay.get(known[i]).grams);
      const right = Number(byDay.get(known[i + 1]).grams);
      between.forEach((day, index) => {
        wanted.set(day, Math.round(left + ((right - left) * (index + 1)) / (between.length + 1)));
      });
    }
    const seen = new Set();
    for (let i = data.weights.length - 1; i >= 0; i -= 1) {
      const item = data.weights[i];
      if (item.childId !== child.id || !item.auto) continue;
      const day = dayKey(item.at);
      if (!wanted.has(day) || seen.has(day)) {
        data.weights.splice(i, 1);
        changed = true;
        continue;
      }
      seen.add(day);
      if (item.grams !== wanted.get(day)) {
        item.grams = wanted.get(day);
        item.at = slotDate(day, 18).toISOString();
        changed = true;
      }
    }
    for (const [day, grams] of wanted) {
      if (seen.has(day)) continue;
      data.weights.push({
        id: `auto-${child.id}-${day}`,
        childId: child.id,
        grams,
        at: slotDate(day, 18).toISOString(),
        auto: true,
      });
      changed = true;
    }
  }
  return changed;
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function latestWeight(childId) {
  let best = null;
  for (const item of state.weights) {
    if (item.childId !== childId) continue;
    if (!best || item.at > best.at) best = item;
  }
  return best;
}

function profileLine(childId) {
  const profile = state.profiles[childId];
  const weight = latestWeight(childId);
  const bits = [
    weight ? `${weight.grams} г${weight.auto ? " · расчёт" : ""}` : "",
    profile.height ? `рост ${profile.height} см` : "",
    profile.headCm ? `голова ${profile.headCm} см` : "",
  ].filter(Boolean);
  return bits.join(" · ");
}

function lastFeed(childId) {
  let best = null;
  for (const item of state.feedings) {
    if (item.childId !== childId || !recordedFeed(item)) continue;
    if (!best || item.at > best.at) best = item;
  }
  return best;
}

function feedBlock(feed) {
  if (!feed) return `<p class="feed-empty">Ещё не записывали</p>`;
  const kind = feed.kind === "formula" ? "Смесь" : feed.kind === "milk" ? "Молоко" : "";
  const bits = [
    kind,
    feed.ml != null ? `${feed.ml} мл` : "",
    feed.mood ? `настроение ${feed.mood}/10` : "",
    feed.slept === true ? "спала" : feed.slept === false ? "не спала" : "",
  ].filter(Boolean);
  return `<p class="feed-when">${formatWhen(feed.at)}</p><p class="feed-meta">${bits.map((bit) => `<span>${bit}</span>`).join("")}</p>`;
}

function historyBusy() {
  const el = document.activeElement;
  return Boolean(
    el &&
      el.closest &&
      (el.closest("[data-feed-edit]") || el.closest("[data-weight-edit]") || el.closest("[data-cal-add]"))
  );
}

function feedHistory() {
  const rows = [...state.feedings].sort((a, b) => String(b.at).localeCompare(String(a.at)));
  if (!rows.length) return `<p class="empty">Пока нет кормлений.</p>`;
  return `
    <div class="history-wrap">
      <table class="history">
        <thead>
          <tr>
            <th>Кто</th>
            <th>Дата</th>
            <th>Час</th>
            <th>Еда</th>
            <th>Мл</th>
            <th>Настроение</th>
            <th>Спала</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map((feed) => {
              const id = escapeHtml(feed.id);
              const date = new Date(feed.at);
              const valid = !Number.isNaN(date.getTime());
              return `
                <tr>
                  <td><select data-feed-edit="childId" data-feed-id="${id}" aria-label="Кто">${childSelect(feed.childId)}</select></td>
                  <td class="day"><input data-feed-edit="day" data-feed-id="${id}" type="date" value="${valid ? dayKey(date) : ""}" aria-label="Дата" /></td>
                  <td class="hour"><select data-feed-edit="hour" data-feed-id="${id}" aria-label="Час">${hourSelect(valid ? date.getHours() : nearestHour())}</select></td>
                  <td>
                    <select data-feed-edit="kind" data-feed-id="${id}" aria-label="Еда">
                      <option value="" ${feed.kind !== "milk" && feed.kind !== "formula" ? "selected" : ""}>—</option>
                      <option value="milk" ${feed.kind === "milk" ? "selected" : ""}>Молоко</option>
                      <option value="formula" ${feed.kind === "formula" ? "selected" : ""}>Смесь</option>
                    </select>
                  </td>
                  <td><input data-feed-edit="ml" data-feed-id="${id}" type="number" min="0" max="300" value="${feed.ml ?? ""}" aria-label="Мл" /></td>
                  <td><input data-feed-edit="mood" data-feed-id="${id}" type="number" min="1" max="10" value="${feed.mood ?? ""}" aria-label="Настроение" /></td>
                  <td class="slept"><input data-feed-edit="slept" data-feed-id="${id}" type="checkbox" ${feed.slept ? "checked" : ""} aria-label="Спала" /></td>
                </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function weightHistory() {
  const rows = [...state.weights].sort((a, b) => {
    const byAt = String(b.at).localeCompare(String(a.at));
    return byAt || String(a.childId).localeCompare(String(b.childId));
  });
  if (!rows.length) return `<p class="empty">Пока нет взвешиваний.</p>`;
  return `
    <div class="history-wrap">
      <table class="history">
        <thead>
          <tr>
            <th>Кто</th>
            <th>Дата</th>
            <th>Вес, г</th>
            <th>Стул</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map((item) => {
              const id = escapeHtml(item.id);
              const date = new Date(item.at);
              const valid = !Number.isNaN(date.getTime());
              return `
                <tr class="${item.auto ? "auto" : ""}">
                  <td><select data-weight-edit="childId" data-weight-id="${id}" aria-label="Кто">${childSelect(item.childId)}</select></td>
                  <td class="day"><input data-weight-edit="day" data-weight-id="${id}" type="date" value="${valid ? dayKey(date) : ""}" aria-label="Дата" /></td>
                  <td>
                    <input data-weight-edit="grams" data-weight-id="${id}" type="number" min="1000" max="12000" step="1" value="${item.grams ?? ""}" aria-label="Вес, г" />
                    ${item.auto ? `<span class="auto-mark">расчёт</span>` : ""}
                  </td>
                  <td>
                    <select data-weight-edit="stool" data-weight-id="${id}" aria-label="Стул">
                      <option value="" ${item.stool == null ? "selected" : ""}>—</option>
                      <option value="yes" ${item.stool === true ? "selected" : ""}>есть</option>
                      <option value="no" ${item.stool === false ? "selected" : ""}>нет</option>
                    </select>
                  </td>
                </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function childSelect(selected) {
  return CHILDREN.map(
    (child) => `<option value="${child.id}" ${child.id === selected ? "selected" : ""}>${child.name}</option>`
  ).join("");
}

function childFeed(item, childId) {
  return item.childId === childId ? item : null;
}

function feedShare(childId) {
  let milk = 0;
  let formula = 0;
  for (const item of state.feedings) {
    const rec = childFeed(item, childId);
    if (!rec) continue;
    const ml = Number(rec.ml) || 0;
    if (rec.kind === "formula") formula += ml;
    else milk += ml;
  }
  const total = milk + formula;
  return {
    milk,
    formula,
    milkPct: total ? Math.round((milk / total) * 100) : 0,
    formulaPct: total ? Math.round((formula / total) * 100) : 0,
    total,
  };
}

function recentDays(count) {
  const days = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - i);
    days.push(date);
  }
  return days;
}

function dynamicsChart() {
  const days = recentDays(14);
  const keys = days.map(dayKey);
  const series = CHILDREN.map((child) => {
    const weights = state.weights
      .filter((item) => item.childId === child.id)
      .sort((a, b) => a.at.localeCompare(b.at));
    const byDay = {};
    for (const item of weights) byDay[dayKey(item.at)] = item.grams;
    const start = days[0].getTime();
    let known = null;
    for (const item of weights) {
      if (new Date(item.at).getTime() < start) known = item.grams;
    }
    const grams = keys.map((key) => {
      if (byDay[key] != null) known = byDay[key];
      return byDay[key] != null ? byDay[key] : known;
    });
    const first = grams.findIndex((value) => value != null);
    const ml = keys.map((key) =>
      state.feedings.reduce((sum, item) => {
        const rec = childFeed(item, child.id);
        return rec && dayKey(rec.at) === key ? sum + (Number(rec.ml) || 0) : sum;
      }, 0)
    );
    return { child, grams, ml, first };
  });
  const gramValues = series.flatMap((item) => item.grams.filter((value) => value != null));
  const mlValues = series.flatMap((item) => item.ml);
  if (!gramValues.length && mlValues.every((value) => value === 0)) {
    return `<p class="empty">Пока нет веса и кормлений за 14 дней.</p>`;
  }
  const width = 840;
  const height = 210;
  const pad = { l: 12, r: 12, t: 8, b: 8 };
  const minG = Math.min(...(gramValues.length ? gramValues : [0])) - 40;
  const maxG = Math.max(...(gramValues.length ? gramValues : [1])) + 40;
  const maxM = Math.max(40, ...mlValues);
  const x = (index) => pad.l + (index / (days.length - 1)) * (width - pad.l - pad.r);
  const yG = (value) => height - pad.b - ((value - minG) / (maxG - minG)) * (height - pad.t - pad.b);
  const yM = (value) => height - pad.b - (value / maxM) * (height - pad.t - pad.b);
  const lines = series
    .map(({ child, grams, first }) => {
      if (first < 0) return "";
      const points = grams
        .map((value, index) => (index >= first && value != null ? `${x(index)},${yG(value)}` : ""))
        .filter(Boolean)
        .join(" ");
      return `<polyline fill="none" stroke="${child.color}" stroke-width="3" points="${points}"></polyline>`;
    })
    .join("");
  const bars = series
    .map(({ child, ml }) =>
      ml
        .map((value, index) => {
          if (!value) return "";
          const barH = height - pad.b - yM(value);
          const offset = child.id === "miroslava" ? -7 : 1;
          return `<rect x="${x(index) + offset}" y="${yM(value)}" width="6" height="${barH}" rx="2" fill="${child.color}" opacity="0.35"></rect>`;
        })
        .join("")
    )
    .join("");
  const dayLabels = [0, 4, 8, 13]
    .map((index) => {
      const day = days[index];
      const label = `${day.getDate()}.${day.getMonth() + 1}`;
      const pct = (x(index) / width) * 100;
      const shift = index === 0 ? "0" : index === days.length - 1 ? "-100%" : "-50%";
      return `<span style="left:${pct}%;transform:translateX(${shift})">${label}</span>`;
    })
    .join("");
  return `<div class="chart-box">
    <div class="chart-scale"><span>${Math.round(maxG)} г</span><span>${Math.round(maxM)} мл</span></div>
    <svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Вес и миллилитры кормления">
      <line x1="${pad.l}" y1="${height - pad.b}" x2="${width - pad.r}" y2="${height - pad.b}" stroke="#e6d9c8"></line>
      ${bars}${lines}
    </svg>
    <div class="chart-days">${dayLabels}</div>
  </div>`;
}

function feedShareBlock() {
  return `<div class="grid">${CHILDREN.map((child) => {
    const share = feedShare(child.id);
    const tone = child.id === "miroslava" ? "mira" : "avrora";
    if (!share.total) {
      return `<article class="card share-card"><h3>${child.name}</h3><p class="empty">Нет миллилитров.</p></article>`;
    }
    return `<article class="card share-card">
      <h3>${child.name}</h3>
      <div class="share-bar" aria-label="Молоко ${share.milkPct}%, смесь ${share.formulaPct}%">
        <span class="${tone} milk" style="width:${share.milkPct}%"></span>
        <span class="${tone} formula" style="width:${share.formulaPct}%"></span>
      </div>
      <p>Молоко ${share.milkPct}% · ${share.milk} мл</p>
      <p>Смесь ${share.formulaPct}% · ${share.formula} мл</p>
    </article>`;
  }).join("")}</div>`;
}

function weightTrend(childId) {
  const days = recentDays(14);
  const start = days[0].getTime();
  const weights = state.weights
    .filter((item) => item.childId === childId)
    .sort((a, b) => String(a.at).localeCompare(String(b.at)));
  let before = null;
  const byDay = {};
  for (const item of weights) {
    if (new Date(item.at).getTime() < start) before = item.grams;
    else byDay[dayKey(item.at)] = item.grams;
  }
  let known = before;
  const grams = days.map((day) => {
    const value = byDay[dayKey(day)];
    if (value != null) known = value;
    return known;
  });
  const current = latestWeight(childId);
  const weekAgo = grams[grams.length - 1 - 7];
  if (!current || weekAgo == null) return { grams, delta: null, current };
  return { grams, delta: current.grams - weekAgo, current };
}

function weightFace(delta) {
  if (delta == null || Number.isNaN(Number(delta))) return "";
  const down = delta < 200;
  const label = delta > 200 ? "Прибавка больше 200 г" : down ? "Прибавка меньше 200 г" : "Прибавка 200 г";
  const fill = down ? "#d64545" : "#1f9d55";
  const mouth = down ? "M10 22c1.6-3 4-4.5 6-4.5s4.4 1.5 6 4.5" : "M10 18c1.6 3 4 4.5 6 4.5s4.4-1.5 6-4.5";
  return `<svg class="face" viewBox="0 0 32 32" role="img" aria-label="${label}"><circle cx="16" cy="16" r="15" fill="${fill}"></circle><circle cx="11" cy="13" r="2" fill="#fff"></circle><circle cx="21" cy="13" r="2" fill="#fff"></circle><path d="${mouth}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"></path></svg>`;
}

function weightSpark(child, grams) {
  const known = grams.filter((value) => value != null);
  if (known.length < 2) return "";
  const width = 160;
  const height = 36;
  const min = Math.min(...known);
  const max = Math.max(...known);
  const span = max - min || 1;
  const points = grams
    .map((value, index) => {
      if (value == null) return "";
      const x = (index / (grams.length - 1)) * width;
      const y = height - 3 - ((value - min) / span) * (height - 6);
      return `${x},${y}`;
    })
    .filter(Boolean)
    .join(" ");
  return `<svg class="spark" viewBox="0 0 ${width} ${height}" aria-hidden="true"><polyline fill="none" stroke="${child.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" points="${points}"></polyline></svg>`;
}

function nextThousand(grams) {
  return Math.floor(Number(grams) / 1000) * 1000 + 1000;
}

function daysLabel(count) {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return "дней";
  if (n1 === 1) return "день";
  if (n1 >= 2 && n1 <= 4) return "дня";
  return "дней";
}

function weightPace(childId) {
  const byDay = new Map();
  for (const item of state.weights) {
    if (item.childId !== childId || item.auto) continue;
    const day = dayKey(item.at);
    const prev = byDay.get(day);
    if (!prev || item.at > prev.at) byDay.set(day, item);
  }
  const points = [...byDay.values()]
    .map((item) => ({ t: new Date(item.at).getTime(), grams: Number(item.grams) }))
    .filter((point) => !Number.isNaN(point.t) && !Number.isNaN(point.grams))
    .sort((a, b) => a.t - b.t);
  const current = latestWeight(childId);
  if (!current || points.length < 2) return null;
  const t0 = points[0].t;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  for (const point of points) {
    const x = (point.t - t0) / 86400000;
    sumX += x;
    sumY += point.grams;
    sumXY += x * point.grams;
    sumXX += x * x;
  }
  const denom = points.length * sumXX - sumX * sumX;
  if (!denom) return null;
  const slope = (points.length * sumXY - sumX * sumY) / denom;
  const target = nextThousand(current.grams);
  if (!(slope > 0)) return { target, days: null };
  return { target, days: Math.ceil((target - current.grams) / slope) };
}

function weightGoalLine(childId) {
  const pace = weightPace(childId);
  if (!pace) return "";
  if (pace.days == null) return `<p class="weight-goal">До ${pace.target} г вес по истории не растёт</p>`;
  return `<p class="weight-goal">До ${pace.target} г ещё ${pace.days} ${daysLabel(pace.days)}</p>`;
}

function feedPortionLine(grams) {
  const ml = Math.round(Number(grams) / 5 / 8);
  if (!ml) return "";
  return `<p class="weight-goal">8 кормлений: по ${ml} мл</p>`;
}

function weightTrendBlock(child) {
  const trend = weightTrend(child.id);
  if (!trend.current) return "";
  const sign = trend.delta > 0 ? "+" : "";
  const delta =
    trend.delta == null ? "" : `<p class="weight-delta">${sign}${trend.delta} г за 7 дней</p>`;
  return `<div class="weight-trend">
    <p class="weight-now">${trend.current.grams} г ${weightFace(trend.delta)}</p>
    ${delta}
    ${weightGoalLine(child.id)}
    ${feedPortionLine(trend.current.grams)}
    ${weightSpark(child, trend.grams)}
  </div>`;
}

function cardForm(childId) {
  const child = CHILDREN.find((item) => item.id === childId);
  if (!child) return "";
  const profile = state.profiles[child.id];
  const weight = latestWeight(child.id);
  return `<div class="overlay">
    <form class="card feed-modal card-modal" data-profile="${child.id}">
      <h2>${child.name}</h2>
      <p class="muted">${ageText(profile.bornAt)}</p>
      <p class="muted">скорр. ${correctedAgeText()}</p>
      <div class="form">
        <label>Дата рождения
          <input name="bornAt" type="datetime-local" value="${escapeHtml(profile.bornAt)}" required />
        </label>
        <label>Вес сейчас, г
          <input name="grams" type="number" min="1000" max="12000" step="5" value="${weight ? weight.grams : ""}" />
        </label>
        <label>Вес при рождении, г
          <input name="birthGrams" type="number" min="1000" max="6000" value="${escapeHtml(profile.birthGrams)}" />
        </label>
        <label>Рост при рождении, см
          <input name="birthHeight" type="number" min="30" max="70" step="0.1" value="${escapeHtml(profile.birthHeight)}" />
        </label>
        <label>Рост сейчас, см
          <input name="height" type="number" min="30" max="90" step="0.1" value="${escapeHtml(profile.height)}" />
        </label>
        <label>Голова, см
          <input name="headCm" type="number" min="25" max="55" step="0.1" value="${escapeHtml(profile.headCm)}" />
        </label>
        <label>Размер одежды
          <input name="clothes" value="${escapeHtml(profile.clothes || "")}" placeholder="56 / 62" />
        </label>
        <label>Смесь / молоко
          <input name="milkNote" value="${escapeHtml(profile.milkNote || "")}" placeholder="какая смесь, как ест" />
        </label>
        <label>Витамин D
          <input name="vitaminD" value="${escapeHtml(profile.vitaminD || "")}" placeholder="капля утром" />
        </label>
        <label>Следующий осмотр
          <input name="nextVisit" type="date" value="${escapeHtml(profile.nextVisit || "")}" />
        </label>
        <label class="wide">Заметки
          <textarea name="notes" rows="3">${escapeHtml(profile.notes || "")}</textarea>
        </label>
      </div>
      <div class="form-actions">
        <button class="btn primary" type="submit">Сохранить</button>
        <button class="btn ghost" type="button" data-close-card>Закрыть</button>
      </div>
    </form>
  </div>`;
}

function shiftMonth(ym, delta) {
  const [year, month] = ym.split("-").map(Number);
  const next = new Date(year, month - 1 + delta, 1);
  const pad = (n) => String(n).padStart(2, "0");
  return `${next.getFullYear()}-${pad(next.getMonth() + 1)}`;
}

function tasksOnDay(day) {
  return state.tasks
    .filter((item) => dayKey(item.at) === day)
    .sort((a, b) => String(a.at).localeCompare(String(b.at)));
}

function googleStamp(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;
}

function googleCalendarUrl(item) {
  const start = new Date(item.at);
  if (Number.isNaN(start.getTime())) return "";
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", item.text);
  url.searchParams.set("dates", `${googleStamp(start)}/${googleStamp(end)}`);
  return url.toString();
}

function calendarBlock() {
  const [year, month] = calendarMonth.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const padStart = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const gridStart = new Date(year, month - 1, 1 - padStart);
  const total = Math.ceil((padStart + daysInMonth) / 7) * 7;
  const today = dayKey(new Date());
  const cells = [];
  for (let i = 0; i < total; i += 1) {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    const key = dayKey(date);
    const dayTasks = tasksOnDay(key);
    const shown = dayTasks.slice(0, 2);
    const extra = dayTasks.length - shown.length;
    const chips = shown
      .map((item) => {
        const time = new Date(item.at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
        return `<span class="cal-chip">${time} ${escapeHtml(item.text)}</span>`;
      })
      .join("");
    const cls = [
      "cal-day",
      key === calendarDay ? "is-on" : "",
      key === today ? "is-today" : "",
      date.getMonth() !== month - 1 ? "is-out" : "",
    ]
      .filter(Boolean)
      .join(" ");
    cells.push(
      `<button type="button" class="${cls}" data-cal-day="${key}"><span class="cal-num">${date.getDate()}</span>${chips}${extra > 0 ? `<span class="cal-more">+${extra}</span>` : ""}</button>`
    );
  }
  const title = first.toLocaleString("ru-RU", { month: "long", year: "numeric" });
  const [cy, cm, cd] = calendarDay.split("-").map(Number);
  const picked = new Date(cy, cm - 1, cd);
  const dayLabel = picked.toLocaleString("ru-RU", { weekday: "long", day: "numeric", month: "long" });
  const items = tasksOnDay(calendarDay);
  const list = items.length
    ? `<ul class="cal-list">${items
        .map((item) => {
          const time = new Date(item.at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
          const google = googleCalendarUrl(item);
          const googleLink = google
            ? `<a class="cal-google" href="${escapeHtml(google)}" target="_blank" rel="noopener noreferrer">в Google</a>`
            : "";
          return `<li><time>${time}</time><span>${escapeHtml(item.text)}</span><span class="cal-actions">${googleLink}<button type="button" class="cal-del" data-cal-del="${item.id}" aria-label="Убрать">×</button></span></li>`;
        })
        .join("")}</ul>`
    : `<p class="cal-empty-note">Нет дел</p>`;
  return `
    <div class="cal">
      <div class="cal-head">
        <button type="button" class="cal-today" data-cal-today>Сегодня</button>
        <button type="button" class="cal-nav" data-cal-move="-1" aria-label="Предыдущий месяц">‹</button>
        <button type="button" class="cal-nav" data-cal-move="1" aria-label="Следующий месяц">›</button>
        <strong>${title}</strong>
      </div>
      <div class="cal-week">${["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((name) => `<span>${name}</span>`).join("")}</div>
      <div class="cal-grid">${cells.join("")}</div>
    </div>
    <div class="cal-agenda">
      <p class="cal-picked">${dayLabel}</p>
      ${list}
      <form class="cal-form" data-cal-add>
        <label>Время
          <input name="time" type="time" value="10:30" required />
        </label>
        <label>Дело
          <input name="text" type="text" placeholder="Добавить название" required />
        </label>
        <button class="cal-save" type="submit">Добавить</button>
      </form>
    </div>
  `;
}

function renderToday() {
  const scheduled = ensureSchedule(state);
  const weighed = ensureDailyWeights(state);
  if (scheduled || weighed) saveState();
  const feedDay = dayKey(new Date());
  const feedHour = nearestHour();
  panelToday.innerHTML = `
    <div class="grid home-grid">
      ${CHILDREN.map((child) => {
        const profile = state.profiles[child.id];
        const tone = child.id === "miroslava" ? "mira" : "avrora";
        return `
          <article class="card girl-card ${tone}" data-open-card="${child.id}">
            <h2>${child.name}</h2>
            <p class="age">${ageText(profile.bornAt)}</p>
            <p class="age-corrected">скорр. ${correctedAgeText()}</p>
            ${weightTrendBlock(child)}
            ${profileLine(child.id) ? `<p class="stats">${profileLine(child.id)}</p>` : ""}
            <div class="last-feed">
              <p class="last-feed-label">Последнее кормление</p>
              ${feedBlock(lastFeed(child.id))}
            </div>
          </article>
        `;
      }).join("")}
    </div>
    <button type="button" class="btn primary feed-one" data-open-feed>Записать кормление</button>
    <p class="sync-note">${syncNote}</p>
    <details class="dyn">
      <summary>Динамика веса и кормления</summary>
      <p class="legend">
        ${CHILDREN.map((child) => `<span><i class="dot" style="background:${child.color}"></i>${child.name}: линия — вес, столбик — мл</span>`).join("")}
      </p>
      ${dynamicsChart()}
    </details>
    <details class="dyn" data-weight-history ${weightHistoryOpen ? "open" : ""}>
      <summary>История веса</summary>
      <p class="muted">Пропуск — среднее соседних дней. Несколько дней подряд делятся равномерно. Такие строки помечены «расчёт».</p>
      ${weightHistory()}
    </details>
    <details class="dyn">
      <summary>Динамика кормления</summary>
      <p class="muted">Доля молока и смеси по всем записанным миллилитрам.</p>
      ${feedShareBlock()}
    </details>
    <details class="dyn" data-calendar ${calendarOpen ? "open" : ""}>
      <summary>Календарь</summary>
      ${calendarBlock()}
    </details>
    <details class="dyn" data-history ${historyOpen ? "open" : ""}>
      <summary>История кормлений</summary>
      <p class="muted">Все записи, сначала новые. Правка ячейки сохраняется сразу.</p>
      ${feedHistory()}
    </details>
    ${
      feedOpen
        ? `<div class="overlay">
            <form class="card feed-modal" data-one-feed>
              <h2>Кормление</h2>
              <div class="form">
                <label>Кто
                  <select name="childId">${childSelect("miroslava")}</select>
                </label>
                <label>Дата
                  <input name="day" type="date" value="${feedDay}" required />
                </label>
                <label>Час
                  <select name="hour">${hourSelect(feedHour)}</select>
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
    ${cardOpen ? cardForm(cardOpen) : ""}
  `;
}

document.body.addEventListener("click", (event) => {
  if (event.target.closest("[data-open-feed]")) {
    feedOpen = true;
    cardOpen = null;
    renderToday();
    return;
  }
  if (event.target.closest("[data-close-feed]")) {
    feedOpen = null;
    renderToday();
    return;
  }
  if (event.target.closest("[data-close-card]")) {
    cardOpen = null;
    renderToday();
    return;
  }
  const move = event.target.closest("[data-cal-move]");
  if (move) {
    calendarMonth = shiftMonth(calendarMonth, Number(move.dataset.calMove));
    if (!calendarDay.startsWith(calendarMonth)) calendarDay = `${calendarMonth}-01`;
    calendarOpen = true;
    renderToday();
    return;
  }
  if (event.target.closest("[data-cal-today]")) {
    calendarDay = dayKey(new Date());
    calendarMonth = calendarDay.slice(0, 7);
    calendarOpen = true;
    renderToday();
    return;
  }
  const calDay = event.target.closest("[data-cal-day]");
  if (calDay) {
    calendarDay = calDay.dataset.calDay;
    calendarMonth = calendarDay.slice(0, 7);
    calendarOpen = true;
    renderToday();
    return;
  }
  const del = event.target.closest("[data-cal-del]");
  if (del) {
    state.tasks = state.tasks.filter((item) => item.id !== del.dataset.calDel);
    calendarOpen = true;
    saveState();
    renderToday();
    return;
  }
  const card = event.target.closest("[data-open-card]");
  if (card && panelToday.contains(card)) {
    cardOpen = card.dataset.openCard;
    feedOpen = null;
    renderToday();
  }
});

document.body.addEventListener(
  "toggle",
  (event) => {
    if (event.target.matches?.("[data-history]")) historyOpen = event.target.open;
    if (event.target.matches?.("[data-weight-history]")) weightHistoryOpen = event.target.open;
    if (event.target.matches?.("[data-calendar]")) calendarOpen = event.target.open;
  },
  true
);

document.body.addEventListener("change", (event) => {
  const field = event.target.closest("[data-feed-edit]");
  if (!field) return;
  const item = state.feedings.find((feed) => feed.id === field.dataset.feedId);
  if (!item) return;
  const key = field.dataset.feedEdit;
  if (key === "childId" || key === "kind") item[key] = field.value;
  if (key === "day" || key === "hour") {
    const row = field.closest("tr");
    const next = slotDate(row.querySelector('[data-feed-edit="day"]').value, row.querySelector('[data-feed-edit="hour"]').value);
    if (!next) return;
    item.at = next.toISOString();
  }
  if (key === "ml" || key === "mood") item[key] = field.value === "" ? "" : Number(field.value);
  if (key === "slept") item.slept = field.checked;
  historyOpen = true;
  saveState();
  renderToday();
});

document.body.addEventListener("change", (event) => {
  const field = event.target.closest("[data-weight-edit]");
  if (!field) return;
  const item = state.weights.find((row) => row.id === field.dataset.weightId);
  if (!item) return;
  const key = field.dataset.weightEdit;
  if (key === "childId") item.childId = field.value;
  if (key === "day") {
    const prev = new Date(item.at);
    const hour = Number.isNaN(prev.getTime()) ? 18 : prev.getHours();
    const next = slotDate(field.value, hour);
    if (!next) return;
    item.at = next.toISOString();
  }
  if (key === "grams") {
    const grams = Number(field.value);
    if (!grams) return;
    item.grams = grams;
  }
  if (key === "stool") item.stool = field.value === "yes" ? true : field.value === "no" ? false : null;
  else item.auto = false;
  weightHistoryOpen = true;
  ensureDailyWeights(state);
  saveState();
  renderToday();
});

document.body.addEventListener("submit", (event) => {
  const form = event.target;
  if (form.matches("[data-cal-add]")) {
    event.preventDefault();
    const data = new FormData(form);
    const text = String(data.get("text") || "").trim();
    const [hour, minute] = String(data.get("time") || "10:30").split(":").map(Number);
    const atDate = slotDate(calendarDay, hour);
    if (!text || !atDate || Number.isNaN(minute)) return;
    atDate.setMinutes(minute);
    state.tasks.unshift({ id: crypto.randomUUID(), text, at: atDate.toISOString() });
    calendarOpen = true;
    saveState();
    renderToday();
    return;
  }
  if (form.matches("[data-profile]")) {
    event.preventDefault();
    const data = new FormData(form);
    const id = form.dataset.profile;
    const grams = Number(data.get("grams"));
    const latest = latestWeight(id);
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
    if (grams) {
      const today = dayKey(new Date());
      const sameDay = state.weights.find((item) => item.childId === id && dayKey(item.at) === today);
      if (sameDay) {
        if (sameDay.grams !== grams || sameDay.auto) {
          sameDay.grams = grams;
          sameDay.auto = false;
          sameDay.at = new Date().toISOString();
        }
      } else if (!latest || latest.grams !== grams) {
        state.weights.unshift({
          id: crypto.randomUUID(),
          childId: id,
          grams,
          at: new Date().toISOString(),
        });
      }
    }
    cardOpen = null;
    saveState();
    renderToday();
    return;
  }
  if (!form.matches("[data-one-feed]")) return;
  event.preventDefault();
  const data = new FormData(form);
  const atDate = slotDate(data.get("day"), data.get("hour"));
  if (!atDate) return;
  const patch = {
    childId: data.get("childId"),
    at: atDate.toISOString(),
    kind: data.get("kind"),
    ml: Number(data.get("ml") || 0),
    mood: Number(data.get("mood") || 0),
    slept: data.get("slept") === "on",
  };
  const item = state.feedings.find((feed) => scheduleKey(feed) === `${patch.childId}|${dayKey(atDate)}|${atDate.getHours()}`);
  if (item) Object.assign(item, patch);
  else state.feedings.unshift({ id: crypto.randomUUID(), ...patch });
  feedOpen = null;
  saveState();
  renderToday();
});

renderToday();
syncShared();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") syncShared();
});
