/* eslint-disable */
'use strict';
var MigrateUtil = require('../app/migrate_util.js')
var async = require('async')
var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  async.series([
    db.createTable.bind(db, 'roles', {
      id: MigrateUtil.getId(),
      name: 'string',
      desc: 'string'
    }),
    db.createTable.bind(db, 'permissions', {
      id: MigrateUtil.getId(),
      name: 'string',
      table: 'string',
      key: 'string'
    }),
    db.createTable.bind(db, 'permission_role', {
      id: MigrateUtil.getId(),
      name: 'string',
      role_id: MigrateUtil.getFK('permission_role_role_id_fk', 'roles'),
      permission_id: MigrateUtil.getFK('permission_role_permission_id_fk', 'permissions')
    }),
    db.createTable.bind(db, 'users', {
      id: MigrateUtil.getId(),
      name: 'string',
      password: 'string',
      email: 'string',
      phone: 'string',
      role_id: MigrateUtil.getFK('user_role_id_fk', 'roles')
    }),
    db.createTable.bind(db, 'issues', {
      id: MigrateUtil.getId(),
      title: 'string',
      index: 'int',
      author: 'string',
      git_created_at: 'timestamp',
      user_id: MigrateUtil.getFK('issue_user_id_fk', 'users')
    })
  ], callback)
};

exports.down = function(db, callback) {
  async.series([
    db.dropTable.bind(db, 'issues'),
    db.dropTable.bind(db, 'users'),
    db.dropTable.bind(db, 'permission_role'),
    db.dropTable.bind(db, 'permissions'),
    db.dropTable.bind(db, 'roles')
  ], callback)
};

exports._meta = {
  "version": 1
};
