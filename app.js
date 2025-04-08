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
    btn.onclick = async () => {
      await deleteTransaction(trx._id); // gunakan _id dari MongoDB
      transactions = await getTransactions(); // refresh data
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

async function deleteTransaction(id) {
  try {
    await fetch(`http://localhost:3000/transactions/${id}`, {
      method: "DELETE"
    });
  } catch (err) {
    console.error("Gagal hapus data:", err);
  }
}

// Tampilkan data dari backend saat halaman dimuat
window.addEventListener("DOMContentLoaded", async () => {
  transactions = await getTransactions();
  renderTransactions();
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const transaction = {
    desc: descInput.value,
    amount: parseFloat(amountInput.value),
    type: typeInput.value
  };

  await addTransaction(transaction); // kirim ke backend
  transactions = await getTransactions(); // ambil data terbaru
  renderTransactions(); // render ulang
  form.reset();
});

async function getTransactions() {
  try {
    const res = await fetch("http://localhost:3000/transactions");
    const data = await res.json();
    return data; // kembalikan data agar bisa disimpan ke transactions
  } catch (err) {
    console.error("Gagal ambil data:", err);
    return [];
  }
}

async function addTransaction(trx) {
  try {
    const res = await fetch("http://localhost:3000/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trx)
    });
    return await res.json();
  } catch (err) {
    console.error("Gagal tambah data:", err);
  }
}