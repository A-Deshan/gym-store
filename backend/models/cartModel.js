import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./userModel.js"; 
import Product from "./productModel.js"; 

const Cart = sequelize.define("Cart", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'Users', 
      key: 'id'
    }
  },
  productId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'Products', 
      key: 'id'
    }
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1 
  },
});

// Associations
Cart.associate = (models) => {
  Cart.belongsTo(models.User, { foreignKey: 'userId' });
  Cart.belongsTo(models.Product, { foreignKey: 'productId' });
};

export default Cart;