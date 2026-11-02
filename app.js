const STORAGE_KEY = "pet1-tasks";

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const status = document.querySelector("#status");

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render(tasks) {
  list.innerHTML = "";

  if (tasks.length === 0) {
    status.textContent = "Пока пусто. Добавь первую задачу.";
    return;
  }

  const remaining = tasks.filter((task) => !task.done).length;
  status.textContent =
    remaining === 0
      ? "Все задачи выполнены."
      : `Осталось: ${remaining} из ${tasks.length}`;

  for (const task of tasks) {
    const item = document.createElement("li");
    item.className = task.done ? "task done" : "task";
    item.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""} aria-label="Выполнено" />
      <span class="title"></span>
      <button type="button" data-action="delete">Удалить</button>
    `;
    item.querySelector(".title").textContent = task.title;

    item.querySelector("input").addEventListener("change", () => {
      task.done = !task.done;
      saveTasks(tasks);
      render(tasks);
    });

    item.querySelector("[data-action='delete']").addEventListener("click", () => {
      const next = tasks.filter((entry) => entry.id !== task.id);
      saveTasks(next);
      render(next);
    });

    list.append(item);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;

  const tasks = loadTasks();
  tasks.unshift({
    id: crypto.randomUUID(),
    title,
    done: false,
  });
  saveTasks(tasks);
  input.value = "";
  input.focus();
  render(tasks);
});

render(loadTasks());
