/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED

    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
  // CODE ADDED END
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      console.log('new Product:', thisProduct);

      thisProduct.getElements();
      thisProduct.initAccordion();

      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
      thisProduct. addToCart();
      thisProduct.prepareCartProduct();
      thisProduct.prepareCartProductParams();
    }
  

    renderInMenu(){
      const thisProduct = this;

      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /* create element DOM using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);

      /* add element DOM to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(element){
      const thisProduct = this;

      thisProduct.dom = {};
      thisProduct.dom.wrapper = element;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      console.log(thisProduct.accordionTrigger);
        
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      console.log(thisProduct.form);

      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      console.log(thisProduct.formInputs);

      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      console.log(thisProduct.cartButton);

      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      console.log(thisProduct.priceElem);

      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      console.log(thisProduct.imageWrapper);

      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
      console.log(thisProduct.amountWidgetElem);
    }

    initAccordion(){
      const thisProduct = this;

      /* START: add event listener to clickable trigger on event click */
      thisProduct.accordionTrigger.addEventListener('click', function(event) {

        /* prevent default action for event */
        event.preventDefault();

        /* find active product (product that has active class) */
        const activeProduct = document.querySelector(select.all.menuProductsActive);
        console.log(activeProduct);

        /* if there is active product and it's not thisProduct.element, remove class active from it */
        if(activeProduct && activeProduct !== thisProduct.element){
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }

        /* toggle active class on thisProduct.element */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
        console.log(thisProduct.element);
      });
    }

    initOrderForm(){
      const thisProduct = this;
      console.log(thisProduct.initOrderForm);
      
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }

    processOrder(){
      const thisProduct = this;
      console.log(thisProduct.processOrder);

      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);

      // set price to default price
      let price = thisProduct.data.price;

      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        console.log(paramId);
        console.log(param);

        // for every option in this category
        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          console.log(optionId);
          console.log(option);

          // check if there is param with a name of paramId in formData and if it includes optionId
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          console.log(optionSelected);

          // find image with class .paramId-optionId
          const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
          console.log(optionImage);
          console.log(paramId, optionId);

          // check if the option is selected
          if(optionSelected) {

            // check if the option is not default
            if(!option.default) {
              // add option price to price variable
              price += option.price;
            }
            // check if you can find image
            if(optionImage) {
              // if yes - show image and add class active
              optionImage.classList.add(classNames.menuProduct.imageVisible);
            }

          } else {
            // check if the option is default
            if(option.default) {
              // reduce price variable
              price -= option.price;
            }
            // check if you can find image
            if(optionImage) {
              // if no - hide image and remove class active
              optionImage.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
      }

      // multiply price by amount
      price *= thisProduct.amountWidget.value;

      // add new value: priceSingle to the thisProduct.price
      thisProduct.price + thisProduct.priceSingle;

      // update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;
      console.log(price);
    }

    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new amountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
      });
    }

    addToCart(){
      const thisProduct = this;

      app.cart.add(thisProduct.prepareCartProduct);
    }

    prepareCartProduct(){
      const thisProduct = this;
      console.log(thisProduct.prepareCartProduct);

      const productSummary = {
        id: thisProduct.id,
        name: thisProduct.name,
        amount: thisProduct.amountWidget.value,
        price: thisProduct.price,
        priceSingle: thisProduct.priceSingle,
        params: {prepareCartProductParams}
      };
      console.log(productSummary); 

      return productSummary;
    }

    prepareCartProductParams(){
      const thisProduct = this;
      console.log(thisProduct.prepareCartProductParams);

      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);

      const params = {};
      console.log(params);

      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        console.log(paramId);
        console.log(param);

        // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
        params[paramId] = {
          label: param.label,
          options: {}
        };

        // for every option in this category
        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          console.log(optionId);
          console.log(option);

          // check if there is param with a name of paramId in formData and if it includes optionId
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          console.log(optionSelected);

          // check if the option is selected
          if(optionSelected) {
            // yes, so add the optionSelected to the params[paramId].options
            optionSelected + params[paramId].options;
          }
        }
      }
      return params;
    }

  }
  

  class amountWidget {
    constructor(element){
      const thisWidget = this;

      console.log('amountWidget:', thisWidget);
      console.log('constructor arguments:', element);

      thisWidget.getElements(element);
      thisWidget.setValue(settings.amountWidget.defaultValue);
      thisWidget.initActions();
    }

    getElements(element){
      const thisWidget = this;
    
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value){
      const thisWidget = this;

      const newValue = parseInt(value);

      /* TODO: Add validation */

      /* check if the specified value(newValue) is different from that in the thisWidget.value and if is a number (NOT NULL) */
      if(thisWidget.value !== newValue && !isNaN(newValue)){
   
        /* check if the value is between 1-9 */
        if(newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax){
          /* yes, it's between, so make this */
          thisWidget.value = newValue;
        }
      }
      thisWidget.input.value = thisWidget.value;
      thisWidget.announce();
    }

    initActions(){
      const thisWidget = this;
      console.log(thisWidget.initActions);

      /* add 'change' as event listener and use the method setValue for thisWidget.input */
      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(thisWidget.input.value);
      });

      /* add 'click' as event listener and use the method setValue for thisWidget.linkDecrease */
      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });

      /* add 'click' as event listener and use the method setValue for thisWidget.linkIncrease */
      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
    }

    announce(){
      const thisWidget = this;

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }

  class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = [];
      thisCart.getElements(element);
      console.log('new Cart', thisCart);

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
    }

    add(menuProduct, cartProduct){
      const thisCart = this;

      console.log('adding product', cartProduct);

      /* generate HTML based on template */
      const generatedHTML = templates.cartProduct(thisCart.data);

      /* create element DOM using utils.createElementFromHTML */
      thisCart.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container */
      const generatedDOM = document.querySelector(select.containerOf.cart);

      /* add element DOM to menu */
      generatedDOM.appendChild(thisCart.dom.productList);

      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      console.log('thisCart.products', thisCart.products);
    }
  }

  class CartProduct {
    constructor(menuProduct, element){
      const thisCartProduct = this;
      console.log('cartProduct:', thisCartProduct);

      thisCartProduct.id = menuProduct.id,
      thisCartProduct.name = menuProduct.name,
      thisCartProduct.amount = menuProduct.amountWidget.value,
      thisCartProduct.price = menuProduct.price,
      thisCartProduct.priceSingle = menuProduct.priceSingle,
      thisCartProduct.params = {
        label: thisCartProduct.param,
        options: {
          key: thisCartProduct.id,
          value: thisCartProduct.name,
        },
      },
      thisCartProduct.getElements(element);
    }

    getElements(element){
      const thisCartProduct = this;

      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;

      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      console.log(thisCartProduct.dom.amountWidget);

      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      console.log(thisCartProduct.dom.price);

      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      console.log(thisCartProduct.dom.edit);

      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
      console.log(thisCartProduct.dom.remove);
    }
  }

  const app = {
    initMenu: function(){
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };

  app.init();
}