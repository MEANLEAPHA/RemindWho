// Import Express & Middleware
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Handle root path and send index.html
app.get('/', (req, res) => {
    console.log("📥 GET / request received");
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Import Routes
try {
    const { ToDo } = require('./router/toDo');
    console.log("✅ Routes imported successfully");
    // Initialize Routes
    ToDo(app);
    console.log("✅ ToDo routes initialized");
} catch (err) {
    console.error("❌ Error importing routes:", err.message);
}

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if (err) {
        console.error("❌ Server failed to start:", err);
    } else {
        console.log(`🚀 Server running at http://localhost:${port}`);
    }
});

// Catch unhandled errors
process.on('uncaughtException', (err) => {
    console.error("❌ Uncaught Exception:", err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error("❌ Unhandled Rejection:", reason);
});
