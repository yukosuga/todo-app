const createAlert = (message) => {
  createCustomModal(message);
};

const createConfirm = (message, onConfirm) => {
  createCustomModal(message, onConfirm);
};

const createCustomModal = (message, onConfirm) => {
  const modalContainer = document.body;

  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  modalContainer.appendChild(overlay);

  const customModal = document.createElement("div");
  customModal.classList.add("modal");
  customModal.innerHTML = `
      <div class="modal-content">
        <div class="content-row">
          <img src="./modal.png" alt="Checked Image">
          <p id="modal-message">${message}</p>
        </div>

        <div class="modal-btn">
        ${onConfirm ? '<button id="cancel-btn">Cancel</button>' : ""}
        <button id="confirm-btn">OK</button>
        </div>
      </div>
  `;

  modalContainer.appendChild(customModal);

  const modalMessage = document.getElementById("modal-message");
  const cancelButton = document.getElementById("cancel-btn");
  const confirmButton = document.getElementById("confirm-btn");

  customModal.style.display = "block";

  confirmButton.addEventListener("click", confirm);

  setTimeout(delayCheckForEnter, 0);

  function delayCheckForEnter() {
    document.body.addEventListener("keydown", checkForEnter);
  }

  function checkForEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      confirm();
    }
  }

  function confirm() {
    document.body.removeEventListener("keydown", checkForEnter);
    customModal.style.display = "none";
    overlay.remove();
    if (onConfirm) {
      onConfirm();
    }
    customModal.remove();
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      customModal.style.display = "none";
      overlay.remove();
      customModal.remove();
    });
  }

  return modalMessage;
};

let selectedCategory;

const createCategoryModal = (categories, onConfirm) => {
  const modalContainer = document.body;

  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  modalContainer.appendChild(overlay);

  const customModal = document.createElement("div");
  customModal.classList.add("modal", "category-modal");
  customModal.innerHTML = `
      <div class="modal-content">
        <div class="content-row">
          <img src="./modal.png" alt="Checked Image">
          <p>Add a category</p>
        </div>

        <div class="category">
        <div class="category-input">
          <input type="text" id="new-category-input" placeholder="Enter a new category" />
        </div>

        <div class="modal-btn">
          <button id="cancel-btn">Cancel</button>
          <button id="confirm-btn">OK</button>
        </div>
      </div>  `;

  modalContainer.appendChild(customModal);

  const categoryDropdown = document.getElementById("category-dropdown");
  const newCategoryInput = document.getElementById("new-category-input");
  const cancelButton = document.getElementById("cancel-btn");
  const confirmButton = document.getElementById("confirm-btn");

  customModal.style.display = "block";
  newCategoryInput.focus();

  confirmButton.addEventListener("click", confirmCategory);
  newCategoryInput.addEventListener("keydown", checkForEnter);

  function checkForEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmCategory();
    }
  }

  function confirmCategory() {
    selectedCategory = categoryDropdown.value || newCategoryInput.value;

    if (newCategoryInput.value.trim() === "") {
      customModal.style.display = "none";
      overlay.remove();
      customModal.remove();

      createAlert("The category field is empty");
      return;
    }

    if (categories.includes(newCategoryInput.value.trim())) {
      customModal.style.display = "none";
      overlay.remove();
      customModal.remove();

      createAlert("The category already exists");
      return;
    }

    customModal.style.display = "none";
    overlay.remove();
    onConfirm(selectedCategory);
    customModal.remove();

    const newCategory = newCategoryInput.value.trim();
    if (newCategory !== "" && !categories.includes(selectedCategory)) {
      categoryDropdown.innerHTML += `<option value="${newCategory}">${newCategory}</option>`;
      categoryDropdown.value = newCategory;
      newCategoryInput.value = "";
    }
  }

  cancelButton.addEventListener("click", () => {
    customModal.style.display = "none";
    overlay.remove();
    customModal.remove();
  });

  return categoryDropdown;
};

export { createAlert, createConfirm, createCategoryModal, selectedCategory };
