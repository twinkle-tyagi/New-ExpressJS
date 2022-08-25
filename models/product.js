// Now we start to work on database so we do not need files and we will comment those code.
/*
const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if(this.id) {
        const existingProductIndex = products.findIndex(prod => prod.id === this.id);

        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      }
      else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  static delete(id) {
    getProductsFromFile(prods => {
      const updatedProd = [];
        prods.forEach(prod => {
          if(prod.id !== id) {
            updatedProd.push(prod);
          }
        });

        fs.writeFile(p, JSON.stringify(updatedProd), err => {
          console.log(err);
        })
      });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  // to get details of a single product using id
  static findById(id, cb) {
    getProductsFromFile(products => { // first get all products
      const product = products.find(p => p.id === id); // then find product using id, find() is defualt JS method
      // in find we are using arrow function to check if any id from p(p.id) is equal to id.
      cb(product); // callback with product to sync
    });

  }
};
*/

const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // id will be taken automatically
    // we are doing like this to avoid SQL Injection attack.
    // question marks corresponds to value we want to enter, second argument of executes is an array that contains actual values we want to insert.
    //SQL will parse our data for hidden SQL commands and removes them. (An added layer of security)
    return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)', [this.title, this.price, this.description, this.imageUrl]); 
  }

  static delete(id) {
    
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products'); // we return this promise to use somewhere else
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
};