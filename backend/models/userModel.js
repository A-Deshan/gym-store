import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define("User", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
});

// Associations (keep these)
User.associate = (models) => {
  User.hasMany(models.Cart, { foreignKey: 'userId' });
  User.hasMany(models.Order, { foreignKey: 'userId' });
};

export default User;