/**
 * Migration 002: Create sectors table
 */
exports.up = function (knex) {
  return knex.schema.createTable('sectors', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.string('name', 100).notNullable().unique();
    table.string('description', 300);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index('name', 'idx_sectors_name');
    table.index('is_active', 'idx_sectors_active');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('sectors');
};
