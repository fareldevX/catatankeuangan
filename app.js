const form = document.getElementById("transaction-form");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const list = document.getElementById("transaction-list");
const incomeEl = document.getElementById("total-income");
const expenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");

let transactions = [];

// === 1. Ambil data dari localStorage saat halaman dimuat ===
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("transactions");
  if (saved) {
    transactions = JSON.parse(saved);
    renderTransactions();
  }
});

// === 2. Simpan data ke localStorage ===
function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// === 3. Menambahkan transaksi baru ===
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    desc: descInput.value,
    amount: parseFloat(amountInput.value),
    type: typeInput.value
  };

  transactions.push(transaction);
  saveToLocalStorage();
  renderTransactions();
  form.reset();
});

// === 4. Tampilkan transaksi ke layar ===
function renderTransactions() {
  list.innerHTML = "";
  let income = 0;
  let expense = 0;

  transactions.forEach(trx => {
    const li = document.createElement("li");
    li.textContent = `${trx.desc} - Rp ${trx.amount}`;
    li.className = trx.type === "income" ? "income" : "expense";

    const btn = document.createElement("button");
    btn.textContent = "Hapus";
    btn.onclick = () => {
      transactions = transactions.filter(t => t.id !== trx.id);
      saveToLocalStorage();
      renderTransactions();
    };

    li.appendChild(btn);
    list.appendChild(li);

    if (trx.type === "income") {
      income += trx.amount;
    } else {
      expense += trx.amount;
    }
  });

  incomeEl.textContent = income;
  expenseEl.textContent = expense;
  balanceEl.textContent = income - expense;
}

async function getTransactions() {
  const res = await fetch("http://localhost:3000/transactions");
  const data = await res.json();
  console.log(data);
}

async function addTransaction(trx) {
  await fetch("http://localhost:3000/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trx)
  });
}