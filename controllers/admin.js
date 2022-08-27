const sequelize = require('sequelize');
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
  /*
  const product = new Product(null, title, imageUrl, description, price);
  product.save()
  .then(() => {
    res.redirect('/');
  })
  .catch(err => {
    console.log(err);
  });
  //res.redirect('/'); // when storing in file
  */

  //using sequelize

  // create will create and insert in DB automatically. We can also use build, but build returns a JS object first and then we have to insert it manually.
  Product.create( { // create works with promises 
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
  .then(result => {
    //console.log(result);
    console.log('saved successfully');
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId;  // to get product Id from request header
  
  //using sequelize
  Product.findByPk(prodId) //findById not availabe, so use findByPk() instead
  .then(product => {
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
  })
  .catch(err => {
    console.log(err);
  })

  /*
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
  */
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId; //get product id from hidden textbox

  // get all params that user entered from req.
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedimageUrl = req.body.imageUrl;
  const updatedDes = req.body.description;
  
  /*
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
  */

  // using sequelize
  Product.findByPk(prodId)
  .then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedimageUrl;
    product.description = updatedDes;
    // save is function provided my sequelize, it will take the object and save it.
    // if object exists it gets updated, if not then new row is created. 
    // we have to return it to be used
    return product.save(); 
  })
  .then(result => {               // will handle the product returned above. 
    console.log("updated product");
    res.redirect('/');
  }) 
  .catch(err => {
    console.log(err);
  });
};


exports.getProducts = (req, res, next) => {
  
  //using sequelize
  Product.findAll()
  .then( product => {
    res.render('admin/products', {
      prods: product,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err=>{
    console.log(err);
  });
  /*
  Product.fetchAll()
  .then(([rows, fieldData]) => {
    res.render('admin/products', {
      prods: rows,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => {
    console.log(err);
  });
  */
  
};

/*
// Deleting from file
exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};
*/


// deleting from DATABASE
exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  /*
  Product.delete(prodId)
  .then(() => {
    res.redirect('/')
  })
  .catch(err => {
    console.log(err);
  });
  */

  //using sequelize
  Product.findByPk(prodId)
  .then(product => {
    return product.destroy()
  })
  .then(result => {
    console.log("destroyed");
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
  })
};