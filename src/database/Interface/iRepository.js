class NotImplementedException extends Error {
  constructor() {
    super('Not Implemented Database Exception');
  }
}
//interface
class IRepository {
  async list(fields,order) {
    throw new NotImplementedException();
  }
  async create(item) {
    throw new NotImplementedException();
  }
  async findById(condition) {
    throw new NotImplementedException();
  }
  async findOne(condition) {
    throw new NotImplementedException();
  }
  async update(id, item) {
    throw new NotImplementedException();
  }
  async delete(id) {
    throw new NotImplementedException();
  }
}

module.exports = IRepository;
