require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');
const { ExpressPeerServer } = require('peer');
const path = require('path');
const morgan = require('morgan');
const colors = require('colors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Socket
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  SocketServer(socket);
});

// Create peer server
ExpressPeerServer(http, { path: '/' });

// Routes
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/categoryRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));

const URI = process.env.MONGO_URL;

const connectDb = async () => {
  try {
    const db = await mongoose.connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${db.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};
connectDb();

const PORT = process.env.PORT || 5000;

http.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
