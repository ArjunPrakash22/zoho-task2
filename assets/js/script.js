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
const inputStatus = document.getElementById("pin-form__status");
const btns = document.querySelectorAll(".enter-pin__num-btn");

let isLocked = false;
let failedAttempts = 0;
let lockTimer = null;

function initializePinForm() {
  inputs.value = "";
  error.textContent = "";
  inputStatus.textContent = "";

  boxes.forEach((box) => {
    box.textContent = "";
  });
}

initializePinForm();

function handleInput({ key, action }) {
  if (inputs.value.length < 4 || action === "correction") {
    if (key) {
      inputs.value += key;
    } else if (action) {
      inputs.value = inputs.value.slice(0, -1);
    }

    displayInput();

    let len = inputs.value.length;
    displayStatus(len);
  }

  if (action && action === "cancel") {
    initializePinForm();
    unlockPinForm();
    alert("transaction cancelled");
  }
}

numbers.addEventListener("click", (e) => {
  if (!isLocked) {
    const key = e.target.value;
    const action = e.target.dataset.action;

    handleInput({
      key: key,
      action: action,
    });
  }
  inputs.focus();
});

document.addEventListener("keydown", (e) => {
  if (!isLocked) {
    if (/^[0-9]$/.test(e.key)) {
      handleInput({ key: e.key });
    } else if (e.key === "Backspace") {
      handleInput({ action: "correction" });
    } else if (e.altKey && e.key === "Escape") {
      handleInput({ action: "cancel" });
    } else if (e.key === "Enter") {
      form.requestSubmit();
    }
  }
});

function displayInput() {
  boxes.forEach((box, i) => {
    box.textContent = inputs.value[i] >= 0 ? "*" : "";
  });
}

function displayStatus(len) {
  if (len > 0 && len < 4) {
    inputStatus.textContent = `${len} of 4 digits entered`;
    error.textContent = "";
  } else if (len === 4) {
    inputStatus.textContent = "Press OK to continue";
  } else if (len === 0) {
    inputStatus.textContent = "";
  }
}

function lockPinForm() {
  isLocked = true;
  inputs.disabled = true;

  btns.forEach((btn) => {
    btn.disabled = true;
  });

  error.textContent = "Too many failed attempts,\n Try Again after a minute";

  lockTimer = setTimeout(unlockPinForm, 20000);
}

function unlockPinForm() {
  isLocked = false;
  failedAttempts = 0;
  inputs.disabled = false;

  btns.forEach((btn) => {
    btn.disabled = false;
  });

  error.textContent = "";
  initializePinForm();
}

inputs.addEventListener("beforeinput", (e) => {
  if (
    e.inputType.startsWith("insert") ||
    e.inputType === "deleteContentBackward"
  ) {
    e.preventDefault();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputs.value.length === 4 && inputs.value === "1234") {
    inputStatus.textContent = "Pin Accepted. redirecting...";
    setTimeout(() => {
      window.location.replace("./pages/menu.html");
    }, 3000);
  } else {
    failedAttempts++;
    if (inputs.value.length !== 4) {
      error.textContent = "Please enter the 4 digits";
      failedAttempts++;
      return;
    } else {
      initializePinForm();
      error.textContent = "Oops! invalid pin,\n Enter Correct pin";
      if (failedAttempts >= 3) {
        lockPinForm();
      }
    }
  }
});
