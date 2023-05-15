class HeaderTable {
  constructor(props) {
    const defaultsOptions = {
      classParent: 'table-header',
      classHeaderRow: 'table-header__row',
      classHeaderColumn: 'table-header__column',
      classHeaderContent: 'table-header__content',
      classColumnResizer: 'table-header__resizer',
      //
      minWidthColumn: 70,
    };
    const {
      parentBlock, getOptionDataTable, setOptionDataTable, callData, renderTable, getMediaQuery,
    } = props;
    Object.assign(this, {
      parentBlock, getOptionDataTable, setOptionDataTable, callData, renderTable, getMediaQuery,
    });

    this.options = Object.assign(defaultsOptions);

    this.options.tableWidth = null;
    this.options.totalShowColumns = null;
    this.options.sizeColumns = [];

    this.node = {};

    this.dataOptionTable = [];

    this.dragColumn = false;
    this.dragCurentColumn = undefined;

    // bind this
    this.handlerColumnMouseEnter = this.handlerColumnMouseEnter.bind(this);
    this.handlerColumnDragStart = this.handlerColumnDragStart.bind(this);
    this.handlerColumnDragLeave = this.handlerColumnDragLeave.bind(this);
    this.handlerColumnDragEnd = this.handlerColumnDragEnd.bind(this);
    this.handlerColumnDragOver = this.handlerColumnDragOver.bind(this);
    this.handlerColumnDrop = this.handlerColumnDrop.bind(this);
  } // constructor

  render() {
    // console.log('start render > HeaderTable');

    if (this.getMediaQuery() !== 'desktop') {
      this.сlearParentBlock();

      return;
    }

    this.dataOptionTable = this.getOptionDataTable();

    if (!this.checkData()) {
      console.error('Error DATA, header table data not found');
      return;
    }

    if (!this.checkParent()) {
      console.error('Error DOMElement, parent block for header table not found');
      return;
    }

    this.сlearParentBlock();

    this.tableOptionsCalculator();

    this.create();
  }

  tableOptionsCalculator() {
    const $parent = this.parentBlock;
    const { dataOptionTable } = this;
    const { minWidthColumn } = this.options;

    function roundUp(num, precision) {
      precision = 10 ** precision;
      return Math.ceil(num * precision) / precision;
    }

    const widthParent = $parent.getBoundingClientRect().width;

    const sizeColumns = [];
    sizeColumns.areeWidth = widthParent;
    sizeColumns.part = 0;
    sizeColumns.onePart = 0;

    const totalColumnsShown = [].reduce.call(dataOptionTable, (result, col) => {
      if (col.columnOptions.isDisplay) {
        sizeColumns.push({
          id: col.id,
          width: col.columnOptions.width,
          fixid: typeof col.columnOptions.width === 'string',
        });
        if (typeof col.columnOptions.width !== 'string') {
          sizeColumns.part += col.columnOptions.width;
        }
        return result + 1;
      }
      return result;
    }, 0);

    sizeColumns.forEach((item, index) => {
      if (item.fixid) {
        if (item.width.slice(-2) === 'px') {
          const width = Number(item.width.slice(0, -2));
          sizeColumns[index].width = roundUp((+width), 2);
          sizeColumns.areeWidth -= roundUp((+width), 2);
          sizeColumns.onePart = roundUp((+sizeColumns.areeWidth / sizeColumns.part), 2);
        } else if (item.width.slice(-1) === '%') {
          const width = Number(item.width.slice(0, -1));
          sizeColumns[index].width = roundUp((+widthParent * +width) / 100, 2);
          sizeColumns.areeWidth -= roundUp((+widthParent * +width) / 100, 2);
          sizeColumns.onePart = roundUp((+sizeColumns.areeWidth / sizeColumns.part), 2);
        }
      }
    });

    sizeColumns.forEach((item, index) => {
      if (!item.fixid) {
        const max = Math.max(minWidthColumn, roundUp(sizeColumns.onePart * item.width, 2));
        sizeColumns[index].width = max;
      }
    });

    this.options.totalShowColumns = totalColumnsShown;
    this.options.tableWidth = widthParent;
    this.options.sizeColumns = Array.from(sizeColumns);
  }

  fixColumnWidth() {
    // console.log('run > fixColumnWidth');

    const { sizeColumns } = this.options;
    const { dataOptionTable } = this;

    [].forEach.call(sizeColumns, (item) => {
      const indexFixRow = [].findIndex.call(dataOptionTable, (row) => row.id === item.id);

      dataOptionTable[indexFixRow].columnOptions.width = `${item.width}px`;
    });

    this.setOptionDataTable(dataOptionTable);
  }

  checkParent() {
    // console.log(this.parentBlock);
    if (this.parentBlock && this.parentBlock instanceof HTMLElement) {
      return true;
    }
    return false;
  }

  checkData() {
    if (Array.isArray(this.dataOptionTable) && this.dataOptionTable.length !== 0) {
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
    const { dataOptionTable } = this;
    const { sizeColumns } = this.options;
    const {
      classParent,
      classHeaderRow,
      classHeaderColumn,
      classHeaderContent,
    } = this.options;

    $parent.classList.add(classParent);

    const $tableRow = document.createElement('tr');
    $tableRow.className = classHeaderRow;
    $parent.appendChild($tableRow);

    dataOptionTable
      .forEach((column, index, array) => {
        const { id } = column;
        const {
          title,
          isDisplay,
          isResize,
          isDraggable,
        } = column.columnOptions;

        let isLastiteration = false;

        if (index === array.length - 1) {
          isLastiteration = true;
        }

        if (isDisplay) {
          const tableHeadingColumn = document.createElement('th');
          tableHeadingColumn.className = classHeaderColumn;
          tableHeadingColumn.dataset.headerId = `${id}`;

          const sizeWidthIndex = sizeColumns.findIndex((item) => item.id === id);

          tableHeadingColumn.style.width = `${sizeColumns[sizeWidthIndex].width}px`;

          const contentBlock = document.createElement('div');
          contentBlock.innerText = title;

          contentBlock.className = classHeaderContent;
          contentBlock.style.whiteSpace = 'nowrap';
          contentBlock.style.overflow = 'hidden';
          contentBlock.style.margin = '2px';

          tableHeadingColumn.appendChild(contentBlock);
          $tableRow.appendChild(tableHeadingColumn);

          if (isLastiteration) {
            const $lastColumn = document.createElement('th');
            $lastColumn.style.width = 'auto';
            $tableRow.appendChild($lastColumn);
          }

          if (isResize) {
            this.createResizableColumn(tableHeadingColumn);
          }

          if (isDraggable && !isLastiteration) {
            tableHeadingColumn.draggable = false;

            // mouse event
            contentBlock.addEventListener('mouseenter', this.handlerColumnMouseEnter);

            // drag event
            tableHeadingColumn.addEventListener('dragstart', (event) => { this.handlerColumnDragStart(event, column); });
            tableHeadingColumn.addEventListener('dragend', (event) => { this.handlerColumnDragEnd(event); });

            tableHeadingColumn.addEventListener('dragover', (event) => { this.handlerColumnDragOver(event); });
            tableHeadingColumn.addEventListener('dragleave', (event) => { this.handlerColumnDragLeave(event); });
            tableHeadingColumn.addEventListener('dragenter', (event) => { this.handlerColumnDragEnter(event); });

            tableHeadingColumn.addEventListener('drop', (event) => { this.handlerColumnDrop(event, column); });
          }
        }
      });
  }

  // createResizableColumn

  createResizableColumn($column) {
    const { classColumnResizer } = this.options;
    const $table = $column.closest('table');

    const $resizer = document.createElement('div');
    $resizer.className = classColumnResizer;
    $column.appendChild($resizer);

    this.handlerChangeColumnSize($column, $resizer);

    $resizer.style.height = `${$table.offsetHeight}px`;

    $resizer.onmouseenter = (e) => {
      $resizer.style.height = `${$table.offsetHeight}px`;
    };
  }

  // updateWidthInData

  updateWidthInData($column, widthColumn) {
    const columns = this.dataOptionTable;
    const columnId = Number($column.dataset.headerId);

    if ($column.tagName !== 'TH' && !columnId) return;

    [].forEach.call(columns, (col, index) => {
      if (col.id === columnId) {
        columns[index] = { ...col, columnOptions: { ...col.columnOptions, width: widthColumn } };
      }
    });

    this.setOptionDataTable(columns);
  }

  // handlers

  handlerChangeColumnSize($column, $resizer) {
    let x = 0;
    let widthColumn = 0;
    let widthColumnEnd = 0;

    const $table = $column.closest('table');

    const widthTable = $table.getBoundingClientRect().width;

    const mouseDownHandler = (mouseDownEvent) => {
      x = mouseDownEvent.clientX;

      const styles = window.getComputedStyle($column);
      widthColumn = parseInt(styles.width, 10);

      const mouseMoveHandler = (mouseMoveEvent) => {
        const dx = mouseMoveEvent.clientX - x;
        if (widthColumn + dx > 20 && widthColumn + dx < (widthTable / 2)) {
          widthColumnEnd = widthColumn + dx;
          $column.style.width = `${widthColumnEnd}px`;
        }
      };

      const mouseUpHandler = () => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);

        this.tableOptionsCalculator();

        this.fixColumnWidth();

        this.updateWidthInData($column, `${widthColumnEnd}px`);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    $resizer.addEventListener('mousedown', mouseDownHandler);
  }

  handlerColumnMouseEnter(event) {
    const $columnDraggable = event.target.closest('[data-header-id]');

    const handlerColumnMouseLeave = () => {
      $columnDraggable.draggable = false;
      event.target.removeEventListener('mouseleave', handlerColumnMouseLeave);
    };

    event.target.addEventListener('mouseleave', handlerColumnMouseLeave);

    $columnDraggable.draggable = true;
  }

  // event drag and drop

  handlerColumnDragStart(e, column) {
    // при начале перетаскивания элемента
    setTimeout(() => {
      e.target.style.opacity = '0.3';
    }, 100);

    const $parent = e.target.closest('thead');
    [].forEach.call($parent.querySelectorAll('[draggable]'), (elem) => {
      elem.classList.add('drag-overlay-on');
    });

    this.dragColumn = true;
    this.dragCurentColumn = column;
  }

  handlerColumnDragEnd(e) {
    // когда перетаскивание завершается
    this.dragColumn = false;
    this.dragCurentColumn = null;

    e.target.style.display = '';
    e.currentTarget.style.opacity = '1';

    if (this.dropColumn) {
      this.dropColumn = false;

      setTimeout(() => {
        this.renderTable();
      }, 0);
    }
  }

  handlerColumnDragOver(e) {
    // когда элемент перетаскивается в допустимую зону
    if (this.dragColumn) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  }

  handlerColumnDragEnter(e) {
    // когда элемент попадает в допустимую зону
    if (this.dropColumn) {
      e.currentTarget.classList.add('drag-hover');
    }
  }

  handlerColumnDragLeave(e) {
    // когда элемент покидает допустимую зону
    e.currentTarget.classList.remove('drag-hover');
  }

  handlerColumnDrop(e, column) {
    // когда элемент отпускают в допустимую зону

    e.preventDefault();

    e.currentTarget.classList.remove('drag-hover');
    const columns = this.dataOptionTable;
    const $dragColumn = this.dragCurentColumn;

    const dropIndex = [].findIndex.call(columns, (col) => col.id === column.id);
    const dragIndex = [].findIndex.call(columns, (col) => col.id === $dragColumn.id);

    const cut = columns.splice(dragIndex, 1)[0];
    columns.splice(dropIndex, 0, cut);

    this.setOptionDataTable(columns);

    this.dropColumn = true;
  }

  destroy() {
    console.log('destroy(), no functionality!');
  }
}

export default HeaderTable;
