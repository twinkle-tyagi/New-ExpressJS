// Now we start to work on database so we do not need files and we will comment those code.

/*
const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

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
/* My way
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


  // UDEMY way

  static deleteById() {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(prod => prod.id !== id);
      //filter will filter according to criteria. here if id is not equal then item is kept otherwise item is left.

      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        // if no error then we have to delete product from cart also,
        if(!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    })
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

/*
// DATABSE MsSql

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
    return db.execute('DELETE FROM products WHERE products.id = ?', [id]);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products'); // we return this promise to use somewhere else
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
};
*/

// using Sequelize

const { DECIMAL } = require('sequelize');
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// define has parameters, first is table name. 
// Second is JS object which define structure of our model and our automatically created DB. 
const Product = sequelize.define('product', {
  id: {                         // first field in DB is id, id may have some attributes, so we represent it as JS object.
    type: Sequelize.INTEGER,    // id type is integer.
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,      // to make it string type.
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;