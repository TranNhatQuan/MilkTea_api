'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Cart.belongsTo(models.Shipping_company, {
        foreignKey: "idShipping_company",
      })
      Cart.belongsTo(models.User, {
        foreignKey: "idUser",
      })
      Cart.hasMany(models.Cart_product, {
        foreignKey: "idCart",
      });
    }
  }
  Cart.init({
    idCart: {
      allowNull: false,

      primaryKey: true,
      type: DataTypes.INTEGER
    },
    shippingFee: {
      allowNull: false,

      type: DataTypes.INTEGER,
    },
    totalCartAmount: {
      allowNull: false,

      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }

  }, {
    sequelize,
    modelName: 'Cart',
    timestamps: false,
  });
  return Cart;
};