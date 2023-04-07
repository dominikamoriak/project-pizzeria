import { select, classNames, templates, settings } from '../settings.js';
import { utils } from '../utils.js';
import cartProduct from '../components/cartProduct.js';

class cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = [];
    thisCart.getElements(element);
    console.log('new cart', thisCart);

    thisCart.initActions();
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    console.log(thisCart.dom.toggleTrigger);

    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    console.log(thisCart.dom.productList);

    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    console.log(thisCart.dom.deliveryFee);

    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    console.log(thisCart.dom.subtotalPrice);

    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    console.log(thisCart.dom.totalPrice);

    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    console.log(thisCart.dom.totalNumber);

    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    console.log(thisCart.dom.form);

    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    console.log(thisCart.dom.address);

    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    console.log(thisCart.dom.phone);
  }

  initActions(){
    const thisCart = this;
    console.log(thisCart.initActions);

    /* START: add event listener to toggle trigger on event click */
    thisCart.dom.toggleTrigger.addEventListener('click', function(){

      /* toggle class */
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      console.log(thisCart.dom.wrapper);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function (event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    const thisCart = this;

    console.log('adding product', menuProduct);

    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);

    /* create element DOM using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    /* gdzie je dodać? -> find menu container */
    const menuContainer = document.querySelector(select.cart.productList);

    /* add element DOM to menu */
    menuContainer.appendChild(generatedDOM);

    thisCart.products.push(new cartProduct(menuProduct, generatedDOM));
    console.log('thisCart.products', thisCart.products);

    thisCart.update();
  }

  update(){
    const thisCart = this;

    const deliveryFee = settings.cart.defaultDeliveryFee;

    let totalNumber = 0;

    let subtotalPrice = 0;

    for(let product of thisCart.products){
      console.log('product:', product);

      totalNumber += product.AmountWidget.value;
      console.log('totalNumber', totalNumber);
      subtotalPrice += product.price;
      console.log('subtotalPrie', subtotalPrice);
    }

    // check if there are products in the Cart
    thisCart.totalPrice = 0;

    if(totalNumber >= 1){
    // yes, so add deliveryfee
      thisCart.totalPrice = subtotalPrice + deliveryFee;
      console.log('totalPrice:', thisCart.totalPrice);
    }

    // update calculated deliveryFee, totalNumber, subtotalPrice, totalPrice in the HTML
    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    console.log(deliveryFee);

    thisCart.dom.totalNumber.innerHTML = totalNumber;
    console.log(totalNumber);

    thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
    console.log(subtotalPrice);

    for(let element of thisCart.dom.totalPrice) {
      element.innerHTML = thisCart.totalPrice;
    }
    console.log(thisCart.totalPrice);

  }

  remove(menuProduct){
    const thisCart = this;

    console.log('remove product', menuProduct);

    const indexOfProduct = thisCart.products.indexOf(menuProduct);

    const removeProduct = thisCart.products.splice(indexOfProduct, 1);
    console.log(removeProduct);

    // delete DOM
    menuProduct.dom.wrapper.remove();

    thisCart.update();
  }

  sendOrder(){
    const thisCart = this;
    console.log(thisCart.sendOrder);

    const url = settings.db.url + '/' + settings.db.orders;
    console.log(url);

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: []
    };
    console.log(payload);

    for(let product of thisCart.products) {
      payload.products.push(product.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)

      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }
}

export default cart;