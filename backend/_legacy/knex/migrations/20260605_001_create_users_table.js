const { ENUMS } = require('../src/config/enums');

/**
 * Migration 001: Create users table
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.string('name', 100).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('phone', 20);

    table
      .enu('role', ENUMS.USER_ROLE, {
        useNative: true,
        enumName: 'user_role_enum',
      })
      .notNullable()
      .defaultTo('affiliate');

    table
      .enu('status', ENUMS.USER_STATUS, {
        useNative: true,
        enumName: 'user_status_enum',
      })
      .notNullable()
      .defaultTo('pending');

    table.integer('available_credits').notNullable().defaultTo(0);
    table.integer('escrow_credits').notNullable().defaultTo(0);
    table.string('address', 200);
    table.text('rejection_reason');
    table.timestamp('approved_at', { useTz: true });
    table.uuid('approved_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('last_login_at', { useTz: true });

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index('email', 'idx_users_email');
    table.index(['role', 'status'], 'idx_users_role_status');
  });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('users')
    .then(() => knex.raw('DROP TYPE IF EXISTS user_role_enum'))
    .then(() => knex.raw('DROP TYPE IF EXISTS user_status_enum'));
};
