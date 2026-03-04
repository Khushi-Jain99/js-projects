const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTask');
const clearDoneBtn = document.getElementById('clearDone');

const todoList = document.getElementById('todoList');
const doingList = document.getElementById('doingList');
const doneList = document.getElementById('doneList');

const todoCount = document.getElementById('todoCount');
const doingCount = document.getElementById('doingCount');
const doneCount = document.getElementById('doneCount');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');

const STORAGE_KEY = 'questBoardTasks';
const STATUSES = ['todo', 'doing', 'done'];

let tasks = [];

init();

function init() {
  loadTasks();
  render();

  addTaskBtn.addEventListener('click', addTask);
  clearDoneBtn.addEventListener('click', clearCompleted);
  taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  });

  [todoList, doingList, doneList].forEach((lane) => {
    lane.addEventListener('click', handleLaneClick);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  const task = {
    id: Date.now().toString(),
    text,
    priority: prioritySelect.value,
    status: 'todo',
    createdAt: new Date().toISOString()
  };

  tasks.unshift(task);
  taskInput.value = '';
  taskInput.focus();
  saveTasks();
  render();
}

function handleLaneClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  const card = button.closest('.task-card');
  if (!card) {
    return;
  }

  const taskId = card.dataset.id;
  const action = button.dataset.action;

  if (action === 'delete') {
    tasks = tasks.filter((task) => task.id !== taskId);
  }

  if (action === 'edit') {
    const target = tasks.find((task) => task.id === taskId);
    if (target) {
      const updated = prompt('Edit quest:', target.text);
      if (updated !== null && updated.trim() !== '') {
        target.text = updated.trim();
        target.updatedAt = new Date().toISOString();
      }
    }
  }

  if (action === 'left' || action === 'right') {
    const target = tasks.find((task) => task.id === taskId);
    if (target) {
      const index = STATUSES.indexOf(target.status);
      const nextIndex = action === 'left' ? index - 1 : index + 1;
      if (nextIndex >= 0 && nextIndex < STATUSES.length) {
        target.status = STATUSES[nextIndex];
        target.updatedAt = new Date().toISOString();
      }
    }
  }

  saveTasks();
  render();
}

function clearCompleted() {
  const hasDone = tasks.some((task) => task.status === 'done');
  if (!hasDone) {
    return;
  }

  tasks = tasks.filter((task) => task.status !== 'done');
  saveTasks();
  render();
}

function render() {
  renderLane(todoList, 'todo');
  renderLane(doingList, 'doing');
  renderLane(doneList, 'done');
  updateCounts();
}

function renderLane(container, status) {
  const laneTasks = tasks.filter((task) => task.status === status);

  if (!laneTasks.length) {
    container.innerHTML = '<p class="empty">No quests here.</p>';
    return;
  }

  container.innerHTML = laneTasks
    .map((task) => createTaskMarkup(task))
    .join('');
}

function createTaskMarkup(task) {
  const date = new Date(task.createdAt);
  const prettyDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  const statusIndex = STATUSES.indexOf(task.status);
  const disableLeft = statusIndex <= 0 ? 'disabled' : '';
  const disableRight = statusIndex >= STATUSES.length - 1 ? 'disabled' : '';
  const updatedMeta = task.updatedAt ? ' · Updated' : '';

  return `
    <article class="task-card ${task.priority}" data-id="${task.id}">
      <p class="task-text">${escapeHtml(task.text)}</p>
      <p class="task-meta">Priority: ${task.priority.toUpperCase()} · ${prettyDate}${updatedMeta}</p>
      <div class="task-actions">
        <button class="mini-btn" data-action="left" ${disableLeft}>←</button>
        <button class="mini-btn" data-action="right" ${disableRight}>→</button>
        <button class="mini-btn" data-action="edit">Edit</button>
        <button class="mini-btn" data-action="delete">Delete</button>
      </div>
    </article>
  `;
}

function updateCounts() {
  const todo = tasks.filter((task) => task.status === 'todo').length;
  const doing = tasks.filter((task) => task.status === 'doing').length;
  const done = tasks.filter((task) => task.status === 'done').length;
  const total = tasks.length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  todoCount.textContent = todo;
  doingCount.textContent = doing;
  doneCount.textContent = done;
  progressText.textContent = `${progress}%`;
  progressFill.style.width = `${progress}%`;
  clearDoneBtn.disabled = done === 0;
}

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      tasks = Array.isArray(parsed) ? parsed : [];
    } catch {
      tasks = [];
    }
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}