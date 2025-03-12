// db.js
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const BarberSchema = new mongoose.Schema({
  nome: String,
  sobrenome: String,
  telefone: String,
  email: String,
  senha: String,
});

const Barber = mongoose.model("barbearia", BarberSchema);

module.exports = { Barber };
