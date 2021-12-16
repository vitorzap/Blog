const Sequelize = require('sequelize');
const { Model } = require('sequelize');

class Categoria extends Model {
  static init(sequelize) {
    super.init(
      {
        descricao: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  // static associate(models) {
  //   this.hasMany(models.Item, { as: 'categoriaItems' });
  // }

}

module.exports = Categoria;