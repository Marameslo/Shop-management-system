const router = require("express").Router();
const Laptop = require("../models/laptop");

router.get("/", async (req, res) => {
    try {
        const laptops = await Laptop.find();
        res.status(200).json(laptops);
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const newLaptop = await new Laptop({ ...req.body }).save();
        res.status(201).json(newLaptop);
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedLaptop = await Laptop.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedLaptop);
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Laptop.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Laptop deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});

module.exports = router;