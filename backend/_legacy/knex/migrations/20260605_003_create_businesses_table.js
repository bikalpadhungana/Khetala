/**
 * Migration 003: Create businesses table
 * Flattens Mongoose's embedded contactPerson sub-document into columns.
 */
exports.up = function (knex) {
  return knex.schema.createTable('businesses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.string('name', 150).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('phone', 20);
    table.string('address', 300);
    table.uuid('sector_id').references('id').inTable('sectors').onDelete('SET NULL');

    // Flattened contactPerson sub-document
    table.string('contact_person_name', 100);
    table.string('contact_person_phone', 20);
    table.string('contact_person_email', 255);

    table.string('website', 500);
    table.string('description', 500);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('last_login_at', { useTz: true });

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index('email', 'idx_businesses_email');
    table.index('name', 'idx_businesses_name');
    table.index('is_active', 'idx_businesses_active');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('businesses');
};
