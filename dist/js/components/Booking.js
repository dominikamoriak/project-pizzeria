import { templates, select } from '../settings.js';
import AmountWidget from '../components/AmountWidget.js';

class Booking{
  constructor(element){
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
  }

  render(element){
    const thisBooking = this;

    // generate HTML based on template
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {
      wrapper: element
    };
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.dom.wrapper.peopleAmount.addEventListener('click', function(){
    });
    thisBooking.dom.wrapper.hoursAmount.addEventListener('click', function(){
    });
  }
}
export default Booking;