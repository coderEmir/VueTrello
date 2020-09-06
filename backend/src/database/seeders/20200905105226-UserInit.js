'use strict';
const crypto = require('crypto')
/**
 * 种子脚本
 * 操作 数据库表 中的数据
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let md5 = crypto.createHash('md5')
    let password = md5.update('123456').digest('hex')
    let date = new Date()
    return queryInterface.bulkInsert('User', ['seeEmil','gitHub','profile'].map((name, index)=>{
      return {
        id : index + 1,
        name,
        password,
        createdAt: date,
        updatedAt: date,
      }
    }))
  },

  down: async (queryInterface, Sequelize) => {
    
    return queryInterface.bulkDelete('User', null, {})
  }
};
