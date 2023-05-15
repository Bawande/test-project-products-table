class ResultTable {
  constructor(props) {
    const defaultsOptions = {
      classParent: 'result-table',
      //
      classGeneralList: 'result-table__general-list',
      classGeneralItem: 'result-table__general-item',
      classGeneralLable: 'result-table__general-lable',
      classGeneralTotal: 'result-table__general-total',
      //
      classResultinglList: 'result-table__resulting-list',
      classResultinglItem: 'result-table__resulting-item',
      classResultinglLable: 'result-table__resulting-lable',
      classResultinglTotal: 'result-table__resulting-total',
    };
    const {
      parentBlock, getDataProducts, getOptionsResultTable,
    } = props;
    Object.assign(this, {
      parentBlock, getDataProducts, getOptionsResultTable,
    });

    this.options = Object.assign(defaultsOptions);

    this.lists = {};
    this.lists.general = {};
    this.lists.general.listClass = this.options.classGeneralList;
    this.lists.general.itemClass = this.options.classGeneralItem;
    this.lists.general.lableClass = this.options.classGeneralLable;
    this.lists.general.totalClass = this.options.classGeneralTotal;

    this.lists.resulting = {};
    this.lists.resulting.listClass = this.options.classResultinglList;
    this.lists.resulting.itemClass = this.options.classResultinglItem;
    this.lists.resulting.lableClass = this.options.classResultinglLable;
    this.lists.resulting.totalClass = this.options.classResultinglTotal;

    this.resultTableList = this.getOptionsResultTable();

    this.node = {};

    // bind this
    this.createList = this.createList.bind(this);
  } // constructor

  render() {
    // console.log(this.resultTableList);

    if (!this.checkData()) {
      console.error('Error DATA, body table data not found');
      return;
    }

    if (!this.checkParent()) {
      console.error('Error DOMElement, parent block for body table not found');
      return;
    }

    this.сlearParentBlock();

    this.completeTotals();

    this.create();
  }

  checkParent() {
    if (this.parentBlock && this.parentBlock instanceof HTMLElement) {
      return true;
    }
    return false;
  }

  checkData() {
    if (Array.isArray(this.getDataProducts()) && this.getDataProducts().length !== 0) {
      return true;
    }
    return false;
  }

  сlearParentBlock() {
    if (this.parentBlock.hasChildNodes()) {
      this.parentBlock.innerHTML = '';
    }
  }

  create() {
    const $parent = this.parentBlock;

    $parent.classList.add(this.options.classParent);

    $parent.appendChild(this.createList('general'));
    $parent.appendChild(this.createList('resulting'));

    this.createList();
  }

  createList(propertyList = 'general') {
    if (!this.lists.hasOwnProperty(propertyList)) {
      console.log(`Error Property, properties not found ${propertyList}!`);
      return;
    }

    const {
      listClass, itemClass, lableClass, totalClass,
    } = this.lists[propertyList];

    const { resultTableList } = this;

    const $list = document.createElement('ul');
    $list.className = listClass;

    [].forEach.call(resultTableList, (item) => {
      if (item.list === propertyList) {
        const { label, unit, result } = item;

        const $item = document.createElement('li');
        $item.className = itemClass;

        const $lable = document.createElement('span');
        $lable.className = lableClass;
        $lable.innerText = `${label}:`;
        $item.appendChild($lable);

        const $total = document.createElement('span');
        $total.className = totalClass;
        $total.innerText = `${result === null ? 'N/A' : result} ${unit}`;
        $item.appendChild($total);

        $list.appendChild($item);
      }
    });

    return $list;
  }

  completeTotals() {
    const { resultTableList } = this;
    const data = this.getDataProducts();

    function countResult(countKey) {
      return [].reduce.call(data, (sum, item) => {
        if ({}.hasOwnProperty.call(item, countKey) && Number.isFinite(Number(item[countKey]))) {
          if (!item.isDeleted) {
            return sum + Number(item[countKey]);
          }
        }
        return sum;
      }, 0);
    }

    [].forEach.call(resultTableList, (item) => {
      item.result = countResult(item.countKey);
    });
  }

  destroy() {
    console.log('destroy(), no functionality!');
  }
}

export default ResultTable;
