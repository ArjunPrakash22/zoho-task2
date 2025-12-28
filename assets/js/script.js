const dateAdd = document.getElementById("date");
const timeAdd = document.getElementById("time");

function updateDateTime() {
  const now = new Date();
  dateAdd.textContent = now.toLocaleDateString();
  timeAdd.textContent = now.toLocaleTimeString();
}

updateDateTime();
setInterval(updateDateTime, 1000);

const inputs = document.getElementById("pin-form__input");
const numbers = document.getElementById("keypad");
const form = document.getElementById("pin-form");
const error = document.getElementById("pin-form__error");
const boxes = document.querySelectorAll(".pin-form__input-bg");
const status = document.getElementById("pin-form__status");
const submitBtn = document.getElementById("submit-btn");
const btns = document.querySelectorAll(".enter-pin__num-btn");

let isLocked = false;
let failedAttempts = 0;
let lockTimer = null;

let hasFocusMoved = false;

function initializePinForm() {
  inputs.value = "";
  submitBtn.disabled = true;
  error.textContent = "";
  status.textContent = "";
  hasFocusMoved = false;

  boxes.forEach((box) => {
    box.textContent = "";
  });

  inputs.dispatchEvent(new Event("input", { bubbles: true }));
}

initializePinForm();

numbers.addEventListener("click", (e) => {
  const event = e.target;

  const key = event.value;
  const action = event.dataset.action;

  if (inputs.value.length < 4 || action === "correction") {
    if (key) {
      inputs.value += key;
    } else if (action) {
      inputs.value = inputs.value.slice(0, -1);
    }
    inputs.dispatchEvent(new Event("input", { bubbles: true }));
  }

  if (action && action === "cancel") {
    resetForm();
    alert("transaction cancelled");
  }
});

function resetForm() {
  initializePinForm();
}

function lockPinForm() {
  isLocked = true;

  inputs.disabled = true;
  submitBtn.disabled = true;

  btns.forEach((btn) => {
    btn.disabled = true;
  });

  error.textContent = "Too many failed attempts,\n Try Again after a minute";

  lockTimer = setTimeout(unlockPinForm, 5000);
}

function unlockPinForm() {
  isLocked = false;
  failedAttempts = 0;

  inputs.disabled = false;
  submitBtn.disabled = false;

  btns.forEach((btn) => {
    btn.disabled = false;
  });

  error.textContent = "";
  initializePinForm();
}

inputs.addEventListener("input", () => {
  let value = inputs.value.replace(/\D/g, "").slice(0, 4);
  inputs.value = value;

  boxes.forEach((box, i) => {
    box.textContent = inputs.value[i] ? "*" : "";
  });

  if (value.length > 0 && value.length < 4) {
    status.textContent = `${value.length} of 4 digits entered`;
    submitBtn.disabled = true;
    error.textContent = "";
    hasFocusMoved = false;
  } else if (value.length === 4) {
    status.textContent = "Press OK to continue";
    submitBtn.disabled = false;
    if(!hasFocusMoved){
        submitBtn.focus();
        hasFocusMoved = true;
    }
  } else if (value.length === 0) {
    status.textContent = "";
    submitBtn.disabled = true;
    hasFocusMoved = false;
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputs.value.length === 4 && inputs.value === "1234") {
    status.textContent = "Pin Accepted. redirecting...";
    setTimeout(() => {
      window.location.href = "./pages/menu.html";
    }, 1000);
  } else {
    failedAttempts++;
    resetForm();
    error.textContent = "Oops! invalid pin,\n Enter Correct pin";

    if (failedAttempts >= 3) {
      lockPinForm();
    }
  }
});
