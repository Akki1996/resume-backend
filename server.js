const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
require('dotenv').config

const app = express()
app.use(express.json());
const PORT =process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/resume").then(()=>console.log("MongoDb connected"))
.catch(err => console.log(err))

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});