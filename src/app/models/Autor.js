const Sequelize = require('sequelize');
const { Model } = require('sequelize');

class Autor extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  // static associate(models) {
  //   this.hasMany(models.Item, { as: 'items' });
  // }
}

module.exports = Autor;