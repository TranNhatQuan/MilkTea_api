'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Imports', {
      idIngredient_shop: {
        allowNull: false,
        
        primaryKey: true,
        references: { model: "Ingredient_shops", key: "idIngredient_shop" },
        
        type: Sequelize.STRING
      },
      
      date: {
        type: Sequelize.DATEONLY,
        primaryKey: true,
        allowNull: false,
      },
      price:{
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Imports');
  }
};