import { select, classNames, templates } from '../settings.js';
import { utils } from '../utils.js';
import amountWidget from '../components/amountWidget.js';

class product{
  constructor(id, data){
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    console.log('new Product:', thisProduct);

    thisProduct.getElements();
    thisProduct.initAccordion();

    thisProduct.initOrderForm();
    thisProduct.initamountWidget();
    thisProduct.processOrder();
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
    thisProduct.priceSingle = price;
    price *= thisProduct.amountWidget.value;

    thisProduct.price = price;

    // update calculated price in the HTML
    thisProduct.priceElem.innerHTML = price;
    console.log(price);
  }

  initamountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new amountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }

  addToCart(){
    const thisProduct = this;

    //app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

  prepareCartProduct(){
    const thisProduct = this;
    console.log(thisProduct.prepareCartProduct);

    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      price: thisProduct.data.price,
      priceSingle: thisProduct.data.price,
      params: thisProduct.prepareCartProductParams()
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
        options: []
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
          params[paramId].options.push(option.label);
        }
      }
    }
    return params;
  }

}
  
export default product;