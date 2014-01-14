
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', function(t) {
    t.increments();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user');
};
