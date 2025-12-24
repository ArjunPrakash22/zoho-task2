const dateAdd = document.getElementById("date");
const timeAdd = document.getElementById("time");

function updateDateTime() {
  const now = new Date();
  dateAdd.textContent = now.toLocaleDateString();
  timeAdd.textContent = now.toLocaleTimeString();
}

updateDateTime();
setInterval(updateDateTime, 1000);

const inputs = document.querySelectorAll(".pin-form__input");
const numbers = document.getElementById("keypad");
const form = document.getElementById("pin-form");
const error = document.getElementById('pin-form__error')
let currIndex = 0;
let val = "";

numbers.addEventListener("click", (e) => {
  const event = e.target;

  const key = event.value;
  const action = event.dataset.action;

    if (key && currIndex < inputs.length) {
      inputs[currIndex].value = key;
      console.log(inputs[currIndex].value);
      currIndex++;
    }

    if (action && action === "cancel") {
      resetForm();
      alert('transaction cancelled')
    }

    if (action && action === "correction" && currIndex > 0) {
      currIndex--;
      inputs[currIndex].value = "";
    }
});

function getPin() {
  inputs.forEach((input) => {
    val += input.value;
  });
  return val;
}

function resetForm() {
  inputs.forEach((input) => {
    input.value = "";
  });
  currIndex = 0;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(currIndex);
  if (currIndex >= inputs.length) {
    alert('form submitted')
  } else {
    resetForm();
    error.textContent='Oops! invalid pin'
  }
});
