// server.js - Cập nhật để tích hợp Socket.IO
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const setupSocketHandlers = require('./src/socket/socketHandlers');

const PORT = process.env.PORT || 5000;

// Tạo HTTP server và Socket.IO
const server = http.createServer(app);

// Xử lý danh sách FRONTEND_URLS trong .env
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map(url => url.trim())
  : [process.env.FRONTEND_URL || "http://localhost:5173"];

// Cấu hình Socket.IO
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Setup Socket.IO handlers
const socketManager = setupSocketHandlers(io);
console.log('✅ SocketManager created:', !!socketManager);

// Thêm socketManager vào app để sử dụng trong routes
app.set('socketManager', socketManager);
console.log('✅ SocketManager set to app');

// Middleware để inject socketManager vào req
app.use((req, res, next) => {
  req.socketManager = app.get('socketManager');
  next();
});

// Kết nối database
connectDB();

// Khởi động server với Socket.IO
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO server is ready`);
  console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
});
