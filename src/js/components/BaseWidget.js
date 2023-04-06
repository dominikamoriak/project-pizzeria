class baseWidget{
  constructor(wrapperElement, initialValue){
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;
  }

  get value(){
    const thisWidget = this;

    return thisWidget.correctValue;
  }

  set value(value){
    const thisWidget = this;

    const newValue = thisWidget.parseValue(value);

    /* TODO: Add validation */

    /* check if the specified value(newValue) is different from that in the thisWidget.correctValue and if is a number (NOT NULL) */
    if(thisWidget.correctValue !== newValue && !isNaN(newValue)){

      /* check if the value is between 1-9 */
      if(thisWidget.isValid(newValue)){
        /* yes, it's between, so make this */
        thisWidget.correctValue = newValue;
      }
    }
    thisWidget.renderValue();
    thisWidget.announce();
  }

  setValue(value){
    const thisWidget = this;

    thisWidget.value = value;
  }

  parseValue(value){
    return parseInt(value);
  }

  isValid(value){
    return !isNaN(value);
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }

  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated',{
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default baseWidget;