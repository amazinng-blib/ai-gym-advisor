/**
 * Model Associations
 * Set up Sequelize relationships between models
 * Senior dev practice: Centralized association configuration
 *
 * This should be imported AFTER all models are initialized
 * but BEFORE database sync or query operations
 */

import UserModel from './user_models';
import ProfileModel from './profile_model';

/**
 * User -> Profile Association
 * One user can have many profiles
 */
UserModel.hasMany(ProfileModel, {
  foreignKey: 'userId',
  as: 'profiles',
  onDelete: 'CASCADE', // Delete profiles when user is deleted
  onUpdate: 'CASCADE',
});

/**
 * Profile -> User Association
 * Each profile belongs to one user
 */
ProfileModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user',
  targetKey: 'id',
});

/**
 * Export for initialization
 * Usage in server.ts:
 * import './models/associations';
 */
export { UserModel, ProfileModel };
