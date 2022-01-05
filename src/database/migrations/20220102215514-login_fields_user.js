'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Autor', 'password_hash',
        {
          type: Sequelize.STRING,
          allowNull: true
        },
      ),
      queryInterface.addColumn('Autor', 'is_root',     
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: true
        },
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Autor','password_hash'),
      queryInterface.removeColumn('Autor','is_root')
    ]);
  },
};
