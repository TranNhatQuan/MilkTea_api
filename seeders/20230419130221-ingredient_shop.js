'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Ingredient_shops", [
      {
        idIngredient_shop:'1,1',
        idIngredient:1,
        idShop:1,
        quantity:1
      },
      
      {
        idIngredient_shop:'2,1',
        idIngredient:1,
        idShop:1,
        quantity:1
      },
      {
        idIngredient_shop:'3,1',
        idIngredient:1,
        idShop:1,
        quantity:1
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
