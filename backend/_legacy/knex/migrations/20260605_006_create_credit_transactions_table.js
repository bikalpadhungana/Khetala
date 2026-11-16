const { ENUMS } = require('../src/config/enums');

/**
 * Migration 006: Create credit_transactions table
 * Flattens Mongoose's embedded balanceAfter sub-document into columns.
 */
exports.up = function (knex) {
  return knex.schema.createTable('credit_transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('referral_id').notNullable().references('id').inTable('referrals').onDelete('CASCADE');

    table
      .enu('type', ENUMS.TRANSACTION_TYPE, {
        useNative: true,
        enumName: 'transaction_type_enum',
      })
      .notNullable();

    table.integer('amount').notNullable();
    table.string('description', 200);

    // Flattened balanceAfter sub-document
    table.integer('balance_after_available');
    table.integer('balance_after_escrow');

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index(['user_id', 'created_at'], 'idx_ct_user_created');
    table.index(['referral_id', 'type'], 'idx_ct_referral_type');
  });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('credit_transactions')
    .then(() => knex.raw('DROP TYPE IF EXISTS transaction_type_enum'));
};
