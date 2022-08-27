const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
//
const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

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

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize.sync() //sync your data to DB by creating appropriate table in DB. 
.then(result => {
    //console.log(result);
    app.listen(3000);   //will start server if we get some result.
})
.catch(err => {
    console.log(err);
})

//app.listen(3000);
