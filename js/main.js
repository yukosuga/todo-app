import {
  createAlert,
  createConfirm,
  createCategoryModal,
  selectedCategory,
} from "./modal";
import {
  todos as the_todos,
  categories as the_categories,
  saveTodos,
  saveCategories,
} from "./storage";

let todos = the_todos;
let categories = the_categories;

const createCategoryContainer = (category) => {
  const todoItems = document.querySelector("#todo-items");
  const container = document.createElement("ul");
  container.id = category;

  if (category === "base-todos") {
    todoItems.prepend(container);
  } else {
    todoItems.append(container);
    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("categoryTitle");

    const icon = document.createElement("i");
    icon.classList.add("far", "fa-folder-closed");

    const textNode = document.createTextNode(category);

    categoryTitle.appendChild(icon);
    categoryTitle.appendChild(textNode);

    const categoryDelButton = document.createElement("button");
    categoryDelButton.innerHTML = '<i class="fa-solid fa-square-xmark"></i>';
    categoryDelButton.classList.add("category-del-btn", "button");

    categoryTitle.appendChild(categoryDelButton);

    document
      .getElementById("todo-items")
      .insertBefore(categoryTitle, document.getElementById(category));
  }

  return container;
};

const renderTodo = (todo) => {
  const li = document.createElement("li");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = todo.isCompleted;
  input.classList.add("checkbox");

  input.addEventListener("change", () => {
    todos.forEach((item) => {
      if (item.id === todo.id) {
        item.isCompleted = !item.isCompleted;
      }
    });
    saveTodos(todos);
    li.classList.toggle("completed", input.checked);
  });

  const span = document.createElement("span");
  span.textContent = todo.title;

  const label = document.createElement("label");

  label.appendChild(input);
  label.appendChild(span);

  const editButton = document.createElement("button");
  editButton.innerHTML = '<i class="fas fa-pen"></i>';
  editButton.classList.add("edit-btn", "button");

  editButton.addEventListener("click", () => {
    if (input.checked) {
      return;
    }

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = todo.title;
    editInput.classList.add("edit-input");

    const editSpan = document.createElement("span");
    editSpan.classList.add("edit-span");
    editSpan.appendChild(editInput);

    span.innerHTML = "";
    span.appendChild(editSpan);

    editInput.focus();
    editInput.select();
    const originalChecked = input.checked;

    input.checked = false;

    editInput.addEventListener("blur", saveOrRevert);
    editInput.addEventListener("keydown", checkForEnter);

    function checkForEnter(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        saveOrRevert();
      }
    }

    function saveOrRevert() {
      if (editInput.value.trim() === "") {
        span.textContent = todo.title;
        input.checked = originalChecked;
      } else {
        todo.title = editInput.value;
        editSpan.textContent = editInput.value;
        localStorage.setItem("todos", JSON.stringify(todos));
      }
      saveTodos(todos);
    }
  });

  const deleteButtonHandler = (li, todo) => {
    createConfirm("Delete the task?", () => {
      li.remove();
      todos = todos.filter((item) => item.id !== todo.id);
      saveTodos(todos);
    });
  };

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "ー";
  deleteButton.classList.add("del-btn-minus", "button");
  deleteButton.addEventListener("click", () => {
    deleteButtonHandler(li, todo);
  });

  const deleteButtonJp = document.createElement("button");
  deleteButtonJp.textContent = "Delete";
  deleteButtonJp.classList.add("del-btn-jp");
  deleteButtonJp.addEventListener("click", () => {
    deleteButtonHandler(li, todo);
  });

  let isStared = false;

  const starButton = document.createElement("button");
  starButton.innerHTML = '<i class="fa-regular fa-star"></i>';
  starButton.classList.add("star-btn", "button");

  starButton.addEventListener("click", () => {
    isStared = !isStared;

    if (isStared) {
      starButton.innerHTML = '<i class="fa-solid fa-star"></i>';
    } else {
      starButton.innerHTML = '<i class="fa-regular fa-star"></i>';
    }
  });

  const listButtons = document.createElement("div");
  listButtons.classList.add("list-buttons");

  listButtons.appendChild(starButton);
  listButtons.appendChild(editButton);
  listButtons.appendChild(deleteButton);
  listButtons.appendChild(deleteButtonJp);

  li.appendChild(label);
  li.appendChild(listButtons);

  if (todo.isCompleted) {
    li.classList.add("completed");
  }

  const categoryId = todo.category || "base-todos";
  let parentList = document.getElementById(categoryId);
  if (!parentList) {
    parentList = createCategoryContainer(categoryId);
  }

  parentList.appendChild(li);
};

const renderTodos = () => {
  document.querySelector("#todo-items").innerHTML = "";

  categories.forEach((category) => {
    const categoryTodos = todos.filter((todo) => todo.category === category);

    createCategoryContainer(category || "base-todos");

    categoryTodos.forEach(renderTodo);
  });
};

document.querySelector("#todo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.querySelector("#content");

  if (input.value.trim() === "") {
    createAlert("The task is not entered");
    return;
  }

  const selectedCategory = document.querySelector("#category-dropdown").value;
  if (!categories.includes(selectedCategory)) {
    categories.push(selectedCategory);
    saveCategories(categories);
  }

  const todo = {
    id: Date.now(),
    title: input.value,
    isCompleted: false,
    category: selectedCategory,
  };

  renderTodo(todo);
  todos.push(todo);
  console.table(todos);
  saveTodos(todos);
  input.value = "";
  input.focus();

  document.querySelector("#category-dropdown").value = "";
});
selectedCategory;

document.querySelector("#done-clear-btn").addEventListener("click", () => {
  const completedTasks = todos.filter((todo) => todo.isCompleted);

  if (completedTasks.length === 0) {
    createAlert("No completed tasks");
    return;
  }

  createConfirm("Delete all completed tasks?", () => {
    todos = todos.filter((todo) => !todo.isCompleted);
    saveTodos(todos);

    document.querySelectorAll("#todo-items li").forEach((li) => {
      li.remove();
    });

    renderTodos();
  });
});

document.addEventListener("click", (e) => {
  const button = e.target.closest(".category-del-btn");
  if (button) {
    const categoryTitle = e.target.closest("h3");
    const categoryId = categoryTitle.nextSibling.id;
    const listContainer = document.querySelector(`#${categoryId}`);

    createConfirm("Delete the category?", () => {
      categoryTitle.remove();
      listContainer.remove();

      const categoryToRemove = categoryTitle.textContent;
      categories = categories.filter(
        (category) => category !== categoryToRemove
      );

      saveCategories(categories);

      todos = todos.filter((todo) => todo.category !== categoryToRemove);
      saveTodos(todos);
    });
  }
});

document.querySelector("#all-clear-btn").addEventListener("click", () => {
  document.querySelectorAll("#todo-items li").forEach((li) => {
    li.remove();
  });
  document.querySelectorAll("#todo-items h3").forEach((h3) => {
    h3.remove();
  });

  todos = [];
  categories = [];

  saveTodos(todos);
  saveCategories(categories);
});

const categoryDropdown = document.createElement("select");
categoryDropdown.id = "category-dropdown";

const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.selected = true;
defaultOption.textContent = "---";
categoryDropdown.appendChild(defaultOption);

categories.forEach((category) => {
  if (!category) return;
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  categoryDropdown.appendChild(option);
});

const categoryDropdownLabel = document.getElementById(
  "category-dropdown-label"
);
categoryDropdownLabel.appendChild(categoryDropdown);

document.getElementById("category-btn").addEventListener("click", () => {
  createCategoryModal(categories, (selectedCategory) => {
    if (!categories.includes(selectedCategory)) {
      console.log("Selected category:", selectedCategory);
    }
  });
});

renderTodos();
