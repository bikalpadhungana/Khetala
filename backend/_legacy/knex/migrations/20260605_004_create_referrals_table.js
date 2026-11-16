const { ENUMS } = require('../src/config/enums');

/**
 * Migration 004: Create referrals table
 */
exports.up = function (knex) {
  return knex.schema.createTable('referrals', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // Parties
    table.uuid('submitted_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('assigned_to').references('id').inTable('businesses').onDelete('SET NULL');

    // Lead info
    table.string('name', 100).notNullable();
    table.string('email', 255);
    table.string('phone', 20).notNullable();
    table.string('address', 200);
    table.text('description').notNullable();
    table.uuid('sector_id').notNullable().references('id').inTable('sectors').onDelete('RESTRICT');

    // Status
    table
      .enu('status', ENUMS.REFERRAL_STATUS, {
        useNative: true,
        enumName: 'referral_status_enum',
      })
      .notNullable()
      .defaultTo('pending');

    // Credits
    table.integer('total_credits').notNullable();
    table
      .enu('credit_status', ENUMS.CREDIT_STATUS, {
        useNative: true,
        enumName: 'credit_status_enum',
      })
      .notNullable()
      .defaultTo('escrow');

    // Admin notes
    table.string('admin_notes', 500);

    // Timestamps for key events
    table.timestamp('assigned_at', { useTz: true });
    table.timestamp('converted_at', { useTz: true });
    table.timestamp('rejected_at', { useTz: true });

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index('submitted_by', 'idx_referrals_submitted_by');
    table.index('assigned_to', 'idx_referrals_assigned_to');
    table.index('sector_id', 'idx_referrals_sector');
    table.index('status', 'idx_referrals_status');
    table.index(['submitted_by', 'status'], 'idx_referrals_submitted_status');
    table.index(['assigned_to', 'status'], 'idx_referrals_assigned_status');
    table.index('created_at', 'idx_referrals_created');
  });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('referrals')
    .then(() => knex.raw('DROP TYPE IF EXISTS referral_status_enum'))
    .then(() => knex.raw('DROP TYPE IF EXISTS credit_status_enum'));
};
