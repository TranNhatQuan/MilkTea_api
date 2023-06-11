const { Product, Cart, Cart_product, Invoice } = require("../../models");
const { QueryTypes, Op, where, STRING } = require("sequelize");
const createProduct = async (idProduct) => {
  let productList = idProduct.substring(1)
  productList = productList.split(';'); // Tách các cặp idRecipe và quantity
  let createdProducts = [];
  // Duyệt qua từng cặp idRecipe và quantity
  for (let i = 0; i < productList.length; i++) {
    const productData = productList[i].split(','); // Tách idRecipe và quantity

    const idRecipe = productData[0];
    const quantity = productData[1];

    const isMain = i === 0 ? 1 : 0; // Thiết lập isMain

    // Tạo bản ghi trong bảng "product" với các giá trị tương ứng
    const createdProduct = await Product.create({
      idProduct: idProduct,
      idRecipe: idRecipe,
      quantity: quantity,
      isMain: isMain
    });
    createdProducts.push(createdProduct);
  }
  return createdProducts;
}
const takeIngredient = async (idCart) => {
  let cartProducts = await Cart_product.findAll({
    where: { idCart },
    include: [
      {
        model: Product,
        required: false,
        where: { isMain: 1 },
        attributes: ['quantity'],
        include: [{
          model: Recipe,
          attributes: ['name', 'image', 'price'],
          include: [{
            model: Recipe_shop,
            where: { idShop, isActive: 1 },
            attributes: ['discount'],
          }]
        }]
      }
    ]
  })
  return cartProducts;
}
const checkExistAccount = (Model) => {
  return async (req, res, next) => {
    try {
      const { phone } = req.body;
      
      const account = await Model.findOne({
        where: {
          phone,
        },
      });
      if (account) {
        console.log('check1')
        req.account= account
        next();
      } else {
        res.status(404).send({ message: "Không tìm thấy tài khoản!", isSuccess: false, isExist: false, status: true });
      }
    } catch (error) {
      res.status(500).send({ message: "Không tìm thấy tài khoản!", isSuccess: false, isExist: false, status: true });
    }
  }

};

const checkExistProduct = () => {
  return async (req, res, next) => {
    try {
      const { idRecipe, quantity } = req.body;
      //console.log(idRecipe)
      if (idRecipe === '' || quantity === '') {
        return res.status(400).json({ isSuccess: false });
      }
      //console.log('test')
      const listIdRecipe = idRecipe.split(',').map(Number);
      const listQuantity = quantity.split(',').map(Number);
      const { sizeProduct } = req.body;
      let idProduct = "";
      if (sizeProduct != 0) {
        idProduct += 'L'
      }
      else idProduct += 'M'


      for (let i = 0; i < listIdRecipe.length; i++) {
        idProduct += listIdRecipe[i] + "," + listQuantity[i] + ";";
      }

      // Loại bỏ dấu chấm phẩy cuối cùng
      idProduct = idProduct.slice(0, -1);
      console.log(idProduct)
      let listProduct = await Product.findAll({
        where: {
          idProduct
        }
      })
      //console.log(product.length)
      if (listProduct.length !== 0) {
        console.log('if');
        //req.listProduct = listProduct
        req.idProduct = idProduct
        next();
      } else {
        console.log('else');
        listProduct = await createProduct(idProduct);
        req.idProduct = idProduct
        //console.log(listProduct)
        //return res.status(500).send({ isSuccess: false, isExist: false, status: true , listProduct});
        next();
      }
    } catch (error) {
      return res.status(500).send({ isSuccess: false, isExist: false, status: true });
    }
  }

};
const checkExistCurrentCart = () => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      //console.log('test1')




      let [currentCart, created] = await Cart.findOrCreate({
        where: {
          idUser: user.idUser,
          isCurrent: 1,
        }
      });
      //console.log(currentCart)
      req.currentCart = currentCart
      next();
    } catch (error) {
      return res.status(500).send({ isSuccess: false, isExist: false, mes: 'check' });
    }
  }

};
const checkExistProductCartAndDel = () => {
  return async (req, res, next) => {
    try {
      const { oldIdProduct } = req.params;
      const currentCart = req.currentCart
      if (oldIdProduct == '') {
        return res.status(400).json({ isSuccess: false });
      }
      // const idProduct = req.idProduct;
      let cartProduct = await Cart_product.findOne({
        where: {
          idProduct: oldIdProduct,
          idCart: currentCart.idCart,

        }

      })
      if (cartProduct != null) {
        await cartProduct.destroy();
        next();
      }
      else next();

      //console.log('test1')

    } catch (error) {
      return res.status(500).send({ isSuccess: false, isExist: false, mes: 'checkAndDelProductCart' });
    }
  }

};
const checkExistInvoiceLessThan3 = () => {
  return async (req, res, next) => {
    try {
      //console.log('test1')

      const user = req.user;
      //console.log(user)
      const invoice = await Invoice.findOne({
        where: { 
          status: { [Op.lt]: 3 } 
        },
        //attributes:[],
        include: [
          {
            model: Cart,
            required: true,
            where: { idUser: user.idUser },
            attributes: []
          }
        ]
      })
      //console.log('test')


      // const idProduct = req.idProduct;

      if (invoice == null) {

        next();
      }
      else {
        let idInvoice = invoice.idInvoice
        return res.status(400).json({ isSuccess: false, mes: 'Đơn hàng hiên tại chưa hoàn thành', idInvoice });
      }


      //console.log('test1')

    } catch (error) {
      return res.status(500).send({ isSuccess: false, isExist: false, mes: 'checkInvoiceStatus0' });
    }
  }

};
const checkExistInvoiceStatus = (status) => {
  return async (req, res, next) => {
    try {
      
      const { idInvoice } = req.body
      

      if (idInvoice === undefined) {
        return res.status(400).json({ isSuccess: false });
      }
      if (idInvoice === '') {
        return res.status(400).json({ isSuccess: false });
      }

      // const idProduct = req.idProduct;

      let invoice = await Invoice.findOne({
        where: {
          idInvoice,
          status: status,
        }
      })
      
      if (invoice != null) {
        req.invoice = invoice
        req.status = status+1
        next();
      }
      else {
        return res.status(400).json({ isSuccess: false, mes:" idInvoice sai hoặc hoá đơn không còn ở trạng thái này" });
      }


      

    } catch (error) {
      return res.status(500).send({ isSuccess: false, isExist: false, mes: 'checkInvoiceStatus0' });
    }
  }

};

module.exports = {

  checkExistAccount, checkExistProduct, checkExistCurrentCart, checkExistProductCartAndDel, 
  checkExistInvoiceLessThan3, checkExistInvoiceStatus
};
