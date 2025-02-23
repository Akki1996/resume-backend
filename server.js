const express = require('express')
const mongoose = require('mongoose')
const path = require('path');
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
require('dotenv').config

const app = express()
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors({
    origin: '*' 
}));
const PORT =process.env.PORT || 3000;

mongoose.connect("mongodb+srv://akstrehan:gYFwCSN8YFs7KnOY@resumecluster.gqiok.mongodb.net/").then(()=>console.log("MongoDb connected"))
.catch(err => console.log(err))

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});