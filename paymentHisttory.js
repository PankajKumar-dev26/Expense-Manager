export let payments = JSON.parse(localStorage.getItem("paymentsHis")) || [];

function dateCalc() {
  const date = new Date();

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function timeCalc() {
  const time = new Date();

  return time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function renderHis(pay, formatter) {
  pay.innerHTML = "";

  let html = "";
  if (!payments) {
    html = "";
  } else {
    payments.forEach((paymentValue) => {
      html += `
  <li class="${paymentValue.color}" data-transaction-id="${paymentValue.id}">

  <span>${paymentValue.sign} ${formatter(Number(paymentValue.money))}</span>

  <button class="history-expand">+</button>

  <div class="transaction-details">

    <div class="transaction-info">
      Transaction ID: ${paymentValue.id}<br/>
      Date: ${paymentValue.date}<br/>
      Time: ${paymentValue.time}<br/>
      Reason: ${paymentValue.reason}<br/>
      Note: ${paymentValue.optional}
    </div>

    <div class="transaction-actions">
      <button class="edit-transaction">Edit</button>
      <button class="delete-transaction">Delete</button>
    </div>

    <div class="edit-transaction-form hide">

      <input
        type="text"
        class="edit-reason"
        placeholder="Reason"
        maxlength="8"
      />

      <input
        type="text"
        class="edit-optional"
        placeholder="Optional note"
        maxlength="30"
      />

      <div class="edit-form-actions">
        <button class="save-edit">Save</button>
        <button class="cancel-edit">Cancel</button>
      </div>

    </div>
  </div>
</li>`;
    });
  }
  pay.innerHTML = html;
}

export function createHis(color, money, reason, optional) {
  const finalOption = optional || "Not Mentioned";
  const transactionId = crypto.randomUUID();

  let sign = undefined;

  if (color === "green") {
    sign = `+`;
  } else if (color === "red") {
    sign = `-`;
  }

  payments.unshift({
    id: transactionId,
    color: color,
    sign: sign,
    date: dateCalc(),
    time: timeCalc(),
    money: Number(money),
    reason: reason,
    optional: finalOption,
  });
  localStorage.setItem("paymentsHis", JSON.stringify(payments));
}

export function finderAmount(id) {
  let matching;
  let realSign = "";

  payments.forEach((transaction) => {
    if (transaction.id === id) {
      matching = transaction;
    }
  });

  if (matching.sign === `+`) {
    realSign = `-`;
  } else if (matching.sign === `-`) {
    realSign = `+`;
  }

  return `${realSign}${Number(matching.money).toFixed(2)}`;
}

export function deleteTrasnsaction(id) {
  const newArray = payments.filter((transaction) => transaction.id !== id);

  payments = newArray;
  localStorage.setItem("paymentsHis", JSON.stringify(payments));
}

export function updateChanges(id, reason, optional) {
  let matching;

  payments.forEach((transaction) => {
    if (transaction.id === id) {
      matching = transaction;
      matching.reason = reason;
      matching.optional = optional;
    }

    localStorage.setItem("paymentsHis", JSON.stringify(payments));
  });
}
