const fs = require('fs');
const path = require('path');


const p = path.join (
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
  );

module.exports = class Cart {
    static addProduct(id, productPrice) {

        //1. fetch previous cart.
        fs.readFile(p,(err, fileContent) => {
            let cart = {products: [], totalPrice: 0}; //create a new cart.
            if(!err) {
                cart = JSON.parse(fileContent);
            }

        //2. Analyze the cart to find previous products.
        const existingProductIndex = cart.products.findIndex(prod => prod.id === id); //find index if product exists in cart.
        const existingProduct = cart.products[existingProductIndex];
        let updatedProduct;

        //3. Add new product, increase quantity
        if(existingProduct) {
            updatedProduct = {...existingProduct};
            updatedProduct.qty = updatedProduct.qty + 1;
            // if cart has that product, replace it.
            cart.products = [...cart.products];
            cart.products[existingProductIndex] = updatedProduct;
        }
        else {
            updatedProduct = {id:id, qty: 1};
            cart.products = [...cart.products, updatedProduct]; // if cart empty add product
        }
        cart.totalPrice = cart.totalPrice + +productPrice; //+ added before productPrice to convert it to integer, otherwise it will be treated as string
        // now save all changes back to file.
        fs.writeFile(p, JSON.stringify(cart), err => {
            console.log(err);
        });
    });
    }

    static deleteProduct(id, productPrice) {
        s.readFile(p, (err, fileContent) => {
            if(err) {
                return;
            }

            const updatedCart = {...fileContent};
            const product = updatedCart.products.findIndex(prod => prod.id === id);
            //update cart items and price.
            // there can be more than one instance of an item in cart, so we get quantity first, then update price.
            productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = cart.totalPrice - productPrice*productQty;
            //update
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
    });
}
}