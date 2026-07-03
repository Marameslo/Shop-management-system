const router = require("express").Router();
const Order = require("../models/order");

router.get("/", async (req, res) => {
    try {
        const orders = await Order.find().populate("laptop");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const newOrder = await new Order({ ...req.body }).save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});

module.exports = router;