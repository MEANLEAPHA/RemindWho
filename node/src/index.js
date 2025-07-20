// Import Express & Middleware
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const { ToDo } = require('./router/toDo');

// Initialize Routes
ToDo(app);

// Start Server
const port = 3000;
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
