'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ingredient_shops', {
      idIngredient_shop: {
        allowNull: false,
        
        primaryKey: true,
    
        type: Sequelize.STRING
      },
      idIngredient: {
        allowNull: false,
        
       
        references: { model: "Ingredients", key: "idIngredient" },
        
        type: Sequelize.INTEGER
      },
      idShop: {
        allowNull: false,
        
        
        references: { model: "Shops", key: "idShop" },
        type: Sequelize.INTEGER
      },
      
      
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ingredient_shops');
  }
};