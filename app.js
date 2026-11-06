const STORAGE_KEY = "pet1-daughters";
const CHILDREN = [
  { id: "miroslava", name: "Мирослава", color: "#c4a882", bornAt: "2026-09-29T10:38" },
  { id: "avrora", name: "Аврора", color: "#e8a0b0", bornAt: "2026-09-29T10:39" },
];
const DUE_DATE = "2026-11-09";
const SKILLS = [
  {
    name: "Успокаивается на руках",
    from: 0,
    to: 2,
    montessori: [
      ["Условия", "Одна и та же тонкая пелёнка на руках и в кроватке. Тихий угол и один взрослый. Телефон и телевизор выключены. Обращайся к ней напрямую."],
      ["Совет", "Сначала скажи: «сейчас возьму». Поднимай медленно, прижми к себе и покачай в одном ритме. Тихо говори, что будет дальше: «на руки», «молоко»."],
      ["Получилось, если", "она спокойна у тебя на руках — тогда не меняй позу. Хватит, если плачет сильнее: поменяй только одно, свет, положение или того, кто держит."],
    ],
  },
  {
    name: "Смотрит на лицо",
    from: 0,
    to: 2,
    montessori: [
      ["Условия", "В бодрое время положи её на спину. Держи лицо в 20–30 см от её лица. Повесь один чёрно-белый мобиль без музыки чуть сбоку, не прямо над носом. Небьющееся зеркало на полу поставь, когда она начнёт поворачивать голову."],
      ["Совет", "Назови её и подожди, пока посмотрит. Встретились взглядом — улыбнись и помолчи две-три секунды. Пока она смотрит на мобиль, не трогай его."],
      ["Получилось, если", "она смотрит на лицо или на один предмет. Хватит, если зевнула, смотрит мимо или отвернулась: вокруг слишком много всего, оставь один предмет. Музыкальная карусель над кроваткой и много погремушек только мешают."],
    ],
  },
  {
    name: "Улыбается в ответ",
    from: 1,
    to: 3,
    montessori: [
      ["Условия", "Один человек напротив. Свет не бьёт ей в глаза. Остальные не наклоняются сверху проверить, улыбнётся ли она."],
      ["Совет", "Улыбнись, назови по имени и подожди. Пауза пусть будет длиннее, чем тебе хочется. Если ответила, повтори тот же жест. Не щекочи и не играй в «козы-козы». Удобный момент — после смены подгузника, когда она сыта и смотрит на тебя."],
      ["Получилось, если", "она улыбнулась в ответ. Хватит, если улыбка быстро пропала: завтра то же самое, коротко. Новые гримасы не нужны."],
    ],
  },
  {
    name: "Гулит",
    from: 1,
    to: 4,
    montessori: [
      ["Условия", "Сядь так, чтобы ваши лица были близко. Пусть будет тихо: говори только ты, телевизор выключен. Можно держать её на руках или положить на спину."],
      ["Совет", "Повтори её звук, добавь один похожий и замолчи. Теперь её очередь. Когда меняешь подгузник или подмываешь, говори простыми словами: «снимаю подгузник», «тёплая вода»."],
      ["Получилось, если", "она замолчала и смотрит на тебя — так она участвует в разговоре. Не включай новую песню, пока она слушает эту."],
    ],
  },
  {
    name: "Держит голову без опоры",
    from: 2,
    to: 4,
    montessori: [
      ["Условия", "Жёсткий коврик на полу, не мягкая перина и не диван. Когда она лежит на животе, держи лицо перед её глазами или повесь короткий мобиль чуть выше. Тогда ей есть зачем поднимать голову. Рядом можно поставить небьющееся зеркало."],
      ["Совет", "Выкладывай на живот в бодрое время, сначала меньше минуты. Сядь сбоку, на уровне её глаз, и говори. Если голова легла или она недовольна, верни её на спину. Держать столбиком после еды — это не упражнение на живот."],
      ["Получилось, если", "она поднимает голову, чтобы смотреть, и сама опускает, когда устала. Не подставляй ладонь под подбородок: иначе голову держишь ты."],
    ],
  },
  {
    name: "Смеётся",
    from: 3,
    to: 6,
    montessori: [
      ["Условия", "Знакомый человек и одна знакомая игра. Не делай резких движений у её лица."],
      ["Совет", "Несколько дней подряд одно и то же: медленно закрой лицо ладонями и скажи «ку-ку» или поиграй в «ладушки» с паузой в одном и том же месте. Засмеялась — остановись и повтори это ещё раз. Не подбрасывай и не щекочи ради смеха."],
      ["Получилось, если", "она засмеялась. Хватит, если смех оборвался или она отвернулась, даже если хочется продолжить. Завтра повтори ту же игру и не усложняй."],
    ],
  },
  {
    name: "Переворачивается",
    from: 4,
    to: 7,
    montessori: [
      ["Условия", "Жёсткий коврик на полу. Одежда свободная: боди и ползунки, без тугого пеленания. Рядом не клади подушки и плед: в них можно уткнуться лицом. Одна игрушка чуть сбоку. Не оставляй её на диване и на пеленальнике: оттуда легко упасть."],
      ["Совет", "Сначала клади на живот. На спину она часто переворачивается сама, руками не помогай. Позже клади на спину и положи игрушку сбоку: она сама посмотрит, потянется и перевернётся на живот. Если застряла на животе и злится, верни её на спину и снова не мешай."],
      ["Получилось, если", "она перевернулась сама, без толчка. Не подкладывай валик под бок, чтобы переворот получился."],
    ],
  },
  {
    name: "Сидит без опоры",
    from: 6,
    to: 9,
    montessori: [
      ["Условия", "Пока не сидит сама, пусть лежит на полу: на спине, на боку или на животе. Подушки вокруг и шезлонг сидеть не учат. Когда села и держит спину, поставь на пол низкий поднос и два предмета."],
      ["Совет", "Не сажай в стульчик просто так. Он пригодится позже и ненадолго: для еды, когда она уже сидит сама. До этого ей полезнее лежать, переворачиваться и опираться на свои руки."],
      ["Получилось, если", "она сидит, опираясь на свои руки, и может лечь обратно. Если без подушки падает, сидеть ещё рано."],
    ],
  },
  {
    name: "Лепечет «ма-ма», «ба-ба»",
    from: 6,
    to: 9,
    montessori: [
      ["Условия", "Лица рядом. Телевизор и музыка выключены. Повторяй один слог, который она уже говорит."],
      ["Совет", "Она сказала «ба» — ответь «ба-ба-ба» и замолчи. Потом назови одну вещь у неё в руках, например «мяч». Не говори сразу три слова. Каждый день используй одни и те же слова: вода, молоко, спать."],
      ["Получилось, если", "она повторяет слог или молча слушает. Не проси «скажи мама»: сначала важен её слог, не точное слово."],
    ],
  },
  {
    name: "Ползает",
    from: 6,
    to: 10,
    montessori: [
      ["Условия", "Свободный пол. Если пол холодный, постели коврик. Впереди поставь низкую полку или ящик с одним предметом. Ходунки и прыгунки не используй: в них ей незачем ползти. Манеж годится на минуту, но не вместо пола."],
      ["Совет", "Положи игрушку на пол чуть дальше её ладони, не держи её в воздухе. Доползла и взяла — дай посмотреть. Не забирай сразу, чтобы она поползла снова. Ползунки не должны скользить и мешать коленям."],
      ["Получилось, если", "она сама ползёт к игрушке. Дети ползают по-разному, кто-то раньше встаёт у дивана. Полоса из препятствий не нужна."],
    ],
  },
  {
    name: "Встаёт у опоры",
    from: 8,
    to: 12,
    montessori: [
      ["Условия", "Подойдёт тяжёлый диван, пуф или ящик на высоте её рук. Закрой острые углы. Убери лёгкий стул, скатерть и провода: она может потянуть их на себя."],
      ["Совет", "Положи предмет на сиденье и сядь на пол рядом. Пусть сама решит взяться и подтянуться. Не ставь её на ноги и не держи за руки, чтобы показать, как стоять."],
      ["Получилось, если", "она встала у опоры, даже если сразу села. В первый день долго стоять не нужно."],
    ],
  },
  {
    name: "Берёт кусочек двумя пальцами",
    from: 9,
    to: 12,
    montessori: [
      ["Условия", "Низкий поднос и две тарелки. Если она уже ест руками, дай крупные мягкие кусочки: банан, отварную морковь, мягкий хлеб. Куски мельче её кулака оставляй только тогда, когда ты рядом. Не давай орехи, целый виноград и мелкие детали."],
      ["Совет", "Медленно покажи: большим и указательным пальцем возьми один кусок и положи на вторую тарелку. Подвинь поднос ближе и не направляй её пальцы. Кусков пусть будет одна горсть, не полная миска."],
      ["Получилось, если", "она взяла кусок двумя пальцами, даже один. Если загребает всей ладонью, двумя пальцами брать ещё рано — оставь крупные куски."],
    ],
  },
  {
    name: "Машет «пока»",
    from: 9,
    to: 12,
    montessori: [
      ["Условия", "Выбери одно место для прощания: входную дверь или край кроватки. Маши «пока», когда кто-то уходит. Отдельное занятие для этого не нужно."],
      ["Совет", "Каждый раз одно и то же: посмотри на неё, подними ладонь, скажи «пока» и подожди. Если махнула по-своему, повтори её движение. Не добивайся красивой ладони. Один раз можно показать у зеркала и сразу выйти по-настоящему."],
      ["Получилось, если", "она махнула по-своему или смотрит на руку. В эту секунду не добавляй другое слово и другой жест."],
    ],
  },
  {
    name: "Ходит вдоль опоры",
    from: 9,
    to: 12,
    montessori: [
      ["Условия", "Сделай один путь: от дивана к тяжёлому пуфу. Между ними не должно быть щели, куда она провалится. Закрой острые углы. Дома пусть ходит босиком. Если пол скользкий, надень носки с подошвой, не гладкие колготки."],
      ["Совет", "Положи предмет на дальний край. Пусть дойдёт сама. Не води её за обе руки: тогда шагаешь ты. Если хочешь быть рядом, иди на коленях."],
      ["Получилось, если", "она сделала хотя бы два шага вдоль опоры. Хватит на сегодня, даже если сразу села. Сначала оставь короткий путь и удлиняй его, когда она проходит его спокойно."],
    ],
  },
  {
    name: "Первые шаги сама",
    from: 11,
    to: 15,
    montessori: [
      ["Условия", "Середину комнаты освободи. Диван и другие устойчивые вещи оставь по краям. Ходунки не используй. Дома пусть ходит босиком: так стопа чувствует пол."],
      ["Совет", "Сядь на пол в одном шаге от дивана, за который она уже держится. Держи предмет у себя. Шаг она делает сама. Не поднимай её за руки и не ставь на ноги, чтобы она прошла. Если упала и рядом безопасно, дай ей самой найти, за что держаться."],
      ["Получилось, если", "она сделала шаг сама, хотя бы от дивана к пуфу, а не через всю комнату. Улыбнись и скажи одно слово. Громкие хлопки часто пугают, и она садится."],
    ],
  },
  {
    name: "Слова кроме «мама» и «папа»",
    from: 12,
    to: 15,
    montessori: [
      ["Условия", "Дай настоящие вещи, не карточки и не картинки на экране. На низкой полке оставь два-три предмета, которые она и так берёт: мяч, чашку, ложку."],
      ["Совет", "Сначала покажи одну вещь и назови её: «чашка». В другой раз, когда перед ней две знакомые вещи, скажи: «дай чашку». Вопрос «что это?» задавай позже, когда она уже подаёт вещь по слову. При кормлении и одевании называй вещи так же."],
      ["Получилось, если", "она принесла вещь и смотрит на тебя — назови вещь один раз и замолчи. Не добавляй новое слово, пока она путает эти два. Сначала дай вещь в руку, потом показывай картинку в книге."],
    ],
  },
];
const WEIGHT_SHEET = 2;
const NOTEBOOK_WEIGHTS = [
  ["2026-10-18", 2060, 2740],
  ["2026-10-19", 2065, 2850],
  ["2026-10-20", 2040, 2935],
  ["2026-10-21", 2105, 2880],
  ["2026-10-23", 2210, 3000],
  ["2026-10-24", 2330, 2920],
  ["2026-10-25", 2280, 2950],
  ["2026-10-27", 2350, 3140],
  ["2026-10-28", 2350, 3100],
  ["2026-10-29", 2440, 3190],
  ["2026-10-30", 2446, 3290],
  ["2026-11-01", 2520, 3430],
  ["2026-11-03", 2640, 3510],
  ["2026-11-04", 2700, 3580],
  ["2026-11-05", 2800, 3660],
];

const panelToday = document.querySelector("#panel-today");

let state = loadState();
let cardOpen = null;
let weightHistoryOpen = false;
let weightPage = {};
let calendarOpen = false;
let skillsOpen = false;
let natalOpen = false;
let skillsMode = "corrected";
let skillOpen = null;
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
  const weighed = ensureDailyWeights(base);
  if (weighed) localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
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
let syncNote = "";

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
  base.feedings = union(local.feedings, remote?.feedings);
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
    syncNote = "";
    if (!cardOpen && !historyBusy()) renderToday();
  } catch {
    syncNote = "Связи нет: пока только этот телефон";
    if (!cardOpen && !historyBusy()) renderToday();
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

function birthDay() {
  const raw = state.profiles.miroslava?.bornAt || CHILDREN[0].bornAt;
  return slotDate(String(raw).slice(0, 10), 0);
}

function skillsOrigin() {
  if (skillsMode === "corrected") {
    const [year, month, date] = DUE_DATE.split("-").map(Number);
    return new Date(year, month - 1, date);
  }
  return birthDay();
}

function addMonths(date, months) {
  const whole = Math.floor(months);
  const fraction = months - whole;
  const next = new Date(date.getFullYear(), date.getMonth() + whole, date.getDate());
  if (fraction) next.setDate(next.getDate() + Math.round(fraction * 30.4375));
  return next;
}

function skillsChart() {
  const born = birthDay();
  const origin = skillsOrigin();
  const end = addMonths(origin, 15.5);
  const span = end - born || 1;
  const pct = (date) => Math.min(100, Math.max(0, ((date - born) / span) * 100));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const names = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  const ticks = [{ at: born, label: `${born.getDate()} ${names[born.getMonth()]}` }];
  let cursor = new Date(born.getFullYear(), born.getMonth() + 1, 1);
  while (cursor < end) {
    const yearBit = cursor.getMonth() === 0 ? ` ${String(cursor.getFullYear()).slice(2)}` : "";
    ticks.push({ at: new Date(cursor), label: names[cursor.getMonth()] + yearBit });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
    const now = pct(today).toFixed(2);
    const months = (skill) => `${skill.from}–${skill.to} мес.`;
    const rows = SKILLS.map((skill, index) => {
    const start = addMonths(origin, skill.from);
    const stop = addMonths(origin, skill.to);
    const left = pct(start);
    const width = Math.max(pct(stop) - left, 0.6);
    const tone = today >= stop ? "past" : today >= start ? "now" : "later";
    const open = skillOpen === index;
    const hint =
      tone === "now"
        ? "Сейчас как раз этот срок. Занимайся коротко, пока ей интересно."
        : tone === "past"
          ? "Обычный срок уже прошёл. Повторяй то же и не торопи. Недоношенным возраст считают от ПДР."
          : "Этот срок ещё впереди. Пока хватает обычных дел. Заранее тренировать не нужно.";
    const montessori = (skill.montessori || [])
      .map(([title, text]) => {
        const glue = title.endsWith("если") ? " " : ". ";
        return `<p><b>${escapeHtml(title)}</b>${glue}${escapeHtml(text)}</p>`;
      })
      .join("");
    return `
      <div class="gantt-skill">
        <div class="gantt-line">
          <button type="button" class="gantt-label" data-skill="${index}" aria-expanded="${open ? "true" : "false"}">
            <span class="gantt-when">${months(skill)}</span>
            <span class="gantt-name">${escapeHtml(skill.name)}</span>
          </button>
          <div class="gantt-clip">
            <div class="gantt-track" data-skill="${index}">
              <i class="gantt-bar ${tone}" style="left:${left.toFixed(2)}%;width:${width.toFixed(2)}%"></i>
              <i class="gantt-now" style="left:${now}%"></i>
            </div>
          </div>
        </div>
        ${open ? `<div class="skill-card"><p class="skill-hint">${hint}</p><p class="skill-school">Монтессори</p>${montessori}</div>` : ""}
      </div>`;
  }).join("");
  const axis = ticks
    .map((tick) => `<span style="left:${pct(tick.at).toFixed(2)}%">${tick.label}</span>`)
    .join("");
  const from = skillsMode === "corrected" ? "от ПДР 9 ноября" : "от рождения 29 сентября";
  return `
    <div class="skills-switch" role="group" aria-label="Как считать возраст">
      <button type="button" class="btn ${skillsMode === "chrono" ? "primary" : ""}" data-skills-age="chrono">Обычный возраст</button>
      <button type="button" class="btn ${skillsMode === "corrected" ? "primary" : ""}" data-skills-age="corrected">Скорректированный</button>
    </div>
    <p class="muted">Полоса показывает, когда навык обычно появляется. Правый край — возраст, к которому он есть у большинства. Сейчас возраст считается ${from}. Чёрная линия — сегодня. Нажми навык: откроется карточка — условия, совет и признак, что получилось. Недоношенным до двух лет возраст считают от ПДР. Ползают не все дети.</p>
    <p class="legend">
      <span><i class="dot gantt-dot later"></i>ещё рано</span>
      <span><i class="dot gantt-dot now"></i>сейчас</span>
      <span><i class="dot gantt-dot past"></i>срок прошёл</span>
    </p>
    <div class="gantt">
      ${rows}
      <div class="gantt-axis">
        <div class="gantt-axis-pad"></div>
        <div class="gantt-clip">
          <div class="chart-days">${axis}</div>
        </div>
      </div>
    </div>
  `;
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

function slotDate(day, hour) {
  const [year, month, date] = String(day).split("-").map(Number);
  const next = new Date(year, month - 1, date, Number(hour), 0, 0, 0);
  return Number.isNaN(next.getTime()) ? null : next;
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
  for (const item of data.weights) {
    if (!Object.hasOwn(item, "stool")) continue;
    delete item.stool;
    changed = true;
  }
  for (const [day, avroraGrams, miraGrams] of NOTEBOOK_WEIGHTS) {
    const byChild = {
      avrora: avroraGrams,
      miroslava: miraGrams,
    };
    for (const child of CHILDREN) {
      const grams = byChild[child.id];
      const id = `notebook-${child.id}-${day}`;
      const item = data.weights.find((row) => row.id === id);
      if (item) {
        if (item.sheet !== WEIGHT_SHEET) {
          item.grams = grams;
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
  const bits = [
    profile.height ? `рост ${profile.height} см` : "",
    profile.headCm ? `голова ${profile.headCm} см` : "",
  ].filter(Boolean);
  return bits.join(" · ");
}

function formatDayKey(key) {
  const date = slotDate(key, 12);
  if (!date) return "";
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

function careLine(childId) {
  const profile = state.profiles[childId];
  const bits = [];
  if (profile.vitaminD) bits.push(`витамин D: ${escapeHtml(profile.vitaminD)}`);
  if (profile.nextVisit) bits.push(`осмотр ${formatDayKey(profile.nextVisit)}`);
  if (!bits.length) return "";
  return `<p class="stats">${bits.join(" · ")}</p>`;
}

function historyBusy() {
  const el = document.activeElement;
  return Boolean(el && el.closest && (el.closest("[data-weight-edit]") || el.closest("[data-weight-add]") || el.closest("[data-cal-add]")));
}

function weightTable(rows) {
  if (!rows.length) return "";
  return `
    <div class="history-wrap">
      <table class="history">
        <thead>
          <tr>
            <th>Кто</th>
            <th>Дата</th>
            <th>Вес, г</th>
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
                </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function weightHistory() {
  const today = dayKey(new Date());
  const pageSize = 5;
  const sections = CHILDREN.map((child) => {
    const rows = state.weights
      .filter((item) => item.childId === child.id)
      .sort((a, b) => String(b.at).localeCompare(String(a.at)));
    const pages = Math.max(1, Math.ceil(rows.length / pageSize));
    let page = weightPage[child.id] || 0;
    if (page > pages - 1) page = pages - 1;
    if (page < 0) page = 0;
    weightPage[child.id] = page;
    const slice = rows.slice(page * pageSize, page * pageSize + pageSize);
    const pager = pages > 1
      ? `<nav class="weight-pages" aria-label="Страницы, ${child.name}">
          ${Array.from({ length: pages }, (_, index) => `
            <button type="button" class="weight-page${index === page ? " is-on" : ""}" data-weight-page="${child.id}" data-page="${index}" ${index === page ? 'aria-current="page"' : ""}>${index + 1}</button>`).join("")}
        </nav>`
      : "";
    const body = rows.length
      ? `${weightTable(slice)}${pager}`
      : `<p class="empty">Пока нет взвешиваний.</p>`;
    return `<section class="weight-girl"><h3>${child.name}</h3>${body}</section>`;
  }).join("");
  return `
    <form class="weight-add" data-weight-add>
      <label>Кто
        <select name="childId" aria-label="Кто">${childSelect("miroslava")}</select>
      </label>
      <label>Дата
        <input name="day" type="date" value="${today}" required aria-label="Дата" />
      </label>
      <label>Вес, г
        <input name="grams" type="number" min="1000" max="12000" step="1" required aria-label="Вес, г" />
      </label>
      <button class="cal-save" type="submit">Добавить</button>
    </form>
    ${sections}`;
}

function childSelect(selected) {
  return CHILDREN.map(
    (child) => `<option value="${child.id}" ${child.id === selected ? "selected" : ""}>${child.name}</option>`
  ).join("");
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
    return { child, grams, first };
  });
  const gramValues = series.flatMap((item) => item.grams.filter((value) => value != null));
  if (!gramValues.length) {
    return `<p class="empty">Пока нет веса за 14 дней.</p>`;
  }
  const width = 840;
  const height = 210;
  const pad = { l: 12, r: 12, t: 8, b: 8 };
  const minG = Math.min(...gramValues) - 40;
  const maxG = Math.max(...gramValues) + 40;
  const x = (index) => pad.l + (index / (days.length - 1)) * (width - pad.l - pad.r);
  const yG = (value) => height - pad.b - ((value - minG) / (maxG - minG)) * (height - pad.t - pad.b);
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
    <div class="chart-scale"><span>${Math.round(maxG)} г</span></div>
    <svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Вес за 14 дней">
      <line x1="${pad.l}" y1="${height - pad.b}" x2="${width - pad.r}" y2="${height - pad.b}" stroke="#e6d9c8"></line>
      ${lines}
    </svg>
    <div class="chart-days">${dayLabels}</div>
  </div>`;
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

function moscowParts(date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((part) => [part.type, part.value]));
  if (parts.hour === "24") parts.hour = "00";
  return parts;
}

function msUntilMoscow(hour) {
  const parts = moscowParts();
  const now = Number(parts.hour) * 3600 + Number(parts.minute) * 60 + Number(parts.second);
  let delta = hour * 3600 - now;
  if (delta <= 0) delta += 86400;
  return delta * 1000;
}

function weightReminder() {
  const parts = moscowParts();
  if (Number(parts.hour) < 22) return "";
  const day = `${parts.year}-${parts.month}-${parts.day}`;
  const missing = CHILDREN.filter(
    (child) => !state.weights.some((item) => item.childId === child.id && !item.auto && dayKey(item.at) === day)
  );
  if (!missing.length) return "";
  const date = slotDate(day, 12).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  const who = missing.length === 1
    ? { miroslava: "Мирославы", avrora: "Авроры" }[missing[0].id]
    : "девочек";
  return `<p class="weight-warn" role="status">Вы за ${date} не заполнили вес ${who}.</p>`;
}

function armWeightReminder() {
  const wait = Math.min(msUntilMoscow(22), msUntilMoscow(0));
  setTimeout(() => {
    if (!historyBusy() && !cardOpen) renderToday();
    armWeightReminder();
  }, wait);
}

const ZODIAC = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const NATAL = [
  {
    id: "miroslava",
    when: "29.09.2026, 10:38",
    asc: 226.43,
    axes: "Asc Скорпион 16°26′ · MC Дева 8°35′",
    cusps: [226.43, 256.1, 296.87, 338.58, 9.17, 30.55, 46.43, 76.1, 116.87, 158.58, 189.17, 210.55],
    bodies: [
      ["Солнце", "☉", 186.19, "Весы 6°11′", "10"],
      ["Луна", "☽", 39.96, "Телец 9°58′", "6"],
      ["Меркурий", "☿", 208.42, "Весы 28°25′", "11"],
      ["Венера", "♀", 218.19, "Скорпион 8°11′", "12"],
      ["Марс", "♂", 120.71, "Лев 0°42′", "9"],
      ["Юпитер", "♃", 139.29, "Лев 19°17′", "9"],
      ["Сатурн", "♄", 11.71, "Овен 11°43′", "5", "R"],
      ["Уран", "♅", 65.55, "Близнецы 5°33′", "7", "R"],
      ["Нептун", "♆", 2.91, "Овен 2°55′", "4", "R"],
      ["Плутон", "♇", 303.13, "Водолей 3°08′", "3", "R"],
      ["Узел", "☊", 327.8, "Водолей 27°48′", "3"],
    ],
  },
  {
    id: "avrora",
    when: "29.09.2026, 10:39",
    asc: 226.6,
    axes: "Asc Скорпион 16°36′ · MC Дева 8°51′",
    cusps: [226.6, 256.31, 297.14, 338.85, 9.39, 30.74, 46.6, 76.31, 117.14, 158.85, 189.39, 210.74],
    bodies: [
      ["Солнце", "☉", 186.19, "Весы 6°11′", "10"],
      ["Луна", "☽", 39.97, "Телец 9°58′", "6"],
      ["Меркурий", "☿", 208.42, "Весы 28°25′", "11"],
      ["Венера", "♀", 218.19, "Скорпион 8°11′", "12"],
      ["Марс", "♂", 120.71, "Лев 0°42′", "9"],
      ["Юпитер", "♃", 139.29, "Лев 19°17′", "9"],
      ["Сатурн", "♄", 11.71, "Овен 11°43′", "5", "R"],
      ["Уран", "♅", 65.55, "Близнецы 5°33′", "7", "R"],
      ["Нептун", "♆", 2.91, "Овен 2°55′", "4", "R"],
      ["Плутон", "♇", 303.13, "Водолей 3°08′", "3", "R"],
      ["Узел", "☊", 327.8, "Водолей 27°48′", "3"],
    ],
  },
];

function natalPoint(lon, radius, asc) {
  const angle = ((180 + (lon - asc)) * Math.PI) / 180;
  return [120 + radius * Math.cos(angle), 120 - radius * Math.sin(angle)];
}

function natalWheel(chart) {
  const rings = chart.bodies.map(() => 62);
  chart.bodies.forEach((body, index) => {
    chart.bodies.forEach((other, prev) => {
      if (prev >= index) return;
      const gap = Math.abs(body[2] - other[2]);
      const near = Math.min(gap, 360 - gap) < 14;
      if (near && rings[index] === rings[prev]) rings[index] = rings[prev] === 62 ? 48 : 62;
    });
  });
  const signLines = ZODIAC.map((_, index) => {
    const [x1, y1] = natalPoint(index * 30, 86, chart.asc);
    const [x2, y2] = natalPoint(index * 30, 112, chart.asc);
    const [lx, ly] = natalPoint(index * 30 + 15, 99, chart.asc);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" />
      <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}">${ZODIAC[index]}</text>`;
  }).join("");
  const houses = chart.cusps.map((cusp, index) => {
    const next = chart.cusps[(index + 1) % 12];
    const span = (next - cusp + 360) % 360;
    const [x1, y1] = natalPoint(cusp, 22, chart.asc);
    const [x2, y2] = natalPoint(cusp, 86, chart.asc);
    const [lx, ly] = natalPoint(cusp + span / 2, 78, chart.asc);
    const asc = index === 0 ? " natal-asc" : "";
    return `<line class="natal-cusp${asc}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" />
      <text class="natal-house" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}">${index + 1}</text>`;
  }).join("");
  const planets = chart.bodies.map((body, index) => {
    const [x, y] = natalPoint(body[2], rings[index], chart.asc);
    const mark = body[5] ? "R" : "";
    return `<text class="natal-planet" x="${x.toFixed(1)}" y="${y.toFixed(1)}">${body[1]}${mark}</text>`;
  }).join("");
  return `<svg class="natal-wheel" viewBox="0 0 240 240" role="img" aria-label="Карта ${chart.id === "miroslava" ? "Мирославы" : "Авроры"}">
    <circle cx="120" cy="120" r="112" />
    <circle cx="120" cy="120" r="86" />
    <circle cx="120" cy="120" r="22" />
    ${signLines}
    ${houses}
    ${planets}
  </svg>`;
}

function natalCharts() {
  return `<p class="muted natal-note">29 сентября 2026, Москва. Тропический зодиак, дома Плацида. Минута между сёстрами — одни и те же планеты, восход сдвигается на 10′. Если роддом не в Москве, асцендент будет другим.</p>
    <div class="natal-grid">
      ${NATAL.map((chart) => {
        const child = CHILDREN.find((item) => item.id === chart.id);
        return `<article class="natal-card">
          <h3>${child.name}</h3>
          <p class="muted">${chart.when}<br>${chart.axes}</p>
          ${natalWheel(chart)}
          <ul class="natal-list">
            ${chart.bodies.map((body) => `<li><span>${body[1]} ${body[0]}${body[5] ? " R" : ""}</span><span>${body[3]} · ${body[4]} дом</span></li>`).join("")}
          </ul>
        </article>`;
      }).join("")}
    </div>
    ${natalReading()}`;
}

function natalReading() {
  return `<div class="natal-reading">
      <h3>Общая карта</h3>
      <p>У Мирославы и Авроры одна и та же карта. Минута между ними ничего в характере планет не меняет. Ниже — кто они и как этому характеру лучше расти. Чем сёстры отличаются, написано отдельно в конце.</p>
      <h4>Какие они</h4>
      <p>Им важно быть вдвоём и чтобы было по-честному. Они чувствуют, смотрят ли на них, сравнивают ли, не обошли ли одну. Хорошо, когда у каждой есть своё имя и своя минута, а не только общее «девочки».</p>
      <p>Успокаиваются телом: тепло, еда, знакомые руки, один и тот же порядок дня. Объятие без еды или еда на бегу их не насыщают. Новое легче входит, если старое ещё рядом.</p>
      <p>С первого взгляда они цепкие: своих не отпускают. Нежность сильная, но тихая. Гостям можно не улыбаться, пока ребёнок не согрелся. Свои это знают без показа.</p>
      <p>Говорить они будут через разговор и через «мы»: сестра, друг, общий сюжет. Слова могут прийти не самыми первыми, зато уже собранными. Если что-то не так, звук резкий. Ровный ответ гасит это быстрее, чем громкий.</p>
      <p>Играть им нужно широко: чтобы видели, чтобы было красиво и чуть больше, чем «просто поделали». При этом игра серьёзная и в своём темпе. Помогает право повторить, а не гонка «ну быстрее».</p>
      <p>Дом для них — это тон, не только расписание. Им легче, когда рядом спокойно и понятно, что будет дальше. Близкий человек может быть совсем другим, не копией. Со временем каждой понадобится своё мнение рядом с сестрой, а не вместо неё.</p>
      <h4>Сейчас, в первые месяцы</h4>
      <p>Держать ритм дня. Кормить и сразу оставлять на руках, не разделять «уже поела» и «ещё полежи». Одним и тем же людям быть рядом чаще, чем новым лицам. На гости выносить уже сытых и согретых: желание понравиться и нужда в тепле сами не совпадают.</p>
      <p>Не ждать, что обе успокоятся одним способом в одну секунду. Ответить той, кто позвала, и следом дать очередь второй.</p>
      <h4>До школы</h4>
      <p>Потенциал растёт в игре с зрителем и в повторении. Пускать на сцену: танец, рисунок, «смотри, как я». Не отбирать попытку, если вышло не сразу. Книги, прогулки и вопросы «а что там» кормят их интерес к миру за порогом дома.</p>
      <p>Речь лучше строить диалогом, а не командой. Спрашивать каждой отдельно. Хвалить и общее дело, и отдельную фразу. Роль «тихоня» и роль «главная» лучше не закреплять: карта этого деления не даёт.</p>
      <h4>Школа</h4>
      <p>Им заходит понятный день и ощущение, что их вклад виден. Сравнение сестёр в одну оценку бьёт сильнее, чем трудное задание. Друзья и компания станут второй семьёй: через них они думают и говорят.</p>
      <p>Учёба идёт легче, когда есть смысл и люди, а не только скорость. Право переделать работу важнее похвалы за то, что сдано первым. Характер в словах прямой: учить спорить без крика, потому что чувство и фраза у них вспыхивают вместе.</p>
      <h4>Подростки</h4>
      <p>Здесь проверка карты: остаться близкими и не слипнуться. Сестра — опора, не обязанность быть одной личностью на двоих. Каждой нужна своя компания, своё дело и право выглядеть иначе.</p>
      <p>Тянет быть заметной. Это опора, если рядом есть место для своего мнения, а не только для аплодисментов. Дружба и любовь у них глубокие. Внешняя лёгкость обманывает: отпускают они не сразу и не всех.</p>
      <h4>Взрослая жизнь</h4>
      <p>Сильная дорога — дело, где виден результат и есть другие люди: пара, команда, сцена, забота, разговор. Одной блестящей роли без пользы им мало. Одной тихой пользы без признания тоже мало.</p>
      <p>В близких отношениях им нужны верность и телесный покой: дом, еда, ритм, честность. Партнёр может быть непохожим. Срабатывает союз, где можно быть в паре и остаться собой.</p>
      <p>Друг с другом они на всю жизнь, если с детства была отдельная очередь. Тогда сестра остаётся своим человеком, а не тем, с кем надо делить одну роль.</p>
    </div>
    <div class="natal-split">
      <h3>Где расходятся</h3>
      <p>Характер по карте один. Отличается только то, кто родилась на минуту раньше.</p>
      <ul>
        <li><b>Мирослава, 10:38.</b> Открывает минуту. Чаще первой подаёт знак: голод, зов, «смотри на меня». Ей полезно быть услышанной первой и сразу отпускать очередь сестре, чтобы не застрять в роли старшей по делу.</li>
        <li><b>Аврора, 10:39.</b> Входит в уже открытую минуту. С первого взгляда чуть тише у порога, суть та же. Ей полезно получать свою очередь сразу, а не остаток после сестры, чтобы тишина не стала её постоянной ролью.</li>
        <li><b>Луна, речь, игра, привязанность.</b> Одинаковые. Отдельного «характера Авроры» и «характера Мирославы» карта не показывает.</li>
      </ul>
      <p>По жизни их лучше растить одним укладом и двумя очередями. Кто позвала первой — та получает ответ. Вторая получает такой же целый ответ, не укороченный.</p>
    </div>`;
}

let ganttScroll = 0;
let skillPin = null;
let holdScroll = null;

function mountGantt() {
  const clips = [...panelToday.querySelectorAll(".gantt-clip")];
  clips.forEach((clip) => {
    clip.scrollLeft = ganttScroll;
    clip.onscroll = () => {
      if (Math.abs(clip.scrollLeft - ganttScroll) < 1) return;
      ganttScroll = clip.scrollLeft;
      clips.forEach((other) => {
        if (other !== clip) other.scrollLeft = ganttScroll;
      });
    };
  });
}

function renderToday() {
  const weighed = ensureDailyWeights(state);
  if (weighed) saveState();
  const scrollY = holdScroll ?? window.scrollY;
  holdScroll = null;
  panelToday.innerHTML = `
    ${weightReminder()}
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
            ${careLine(child.id)}
            ${profileLine(child.id) ? `<p class="stats">${profileLine(child.id)}</p>` : ""}
          </article>
        `;
      }).join("")}
    </div>
    ${syncNote ? `<p class="sync-note">${syncNote}</p>` : ""}
    <details class="dyn">
      <summary>Динамика веса</summary>
      <p class="legend">
        ${CHILDREN.map((child) => `<span><i class="dot" style="background:${child.color}"></i>${child.name}</span>`).join("")}
      </p>
      ${dynamicsChart()}
    </details>
    <details class="dyn" data-weight-history ${weightHistoryOpen ? "open" : ""}>
      <summary>История веса</summary>
      <p class="muted">Пропуск — среднее соседних дней. Несколько дней подряд делятся равномерно. Такие строки помечены «расчёт».</p>
      ${weightHistory()}
    </details>
    <details class="dyn" data-calendar ${calendarOpen ? "open" : ""}>
      <summary>Календарь</summary>
      ${calendarBlock()}
    </details>
    <details class="dyn" data-skills ${skillsOpen ? "open" : ""}>
      <summary>Навыки</summary>
      ${skillsChart()}
    </details>
    <details class="dyn" data-natal ${natalOpen ? "open" : ""}>
      <summary>Натальные карты</summary>
      ${natalCharts()}
    </details>
    ${cardOpen ? cardForm(cardOpen) : ""}
  `;
  mountGantt();
  const keep = () => {
    if (window.scrollY !== scrollY) window.scrollTo(0, scrollY);
  };
  keep();
  requestAnimationFrame(keep);
}

document.body.addEventListener(
  "pointerdown",
  (event) => {
    const skill = event.target.closest?.("[data-skill]");
    skillPin = skill ? window.scrollY : null;
  },
  true
);

document.body.addEventListener("click", (event) => {
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
  const skillsBtn = event.target.closest("[data-skills-age]");
  if (skillsBtn) {
    skillsMode = skillsBtn.dataset.skillsAge === "chrono" ? "chrono" : "corrected";
    skillsOpen = true;
    renderToday();
    return;
  }
  const skillBtn = event.target.closest("[data-skill]");
  if (skillBtn) {
    const index = Number(skillBtn.dataset.skill);
    skillOpen = skillOpen === index ? null : index;
    skillsOpen = true;
    holdScroll = skillPin;
    renderToday();
    return;
  }
  const pageBtn = event.target.closest("[data-weight-page]");
  if (pageBtn) {
    weightPage[pageBtn.dataset.weightPage] = Number(pageBtn.dataset.page) || 0;
    weightHistoryOpen = true;
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
    renderToday();
  }
});

document.body.addEventListener(
  "toggle",
  (event) => {
    if (event.target.matches?.("[data-weight-history]")) weightHistoryOpen = event.target.open;
    if (event.target.matches?.("[data-calendar]")) calendarOpen = event.target.open;
    if (event.target.matches?.("[data-skills]")) skillsOpen = event.target.open;
    if (event.target.matches?.("[data-natal]")) natalOpen = event.target.open;
  },
  true
);

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
  item.auto = false;
  weightHistoryOpen = true;
  ensureDailyWeights(state);
  saveState();
  renderToday();
});

document.body.addEventListener("submit", (event) => {
  const form = event.target;
  if (form.matches("[data-weight-add]")) {
    event.preventDefault();
    const data = new FormData(form);
    const grams = Number(data.get("grams"));
    const day = String(data.get("day") || "");
    const childId = String(data.get("childId") || "");
    const atDate = slotDate(day, new Date().getHours());
    if (!grams || !atDate || !CHILDREN.some((child) => child.id === childId)) return;
    state.weights.unshift({
      id: crypto.randomUUID(),
      childId,
      grams,
      at: atDate.toISOString(),
      auto: false,
    });
    weightHistoryOpen = true;
    weightPage[childId] = 0;
    ensureDailyWeights(state);
    saveState();
    renderToday();
    return;
  }
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
  }
});

renderToday();
armWeightReminder();
syncShared();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") syncShared();
});
