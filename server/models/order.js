const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerSurname: { type: String, required: true },
    customerEmail: { type: String, required: true },
    laptop: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Laptop",
        required: true 
    },
    quantity: { type: Number, default: 1 },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;