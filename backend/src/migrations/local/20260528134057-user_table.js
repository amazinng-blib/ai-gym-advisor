'use strict';

/**
 * @type {import('sequelize-cli').Migration}
 * @description Creates the users table with authentication fields
 *
 * Schema:
 * - id: UUID primary key for user identification
 * - name: User's full name
 * - email: Unique email for authentication and communication
 * - password: Hashed password for security
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
        'users',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
            comment: 'Unique user identifier',
          },
          name: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: 'User full name',
          },
          email: {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Unique email address for authentication',
          },
          password: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: 'Hashed password',
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

      // Create indexes for performance optimization
      await queryInterface.addIndex('users', ['email'], {
        transaction,
        name: 'idx_users_email',
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
      await queryInterface.dropTable('users', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
