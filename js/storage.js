let todos;
let categories;

if (localStorage.getItem("todos") === null) {
  todos = [];
} else {
  todos = JSON.parse(localStorage.getItem("todos"));
}

if (localStorage.getItem("categories") === null) {
  categories = [];
} else {
  categories = JSON.parse(localStorage.getItem("categories"));
}

const saveTodos = (todosToSave) => {
  try {
    todos = todosToSave;
    localStorage.setItem("todos", JSON.stringify(todos));
  } catch (error) {
    console.log("Error saving todos to local storage", error);
  }
};

const saveCategories = (categoriesToSave) => {
  try {
    categories = categoriesToSave;
    localStorage.setItem("categories", JSON.stringify(categories));
  } catch (error) {
    console.log("Error saving categories to local storage", error);
  }
};

export { todos, categories, saveTodos, saveCategories };
