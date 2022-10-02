/* function addToCart(event) {
    event.preventDefault();

    const btnId = event.target.className;
    
        //console.log(event.target.tagName);
        //console.log(event.target.parentNode.parentNode.id);
        //console.log(btnId);

    if(event.target.tagName == 'BUTTON' && btnId == 'shop-item-button') {
        //console.log(btnId.parentNode.id);
        const parentId = event.target.parentNode.parentNode.id;
        console.log(parentId);
        console.log(btnId);

        document.getElementsByClassName('cart-item')[0].innerHTML = document.getElementsByClassName('cart-item')[0].innerHTML + document.getElementById(parentId).childNodes

    }
}
*/


//const { default: axios } = require("axios");
//const res = require("express/lib/response");

// if page is loaded before JS then its okay, but if page is loaded slow and loaded after JS then, JS will execute all its code and will not find any element and would give error
// so we need to check if page is loading or done loading


if(document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
}
else {
    ready();
}


function ready () {

    const page = 1;

    axios.get(`http://localhost:3000/?page=${page}`)
    .then( res => {
        //console.log("here");
        //console.log(res);
        pagination(res);
        
        for(var i =0; i< res.data.products.length; i++) {
            //addProductToShop(res.data[i]);
            //console.log("data is");
            //console.log(res.data.products[i]);
            addProductToShop(res.data.products[i]);
        }
    
    })
    .catch(err => console.log(err));


    axios.get(`http://localhost:3000/cart/?page=${page}`)
    .then(res => {
        //console.log(res.data);
        cartPagination(res);

        for(var i =0; i< res.data.products.length; i++) {
            //console.log(res.data.products[i]);
            
            addItemToCart(res.data.products[i]);
        }
        
    })
    .catch(err => console.log(err));
    
    var removeItems = document.getElementsByClassName('btn-danger');

    for(var i =0; i<removeItems.length; i++) {    // to loop through all buttons having ID btn-danger
        var button = removeItems[i];                    //check which one to remove
        button.addEventListener('click', removeCartItem);   // add event listener to remove
        console.log('clicked');
        //var buttonClickedd = event.target.parentElement.parentElement.remove();     //remove whole div
        //updateCartTotal();
        //})
    }
    
    var quantityInput = document.getElementsByClassName('cart-quantity-input');
    for(var i =0; i< quantityInput.length; i++) {
        var input = quantityInput[i];
        input.addEventListener('change', quantityChanged);
    }

    /*
    var addToCartButton = document.getElementsByClassName('shop-item-button');
    console.log(addToCartButton);
    for(var i=0; i< addToCartButton.length; i++) {
        
        var button = addToCartButton[i];
        button.addEventListener('click', addToCartClicked);
    } 
    */

    //console.log(document.getElementsByClassName('purchase-button'));
    if(document.getElementsByClassName('purchase-button')[0]) {
        document.getElementsByClassName('purchase-button')[0].addEventListener('click', purchaseClicked);
    }
    

//to disapper cart when we click X
    if(document.getElementsByClassName('cancel')[0]) {
        document.getElementsByClassName('cancel')[0].addEventListener('click', () => {
            document.getElementById('cart').style = 'display:none';
        });
    }
    
    if(document.getElementsByClassName('cart-holder')[0]) {
        document.getElementsByClassName('cart-holder')[0].addEventListener('click', () => {
            document.getElementById('cart').style = 'display:inline';
        })
    }
}

function addProductToShop(product) {
    var parent = document.getElementById('music-content');
    var childNode = document.createElement('div')
    childNode.id = product.title;
    //console.log(product.id);
    //console.log(imgUrl);
    var childNodeContent =
    `<h3> ${product.title} </h3>
    <div class="img-container">
        <img src="${product.imageUrl}" alt="" class="prod-images">
    </div>
    <div>
        <span>$${product.price}</span>
        <button class="shop-item-button" onclick="addToCartClicked(event, ${product.id})"> Add to Cart </button>
    </div>`;

    childNode.innerHTML = childNodeContent;
    parent.appendChild(childNode);

}

function addToCartClicked(event, prodID) {
    
    var button = event.target;
    var shopItem = button.parentElement.parentElement;

    var title = shopItem.getElementsByTagName('h3')[0].innerText; //here it will select only the one we want, as it is inside shopItem, so it will only access elements of shopItem.
    console.log(title);
    var price = shopItem.getElementsByTagName('span')[0].innerText;
    console.log(price);
    var imgSrc = shopItem.getElementsByTagName('img')[0].src;
    console.log(imgSrc);
    var quantity = 1;
    console.log(quantity)

    var p1 = parseFloat(price.replace('$',''));

    var obj = {
        title: title,
        imgUrl: imgSrc,
        price: p1,
        quantity: quantity
    }
    axios.post('http://localhost:3000/cart', {prodID: prodID})
    .then (res => {
        if(res.status === 200) {
            //console.log(obj);
            //addItemToCart(res); // to add row to cart.
            
            showNotification(obj.title);
        }
    })
    .catch();
    
}

function addItemToCart(product) {

    console.log("hey");
    var cartRow = document.createElement('div'); // create new div element
    cartRow.classList.add('cart-row');  // to add class name
    //cartRow.innerText = title;
    var cartItems = document.getElementsByClassName('cart-items')[0]; // to add newly created cartRow here.
    //cartItems.append(cartRow); //to add at end

    // We have to check if we already have item in cart. If we already have item in cart, we do not add duplicate item but increase its quantity.
    var cartItemNames = document.getElementsByClassName('cart-item-title');

    //for(var i =0; i< cartItemNames.length; i++) {
        //console.log(cartItemNames[i]);
       /* if(cartItemNames[i].innerText == product.title) {   // means item already in cart
            alert('This item is already added to cart');
            return; // to not execute anything below
        }
        */
    //}

    console.log(product.title);

    // Easy way is to copy the html code in a string and use it.
    var cartRowContents = ` 
    <span class='cart-item cart-column'>
        <img class='cart-img' src="${product.imgSrc}" alt="" width="100" height="100">
        <span class='cart-item-title'>${product.title}</span>
    </span>
    <span class='cart-price cart-column'>${product.price}</span>
    <span class='cart-quantity cart-column'>
        <input class='cart-quantity-input' type="number" value='${product.cartItem.quantity}'>
        <button class="btn btn-danger" type='button'>REMOVE</button>
    </span> `;

    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);

// remove button will not work as it was added after content is loaded, so we have to add event listener here to make it work
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
// we would do same thing with quantity as it is also added afterwards
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);

    updateCartTotal();  // to update total when item added
}


function quantityChanged(event) {
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0) {    //check if input items are non negative and number only.
        input.value = 1;
    }
    var newVal = input.value;
    /*var newValue = {
        title: event.target.parentElement.parentElement.getElementsByClassName('cart-item-title')[0].innerText,
        newVal: newVal
    };
    axios.post('http://localhost:3000/postUpdateQty', newValue)
    .then(resu => {
        updateCartTotal();
    })
    .catch(err => console.log(err)); */
}


function removeCartItem(event) {
        var buttonClickedd = event.target;
        buttonClickedd.parentElement.parentElement.remove();     //remove whole div
        updateCartTotal();
}


function updateCartTotal() {
    var total =0;

    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');

    var total = 0;
    for(var i=0; i<cartRows.length; i++) {  // to traverse each cart rows and check and get price and quantity of clicked item
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];

        var price = parseFloat(priceElement.innerHTML.replace('$', '')); //to get text value and replace $ sign as we dont need $ sign
        //parseFloat will convert string to float value
        var quantity = quantityElement.value;
        //console.log(price);

        //console.log(price*quantity);

        total = total + (price*quantity);

    }

    total = Math.round(total * 100)/100; //to round our number to 2 decimal places.
    document.getElementsByClassName('cart-total')[0].innerHTML = '$' + total;
}

function purchaseClicked() {

    axios.post('http://localhost:3000/create-order')
    .then( res => {
        alert('Thanks for purchase');
        // when we purchase, cart gets empty, so we will remove the parent of cart-item
            var cartItems = document.getElementsByClassName('cart-items')[0];
            cartItems.innerHTML = "";
            //while(cartItems.hasChildNodes()) {
              //  cartItems.removeChild(cartItems.firstChild);    //loop through all the items and remove them using firstChild.
           // }
        updateCartTotal();
    })
    .catch(err => console.log(err));

}

function showNotification(title) {
    const container = document.getElementById('ecomm');
    const notify = document.createElement('span');
    notify.classList.add('notify');
    notify.innerText = `Your Item ${title} is added to cart`;

    container.appendChild(notify);

    setTimeout(() => {
        notify.remove();
    }, 3000);
}

function pagination(res) {
    var currentPage = res.data.currentPage;
    var nextPage = res.data.nextPage;
    var lastPage = res.data.lastPage;
    var previousPage = res.data.previousPage;

    //console.log(nextPage);

    //console.log("prev"+previousPage)
    //console.log("curr"+currentPage);
    //1. create button dynamically using hasNext and hasPrevious and add button to root element of music
    //2. call addproducts() on res.data.products using for loop.

    var parent = document.getElementById('pagination');
    parent.innerHTML = "";
    document.getElementById('music-content').innerHTML = "";

    if(res.data.hasPreviousPage) {
        const btn2 = document.createElement("button");
        btn2.innerHTML = previousPage;
        btn2.classList = 'btn-page';
        btn2.addEventListener('click', () => getProds(previousPage));
        parent.prepend(btn2);
    }

    const btn1 = document.createElement("button");
    btn1.innerHTML = currentPage;
    btn1.classList = "btn-page";
    btn1.addEventListener('click', () => getProds(currentPage));
    parent.prepend(btn1);

    if(res.data.hasNextPage) {
        const btn3 = document.createElement("button");
        btn3.innerHTML = nextPage;
        btn3.classList = 'btn-page';
        btn3.addEventListener('click', () => getProds(nextPage));
        parent.prepend(btn3);
    }

   
}

function getProds(page) {
    axios.get(`http://localhost:3000/?page=${page}`)
    .then(res => {
        pagination(res);
        for(var i=0; i<res.data.products.length; i++) {
            addProductToShop(res.data.products[i]);
        }
    })
    .catch(err => console.log(err));
}

function cartPagination(res) {
    console.log(res.data);
    var currentPage = res.data.currentPage;
    var nextPage = res.data.nextPage;
    var lastPage = res.data.lastPage;
    var previousPage = res.data.previousPage;

    console.log("next page = "+nextPage);

    //1. create button dynamically using hasNext and hasPrevious and add button to root element of music
    //2. call addproducts() on res.data.products using for loop.

    var parent = document.getElementById('cartPagination');
    parent.innerHTML = "";
    document.getElementById('cart-items').innerHTML = "";

    if(res.data.hasPreviousPage) {
        const btn2 = document.createElement("button");
        btn2.innerHTML = previousPage;
        btn2.classList = 'btn-page';
        btn2.addEventListener('click', () => getCarts(previousPage));
        parent.prepend(btn2);
    }

    const btn1 = document.createElement("button");
    btn1.innerHTML = currentPage;
    btn1.classList = "btn-page";
    btn1.addEventListener('click', () => getCarts(currentPage));
    parent.prepend(btn1);

    if(res.data.hasNextPage) {
        const btn3 = document.createElement("button");
        btn3.innerHTML = nextPage;
        btn3.classList = 'btn-page';
        btn3.addEventListener('click', () => getCarts(nextPage));
        parent.prepend(btn3);
    } 
}

function getCarts(page) {
        axios.get(`http://localhost:3000/cart/?page=${page}`)
        .then(res => {
            cartPagination(res);

            for(var i=0; i<res.data.products.length; i++) {
                addItemToCart(res.data.products[i]);
            }

        })
        .catch(err => console.log(err));
}


