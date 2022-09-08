const Product = require('../models/product.js');
const Cart = require('../models/cart.js');
const CartItem = require('../models/cart-item.js');

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

// to access single product when we click details
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;  
  
  // using sequelize
Product.findAll({where: {id: prodId}}) // findAll gives array,
.then(products => {
  res.render('shop/product-detail', { 
    product: products[0],              // as our data is the first element 
    pageTitle: products[0].title,
    path: '/products'
  });
})
.catch(err => {
  console.log(err);
});

/* second way
  Product.findById(prodId)
  .then(product => {    // there is in-built function findById in sequelize that we can use, but it doesnot returns an array but a single product

    res.render('shop/product-detail', { 
    product: product, 
    pageTitle: product.title,
    path: '/products'
  });
})
  .catch(err => {
    console.log(err);
  });
  */

  /*
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
  */
};

// to access all products
exports.getProducts = (req, res, next) => {

  Product.findAll()
  .then( products => {   // using SEQUELIZE
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => {
    console.log(err);
  });
  /*
  Product.fetchAll()
  .then(([rows, fieldData]) => {
    res.render('shop/product-list', {
      prods: rows,
      pageTitle: 'All Products',
      path: '/products'
    })
  });
  */
};



exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then( products => {   // using SEQUELIZE
    res.render('shop/index', {
      prods: products,  // rows conatins the product data
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => {
    console.log(err);
  });
  
  /*  DATABASE WAY
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
  */
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  /*
  // get information of product, then add to cart.
  Product.findByPk(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
  */
 // using magic method.
 let fetchedCart;
 let newQuantity = 1;

 req.user.getCart()
 .then(cart => {      // here we get a cart
  //1. check if product is in cart or not. If in cart then we need to just increase quantity.
  fetchedCart = cart;   // to get cart and use it everywhere.
  return cart.getProducts({where: {id: prodId}} );   // returns array of products, where first element if the product with prodId
})
.then(products => {    //2. here we get array of products with our product on index 0 (if it exist) 
  let product;
  if(products.length > 0) {
    product = products[0];
  }

  if(product) {   //if product there we need to access its previous qunatity and update it
    const oldQuantity = product.cartItem.quantity;
    newQuantity = oldQuantity+1;
    //return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
    return product;
  }  

  // if product not found in cart, means new product is added in cart.
  return Product.findByPk(prodId)
  //.then(product => {
    //return fetchedCart.addProduct(product, { through: {quantity: newQuantity}} );    // addProduct is magic method added by sequelize
    // we need to update quantity so we send it as second argument using through, and set quantity as newQuantity.
  //})
  })
  .then(product => {
    return fetchedCart.addProduct(product, {  // we can use another then block to avoid duplication of code
      through: { quantity: newQuantity }
    })
})
.then(() => {
  res.redirect('/cart');
})
 .catch(err => console.log(err));
};


//to delete from cart, first get cart, then search item in cart, then delete it.
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user.getCart()
  .then(cart => {
    return cart.getProducts({where: {id: prodId}} );
  })
  .then(products => {
    const product = products[0];
    // we will get product from cartItem and destroy it. 
    // we only have to delete it from cartItem table.
    return product.cartItem.destroy(); //cartItem is magic method
  })
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
  /*
  Product.findByPk(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
  */
};

/*
exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
};
*/
/*
exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};
*/

exports.getCart = (req, res, next) => {
  console.log(req.user.cart);
  req.user.getCart()          // to get access to cart
  .then(cart => {
    return cart.getProducts()  //magic method getProducts()
    .then( products => {        // will contain products
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
    //console.log(cart);
  })
  .catch(err => {
    console.log(err);
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
