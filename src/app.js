// LOAD ENVIROMENT VARIABLES
import * as dotenv from 'dotenv';
dotenv.config();

// Dependencies
import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import { createServer } from 'http';
import { Server } from 'socket.io';
import session from 'express-session';

// Import Routes
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import viewRoutes from './routes/viewRoutes.js';

// SET DIRNAME
import path from 'path';
import __dirname from './utils.js';

// DB CONNECTION
import dbConnection from './dao/db/db.js';
dbConnection();

// Import MODELS
import * as ProductModel from './dao/filesystem/models/ProductModel.js';

// =====================================================
// Start App
// =====================================================
const app = express();
const server = createServer(app);
const io = new Server(server);

// Settings
app.set('view engine', 'ejs');
app.set('layout extractScripts', true);
app.set('views', path.resolve(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressEjsLayouts);
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(
  session({
    secret: 'sesionSecret@',
    resave: true,
    saveUninitialized: true,
  })
);

// Declare Routing
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', viewRoutes);

// Handle 404 ERROR
app.use('*', (req, res) => {
  const opts = {
    pageTitle: 'ERROR 404 PAGE NOT FOUND',
  };
  return res.status(404).render('404', opts);
});

// Launch Server
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server ready on port: ${port}...`));

// Launch Websocket Actions
io.on('connection', async (socket) => {
  console.log('CLIENTE CONECTADO');
  console.log(socket.id);
  console.log('================================');
  const listaProductosDB = await ProductModel.getProducts();
  let productos = listaProductosDB.payload;

  socket.emit('server:initialProducts', productos);

  socket.on('client:idProductoaBorrar', (data) => {
    productos = productos.filter((p) => p.id !== parseInt(data));
    socket.emit('server:productoBorrado', productos);
  });

  socket.on('client:newproduct', (data) => {
    const productID = productos.length + 1;
    const newProduct = { id: productID, ...data };
    productos.push(newProduct);
    socket.emit('server:newProductAdded', productos);
  });
});
