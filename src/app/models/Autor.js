const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class Autor extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        is_root: Sequelize.BOOLEAN
      },
      { sequelize }
    );

    this.addHook('beforeSave', async autor => {
      if (autor.password) {
        autor.password_hash = await bcrypt.hash(autor.password, 8);
      }
    });


    return this;
  }

  static associate(models) {
    this.hasMany(models.Item, { as: 'autorItems' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = Autor;