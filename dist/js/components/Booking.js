import { templates, select, settings, classNames } from '../settings.js';
import { utils } from '../utils.js';
import amountWidget from '../components/amountWidget.js';
import datePicker from '../components/datePicker.js';
import hourPicker from '../components/hourPicker.js';

class booking{
  constructor(element){
    const thisBooking = this;

    thisBooking.selectedTable = {};

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    console.log('getData params', params);

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
    };
    console.log('getData params', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        console.log(bookings);
        console.log(eventsCurrent);
        console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }

    console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    for(let index = 0; index <3; index++){
      console.log('loop', index);
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      console.log('loop', hourBlock);

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
        ||
        typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'    
    ){
      allAvailable = true;
    }

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
            &&
            thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  render(element){
    const thisBooking = this;

    // generate HTML based on template
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element,
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper),
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper),
    
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
 
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(select.booking.floorPlan);
  
    thisBooking.dom.bookingForm = thisBooking.dom.wrapper.querySelector('.booking-form');
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector('.booking-address');
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector('.booking-phone');
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new amountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new amountWidget(thisBooking.dom.hoursAmount);

    thisBooking.dom.peopleAmount.addEventListener('click', function(){
      console.log('peopleAmount clicked');
    });
    thisBooking.dom.hoursAmount.addEventListener('click', function(){
      console.log('hourAmount clicked');
    });

    thisBooking.datePicker = new datePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new hourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });

    // add EventListener to the div of floorPlan
    thisBooking.dom.floorPlan.addEventListener('click', function(event){
      thisBooking.clickedTable = event.target;
      // check if table is clicked and has class table
      if(thisBooking.clickedTable.classList.contains('table')){
        // yes, so pass it to the method initTables
        thisBooking.initTables(thisBooking.clickedTable);
      }
    });

    thisBooking.dom.bookingForm.addEventListener('submit', function (event){
      event.preventDefault();
      thisBooking.sendBooking();
    });
  }

  initTables(clickedTable){
    const thisBooking = this;

    // reset selectedTable when date, hour, duration or peopleAmount is changed
    thisBooking.resetTable();

    // get tableNumber from data-table attribute
    thisBooking.tableNumber = clickedTable.getAttribute(settings.booking.tableIdAttribute);

    // check if the clickedTable is free
    if(!clickedTable.classList.contains(classNames.booking.tableBooked)){
    // check if another tables has .selected class
      const selectedTables = thisBooking.dom.wrapper.querySelectorAll('.selected');
      // yes, so remove selected class from another tables
      for(let selectedTable of selectedTables){
        selectedTable.classList.remove('selected');
      }
      // and add selected class to the correct clickedTable
      clickedTable.classList.add('selected');
      // save selectedTable information to the object: thisBooking.selectedTable
      thisBooking.selectedTable = {
        tableNumber: clickedTable.getAttribute(settings.booking.tableIdAttribute),
        date: thisBooking.datePicker.value,
        hour: thisBooking.hourPicker.value,
        duration: thisBooking.hoursAmount.value,
        people: thisBooking.peopleAmount.value,
        starters: [],
      };
    } else {
      alert('This table is already booked. Please choose another one.');
    }
  }

  resetTable(){
    const thisBooking = this;

    // check if the date, hour, duration or people amount is change
    if(thisBooking.selectedTable &&
        (thisBooking.selectedTable.date !== thisBooking.datePicker.value ||
        thisBooking.selectedTable.hour !== thisBooking.hourPicker.value ||
        thisBooking.selectedTable.duration !== thisBooking.hoursAmount.value ||
        thisBooking.selectedTable.people !== thisBooking.peopleAmount.value)
    ){
    // find the clickedTable
      thisBooking.clickedTable = thisBooking.dom.wrapper.querySelector('.selected');
      // check if the clickedTable is clicked again
      if(thisBooking.clickedTable){
        // yes so, remove selected class from clickedTable
        thisBooking.clickedTable.classList.remove('selected');
      }
    }
    // reset selectedTable information in the object thisBooking.selectedTable = {}
    thisBooking.selectedTable = null;
  }

  sendBooking(){
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.booking;
    console.log(url);

    const payload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.selectedTable,
      duration: parseInt(thisBooking.hoursAmount.value),
      ppl: parseInt(thisBooking.peopleAmount.value),
      starters: [],
      phone: thisBooking.phone.value,
      address: thisBooking.address.value,
    };
    console.log(payload);

    for(let starter of thisBooking.starters){
      if(starter.checked){
        thisBooking.starters.push(starter.value);
      }
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
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
        thisBooking.makeBooked(parsedResponse.date, parsedResponse.hour, parsedResponse.duration, parsedResponse.table);
      })
      .catch(function(error){
        console.error('Error', error);
      });
  }
}

export default booking;