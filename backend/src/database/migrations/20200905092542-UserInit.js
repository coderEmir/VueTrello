'use strict';
/**
 * 使用命令创建的迁移脚本文件
 * 命令：./node_modules/.bin/sequelize migration:create --name UserInit
 */
module.exports = {
  // 主要作用：生成表结构
  // Sequelize提供的queryInterface对象：封装了操作数据库的方法：创建表、字段、索引等
  // Sequelize：提供数据库相关的常量信息，如数据库类型。可以实例化，对数据操作（DQL、DML）
  up: async (queryInterface, Sequelize) => {
    /**
     * 需要返回一个promise对象
     * queryInterface.createTable返回一个promise对象
     */
    return queryInterface.createTable("User",{
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(32),
        allowNull: false,
        defaultValue: ""
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
    })
  },
  // 主要作用：回滚
  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("User")
  }
};
