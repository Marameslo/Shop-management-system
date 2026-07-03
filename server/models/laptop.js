const mongoose = require("mongoose");

const laptopSchema = new mongoose.Schema({
    producer: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    ram: { type: Number, required: true },
    storage: { type: Number, required: true }
});

module.exports = mongoose.model("Laptop", laptopSchema);