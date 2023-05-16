import HeaderTable from './lib/HeaderTable';
import RowsTable from './lib/RowsTable';
import ResultTable from './lib/ResultTable';
import ContextMenu from './lib/ContextMenu';
import ToolsTableMenu from './lib/ToolsTableMenu';
import { throttle } from './helpers/slowDownEvents';
import { products, tableColumns, resultTableList } from '../data/allData';
import {
  getServerAllProducts,
  getServerOptionsDataTable,
  getServerOptionsResultTable,
  setServerAllProducts,
} from './helpers/server';

class ProductTable {
  constructor(extOptions) {
    const defaultsOptions = {
      selectorTable: 'id-table',
      selectorToolbar: 'id-toolbar',
      selectorContextMenu: 'id-context-menu',
      selectorResultTable: 'id-result-table',
      //
      classParrentTable: 'table-wrapper',
      classTable: 'table',
      //
      debag: true,
    };

    // Options

    this.options = Object.assign(extOptions || {}, defaultsOptions);

    this.options.initTableWidth = '99%';

    // Data

    this.data = {};

    this.data.dataProducts = {};
    this.data.optionDataTable = {};
    this.data.optionTotalTable = {};

    this.data.isNewData = false;

    // Nodes

    this.nodes = {};
    this.nodes.$tableParent = undefined;
    this.nodes.$contextMenuParent = undefined;
    this.nodes.$totalTable = undefined;
    this.nodes.$toolbar = undefined;

    this.initParentNodes();

    this.nodes.$table = undefined;
    this.nodes.$tableHeader = undefined;
    this.nodes.$tableBody = undefined;

    // bind

    this.getDataProducts = this.getDataProducts.bind(this);
    this.setDataProducts = this.setDataProducts.bind(this);

    this.getOptionDataTable = this.getOptionDataTable.bind(this);
    this.setOptionDataTable = this.setOptionDataTable.bind(this);

    this.getOptionsResultTable = this.getOptionsResultTable.bind(this);
    this.setOptionsResultTable = this.setOptionsResultTable.bind(this);

    this.setServerDataProducts = this.setServerDataProducts.bind(this);

    this.renderTable = this.renderTable.bind(this);
    this.renderResult = this.renderResult.bind(this);

    this.createNewRows = this.createNewRows.bind(this);
    this.saveChanges = this.saveChanges.bind(this);

    this.getIsNewData = this.getIsNewData.bind(this);
    this.setIsNewData = this.setIsNewData.bind(this);

    this.getMediaQuery = this.getMediaQuery.bind(this);

    // create parent nodes

    this.createTable();

    // initData

    this.initData();
  } // constructor

  // initData

  initData() {
    Promise
      .all([
        getServerAllProducts(),
        getServerOptionsDataTable(),
        getServerOptionsResultTable(),
      ])
      .then(([dataProducts, optionsDataTable, optionTotalTable]) => {
        console.warn('Load server data...');

        this.setDataProducts(dataProducts);
        this.setOptionDataTable(optionsDataTable);
        this.setOptionsResultTable(optionTotalTable);
        this.initComponents();
        window.addEventListener('resize', throttle(this.renderTable, 60));
        this.render();
      })
      .catch((error) => {
        console.error(error, 'Error server data!');
        console.warn('Load local data...');

        this.setDataProducts(products);
        this.setOptionDataTable(tableColumns);
        this.setOptionsResultTable(resultTableList);
        this.initComponents();
        window.addEventListener('resize', throttle(this.renderTable, 60));
        this.render();
      });
  }

  initComponents() {
    this.contextMenu = new ContextMenu({
      parentBlock: this.nodes.$contextMenuParent,
      getOptionDataTable: this.getOptionDataTable,
      setOptionDataTable: this.setOptionDataTable,
      renderTable: this.renderTable,
      getMediaQuery: this.getMediaQuery,
    });

    this.headerTable = new HeaderTable({
      parentBlock: this.nodes.$tableHeader,
      getOptionDataTable: this.getOptionDataTable,
      setOptionDataTable: this.setOptionDataTable,
      renderTable: this.renderTable,
      getMediaQuery: this.getMediaQuery,
    });

    this.rowsTable = new RowsTable({
      parentBlock: this.nodes.$tableBody,
      getDataProducts: this.getDataProducts,
      setDataProducts: this.setDataProducts,
      getOptionDataTable: this.getOptionDataTable,
      setIsNewData: this.setIsNewData,
      setServerDataProducts: this.setServerDataProducts,
      getMediaQuery: this.getMediaQuery,
      renderResult: this.renderResult,
    });

    this.toolsTableMenu = new ToolsTableMenu({
      parentBlock: this.nodes.$toolbar,
      createNewRows: this.createNewRows,
      saveChanges: this.saveChanges,
      getIsNewData: this.getIsNewData,
    });

    this.resultTable = new ResultTable({
      parentBlock: this.nodes.$totalTable,
      getDataProducts: this.getDataProducts,
      getOptionsResultTable: this.getOptionsResultTable,
    });
  }

  initParentNodes() {
    const {
      selectorTable,
      selectorContextMenu,
      selectorResultTable,
      selectorToolbar,
    } = this.options;

    this.nodes.$tableParent = document.getElementById(selectorTable);

    this.nodes.$contextMenuParent = document.getElementById(selectorContextMenu);
    this.nodes.$contextMenuParent.style.position = 'relative';

    this.nodes.$totalTable = document.getElementById(selectorResultTable);
    this.nodes.$toolbar = document.getElementById(selectorToolbar);
  }

  render() {
    this.renderTable();
    this.contextMenu.render();
    this.toolsTableMenu.render();
  }

  renderTable() {
    this.headerTable.render();
    this.rowsTable.render();
    this.resultTable.render();
  }

  renderResult() {
    this.resultTable.render();
  }

  // GET

  getOptionDataTable() {
    return JSON.parse(JSON.stringify(this.data.optionDataTable));
  }

  getOptionsResultTable() {
    return JSON.parse(JSON.stringify(this.data.optionTotalTable));
  }

  getDataProducts() {
    return JSON.parse(JSON.stringify(this.data.dataProducts));
  }

  getIsNewData() {
    return this.data.isNewData;
  }

  getMediaQuery() {
    let mediaQuery = 'desktop';

    if (window.matchMedia('(max-width: 768px)').matches) {
      mediaQuery = 'tablet';
    }
    if (window.matchMedia('(max-width: 480px)').matches) {
      mediaQuery = 'mobile';
    }

    return mediaQuery;
  }

  // SET

  setOptionsResultTable(value) {
    // console.log('setOptionsResultTable > value:', value);
    if (!Array.isArray(value)) {
      console.error('Error change rows data!');
      return;
    }
    this.data.optionTotalTable = value;
  }

  setDataProducts(value) {
    // console.log('setDataProducts > value:', value);
    if (!Array.isArray(value)) {
      console.error('Error change rows data!');
      return;
    }
    this.data.dataProducts = JSON.parse(JSON.stringify(value));
  }

  setServerDataProducts(value, fun) {
    if (!Array.isArray(value)) {
      console.error('Error change rows data!');
      return;
    }
    setServerAllProducts(value)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((json) => {
        console.log(Object.values(json));
        this.setDataProducts(value);
        this.setIsNewData(false);
        this.renderTable();
      })
      .catch((error) => {
        console.error(error, 'Error server');
      });
  }

  setOptionDataTable(value) {
    // console.log('setOptionDataTable > value:', value);
    if (!Array.isArray(value)) {
      console.error('Error change columns data!');
      return;
    }
    this.data.optionDataTable = JSON.parse(JSON.stringify(value));
  }

  setIsNewData(value) {
    if (typeof value !== 'boolean') {
      console.error('Error change value IsNewData!');
      return;
    }
    this.data.isNewData = value;

    this.toolsTableMenu.render();
  }

  createNewRows() {
    this.rowsTable.addNewRows();
  }

  createTable() {
    const { $tableParent } = this.nodes;
    const { classParrentTable, classTable, initTableWidth } = this.options;

    if (!$tableParent) {
      console.error('Error, table has no parent! key id="id-table"');
      return;
    }

    $tableParent.innerHTML = '';
    $tableParent.classList = classParrentTable;

    const $table = document.createElement('table');
    $table.id = 'id-testing-table';
    $table.className = classTable;
    $table.className = classTable;
    $table.style.tableLayout = 'fixed';
    $table.style.width = initTableWidth;
    $tableParent.appendChild($table);
    this.nodes.$table = $table;

    const tableHeader = document.createElement('thead');
    $table.appendChild(tableHeader);
    this.nodes.$tableHeader = tableHeader;

    const tableBody = document.createElement('tbody');
    $table.appendChild(tableBody);
    this.nodes.$tableBody = tableBody;
  }

  saveChanges() {
    this.rowsTable.saveChangeRows();
  }
}

export default ProductTable;
