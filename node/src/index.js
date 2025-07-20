// Import Express & Middleware
const express = require('express');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Handle root path and send index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Import Routes
const { ToDo } = require('./router/toDo');

// Initialize Routes
ToDo(app);

// Start Server
const port = 3000;
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
