import { Cocobase } from "https://unpkg.com/cocobase@1.1.4/dist/index.js";

const db = new Cocobase({
  
});

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

// ✅ Fetch todos
async function fetchTodos() {
  const todos = await db.listDocuments("todos");
  render(todos);
}

// ✅ Render list
function render(todos) {
  list.innerHTML = "";
  todos.forEach((t) => list.appendChild(createItem(t)));
}

// ✅ Create item
function createItem(todo) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.data?.done ?? false;

  const span = document.createElement("span");
  span.textContent = todo.data?.title || "Untitled";
  if (todo.data?.done) span.classList.add("done");

  checkbox.addEventListener("change", async () => {
    await db.updateDocument("todos", todo.id, {
      title: todo.data.title,
      done: checkbox.checked,
    });
    fetchTodos();
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "delete-btn";

  delBtn.addEventListener("click", async () => {
    delBtn.textContent = "deleting..."
    await db.deleteDocument("todos", todo.id);
    fetchTodos();
  });

  li.append(checkbox, span, delBtn);
  return li;
}

// ✅ Add todo
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;

  await db.createDocument("todos", {
    title,
    done: false,
  });

  input.value = "";
  fetchTodos();
});

fetchTodos();
