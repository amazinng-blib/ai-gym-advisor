import { DataTypes, Model, Optional } from 'sequelize';
import { UserType } from './types';
import { sequelize } from '../config/database';

interface UserAttriutes extends Optional<UserType, 'id'> {}

class UserModel extends Model<UserType, UserAttriutes> implements UserType {
  public id?: string;
  public email!: string;
  public name!: string;
  public password!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'UserModel',
    tableName: 'users',
    underscored: true,
    timestamps: false,
  },
);

export default UserModel;
