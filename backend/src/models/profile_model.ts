import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import type UserModel from './user_models';
import { ProfileType } from '../types';

interface ProfileAttributes extends Optional<ProfileType, 'id'> {}

class ProfileModel
  extends Model<ProfileType, ProfileAttributes>
  implements ProfileType
{
  public id?: string;
  public userId!: string;
  public goal!: string;
  public experience!: string;
  public days_per_week!: string;
  public session_length!: string;
  public equipment!: string;
  public injuries!: string;
  public preferred_split!: string;

  // Association properties (will be available after association setup)
  public user?: typeof UserModel; // User this profile belongs to
  public getUser?: () => Promise<typeof UserModel>; // Lazy load user
}

ProfileModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    goal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    days_per_week: { type: DataTypes.STRING, allowNull: false },
    session_length: { type: DataTypes.STRING, allowNull: false },
    equipment: { type: DataTypes.STRING, allowNull: false },
    injuries: { type: DataTypes.STRING, allowNull: true },
    preferred_split: { type: DataTypes.STRING, allowNull: false },
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
    modelName: 'ProfileModel',
    tableName: 'profiles',
    underscored: true,
    timestamps: false,
  },
);

export default ProfileModel;
