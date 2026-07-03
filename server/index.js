require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))

const connection = require('./db')
connection()

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const laptopRoutes = require("./routes/laptops"); 
const orderRoutes = require("./routes/orders");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/laptops", laptopRoutes); 
app.use("/api/orders", orderRoutes);
