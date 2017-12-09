/* eslint-disable */
'use strict';
const getId = () => {
  return {
    type: 'int',
    unsigned: true,
    notNull: true,
    primaryKey: true,
    autoIncrement: true,
    length: 10,
  };
};
const getFK = (fkName, tableName) => {
  return {
    type: 'int',
    unsigned: true,
    length: 10,
    notNull: true,
    foreignKey: {
      name: fkName,
      table: tableName,
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
      },
      mapping: 'id',
    },
  };
};

exports.getId = getId;
exports.getFK = getFK;
