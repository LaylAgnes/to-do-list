const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

let todo = JSON.parse(localStorage.getItem("todo-list")) || [];
let updateText;

function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
  todoAlert.removeAttribute("class");
  todoAlert.innerText = message;
  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, 1000);
}

function CreateToDoItems() {
  if (todoValue.value.trim() === "") {
    setAlertMessage("Please enter your todo text!");
    todoValue.focus();
    return;
  }

  if (todo.some(item => item.item === todoValue.value.trim())) {
    setAlertMessage("Este item já está presente na lista!");
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = `
    <span title="Double Click to Complete" ondblclick="CompletedToDoItems(this)">
      ${todoValue.value.trim()}
    </span>
    <div class="buttons">
      <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/img/pencil.png" />
      <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/img/delete.png" />
    </div>
  `;
  listItems.appendChild(li);

  todo.push({ item: todoValue.value.trim(), status: false });
  setLocalStorage();
  todoValue.value = "";
  setAlertMessage("Item de tarefa criado com sucesso!");
}

function ReadToDoItems() {
  listItems.innerHTML = "";
  todo.forEach(element => {
    let li = document.createElement("li");
    let textDecoration = element.status ? "line-through" : "";
    li.innerHTML = `
      <span ondblclick="CompletedToDoItems(this)" style="text-decoration:${textDecoration}">
        ${element.item}
      </span>
      <div class="buttons">
        ${element.status ? '<img class="todo-controls" src="/img/check.png" />' :
          '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/img/pencil.png" />'}
        <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/img/delete.png" />
      </div>
    `;
    listItems.appendChild(li);
  });
}
ReadToDoItems();

function UpdateToDoItems(e) {
  const span = e.closest("li").querySelector("span");
  if (!span.style.textDecoration) {
    todoValue.value = span.innerText.trim();
    updateText = span;
    addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdate.setAttribute("src", "/img/transferir.png");
    todoValue.focus();
  }
}

function UpdateOnSelectionItems() {
  if (todo.some(item => item.item === todoValue.value.trim())) {
    setAlertMessage("seu item já está presente na lista!");
    return;
  }

  todo.forEach(element => {
    if (element.item === updateText.innerText.trim()) {
      element.item = todoValue.value.trim();
    }
  });
  setLocalStorage();

  updateText.innerText = todoValue.value.trim();
  addUpdate.setAttribute("onclick", "CreateToDoItems()");
  addUpdate.setAttribute("src", "/img/sinal-de-mais.png");
  todoValue.value = "";
  setAlertMessage("Item de tarefa atualizado com sucesso!");
}

function DeleteToDoItems(e) {
  const li = e.closest("li");
  const value = li.querySelector("span").innerText.trim();
  if (confirm(`Tem certeza de que deseja excluir "${value}"?`)) {
    li.classList.add("deleted-item");
    todo = todo.filter(item => item.item !== value);
    setLocalStorage();
    setTimeout(() => li.remove(), 1000);
  }
}

function CompletedToDoItems(e) {
  const span = e.closest("span");
  const li = e.closest("li");
  if (!span.style.textDecoration) {
    span.style.textDecoration = "line-through";

    const checkImg = document.createElement("img");
    checkImg.src = "/img/check.png";
    checkImg.className = "todo-controls";

    li.querySelector(".buttons .edit")?.remove();
    li.querySelector(".buttons").appendChild(checkImg);

    todo.forEach(item => {
      if (item.item === span.innerText.trim()) item.status = true;
    });
    setLocalStorage();
    setAlertMessage("Item de tarefa concluído com sucesso!");
  }
}
