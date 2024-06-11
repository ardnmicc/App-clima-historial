const mongoose = require("mongoose");
const ClimaSchema = new mongoose.Schema({
  ciudad: String,
  clima: Object,
  fecha: { type: Date, default: Date.now },
});
module.exports = mongoose.model("historial_ciudades", ClimaSchema);
