import {
  payments,
  createHis,
  renderHis,
  deleteTrasnsaction,
  finderAmount,
  updateChanges,
} from "./paymentHisttory.js";

const input = document.querySelector(".input");

const amount = document.querySelector(".amount");

const deposit = document.querySelector(".deposit");

const withdraw = document.querySelector(".withdraw");

const dailogOverlay = document.querySelector(".dailog-overlay");

const message = document.querySelector(".message");

const dailogCloseBtn = document.querySelector(".dailog-close");

const pay = document.querySelector(".js-payment-history");

const reasons = document.querySelector("#reason");

const selectReason = document.querySelector(".select-reason");

const resetBtn = document.querySelector(".reset-transactions");

const resetDailog = document.querySelector(".reset-dialog-overlay");

function load() {
  return JSON.parse(localStorage.getItem("balanceSave")) || 0;
}

export function currency(a) {
  return Number(a).toLocaleString("en-IN", {
    style: "currency",

    currency: "INR",
  });
}

amount.innerHTML = currency(load());

renderHis(pay, currency);

dailogCloseBtn.addEventListener("click", () => {
  dailogOverlay.classList.add("hide");
});

function alertChange(mes) {
  dailogOverlay.classList.remove("hide");

  message.innerHTML = mes;
}

function addMoney() {
  const money = Number(Number(input.value).toFixed(2));

  let bal = Number(load());

  if (money === 0) {
    alertChange("Please Add some amount !");
  } else if (money < 0) {
    alertChange("Please Enter only positive number");
  } else if (money > 200000) {
    alertChange("You have savings account which have 2 Lakh Limit!");
  } else if (money > 0 && money < 200001) {
    bal = bal + money;

    localStorage.setItem("balanceSave", JSON.stringify(bal));

    amount.innerHTML = currency(Number(load()));

    createHis("green", input.value, reasons.value, selectReason.value);

    renderHis(pay, currency);

    selectReason.value = "";
  }
}

function cashOut() {
  const money = Number(Number(input.value).toFixed(2));

  let bal = Number(load());

  if (money === 0) {
    alertChange("Please Add some amount !");
  } else if (money < 0) {
    alertChange("Please Enter only positive number");
  } else if (money > 100000) {
    alertChange("You have savings account which have 1 Lakh Limit!");
  } else if (money > 0 && money < 200001) {
    bal = bal - money;

    localStorage.setItem("balanceSave", JSON.stringify(bal));

    amount.innerHTML = currency(Number(load()));

    createHis("red", input.value, reasons.value, selectReason.value);

    renderHis(pay, currency);

    selectReason.value = "";
  }
}

deposit.addEventListener("click", () => {
  if (reasons.value === "") {
    alertChange(`

      Please choose a Reason before proceeding!

      `);
  } else {
    const money = Number(input.value);

    if (Number(Number(load()) + money) <= 1000000) {
      addMoney();

      input.value = "";
    } else {
      alertChange(
        `You have croosed the limit of Savings bank account!\nYou can still deposit ${currency(
          1000000 - Number(load()),
        )}`,
      );

      input.value = "";
    }
  }
});

withdraw.addEventListener("click", () => {
  if (reasons.value === "") {
    alertChange(`

      Please choose a Reason before proceeding!

      `);
  } else {
    const bal = Number(load());

    const money = Number(input.value);

    if (bal - money >= 0) {
      cashOut();

      input.value = "";
    } else if (bal === 0) {
      alertChange(`You don't have enough Balance!`);

      input.value = "";
    } else if (bal - money < 0) {
      alertChange(
        `You don't have enough Balance!\nYou can still withdraw ${currency(bal)}`,
      );

      input.value = "";
    }
  }
});

const resetDialogClose = document.querySelector(".reset-dialog-close");

const resetDialogNo = document.querySelector(".reset-dialog-no");

const resetDialogYes = document.querySelector(".reset-dialog-yes");

resetBtn.addEventListener("click", () => {
  resetDailog.classList.remove("hide");
});

resetDialogClose.addEventListener("click", () => {
  resetDailog.classList.add("hide");
});

resetDialogNo.addEventListener("click", () => {
  resetDailog.classList.add("hide");
});

resetDialogYes.addEventListener("click", () => {
  localStorage.removeItem("paymentsHis");

  localStorage.removeItem("balanceSave");

  amount.innerHTML = currency(load());

  pay.innerHTML = "";

  payments.length = 0;

  input.value = "";

  resetDailog.classList.add("hide");
});

pay.addEventListener("click", (e) => {
  if (e.target.classList.contains("history-expand")) {
    e.target.parentElement.classList.toggle("open");
    e.target.nextElementSibling.children[2].classList.add("hide");
  } else if (e.target.classList.contains("edit-transaction")) {
    if (
      e.target.parentElement.nextElementSibling.classList.contains(
        "edit-transaction-form",
      )
    ) {
      e.target.parentElement.nextElementSibling.classList.toggle("hide");
    }
  } else if (e.target.classList.contains("cancel-edit")) {
    e.target.parentElement.parentElement.classList.add("hide");
  } else if (e.target.classList.contains("delete-transaction")) {
    const traId =
      e.target.parentElement.parentElement.parentElement.dataset.transactionId;

    const extraBalance = Number(finderAmount(traId));
    console.log(extraBalance);
    let bal = load();
    bal = bal + extraBalance;
    localStorage.setItem("balanceSave", JSON.stringify(bal));
    amount.innerHTML = currency(Number(load()));

    e.target.parentElement.parentElement.parentElement.remove();

    deleteTrasnsaction(traId);
    renderHis(pay, currency);
  } else if (e.target.classList.contains("save-edit")) {
    const reason = e.target.parentElement.parentElement.children[0].value;
    const optional = e.target.parentElement.parentElement.children[1].value;
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement.dataset
        .transactionId;

    updateChanges(id, reason, optional);
    renderHis(pay, currency);
  }
});
