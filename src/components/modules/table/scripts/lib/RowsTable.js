import autocomplete from '../helpers/autocomplete';

class RowsTable {
  constructor(props) {
    const defaultsOptions = {
      maxRows: 100,
      classParent: 'table-body',
      classRow: 'table-body__row',
      classTempRow: 'table-body__temp-row',
      classTempRowItem: 'table-body__temp-item',
      //
      classColumn: 'table-body__column',
      classLabelColumn: 'table-body__lable',
      classContentBlock: 'table-body__content',
      classInputBlock: 'table-body__input-value',
      classStaticBlock: 'table-body__statick-value',
      classSystemBlockСapture: 'table-body__capture',
      //
      classSystemBlockActionButton: 'table-body__actions-button',
      classSystemBlockActionList: 'table-body__actions-list',
      classSystemBlockActionItem: 'table-body__actions-item',
      //
      classDragHover: 'drag-hover',
      classDragOverlay: 'overlay-on',
      classDragBefore: 'insert-before',
      classDragAfter: 'insert-after',
      classDragDraggrable: 'draggrable',
    };
    const {
      parentBlock,
      getDataProducts,
      getOptionDataTable,
      getMediaQuery,
      setDataProducts,
      setServerDataProducts,
      setIsNewData,
      renderResult,
    } = props;
    Object.assign(this, {
      parentBlock,
      getDataProducts,
      getOptionDataTable,
      getMediaQuery,
      setDataProducts,
      setServerDataProducts,
      setIsNewData,
      renderResult,
    });

    this.options = Object.assign(defaultsOptions);

    this.newRow = {};
    this.newRow.isNewRow = false;
    this.newRow.idNewRow = null;
    this.newRow.objectNewRow = {};

    this.node = {};

    this.dragRow = false;
    this.dragCurentIndex = undefined;

    this.data = {};
    this.data.rows = {};
    this.data.columns = {};

    // bind this
    this.handlerRowMouseEnter = this.handlerRowMouseEnter.bind(this);
    this.handlerRowDragEnd = this.handlerRowDragEnd.bind(this);
    this.handlerActionRemoveRow = this.handlerActionRemoveRow.bind(this);

    this.addNewRows = this.addNewRows.bind(this);
    this.saveChangeRows = this.saveChangeRows.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.createInputBlock = this.createInputBlock.bind(this);
  } // constructor

  render() {
    // console.log(this.getMediaQuery());

    this.init();

    if (!this.checkDataRows()) {
      console.log('Error DATA, body table data not found');
      return;
    }

    if (!this.checkDataColumns()) {
      console.log('Error DATA, body table data not found');
      return;
    }

    if (!this.checkParent()) {
      console.log('Error DOMElement, parent block for body table not found');
      return;
    }

    this.update();
  }

  update() {
    this.сlearParentBlock();
    this.create();
    this.renderResult();
  }

  init() {
    this.data.rows = this.getDataProducts();
    this.data.columns = this.getOptionDataTable();
  }

  // checkParent

  checkParent() {
    // console.log(this.parentBlock);
    if (this.parentBlock && this.parentBlock instanceof HTMLElement) {
      return true;
    }
    return false;
  }

  // checkDataRows

  checkDataRows() {
    if (Array.isArray(this.getDataProducts()) && this.getDataProducts().length !== 0) {
      return true;
    }
    return false;
  }

  // checkDataColumns

  checkDataColumns() {
    if (Array.isArray(this.getOptionDataTable()) && this.getOptionDataTable().length !== 0) {
      return true;
    }
    return false;
  }

  // checkValueRows

  checkValueRows() {
    // console.log('check value!');
    return true;
  }

  сlearParentBlock() {
    if (this.parentBlock.hasChildNodes()) {
      this.parentBlock.innerHTML = '';
    }
  }

  // create

  create() {
    const $parent = this.parentBlock;
    const { rows } = this.data;
    const { columns } = this.data;
    const {
      classRow,
      classColumn,
      classContentBlock,
      classLabelColumn,
    } = this.options;

    const limitRows = Math.min(rows.length, this.options.maxRows);
    let counter = 0;

    for (let i = 0; i < limitRows; i += 1) {
      const row = rows[i];
      const { id, isDeleted } = row;
      const count = counter;

      if (!isDeleted) {
        const tableRow = document.createElement('tr');
        tableRow.className = classRow;
        // drag #event
        if (this.getMediaQuery() === 'desktop') {
          tableRow.draggable = false;
          tableRow.ondragstart = (event) => { this.handlerRowDragStart(event, id); };
          tableRow.ondragend = (event) => { this.handlerRowDragEnd(event); };

          tableRow.ondragover = (event) => { this.handlerRowDragOver(event, id); };
          tableRow.ondragenter = (event) => { this.handlerRowDragEnter(event, id); };
          tableRow.ondragleave = (event) => { this.handlerRowDragLeave(event); };
          tableRow.ondrop = (event) => { this.handlerRowDrop(event, id); };
        }

        const fragment = document.createDocumentFragment();

        columns
          .forEach((column, index, array) => {
            const {
              key,
              type,
            } = column;
            const {
              lable,
              isAutocomplete,
              isDisplay,
              isEditable,
              mediaQuery,
            } = column.columnOptions;

            const isMedia = () => {
              if (mediaQuery.includes(this.getMediaQuery())) {
                return true;
              }
              return false;
            };

            if (isDisplay && isMedia()) {
              const $tableHeadingColumn = document.createElement('td');
              $tableHeadingColumn.className = classColumn;
              $tableHeadingColumn.style.position = 'relative';

              let isLastiteration = false;

              if (index === array.length - 1) {
                isLastiteration = true;
              }

              let value = '';

              const $contentBlock = document.createElement('div');
              $contentBlock.className = classContentBlock;
              $contentBlock.style.overflow = 'hidden';

              $tableHeadingColumn.appendChild($contentBlock);

              if (type === 'DATA' && {}.hasOwnProperty.call(row, key)) {
                value = String(row[key]);

                if (isEditable) {
                  const $inputBlock = this.createInputBlock(value, id, key, isAutocomplete);
                  $inputBlock.dataset.dataId = `${key}-${id}`;

                  $contentBlock.appendChild($inputBlock);
                } else {
                  const $textBlock = this.createStaticBlock(value);
                  $contentBlock.appendChild($textBlock);
                }
              }

              if (type === 'SYSTEM') {
                if (key === 'index') {
                  const dragBlock = this.createSystemBlockСapture();
                  $contentBlock.appendChild(dragBlock);

                  const $textBlock = this.createStaticBlock(`${count + 1}`);
                  $contentBlock.appendChild($textBlock);
                }

                if (key === 'action') {
                  const $action = this.createSystemBlockAction(id);
                  $contentBlock.style.overflow = 'visible';
                  $contentBlock.appendChild($action);
                }
              }

              if (this.getMediaQuery() !== 'desktop') {
                const $labelColumn = document.createElement('div');
                $labelColumn.className = classLabelColumn;
                $labelColumn.innerHTML = lable;
                fragment.appendChild($labelColumn);
              }

              fragment.appendChild($tableHeadingColumn);

              if (isLastiteration && this.getMediaQuery() === 'desktop') {
                const $lastColumn = document.createElement('td');
                $lastColumn.style.width = 'auto';
                fragment.appendChild($lastColumn);
              }
            }
          });
        counter += 1;
        tableRow.appendChild(fragment);
        $parent.appendChild(tableRow);
      } // if (!isDeleted)
    }
  }

  // createInputBlock

  createInputBlock(value, dataID, key, isAutocomplete) {
    const { classInputBlock } = this.options;
    const { rows } = this.data;

    const $inputBlock = document.createElement('input');

    // #even handler change

    const handlerChange = (event) => {
      const indexChangeableRow = [].findIndex.call(rows, (row) => row.id === dataID);
      rows[indexChangeableRow][key] = event.target.value;

      this.setDataProducts(this.data.rows);

      this.setIsNewData(true);

      this.renderResult();
    };

    $inputBlock.type = 'cc-text';
    $inputBlock.value = value;
    $inputBlock.className = classInputBlock;
    $inputBlock.onchange = handlerChange;

    if (isAutocomplete) {
      const arrayAutocomplete = [].map.call(rows, (row) => row[key]);

      autocomplete($inputBlock, arrayAutocomplete);
    }

    return $inputBlock;
  }

  // createStaticBlock

  createStaticBlock(value) {
    const { classStaticBlock } = this.options;

    const $staticBlock = document.createElement('div');
    $staticBlock.className = classStaticBlock;
    $staticBlock.innerText = value;

    return $staticBlock;
  }

  // createSystemBlockСapture

  createSystemBlockСapture() {
    const { classSystemBlockСapture } = this.options;

    const $dragBlock = document.createElement('div');
    $dragBlock.className = classSystemBlockСapture;
    // #event
    $dragBlock.onmouseenter = this.handlerRowMouseEnter;

    return $dragBlock;
  }

  // createSystemBlockAction

  createSystemBlockAction(dataID = null) {
    const {
      classSystemBlockActionList,
      classSystemBlockActionItem,
      classSystemBlockActionButton,
    } = this.options;

    function hiddenActionMenu() {
      document
        .querySelectorAll('[data-action-menu]')
        .forEach((itemMenu) => {
          itemMenu.style.display = 'none';
        });
    }

    function hendlerOutsideClick() {
      console.log('click');

      hiddenActionMenu();

      document
        .removeEventListener('click', hendlerOutsideClick);
    }

    function handlerActionClick(e) {
      e.stopPropagation();

      hiddenActionMenu();

      const $menu = e.target.firstElementChild || e.target.firstChild;

      if ($menu && $menu.tagName === 'UL') {
        if ($menu.style.display === 'none') {
          $menu.style.display = '';
          document.addEventListener('click', hendlerOutsideClick);
        } else {
          $menu.style.display = 'none';
          document.removeEventListener('click', hendlerOutsideClick);
        }
      }
    }

    const $actionToggle = document.createElement('div');
    $actionToggle.className = classSystemBlockActionButton;
    $actionToggle.style.position = 'relative';
    // mouse #event
    $actionToggle.onclick = handlerActionClick;

    const $actionList = document.createElement('ul');
    $actionList.className = classSystemBlockActionList;
    $actionList.dataset.actionMenu = 'row';
    $actionList.style.position = 'absolute';
    $actionList.style.display = 'none';
    $actionToggle.appendChild($actionList);

    const actions = [
      { name: 'Удалить', action: this.handlerActionRemoveRow },
    ];

    [].forEach.call(actions, (action) => {
      const $actionItem = document.createElement('li');
      $actionItem.className = classSystemBlockActionItem;
      $actionItem.innerText = action.name;
      $actionItem.dataset.dataId = dataID;
      $actionItem.onclick = action.action;

      $actionList.appendChild($actionItem);
    });

    return $actionToggle;
  }

  // createTempRow

  createTempRow() {
    const { classTempRow, classTempRowItem } = this.options;

    const $row = document.createElement('tr');
    $row.style.position = 'relative';
    $row.className = classTempRow;
    $row.dataset.tempRow = '';

    const $innerBlock = document.createElement('div');
    $innerBlock.className = classTempRowItem;

    $row.appendChild($innerBlock);

    return $row;
  }

  // removeTempRow

  removeTempRow() {
    document
      .querySelectorAll('[data-temp-row]')
      .forEach((row) => {
        row.parentNode.removeChild(row);
      });
  }

  // removeRow

  removeRow(dataID = null) {
    if (dataID === null && typeof dataID !== 'number') {
      console.log('Data error! not correct form ID');
      return false;
    }

    const { rows } = this.data;

    const indexRowDeleted = [].findIndex.call(rows, (row) => row.id === dataID);

    rows[indexRowDeleted].isDeleted = true;

    this.setDataProducts(this.data.rows);

    this.render();

    this.setIsNewData(true);

    return true;
  }

  // addNewRows

  addNewRows() {
    // if (this.newRow.isNewRow) {
    //   if (!this.saveChangeRows()) {
    //     return false;
    //   }
    // }

    const { rows } = this.data;

    const generateId = () => {
      let id = rows.length + 1;

      const checkIdInData = (n) => {
        if (rows.some((e) => e.id === n)) {
          // console.log('n+1 >', n);
          checkIdInData(n += 1);
        } else {
          id = n;
        }
        return n;
      };

      return checkIdInData(id);
    };

    const newId = generateId();

    const templateRow = Object
      .keys({ ...rows.slice(-1)[0] })
      .reduce((a, v) => ({ ...a, [v]: '' }), {});
    templateRow.id = newId;
    templateRow.isDeleted = false;

    this.newRow.isNewRow = true;
    this.newRow.idNewRow = newId;
    this.newRow.objectNewRow = { ...templateRow };

    [].push.call(rows, { ...templateRow });

    this.setDataProducts(this.data.rows);

    this.render();

    this.setIsNewData(true);

    return true;
    // console.log('addNewRows > add!');
  }

  // saveChangeRows

  saveChangeRows() {
    if (!this.checkValueRows()) return false;

    if (this.newRow.isNewRow) {
      this.newRow.isNewRow = false;
      this.newRow.idNewRow = null;
      this.newRow.objectNewRow = {};
    }

    this.setServerDataProducts(this.data.rows);

    return true;
  }

  // handlers

  handlerActionRemoveRow(event) {
    event.stopPropagation();
    this.removeRow(Number(event.target.dataset.dataId));
  }

  // handlerActionClick(event) {
  //   event.stopPropagation();
  //   console.log('handlerActionClick > ', event.target);
  // }

  handlerRowMouseEnter(event) {
    const $rowDraggable = event.target.closest('tr[draggable]');

    const handlerRowMouseLeave = () => {
      $rowDraggable.draggable = false;
      event.target.removeEventListener('mouseleave', handlerRowMouseLeave);
    };

    event.target.addEventListener('mouseleave', handlerRowMouseLeave);

    $rowDraggable.draggable = true;
  }

  // event drag and drop

  handlerRowDragStart(e, rowId) {
    // при начале перетаскивания элемента
    const {
      classDragDraggrable,
      classDragOverlay,
    } = this.options;

    if (e.target.tagName !== 'TR') return;

    setTimeout(() => {
      e.target.classList.add(classDragDraggrable);
      e.target.style.opacity = '0.3';
    }, 100);

    const $parent = e.target.closest('tbody');
    [].forEach.call($parent.querySelectorAll('[draggable]'), (elem) => {
      elem.classList.add(classDragOverlay);
    });

    this.dragRow = true;
    this.dragCurentIndex = rowId;
  }

  handlerRowDragEnd(e) {
    // когда перетаскивание завершается

    const {
      classDragDraggrable,
      classDragOverlay,
    } = this.options;

    this.removeTempRow();

    if (e.target.tagName !== 'TR') return;

    const $parent = e.target.closest('tbody');
    [].forEach.call($parent.querySelectorAll('[draggable]'), (elem) => {
      elem.classList.remove(classDragOverlay);
    });

    e.currentTarget.style.opacity = '1';
    e.currentTarget.classList.remove(classDragDraggrable);

    if (this.dropRow) {
      this.dragRow = false;
      this.dragCurentIndex = null;

      setTimeout(() => {
        this.setDataProducts(this.data.rows);

        this.render();
      }, 0);
    }
  }

  handlerRowDragOver(e, rowId) {
    // когда элемент перетаскивается в допустимую зону

    if (this.dragRow) {
      const { rows } = this.data;

      e.dataTransfer.dropEffect = 'move';

      const dropIndex = [].findIndex.call(rows, (row) => row.id === rowId);
      const dragIndex = [].findIndex.call(rows, (row) => row.id === this.dragCurentIndex);

      if (dropIndex !== dragIndex) {
        e.preventDefault();
      }
    }
  }

  handlerRowDragEnter(e, rowId) {
    // когда элемент попадает в допустимую зону
    this.removeTempRow();

    if (this.dragRow) {
      const { rows } = this.data;
      const { classDragHover, classDragBefore, classDragAfter } = this.options;

      e.currentTarget.classList.add(classDragHover);

      const dropIndex = [].findIndex.call(rows, (row) => row.id === rowId);
      const dragIndex = [].findIndex.call(rows, (row) => row.id === this.dragCurentIndex);

      if (dropIndex !== dragIndex) {
        const $tempRow = this.createTempRow();

        if (dropIndex < dragIndex) { // before
          e.currentTarget.classList.add(classDragBefore);
          // append Before
          e.currentTarget.parentNode.insertBefore($tempRow, e.currentTarget);
        }
        if (dropIndex > dragIndex) { // after
          e.currentTarget.classList.add(classDragAfter);
          // append After
          e.currentTarget.parentNode.insertBefore($tempRow, e.currentTarget.nextSibling);
        }
      }
    }
  }

  handlerRowDragLeave(e) {
    // когда элемент покидает допустимую зону
    if (this.dragRow) {
      const { classDragHover, classDragBefore, classDragAfter } = this.options;

      e.currentTarget.classList.remove(classDragHover);
      e.currentTarget.classList.remove(classDragBefore);
      e.currentTarget.classList.remove(classDragAfter);
    }
  }

  handlerRowDrop(e, rowId) {
    // когда элемент отпускают в допустимую зону
    e.preventDefault();

    if (this.dragRow) {
      const { classDragHover, classDragBefore, classDragAfter } = this.options;

      e.currentTarget.classList.remove(classDragHover);
      e.currentTarget.classList.remove(classDragBefore);
      e.currentTarget.classList.remove(classDragAfter);

      // this.removeTempRow();

      const { rows } = this.data;

      const dropIndex = [].findIndex.call(rows, (row) => row.id === rowId);
      const dragIndex = [].findIndex.call(rows, (row) => row.id === this.dragCurentIndex);

      const cut = rows.splice(dragIndex, 1)[0];
      rows.splice(dropIndex, 0, cut);

      this.dropRow = true;

      this.setIsNewData(true);
    }
  }

  destroy() {
    console.log('destroy(), no functionality!');
  }
}

export default RowsTable;
