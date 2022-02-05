// import Sequelize, { Model } from 'sequelize';
const Sequelize = require('sequelize');
const { Model } = require('sequelize');

class Item extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: Sequelize.STRING,
        descricao: Sequelize.TEXT,
        autor_id: Sequelize.INTEGER,
        categoria_id: Sequelize.INTEGER
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Autor, { foreignKey: 'autor_id', as: 'autor' });
    this.belongsTo(models.Categoria, {
      foreignKey: 'categoria_id',
      as: 'categoria'
    });
  }
}

module.exports = Item;
