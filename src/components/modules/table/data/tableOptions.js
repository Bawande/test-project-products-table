/**
 * id: 0, // идентификатор {Number}
 * key: 'action', // ключ для обработчика {String}
 * type: 'SYSTEM', // тип: SYSTEM (поле с внутренней логикой) / DATA (поле с данными) {String}
 * columnOptions: {} // содержит общие настройки для колонки {Object}
 * title: 'Д', // заголовок таблицы {String}
 * validated: '', // тип записи для валидации (''/text/number) {String}
 * lable: 'Действие', // метка поля {String}
//  * order: 2, // порядковый номер колонки {Number}
 * width: 20, // ширина колонки в px {Number}
 * isAutocomplete: false, // включить автозаполнение
 * isDisplay: false, // скрыть при выводе {Boolean}
 * isResize: false, // возможность изменить размер колонки {Boolean}
 * isDraggable: false, // возможность перетаскивать колонку {Boolean}
 * isEditable: false, // возможность редактировать содержимое колонки {Boolean}
 */

/* Template
  {
    id: 0,
    key: '',
    type: '', // SYSTEM | DATA
    columnOptions: {
      validated: '',
      title: '',
      lable: '',
      // order: 0,
      width: 0,
      isAutocomplete: false,
      isDisplay: false,
      isResize: false,
      isDraggable: false,
      isEditable: false,
    },
  },
*/
const tableColumns = [
  {
    id: 0,
    key: 'index',
    type: 'SYSTEM', // SYSTEM | DATA
    columnOptions: {
      title: 'Номер',
      lable: 'Номер',
      validated: '',
      // order: 0,
      width: '48px',
      isAutocomplete: false,
      isDisplay: true,
      isAlwaysVisible: true,
      isResize: false,
      isDraggable: false,
      isEditable: false,
      mediaQuery: ['desktop'],
    },
  },
  {
    id: 1,
    key: 'action',
    type: 'SYSTEM', // SYSTEM | DATA
    columnOptions: {
      title: 'Д',
      lable: 'Действие',
      validated: '',
      // order: 1,
      width: '22px',
      isAutocomplete: false,
      isDisplay: true,
      isAlwaysVisible: true,
      isResize: false,
      isDraggable: false,
      isEditable: false,
      mediaQuery: ['desktop', 'tablet', 'mobile'],
    },
  },
  {
    id: 3,
    key: 'longName',
    type: 'DATA', // SYSTEM | DATA
    columnOptions: {
      title: 'Наименование еденицы',
      lable: 'Наименование еденицы',
      validated: 'text',
      // order: 2,
      width: 2.85,
      isAutocomplete: true,
      isDisplay: true,
      isAlwaysVisible: true,
      isResize: true,
      isDraggable: true,
      isEditable: true,
      mediaQuery: ['desktop', 'tablet', 'mobile'],
    },
  },
  {
    id: 4,
    key: 'price',
    type: 'DATA', // SYSTEM | DATA
    columnOptions: {
      title: 'Цена',
      lable: 'Цена',
      validated: 'number',
      // order: 3,
      width: 1,
      isAutocomplete: false,
      isDisplay: true,
      isAlwaysVisible: true,
      isResize: true,
      isDraggable: true,
      isEditable: true,
      mediaQuery: ['desktop', 'tablet', 'mobile'],
    },
  },
  {
    id: 5,
    key: 'quantity',
    type: 'DATA', // SYSTEM | DATA
    columnOptions: {
      title: 'Кол-во',
      lable: 'Кол-во',
      validated: 'number',
      // order: 4,
      width: 1,
      isAutocomplete: false,
      isDisplay: true,
      isAlwaysVisible: true,
      isResize: true,
      isDraggable: true,
      isEditable: true,
      mediaQuery: ['desktop', 'tablet', 'mobile'],
    },
  },
  {
    id: 6,
    key: 'shortName',
    type: 'DATA', // SYSTEM | DATA
    columnOptions: {
      title: 'Название товара',
      lable: 'Название товара',
      validated: 'text',
      // order: 5,
      width: '10%',
      isAutocomplete: true,
      isDisplay: true,
      isAlwaysVisible: false,
      isResize: true,
      isDraggable: true,
      isEditable: true,
      mediaQuery: ['desktop', 'tablet', 'mobile'],
    },
  },
  {
    id: 10,
    key: 'weight',
    type: 'DATA', // SYSTEM | DATA
    columnOptions: {
      title: 'Вес',
      lable: 'Вес',
      validated: '',
      // order: 1000,
      width: 0.63,
      isAutocomplete: false,
      isDisplay: false,
      isAlwaysVisible: false,
      isResize: true,
      isDraggable: true,
      isEditable: true,
      mediaQuery: ['desktop', 'tablet', 'mobile'],
    },
  },
  {
    id: 8,
    key: 'shippingСost',
    type: 'DATA', // SYSTEM | DATA
    columnOptions: {
      title: 'Цена доставки, руб',
      lable: 'Цена доставки, руб',
      validated: 'number',
      // order: 6,
      width: '10%',
      isAutocomplete: false,
      isDisplay: false,
      isAlwaysVisible: false,
      isResize: true,
      isDraggable: true,
      isEditable: false,
      mediaQuery: ['desktop', 'tablet', 'mobile'],
    },
  },
  {
    id: 9,
    key: 'maxCapacity',
    type: 'DATA', // SYSTEM | DATA
    columnOptions: {
      title: 'Max грузоподъемность, кг',
      lable: 'Max грузоподъемность, кг',
      validated: 'number',
      // order: 8,
      width: 1,
      isAutocomplete: false,
      isDisplay: false,
      isAlwaysVisible: false,
      isResize: true,
      isDraggable: true,
      isEditable: true,
      mediaQuery: ['desktop', 'tablet', 'mobile'],
    },
  },
  {
    id: 7,
    key: 'total',
    type: 'DATA', // SYSTEM | DATA
    columnOptions: {
      title: 'Итого',
      lable: 'Итого',
      validated: '',
      // order: 1000,
      width: 0.63,
      isAutocomplete: false,
      isDisplay: true,
      isAlwaysVisible: true,
      isResize: true,
      isDraggable: false,
      isEditable: true,
      mediaQuery: ['desktop', 'tablet', 'mobile'],
    },
  },

];

export default tableColumns;
