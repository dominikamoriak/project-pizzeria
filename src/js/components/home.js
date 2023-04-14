import { templates, select } from '../settings.js';

class home {
  constructor(element){
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidgets();
  }

  render(element){
    const thisHome = this;

    // generate HTML based on template
    const generatedHTML = templates.homeWidget();

    thisHome.dom = {};
    thisHome.dom.wrapper = element,
    thisHome.dom.wrapper.innerHTML = generatedHTML;

    thisHome.dom.homeContainer = thisHome.dom.wrapper.querySelector(select.containerOf.home);
    thisHome.dom.carousel = thisHome.dom.wrapper.querySelector(select.home.carousel);
  }

  initWidgets(){
    const thisHome = this;

    // eslint-disable-next-line no-undef
    new Flickity(thisHome.dom.carousel, {
      cellAlign: 'left',
      contain: true,
      autoPlay: true,
      prevNextButtons: true,
      wrapAround: true,
    });
  }
}

export default home;