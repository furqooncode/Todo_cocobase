
    import { Cocobase } from "https://unpkg.com/cocobase@1.1.4/dist/index.js";

    const db = new Cocobase({
      apiKey: "uGSgOV6ks-dx1w7xctGuxF5g59zOvyhVqmapuYZy",
      projectId: "03f3d4d2-e422-46ed-8b0c-9c5cdb2cbb55",
    });

    const form = document.getElementById("todo-form");
    const input = document.getElementById("todo-input");
    const list = document.getElementById("todo-list");

    function saveLocal(todos) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }

    function getLocal() {
      return JSON.parse(localStorage.getItem("todos")) || [];
    }

    function render() {
      list.innerHTML = "";
      getLocal().forEach(t => list.appendChild(createItem(t)));
    }

    function createItem(todo) {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.done;

      const span = document.createElement("span");
      span.textContent = todo.title;
      if (todo.done) span.classList.add("done");

      checkbox.addEventListener("change", () => {
        todo.done = checkbox.checked;
        updateLocal(todo);
        span.classList.toggle("done", todo.done);
        db.updateDocument("todos", todo.id, { done: todo.done }).catch(() => {});
      });

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.className = "delete-btn";

      delBtn.addEventListener("click", () => {
        li.remove();
        removeLocal(todo.id);
        db.deleteDocument("todos", todo.id).catch(() => {});
      });

      li.append(checkbox, span, delBtn);
      return li;
    }

    function updateLocal(updated) {
      const todos = getLocal().map(t => t.id === updated.id ? updated : t);
      saveLocal(todos);
    }

    function removeLocal(id) {
      saveLocal(getLocal().filter(t => t.id !== id));
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = input.value.trim();
      if (!title) return;

      const todo = { id: crypto.randomUUID(), title, done: false };

      const todos = getLocal();
      todos.push(todo);
      saveLocal(todos);
      render();
      input.value = "";

      db.createDocument("todos", todo).catch(() => {});
    });

    window.addEventListener("DOMContentLoaded", render);