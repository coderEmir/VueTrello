'use strict';


/**
 * 更新迭代——> User表 增删 updatedAt 字段
 * ./node_modules/.bin/sequelize migration:create --name UserAddUpdatedAt
 * 依然执行 sequelize db:migrate 脚本 完成迁移。脚本选择性执行未执行过的部分
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    return queryInterface.addColumn('User', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * 依然执行 sequelize db:undo 脚本 完成迁移。脚本选择性执行未执行过的部分
     */
    return queryInterface.removeColumn('User', 'updatedAt')
  }
};
