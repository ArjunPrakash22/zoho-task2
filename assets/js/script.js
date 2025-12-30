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
const boxes = document.querySelectorAll(".pin-form__input-bg");
const inputStatus = document.getElementById("pin-form__status");
const btns = document.querySelectorAll(".enter-pin__num-btn");
const submitBtn = document.getElementById('submit-btn');

let isLocked = false;
let failedAttempts = 0;
let lockTimer = null;
let content = '';

function initializePinForm() {
  inputs.value = "";
  inputStatus.textContent = "";
  inputStatus.style.color = 'green';

  boxes.forEach((box) => {
    box.textContent = "";
    box.classList.remove("is-active");
  });

  boxes[0].classList.add("is-active")
}

initializePinForm();

function displayInput(len) {
  boxes.forEach((box, i) => {
    box.textContent = inputs.value[i] >= 0 ? "*" : "";
    box.classList.toggle("is-active",i==len && len<4);
  });
}

function statusValue(content,type){
    inputStatus.textContent = content;
    if(type === 'status'){
        inputStatus.style.color = 'green';
    }else if(type === 'error'){
        inputStatus.style.color = 'red';
    }
}

function displayStatus(len) {
  if (len > 0 && len < 4) {
    content = `${len} of 4 digits entered`;
    statusValue(content,'status');
  } else if (len === 4) {
    content = "Press OK to continue";
    statusValue(content,'status');
  } else if (len === 0) {
    statusValue('','status');
  }
}

function lockPinForm() {
  isLocked = true;
  inputs.disabled = true;

  btns.forEach((btn) => {
    btn.disabled = true;
  });

  content = "Too many failed attempts,\n Try Again after a minute";
  statusValue(content,'error');

  lockTimer = setTimeout(unlockPinForm, 20000);
}

function unlockPinForm() {
  isLocked = false;
  failedAttempts = 0;
  inputs.disabled = false;

  btns.forEach((btn) => {
    btn.disabled = false;
  });

  statusValue('','status');
  initializePinForm();
}



function handleInput({ key, action }) {
  if (inputs.value.length < 4 || action === "correction") {
    if (key) {
      inputs.value += key;
    } else if (action) {
      inputs.value = inputs.value.slice(0, -1);
    }

    let len = inputs.value.length;
    displayInput(len);
    displayStatus(len);
  }

  if (action && action === "cancel") {
    initializePinForm();
    unlockPinForm();
    alert("transaction cancelled");
  }
  if (action && action === 'ok'){
    form.requestSubmit();
  }
}

numbers.addEventListener("click", (e) => {
  if (!isLocked) {
    const key = e.target.value;
    const action = e.target.dataset.action;
    console.log(key)

    handleInput({
      key: key,
      action: action,
    });
  }
//   inputs.focus();
});

document.addEventListener("keydown", (e) => {
  if (!isLocked) {
    if (/^[0-9]$/.test(e.key)) {
      handleInput({ key: e.key });
    } else if (e.key === "Backspace") {
      handleInput({ action: "correction" });
    } else if (e.key === "Escape") {
      handleInput({ action: "cancel" });
    } else if (e.key === "Enter") {
        console.log('hi')
      form.requestSubmit();
    }
  }
});

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
  submitBtn.disabled = true;
  if (inputs.value.length === 4 && inputs.value === "1234") {
    content = "Pin Accepted. redirecting...";
    statusValue(content,'status')
    setTimeout(() => {
      window.location.replace("./pages/menu.html");
    }, 3000);
  } else {
    failedAttempts++;
    submitBtn.disabled=false;
    if (inputs.value.length !== 4) {
      content = "Please enter the 4 digits";
      statusValue(content,'error');
      return;
    } else {
      initializePinForm();
      console.log('hello')
      content = "Oops! invalid pin,\n Enter Correct pin";
      statusValue(content,'error');
      if (failedAttempts >= 3) {
        lockPinForm();
      }
    }
  }
});
