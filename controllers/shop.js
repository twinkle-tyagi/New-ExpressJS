const Product = require('../models/product');
const Cart = require('../models/cart.js');

/*
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};
*/



/*
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;  // to get product id
  //console.log(prodId);
  Product.findById(prodId, product => { // to get details of product, product => is a callback // to make our code synchronous
    //console.log(product);
    res.render('shop/product-detail', 
    {product: product, 
    pageTitle: product.title,
    path: '/products'
  });// to view detail as a new page, here {product:product} is an object and first product is key to access product that we get from findById()
  });
  //res.redirect('/');
};
*/

/*
exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};
*/

//Using DATABASE

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;  
  
  Product.findById(prodId).then(([prod]) => {
    
    res.render('shop/product-detail', 
    { product: prod[0], 
    pageTitle: prod.title,
    path: '/products'
  })
})
  .catch(err => {
    console.log(err);
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(([rows, fieldData]) => {
    res.render('shop/product-list', {
      prods: rows,
      pageTitle: 'All Products',
      path: '/products'
    })
    
  });
};



exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(([rows, fieldData]) => { //rows and filedata are simply index-0(arr[0]), index-1(arr[1]) of array
    
    res.render('shop/index', {
      prods: rows,  // rows conatins the product data
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // get information of product, then add to cart.
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
