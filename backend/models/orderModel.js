import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Order = sequelize.define("Order", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'Users', // Ensure this matches your User model/table name
      key: 'id'
    }
  },
  items: { 
    type: DataTypes.JSON, 
    allowNull: false 
  },
  amount: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  address: { 
    type: DataTypes.JSON, 
    allowNull: false 
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Processing",
    validate: {
      isIn: [["Processing", "Shipped", "Delivered"]],
    },
  },
  date: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  payment: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
});

export default Order;
