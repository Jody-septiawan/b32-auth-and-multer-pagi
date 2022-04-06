// import model here
const { user } = require('../../models');

// import package here
const Joi = require('joi');

exports.register = async (req, res) => {
  try {
    const data = req.body;

    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      status: Joi.string().required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      return res.send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    const dataInDB = await user.findOne({
      where: {
        email: data.email,
      },
    });

    if (dataInDB) {
      return res.send({
        error: {
          message: `Email ${data.email} is Already!`,
        },
      });
    }

    const newUser = await user.create(data);

    res.send({
      status: 'success',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const data = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      return res.send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    const userExist = await user.findOne({
      where: {
        email: data.email,
      },
    });

    if (!userExist) {
      return res.send({
        error: {
          message: `Email ${data.email} not found!`,
        },
      });
    }

    if (userExist.password != data.password) {
      return res.send({
        error: {
          message: 'Credential is invalid!',
        },
      });
    }

    res.send({
      status: 'success',
      data: {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        status: userExist.status,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};
