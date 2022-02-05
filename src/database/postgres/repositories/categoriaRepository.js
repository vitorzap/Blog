const GenericRepository = require('./genericRepository'); 
const Categoria = require('../../../app/models/postgres/Categoria');

class CategoriaRepository extends GenericRepository{

}
module.exports = new CategoriaRepository(Categoria);