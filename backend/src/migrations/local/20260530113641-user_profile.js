'use strict';

/**
 * @type {import('sequelize-cli').Migration}
 * @description Creates the user_profiles table with fitness profile information
 *
 * Schema:
 * - id: UUID primary key for profile identification
 * - user_id: Foreign key reference to users table (one-to-one relationship)
 * - goal: User's fitness goal (e.g., muscle gain, fat loss, endurance)
 * - experience: User's experience level (beginner, intermediate, advanced)
 * - days_per_week: Number of days available for training per week
 * - session_length: Preferred workout session duration
 * - equipment: Available equipment for training
 * - injuries: Any injuries or physical limitations (nullable)
 * - preferred_split: Preferred workout split (push/pull/legs, upper/lower, full body)
 * - created_at: Timestamp for audit trail
 * - updated_at: Timestamp for audit trail
 */
module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize')} Sequelize
   */
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'profiles',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Unique profile identifier',
          },
          user_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            comment: 'Foreign key reference to users table',
          },
          goal: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment:
              'User fitness goal (muscle gain, fat loss, endurance, etc.)',
          },
          experience: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: 'User experience level (beginner, intermediate, advanced)',
          },
          days_per_week: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: 'Number of days available for training per week',
          },
          session_length: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: 'Preferred workout session duration',
          },
          equipment: {
            type: Sequelize.STRING(500),
            allowNull: false,
            comment: 'Available equipment for training',
          },
          injuries: {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Any injuries or physical limitations',
          },
          preferred_split: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: 'Preferred workout split pattern',
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false,
            comment: 'Record creation timestamp',
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false,
            comment: 'Record update timestamp',
          },
        },
        {
          transaction,
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci',
        },
      );

      // Create indexes for performance optimization and data integrity
      await queryInterface.addIndex('profiles', ['user_id'], {
        transaction,
        name: 'idx_profiles_user_id',
        unique: true, // Enforce one profile per user
      });

      await queryInterface.addIndex('profiles', ['goal'], {
        transaction,
        name: 'idx_profiles_goal',
      });

      await queryInterface.addIndex('profiles', ['experience'], {
        transaction,
        name: 'idx_profiles_experience',
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize')} Sequelize
   */
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('profiles', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
