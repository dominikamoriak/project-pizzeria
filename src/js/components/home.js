import { templates, select } from '../settings.js';

const templateData = {
  startingHour: '12am',
  closingHour: '12pm',
  slides: [
    {
      image: 'https://i.postimg.cc/tRmhs3vv/pizza-3.jpg',
      title: 'AMAZING SERVICE!',
      description: '<p>Duis aute irure dolor in reprehenderit in voluptate<br>velit esse cillum dolore eu fugiat nulla pariatur. <br>Excepteur sint occaecat cupidatat non proident.</p>',
      author: ' Margaret Osborne'
    },
    {
      image: 'https://i.postimg.cc/tRmhs3vv/pizza-3.jpg',
      title: 'Great venue',
      description: '<p>Duis aute irure dolor in reprehenderit in voluptate<br>velit esse cillum dolore eu fugiat nulla pariatur. <br>Excepteur sint occaecat cupidatat non proident.</p>',
      author: ' Tommy Peron'
    },
    {
      image: 'https://i.postimg.cc/tRmhs3vv/pizza-3.jpg',
      title: 'Best Service',
      description: '<p>Duis aute irure dolor in reprehenderit in voluptate<br>velit esse cillum dolore eu fugiat nulla pariatur. <br>Excepteur sint occaecat cupidatat non proident.</p>',
      author: ' Kaslik Amanow'
    },
    {
      image: 'https://i.postimg.cc/tRmhs3vv/pizza-3.jpg',
      title: 'Good snacks',
      description: '<p>Duis aute irure dolor in reprehenderit in voluptate<br>velit esse cillum dolore eu fugiat nulla pariatur. <br>Excepteur sint occaecat cupidatat non proident.</p>',
      author: ' Rupert Seamson'
    },
  ]
};

class home {
  constructor(element){
    const thisHome = this;

    thisHome.render(element);
    // thisHome.initWidgets();
  }

  render(element){
    const thisHome = this;

    // generate HTML based on template
    const generatedHTML = templates.homeWidget(templateData);

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