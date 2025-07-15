import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class SavedPin extends Model {}

SavedPin.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pinId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'SavedPin',
});

export default SavedPin;
