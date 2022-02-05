const GenericRepository = require('./genericRepository'); 
const Autor = require('../../../app/models/postgres/Autor');

class AutorRepository extends GenericRepository{

}
module.exports = new AutorRepository(Autor);