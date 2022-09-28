const Product = require('../models/product.js');
const Cart = require('../models/cart.js');
const CartItem = require('../models/cart-item.js');

const ITEMS_PER_PAGE = 2;

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
  .then(result => {
    return res.json(result);
  })
  .catch(err => console.log(err));

/*
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
*/
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
  const page = +req.query.page || 1;    // for pagination + is added to make it number
  // buttons are hard coded, make then add automatically as we add more products

  console.log("==========================............................"+req.query.page);
  let totalItems;

  Product
  .count()     // to count no of products
  .then(numProducts => {
    //console.log("=============================================="+numProducts);
    totalItems = numProducts;   // will store count of products
    return Product.findAll({offset:(page-1)*ITEMS_PER_PAGE, limit: 2});
  })
  /*
  .then( products => {   // using SEQUELIZE
    res.render('shop/index', {
      prods: products,  // rows conatins the product data
      pageTitle: 'Shop',
      path: '/',
      //totalProducts: totalItems,  // we will also render total products
      currentPage: page, // to always get current page
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,  // which show that we have next page or not, if total items are greater than page*items_per_page, then for rest of products we must have next page
      hasPreviousPage: page > 1,      // to show if we have a previous page, if page is greater than 1 than there is a previous page.
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)    //last page
    });
  })
  */
  .then(products => {
    var obj = {
      products: products,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    }
    ///console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
    //console.log(obj.products);
    return res.json(obj);
  })

  .catch(err => {
    console.log(err);
  });

  /*
  // we use offset and limit in sequelize instead of skip and limit
  Product.findAll({offset:(page-1)*ITEMS_PER_PAGE, limit: 2})
  //.skip((page-1)*ITEMS_PER_PAGE)   //skip lets us skip given number of queries.
  // here we are doing page-1 to get page and then multiply by no of items per page to get those items only
  //.limit(ITEMS_PER_PAGE)    //limits us to fetch only those no of items.
  
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
  console.log("=====================================================");
  //console.log(req);
  const prodId = req.body.prodID;
  //const title = req.body.title;
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
  //return cart.getProducts({where: {title: title}});
})
.then(products => {    //2. here we get array of products with our product on index 0 (if it exist) 
  let product;
  if(products.length > 0) {
    product = products[0];
  }

  console.log(products);

  if(product) {   //if product there we need to access its previous qunatity and update it
    const oldQuantity = product.cartItem.quantity;
    newQuantity = oldQuantity+1;
    //return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
    return product;
  }  

  // if product not found in cart, means new product is added in cart.
  return Product.findByPk(prodId)
  //return Product.findByPk(title)
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
  //res.redirect('/cart');
  res.status(200).json({success: true, quantity: newQuantity});

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

  var page = +req.query.page || 1;

  const ITEM_PER_PAGE = 2;
  var totalItems = 0;

  console.log(req.user.cart);
  req.user.getCart()          // to get access to cart
  .then(cart => {
    //console.log("----------------------------");
    //console.log(JSON.stringify(cart))

    Cart
    .count()
    .then(counts => {
      totalItems = counts;
      console.log(cart);
      return cart.getProducts({offset:(page-1)*ITEM_PER_PAGE, limit: ITEM_PER_PAGE})  //magic method getProducts()
    })

  .then( products => {        // will contain products
      /*
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
      */
     //console.log(JSON.stringify(products)); 

     var productsObj = {
      products: products,
      previousPage: page - 1,
      currentPage: page,
      nextPage: page + 1,
      lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
      hasPreviousPage: page > 1,
      hasNextPage: page * ITEMS_PER_PAGE < totalItems
     }

      return res.json(productsObj);
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
