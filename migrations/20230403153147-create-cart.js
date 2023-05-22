'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      idCart: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idProduct: {
        allowNull: false,
        
        
        references: { model: "Products", key: "idProduct" },
        
        type: Sequelize.STRING
      },
      idUser: {
        allowNull: false,
        
        
        references: { model: "Users", key: "idUser" },
        type: Sequelize.INTEGER
      },
      
      
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Carts');
  }
};