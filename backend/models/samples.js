import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SamplesModel = sequelize.define('Sample', {
  _id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'samples',
});

export default SamplesModel;
