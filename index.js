const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Kết nối MongoDB với cổng 27019
const MONGO_URI = 'mongodb://localhost:27019/mydatabase';
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((error) => console.error('MongoDB connection error:', error));

// Định nghĩa Model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Định nghĩa các route
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password });

    try {
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Cấu hình cổng và khởi động server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
