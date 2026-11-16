const { ENUMS } = require('../src/config/enums');

/**
 * Migration 005: Create referral_status_history table
 * Normalizes the embedded statusHistory array from MongoDB into a proper table.
 */
exports.up = function (knex) {
  return knex.schema.createTable('referral_status_history', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('referral_id')
      .notNullable()
      .references('id')
      .inTable('referrals')
      .onDelete('CASCADE');

    table
      .enu('status', ENUMS.REFERRAL_STATUS, {
        useNative: true,
        existingType: true,
        enumName: 'referral_status_enum',
      })
      .notNullable();

    table.uuid('changed_by').notNullable();

    table
      .enu('changed_by_model', ENUMS.CHANGED_BY_MODEL, {
        useNative: true,
        enumName: 'changed_by_model_enum',
      })
      .notNullable();

    table.string('note', 500);
    table.timestamp('changed_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index('referral_id', 'idx_rsh_referral');
  });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('referral_status_history')
    .then(() => knex.raw('DROP TYPE IF EXISTS changed_by_model_enum'));
};
