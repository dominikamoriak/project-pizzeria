export const select = {
  templateOf: {
    menuProduct: '#template-menu-product',
    cartProduct: '#template-cart-product', // CODE ADDED
    bookingWidget: '#template-booking-widget', // CODE ADDED 2
    homeWidget: '#template-home-widget', // CODE ADDED 3

  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
    pages: '#pages', // CODE ADDED 2
    booking: '.booking-wrapper', // CODE ADDED 2
    home: '.home-wrapper', // CODE ADDED 3
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
    datePicker: { // CODE ADDED 2
      wrapper: '.date-picker', // CODE ADDED 2
      input: 'input[name="date"]', // CODE ADDED 2
    }, // CODE ADDED 2
    hourPicker: { // CODE ADDED 2
      wrapper: '.hour-picker', // CODE ADDED 2
      input: 'input[type="range"]', // CODE ADDED 2
      output: '.output', // CODE ADDED 2
    },
  },
  booking: { // CODE ADDED 2
    peopleAmount: '.people-amount', // CODE ADDED 2
    hoursAmount: '.hours-amount', // CODE ADDED 2
    tables: '.floor-plan .table', // CODE ADDED 2
  }, // CODE ADDED 2
  nav: { // CODE ADDED 2
    links: '.main-nav a', // CODE ADDED 2
  }, // CODE ADDED 2

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
  home: { // CODE ADDED START 3
    cardsWrapper: '.home-cards-wrapper',
    cardWrapper: '.home-card-wrapper',
    cardImage: '.home-card-image',
    cardBackground: '.home-card-background',
    cardImageDescription: '.home-card-image-description',
    carousel: '.carousel',
    gallery: '.home-gallery',
    galleryUp: '.gallery-up',
    galleryDown: '.gallery-down',
    galleryImage: '.gallery-image',
  },
  // CODE ADDED END 3
};

export const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  // CODE ADDED START
  cart: {
    wrapperActive: 'active',
  },
  // CODE ADDED END
  booking: { // CODE ADDED 2
    loading: 'loading', // CODE ADDED 2
    tableBooked: 'booked', // CODE ADDED 2
  }, // CODE ADDED 2
  nav: { // CODE ADDED 2
    active: 'active', // CODE ADDED 2
  }, // CODE ADDED 2
  pages: { // CODE ADDED 2
    active: 'active', // CODE ADDED 2
  } // CODE ADDED 2
};

export const settings = {
  amountWidget: {
    defaultValue: 1,
    defaultMin: 1,
    defaultMax: 9,
  }, // CODE CHANGED
  // CODE ADDED START
  cart: {
    defaultDeliveryFee: 20,
  },
  db: {
    url: '//localhost:3131',
    products: 'products',
    orders: 'orders',
    // CODE ADDED END
    // CODE ADDED START 2
    product: 'products',
    order: 'orders',
    booking: 'bookings',
    event: 'events',
    dateStartParamKey: 'date_gte',
    dateEndParamKey: 'date_lte',
    notRepeatParam: 'repeat=false',
    repeatParam: 'repeat_ne=false',
  },
  hours: {
    open: 12,
    close: 24,
  },
  datePicker: {
    maxDaysInFuture: 14,
  },
  booking: {
    tableIdAttribute: 'data-table',
  },
  // CODE ADDED END 2
};

export const templates = {
  menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  // CODE ADDED START
  cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  // CODE ADDED END
  // CODE ADDED START 2
  bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML),
  // CODE ADDED END 2
  // CODE ADDED START 3
  homeWidget: Handlebars.compile(document.querySelector(select.templateOf.homeWidget).innerHTML),
  // CODE ADDED END 3
};
