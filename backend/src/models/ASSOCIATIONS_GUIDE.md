/\*\*

- Model Associations Reference Guide
- Senior Dev Pattern: Proper Sequelize Relationships
-
- All associations are centralized in models/associations.ts
- This enables:
- - One-to-many relationship (User -> Profiles)
- - Many-to-one relationship (Profile -> User)
- - Eager loading with include
- - Lazy loading via helper methods
- - Cascade operations (delete user = delete profiles)
    \*/

/\*\*

- EAGER LOADING EXAMPLES
- Load related data in a single query using 'include'
  \*/

import UserModel from '../models/user_models';
import ProfileModel from '../models/profile_model';

// Get user with all their profiles
const userWithProfiles = await UserModel.findByPk(userId, {
include: [
{
association: 'profiles',
model: ProfileModel,
},
],
});

// Get profile with its associated user
const profileWithUser = await ProfileModel.findByPk(profileId, {
include: [
{
association: 'user',
model: UserModel,
},
],
});

// Access the data
console.log(userWithProfiles.profiles); // ProfileModel[]
console.log(profileWithUser.user); // UserModel

/\*\*

- LAZY LOADING EXAMPLES
- Load related data after fetching the main record
  \*/

// Get user first
const user = await UserModel.findByPk(userId);

// Then load their profiles on demand
if (user && user.getProfiles) {
const userProfiles = await user.getProfiles();
console.log(userProfiles); // ProfileModel[]
}

// Get profile first
const profile = await ProfileModel.findByPk(profileId);

// Then load the user on demand
if (profile && profile.getUser) {
const profileUser = await profile.getUser();
console.log(profileUser); // UserModel
}

/\*\*

- CASCADE DELETE
- When a user is deleted, all their profiles are automatically deleted
  \*/
  await UserModel.destroy({
  where: { id: userId },
  // This automatically deletes all associated profiles
  });

/\*\*

- FILTERING WITH ASSOCIATIONS
- Get users who have profiles
  \*/
  const usersWithProfiles = await UserModel.findAll({
  include: [
  {
  association: 'profiles',
  model: ProfileModel,
  required: true, // INNER JOIN - only users with profiles
  },
  ],
  });

/\*\*

- PAGINATION WITH ASSOCIATIONS
- Get profiles with their users, paginated
  \*/
  const { rows, count } = await ProfileModel.findAndCountAll({
  include: [
  {
  association: 'user',
  model: UserModel,
  },
  ],
  limit: 10,
  offset: 0,
  order: [['created_at', 'DESC']],
  });

/\*\*

- SENIOR DEV BEST PRACTICES
-
- ✓ Centralized associations (models/associations.ts)
- ✓ Bidirectional relationships (hasMany + belongsTo)
- ✓ Cascade operations configured (onDelete, onUpdate)
- ✓ Type hints for association properties
- ✓ Proper aliases ('profiles', 'user')
- ✓ Lazy loading helpers (getUser, getProfiles)
- ✓ Eager loading with include
- ✓ Foreign key consistency (userId in both files)
- ✓ Database constraints (references, allowNull: false)
- ✓ Migration support (add_user_id_to_profiles.js)
  \*/
