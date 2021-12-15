const { Router } = require('express');
const AutorController = require('./app/controllers/AutorController');
const CategoriaController = require('./app/controllers/CategoriaController');



const routes = new Router();

routes.get('/ping', function(req, res) {
  return res.json({
    Hello: {
      id: 'Blog',
      msg: 'Ready to work'
    }
  })
});

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

module.exports = routes;