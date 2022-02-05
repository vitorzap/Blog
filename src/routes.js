const { Router } = require('express');
const SessionController = require('./app/controllers/SessionController');
const AutorController = require('./app/controllers/AutorController');
const CategoriaController = require('./app/controllers/CategoriaController');
const ItemController = require('./app/controllers/ItemController');
const { auth } = require("./app/middleware/auth");



const routes = new Router();

routes.get('/ping', function(req, res) {
  return res.json({
    Hello: {
      id: 'Blog',
      msg: 'Ready to work'
    }
  })
});
// Login
routes.post('/login', SessionController.login);

// Verifica autenticacáo
//routes.use(auth);

// Logout
routes.get('/logout', SessionController.logout);

// Autores
routes.get('/autor', AutorController.index);
routes.get('/listautor', AutorController.listautores);
routes.get('/autor/:id', AutorController.getOne);
routes.post('/autor', AutorController.store);
routes.put('/autor/:id', AutorController.update);
routes.delete('/autor/:id', AutorController.delete);

// Categorias
routes.get('/categoria', CategoriaController.index);
routes.get('/listcategoria', CategoriaController.listcategorias);
routes.get('/categoria/:id', CategoriaController.getOne);
routes.post('/categoria', CategoriaController.store);
routes.put('/categoria/:id', CategoriaController.update);
routes.delete('/categoria/:id', CategoriaController.delete);

//Items
routes.get('/item', ItemController.index);
routes.get('/item/:id', ItemController.getOne);
routes.post('/item', ItemController.store);
routes.put('/item/:id', ItemController.update);
routes.delete('/item/:id', ItemController.delete);

module.exports = routes;