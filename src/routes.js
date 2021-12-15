const { Router } = require('express');
const AutorController = require('./app/controllers/AutorController');



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

module.exports = routes;