const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  
  product.save()
  .then(() => {
    res.redirect('/');
  })
  .catch(err => {
    console.log(err);
  });
  //res.redirect('/'); // when storing in file
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId;  // to get product Id from request header
  Product.findById(prodId, product => {
    if(!product) {
      return res.redirect('/');
    }
    console.log(product);
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId; //get product id from hidden textbox

  // get all params that user entered from req.
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedimageUrl = req.body.imageUrl;
  const updatedDes = req.body.description;
  
  // create a new product object of Product class.
  const updatedProduct = new Product (
    prodId, 
    updatedTitle, 
    updatedimageUrl, 
    updatedDes, 
    updatedPrice,
    );
  
  // save updated object using save()
  updatedProduct.save();
  res.redirect('/');
};


exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then((rows, fieldData) => {
    res.render('admin/products', {
      prods: rows,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.delete(prodId);
  res.redirect('/');
};