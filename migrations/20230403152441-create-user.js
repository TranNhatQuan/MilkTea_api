'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      idUser: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      
      
      idAcc: {
        allowNull: false,
        unique:true,
        references: { model: "Accounts", key: "idAcc" },
        type: Sequelize.INTEGER
      },
      isShare: {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};