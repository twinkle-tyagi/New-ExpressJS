

window.addEventListener('DOMContentLoaded', () => {
    axios.get('http://localhost:3000/orders')
    .then(res => {
        console.log(res);
        for(var i =0; i< res.data.length; i++) {
            var datas = res.data[i];
            for(var j =0; j< datas.products.length; j++) {
               addProductToOrder(datas.products[j], datas.id);
            }

           //addProductToOrder(res.data.Object[1]);
        }
    })
    .catch(err => console.log(err));
})

function addProductToOrder(product, orderId) {
    var parent = document.getElementById('order-content');
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
        <span>Order Id = ${orderId}</span>
        <span>Product Price = $${product.price}</span>
        <span> Quantity = ${product.orderItem.quantity}</span>

    </div>`;

    childNode.innerHTML = childNodeContent;
    parent.appendChild(childNode);

}