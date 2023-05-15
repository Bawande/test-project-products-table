class ToolsTableMenu {
  constructor(props) {
    const defaultsOptions = {
      classParent: 'tools-table',
      classButtonAddRow: 'tools-table__add-row button-primary button-primary--simple',
      classButtonSave: 'tools-table__save-change button-primary button-primary--accept',
      classButtonСancel: 'tools-table__сancel-change',
      //
      textButtonAddRow: 'Добавить строку',
      textButtonSave: 'Сохранить',
    };
    const {
      parentBlock, createNewRows, saveChanges, getIsNewData, getMediaQuery,
    } = props;
    Object.assign(this, {
      parentBlock, createNewRows, saveChanges, getIsNewData, getMediaQuery,
    });

    this.options = Object.assign(defaultsOptions);

    this.node = {};

    // bind this
    this.handlerClickAddRowButton = this.handlerClickAddRowButton.bind(this);
    this.handlerClickSaveButton = this.handlerClickSaveButton.bind(this);
  } // constructor

  render() {
    if (!this.checkParent()) {
      console.log('Error DOMElement, parent block for ToolsTableMenu, not found');
      return;
    }

    const $parent = this.parentBlock;
    const { classParent } = this.options;

    $parent.classList.add(classParent);

    this.сlearParentBlock();

    this.createButtonAddRow();

    if (this.getIsNewData()) this.createButtonSave();
  }

  checkParent() {
    if (this.parentBlock && this.parentBlock instanceof HTMLElement) {
      return true;
    }
    return false;
  }

  сlearParentBlock() {
    if (this.parentBlock.hasChildNodes()) {
      this.parentBlock.innerHTML = '';
    }
  }

  createButtonAddRow() {
    const $parent = this.parentBlock;
    const { classButtonAddRow, textButtonAddRow } = this.options;

    const $addRowButton = document.createElement('button');
    $addRowButton.className = classButtonAddRow;
    $addRowButton.innerText = textButtonAddRow;
    $parent.appendChild($addRowButton);

    setTimeout(() => {
      $addRowButton.addEventListener('click', this.handlerClickAddRowButton);
    }, 0);
  }

  createButtonSave() {
    const $parent = this.parentBlock;
    const { classButtonSave, textButtonSave } = this.options;

    const $saveButton = document.createElement('button');
    $saveButton.className = classButtonSave;
    $saveButton.innerText = textButtonSave;
    $parent.appendChild($saveButton);

    setTimeout(() => {
      $saveButton.addEventListener('click', this.handlerClickSaveButton);
    }, 0);
  }

  handlerClickAddRowButton() {
    this.createNewRows();
  }

  handlerClickSaveButton() {
    this.saveChanges();
  }

  destroy() {
    console.log('destroy(), no functionality!');
  }
}

export default ToolsTableMenu;
