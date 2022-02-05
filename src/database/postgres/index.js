const Sequelize = require('sequelize');

const Autor = require('../../app/models/postgres/Autor');
const Categoria = require('../../app/models/postgres/Categoria');
const Item = require('../../app/models/postgres/Item');

const { config: dbConfig } = require('../../config/postgres');

const models = [Autor, Categoria, Item];

class MainDatabase {
  constructor() {
    this.init();
  }

  async init() {
    console.log('Conectando a database POSTGRES');
    console.log(process.env.DATABASE_URL);
    this.connection = new Sequelize(process.env.DATABASE_URL, dbConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));

    try {
      await this.connection.authenticate();
      console.log('Conectado ao database POSTGRES com sucesso !!!');
    } catch (error) {
      console.log('Conexão a database falhou ???', error);
    }
  }
}

module.exports = new MainDatabase();
