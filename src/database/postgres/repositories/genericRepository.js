const Constants = require('../../../app/constants');
const IRepository = require('../../../database/Interface/iRepository');
class GenericRepository extends IRepository{
  constructor(entity) {
    super();
    this._entity = entity;
  }
  async list(options = {}) {
    let espec = {};
    if (options.attributes) espec['attributes'] = options.attributes; 
    if (options.order) espec['order'] = options.order; 
    return await this._entity.findAll(espec);
  }
  // async paginatedList(fields, order = ['id'], page = 1) {
  async paginatedList(options = {page: 1}) {
    let resultList;
    let espec = {};
    if (options.attributes) espec['attributes'] = options.attributes; 
    if (options.order) espec['order'] = options.order; 
    resultList = await this._entity.findAndCountAll({
      ...espec,
      limit: Constants.ROWS_PER_PAGE,
      offset: (options.page - 1) * Constants.ROWS_PER_PAGE
    });
    resultList.perpage = Constants.ROWS_PER_PAGE;
    return resultList;
  }
  async create(item) {
    return await this._entity.create(item);
  }
  async findById(id) {
    return await this._entity.findByPk(id);
  }
  async findOne(condition) {
    return await this._entity.findOne({ where: condition });
  }
  async update(id, item) {
    const [count,updatedItem] = 
      await this._entity.update(item, { where: { id }, returning: true });
    return updatedItem[0];
  }
  async delete(id) {
    return await this._entity.destroy({ where: { id } });
  }
}

module.exports = GenericRepository;
