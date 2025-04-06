const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://mobillamborghini9999:farelaja@cluster0.enkkoof.mongodb.net/moneytracker?retryWrites=true&w=majority&appName=Cluster0');

// Schema
const Transaction = mongoose.model('Transaction', {
  desc: String,
  amount: Number,
  type: String,
  createdAt: { type: Date, default: Date.now }
});

// GET semua transaksi
app.get('/transactions', async (req, res) => {
  const data = await Transaction.find().sort({ createdAt: -1 });
  res.json(data);
});

// POST transaksi baru
app.post('/transactions', async (req, res) => {
  const trx = new Transaction(req.body);
  await trx.save();
  res.json({ message: "Transaksi disimpan", data: trx });
});

// DELETE transaksi
app.delete('/transactions/:id', async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Transaksi dihapus" });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => console.log("Server berjalan di port 3000"));