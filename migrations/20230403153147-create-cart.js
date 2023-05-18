'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      idCart: {
        allowNull: false,
        
        primaryKey: true,
        
        type: Sequelize.INTEGER
      },
      idUser: {
        allowNull: false,
        
        
        references: { model: "Users", key: "idUser" },
        type: Sequelize.INTEGER
      },
      
      shippingCompany: {
        allowNull: false,
        references: { model: "Shipping_companies", key: "idShipping_company" },
        type: Sequelize.INTEGER,
      },
      shippingFee: {
        allowNull: false,
        
        type: Sequelize.INTEGER,
      },
      totalCartAmount: {
        allowNull: false,
        
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Carts');
  }
};