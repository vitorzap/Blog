const Constants = require('../../../app/constants');
const GenericRepository = require('./genericRepository'); 
const Item = require('../../../app/models/postgres/Item');
const Autor = require('../../../app/models/postgres/Autor');
const Categoria= require('../../../app/models/postgres/Categoria');

class ItemRepository extends GenericRepository{

  async paginatedList(options = {page: 1}) {
    const includeAutor = 
    { model: Autor, as: 'autor',attributes: ['name'] };
    const includeCategoria = 
    { model: Categoria, as: 'categoria' ,attributes: ['descricao'] };
    let espec = { include: [includeAutor, includeCategoria] };
    let resultList;
    if (options.attributes) espec['attributes'] = options.attributes; 
    if (options.where) espec['where'] = options.where; 
    if (options.order)  {
      var orderEspec = options.order;
      for( let i=0;i<orderEspec.length;i++) {
        if (orderEspec[i] == "autor.name") {
          orderEspec[i] = [includeAutor, 'name', 'ASC']
        }
        if (orderEspec[i] == "categoria.descricao") {
          orderEspec[i] = [includeCategoria, 'descricao', 'ASC']
        }
      }
      espec['order'] = orderEspec; 
    }
    if (options.condition) espec['where'] = options.condition;
    
    resultList = await this._entity.findAndCountAll({
      ...espec,
      limit: Constants.ROWS_PER_PAGE,
      offset: (options.page - 1) * Constants.ROWS_PER_PAGE
    });
    resultList.perpage = Constants.ROWS_PER_PAGE;
    return resultList;
  }

  async list(options = {}) {
    let espec = {
      include: [
        { model: Autor, as: 'autor',attributes: ['name'] }, 
        { model: Categoria, as: 'categoria',attributes: ['descricao'] }
      ]
    };
    if (options.attributes) espec['attributes'] = options.attributes; 
    if (options.order) espec['order'] = options.order; 
    return await this._entity.findAll(espec);
  }

  async findById(id) {
    const { 
      titulo, 
      descricao, 
      autor_id, 
      categoria_id, 
      autor: { name: autor },
      categoria: { descricao: categoria} 
    } = await this._entity.findByPk(id,{ include: [
        { model: Autor, as: 'autor',attributes: ['name'] }, 
        { model: Categoria, as: 'categoria',attributes: ['descricao'] }
      ]     
    });
    return { 
      id,
      titulo, 
      descricao, 
      autor_id, 
      autor, 
      categoria_id, 
      categoria 
    };
  }

  async findOne(condition) {
    const { 
      titulo, 
      descricao, 
      autor_id, 
      categoria_id, 
      autor: { name: autor },
      categoria: { descricao: categoria} 
    } = await this._entity.findOne({ 
      where: condition,
      include: [
        { model: Autor, as: 'autor',attributes: ['name'] }, 
        { model: Categoria, as: 'categoria',attributes: ['descricao'] }
      ]     
    });
    return { 
      id,
      titulo, 
      descricao, 
      autor_id, 
      autor, 
      categoria_id, 
      categoria 
    };
  }


}
module.exports = new ItemRepository(Item);