const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

//const Sequelize = require('sequelize');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
//to define model of product and user

/* //sample code
db.execute('SELECT * FROM products')    //
.then(result => {
    console.log(result);
})
.catch(err => {
    console.log(err);
});
*/ 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user; //  to add user field in request
        console.log(user);
        next();
    })
    .catch(err => {
        console.log(err);
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// set associations
//Product.belongsTo(User);      we can even add additional constraints
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'        // to define cascade delete, when a user is deleted all products in that user will also get deleted
});

User.hasMany(Product);

//make a new middleware to get user from databse

//sync your data to DB by creating appropriate table in DB.
//sequelize.sync()  // data will not reflect as we added new constaints, to make changed to DB is should use force.
//sequelize.sync({force: true})     we do not want to do it evrytime, just once.
/*
Sequelize.sync()
.then(result => {
    //console.log(result);
    app.listen(3000);   //will start server if we get some result.
})
.catch(err => {
    console.log(err);
});
*/
//app.listen(3000);

// to add new user
sequelize.sync()
.then(result => {
    //1. check if user exists, and return the result.
    return User.findByPk(1); 
})
.then(user => {
    // 2. If no user, then create user
    if(!user) {
        return User.create({name: "Max", email: 'max@gmail.com'})
    }
    //return user;
    // then returns either a promise(user.create) or an object(user), but we should return same
    //return Promise.resolve(user); // to return same we encapsulate user like this.
    return user; // but in then block it is automatically wrapped in new promise, so this will run fine.
})
.then(user => {
    //console.log(user);
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})
