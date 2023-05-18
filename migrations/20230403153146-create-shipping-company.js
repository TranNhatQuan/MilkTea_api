'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Shipping_companies', {
      idShipping_company: {
        allowNull: false,
        
        primaryKey: true,
        
        type: Sequelize.INTEGER
      },
      
      costPerKm: {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Shipping_companies');
  }
};