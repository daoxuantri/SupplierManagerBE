const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const dbConfig = require('./config/db');
// const auth = require('./middlewares/auth');
// const { unless } = require('express-unless');
const middleware = require('./middlewares/error');

dotenv.config();

const app = express();

// CORS setup
app.use(
    cors({
        credentials: true,
        origin: true,
    }),
);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database Connected");
    })
    .catch((error) => {
        console.error("Database can't be connected: " + error);
    });

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
// app.use("/users", require("./routes/users.routes"));
app.use("/products", require("./routes/products.routes"));
app.use("/categories", require("./routes/categories.routes"));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send({
        success: false,
        message: err.message
    });
});

// Đọc SSL certificate và key
// const sslOptions = {
//     key: fs.readFileSync('./ssl/private.key'),         // chỉnh lại đường dẫn nếu cần
//     cert: fs.readFileSync('./ssl/certificate.crt'),
// };

// Tạo HTTPS server
const PORT = process.env.PORT || 4000;
// https.createServer(sslOptions, app).listen(PORT, () => {
//     console.log(`🚀 HTTPS Server running on port ${PORT}`);
// });

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});