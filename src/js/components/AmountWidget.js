import { select, settings } from '../settings.js';
import BaseWidget from '../componentsBaseWidget.js';

class AmountWidget extends BaseWidget{
  constructor(element){
    super(element, settings.AmountWidget.defaultValue);

    const thisWidget = this;

    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);

    thisWidget.getElements(element);
    thisWidget.initActions();
    thisWidget.announce();
  }

  getElements(){
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(value){
    return !isNaN(value)
    && value >= settings.AmountWidget.defaultMin 
    && value <= settings.AmountWidget.defaultMax;
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions(){
    const thisWidget = this;
    console.log(thisWidget.initActions);

    /* add 'change' as event listener and use the method setValue for thisWidget.dom.input */
    thisWidget.dom.input.addEventListener('change', function(){
      thisWidget.setValue(thisWidget.dom.input.value);
    });

    /* add 'click' as event listener and use the method setValue forthisWidget.dom.linkDecrease */
    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    /* add 'click' as event listener and use the method setValue for thisWidget.dom.linkIncrease */
    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
}

export default AmountWidget;