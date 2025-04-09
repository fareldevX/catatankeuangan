require('dotenv').config();

const port = process.env.PORT || 3000;
const db = process.env.MONGO_URI;
const secret = process.env.JWT_SECRET;

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

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