const logger = require('../../utils/logger');
const { ResourceNotFoundError } = require('../../utils/error');
const { Users } = require('../../db/db.bookshelf');

const query = async (personNr) => {
  try {
    const user = await Users.where('person_nr', personNr).fetch();
    if (!user) {
      return new ResourceNotFoundError(`The user with person nummer ${personNr} could not be found`);
    }
    return user;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

const create = async (user) => {
  try {
    Users.forge({
      person_nr: user.person_nr,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      device_id: user.device_id,
      telephone_nr: user.telephone_nr,
      post_nr: user.post_nr,
      post_ort: user.post_ort,
      adress: user.adress,
      updated_at: user.updated_at,
    })
      .save();
    return user;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

const erase = async (personNr) => {
  try {
    Users.where('person_nr', personNr).destroy()
      .then((res) => {
        logger.info('success');
        return res.json({ success: true });
      })
      .catch((e) => { 
        logger.error('failed', e);
        return e;
      });
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

const insert = async (personNr, user) => {
  try {
    Users.where('person_nr', personNr)
      .fetch()
      .then(res => res.save(
        {
          first_name: user.first_name || res.first_name,
          last_name: user.last_name || res.last_name,
          email: user.email || res.email,
          device_id: user.device_id || res.device_id,
          telephone_nr: user.telephone_nr || res.telephone_nr,
          post_nr: user.post_nr || res.post_nr,
          post_ort: user.post_ort || res.post_ort,
          adress: user.adress || res.adress,
          updated_at: user.updated_at || new Date(),
          created_at: user.created_at || res.created_at,
        },
        {
          method: 'update',
          patch: true,
        },
      ).then(updated => updated));
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports = {
  query,
  create,
  erase,
  insert,
};
