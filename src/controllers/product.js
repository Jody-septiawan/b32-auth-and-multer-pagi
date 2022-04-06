const { product, user, category, productCategory } = require('../../models');

exports.getProduct = async (req, res) => {
  try {
    let data = await product.findAll({
      include: [
        {
          model: user,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
          },
        },
        {
          model: category,
          as: 'categories',
          through: {
            model: productCategory,
            as: 'bridge',
            attributes: [],
          },
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser'],
      },
    });

    data = data.map((item) => {
      item.image = process.env.PATH_FILE + item.image;
      return item;
    });

    res.send({
      status: 'success...',
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const data = req.body;

    data.idUser = req.user.id;
    data.image = req.file.filename;

    const newProduct = await product.create(data);

    // code here
    // const categoryData = await category.findOne({
    //   where: {
    //     name: categoryName,
    //   },
    // });

    // if (categoryData) {
    //   await productCategory.create({
    //     idCategory: categoryData.id,
    //     idProduct: newProduct.id,
    //   });
    // } else {
    //   const newCategory = await category.create({ name: categoryName });
    //   await productCategory.create({
    //     idCategory: newCategory.id,
    //     idProduct: newProduct.id,
    //   });
    // }

    let productData = await product.findOne({
      where: {
        id: newProduct.id,
      },
      include: [
        {
          model: user,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
          },
        },
        {
          model: category,
          as: 'categories',
          through: {
            model: productCategory,
            as: 'bridge',
            attributes: [],
          },
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser'],
      },
    });

    res.send({
      status: 'success',
      data: {
        productData,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};
