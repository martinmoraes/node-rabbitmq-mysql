const Sequelize = require('sequelize');
const { executeQuery } = require('../infra/sequelize/repositoryQuery');

const SELECT_USER_BY_EMAIL = 'SELECT * FROM skeelo.user WHERE email = :email;';

const SELECT_USER_BY_ID = 'SELECT * FROM skeelo.user WHERE id = :id;';

const UPDATE_USER_BY_ID = `UPDATE skeelo.user SET name = :name, email = :email, fone = :fone, updatedAt = :updatedAt 
                            WHERE id = :id;`;

const STATUS_USER_BY_ID = `UPDATE skeelo.user SET status = :status, updatedAt = :updatedAt 
                            WHERE id = :id;`;

const INSER_USER = `INSERT INTO skeelo.user (name, email, fone)
                        VALUES (:name, :email, :fone);`;

class UserRepository {
  async findByEmail(replacements) {
    let selectResult = await executeQuery(SELECT_USER_BY_EMAIL, {
      replacements,
      type: Sequelize.QueryTypes.SELECT,
    });

    return selectResult.length > 0 ? selectResult[0] : {};
  }

  async findById(replacements) {
    const selectResult = await executeQuery(SELECT_USER_BY_ID, {
      replacements,
      type: Sequelize.QueryTypes.SELECT,
    });

    return selectResult.length > 0 ? selectResult[0] : {};
  }

  async updateById(replacements) {
    replacements.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatResult = await executeQuery(UPDATE_USER_BY_ID, {
      replacements,
      type: Sequelize.QueryTypes.UPDATE,
    });

    return { affectedRows: updatResult[1] };
  }

  async setStatusById(replacements) {
    replacements.updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatResult = await executeQuery(STATUS_USER_BY_ID, {
      replacements,
      type: Sequelize.QueryTypes.UPDATE,
    });

    return { affectedRows: updatResult[1] };
  }

  async insert(replacements) {
    const insertResult = await executeQuery(INSER_USER, {
      replacements,
      type: Sequelize.QueryTypes.INSERT,
    });

    return { affectedRows: insertResult[1] };
  }
}

module.exports = { UserRepository };
