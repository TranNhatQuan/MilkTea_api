'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Exports', {
      idIngredient_shop: {
        allowNull: false,
        
        primaryKey: true,
        references: { model: "Ingredient_shops", key: "idIngredient_shop" },
        
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY,
        primaryKey: true,
        allowNull: false,
      },
      info:{
        allowNull:false,
        type: Sequelize.STRING,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Exports');
  }
};