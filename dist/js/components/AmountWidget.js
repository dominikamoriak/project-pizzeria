import { select, settings } from '../settings.js';

class AmountWidget {
  constructor(element){
    const thisWidget = this;

    console.log('AmountWidget:', thisWidget);
    console.log('constructor arguments:', element);

    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value || settings.AmountWidget.defaultValue);
    thisWidget.initActions();
    thisWidget.announce();
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
      if(newValue >= settings.AmountWidget.defaultMin && newValue <= settings.AmountWidget.defaultMax){
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

    const event = new CustomEvent('updated',{
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;