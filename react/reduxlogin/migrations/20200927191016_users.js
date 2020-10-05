
exports.up = function(knex) {
  return knex.schema.createTable('users',function(table){
    table.increments();
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password_digest').notNullable();
    table.timestamps();    
    });
};

exports.down = function(knex) {
    return knex.schema.dropTables('users');
};
