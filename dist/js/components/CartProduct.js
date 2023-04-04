import { select } from '../settings.js';
import AmountWidget from '../components/AmountWidget.js';

class CartProduct {
  constructor(menuProduct, element){
    const thisCartProduct = this;
    console.log('cartProduct:', thisCartProduct);

    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.params = menuProduct.params;

    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
    
  }

  getElements(element){
    const thisCartProduct = this;

    thisCartProduct.dom = {};
    thisCartProduct.dom.wrapper = element;

    thisCartProduct.dom.AmountWidgetElem = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.AmountWidget);
    console.log(thisCartProduct.dom.AmountWidgetElem);

    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    console.log(thisCartProduct.dom.price);

    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    console.log(thisCartProduct.dom.edit);

    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    console.log(thisCartProduct.dom.remove);
  }

  initAmountWidget(){
    const thisCartProduct = this;

    thisCartProduct.AmountWidget = new AmountWidget(thisCartProduct.dom.AmountWidgetElem);

    thisCartProduct.dom.AmountWidgetElem.addEventListener('updated', function(){
      console.log('price', thisCartProduct.price);
      thisCartProduct.price = thisCartProduct.AmountWidget.value * thisCartProduct.priceSingle;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
    });
  }

  remove(){
    const thisCartProduct = this;
    console.log(thisCartProduct.remove);

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });

    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }

  initActions(){
    const thisCartProduct = this;

    thisCartProduct.dom.edit.addEventListener('click', function(event){
      event.preventDefault();
    });

    thisCartProduct.dom.remove.addEventListener('click', function(event){
      event.preventDefault();
      thisCartProduct.remove();
    });
  }

  getData(){
    const thisCartProduct = this;
    console.log(thisCartProduct.getData);

    const productCartSummary = {
      id: thisCartProduct.id,
      name: thisCartProduct.name,
      amount: thisCartProduct.amount,
      price: thisCartProduct.price,
      priceSingle: thisCartProduct.priceSingle,
      params: thisCartProduct.params,
    };
    console.log(productCartSummary);

    return productCartSummary;
  }
}

export default CartProduct;