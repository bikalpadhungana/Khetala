const { ENUMS } = require('../src/config/enums');

/**
 * Migration 007: Create notifications table
 */
exports.up = function (knex) {
  return knex.schema.createTable('notifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // If user_id is null, it can be a global notification
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');

    table.string('title', 255).notNullable();
    table.text('message').notNullable();

    table
      .enu('type', ENUMS.NOTIFICATION_TYPE, {
        useNative: true,
        enumName: 'notification_type_enum',
      })
      .notNullable()
      .defaultTo('info');

    table.boolean('is_read').notNullable().defaultTo(false);
    table.string('link', 255);

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index(['user_id', 'is_read'], 'idx_notifications_user_read');
    table.index('created_at', 'idx_notifications_created_at');
  });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('notifications')
    .then(() => knex.raw('DROP TYPE IF EXISTS notification_type_enum'));
};
