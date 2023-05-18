'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cart_products', {
      idProduct: {
        allowNull: false,
        
        primaryKey: true,
        references: { model: "Products", key: "idProduct" },
        
        type: Sequelize.INTEGER
      },
      idCart: {
        allowNull: false,
        
        primaryKey: true,
        references: { model: "Carts", key: "idCart" },
        type: Sequelize.INTEGER
      },
      
      
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cart_products');
  }
};