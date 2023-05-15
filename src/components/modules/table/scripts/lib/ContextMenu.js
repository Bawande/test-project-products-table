class ContextMenu {
  constructor(props) {
    const defaultsOptions = {
      classParent: 'context-menu',
      classButtonMenu: 'context-menu__toggle',
      classMenuList: 'context-menu__list',
      classMenuItem: 'context-menu__item',
      classSubMenu: 'context-menu__sublist',
      classTitleSubMenu: 'context-menu__title-sublist',
      classTitleCheckbox: 'context-menu__checkbox',
    };
    const {
      parentBlock, getOptionDataTable, setOptionDataTable, renderTable, getMediaQuery,
    } = props;

    this.options = Object.assign(defaultsOptions);
    Object.assign(this, {
      parentBlock, getOptionDataTable, setOptionDataTable, renderTable, getMediaQuery,
    });

    this.menuItems = [
      {
        id: 0,
        key: 'columns',
        lable: 'Отображение столбцов',
        items: this.getOptionDataTable(),
      },
    ];

    this.node = {};
    this.node.$menuList = undefined;
    this.node.$menuButtonToggler = undefined;

    // bind this
    this.handlerToggleMenu = this.handlerToggleMenu.bind(this);
    this.handlerMouseEnterMenuItem = this.handlerMouseEnterMenuItem.bind(this);
    this.hendlerOutsideClickEvent = this.hendlerOutsideClickEvent.bind(this);
    this.handlerChangeCheckbox = this.handlerChangeCheckbox.bind(this);
  } // constructor

  render() {
    if (this.getMediaQuery() !== 'desktop') {
      this.сlearParentBlock();

      return;
    }

    if (!this.checkData()) {
      console.log('Error DATA, context menu data not found');
      return;
    }

    if (!this.checkParent()) {
      console.log('Error DOMElement, parent block for context menu not found');
      return;
    }

    this.сlearParentBlock();

    this.create();
  }

  checkParent() {
    if (this.parentBlock && this.parentBlock instanceof HTMLElement) {
      return true;
    }
    return false;
  }

  checkData() {
    if (Array.isArray(this.getOptionDataTable()) && this.getOptionDataTable().length !== 0) {
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
    const { classParent } = this.options;

    this.parentBlock.classList.add(classParent);

    this.createToggleButton();
    this.createMenu();
  }

  createToggleButton() {
    const { classButtonMenu } = this.options;

    const $toggleButton = document.createElement('button');
    $toggleButton.className = classButtonMenu;
    this.parentBlock.appendChild($toggleButton);

    this.node.$menuButtonToggler = $toggleButton;

    setTimeout(() => {
      $toggleButton.addEventListener('click', this.handlerToggleMenu);
    }, 0);
  }

  createMenu() {
    const {
      classMenuList,
      classSubMenu,
      classMenuItem,
      classTitleSubMenu,
      classTitleCheckbox,
    } = this.options;

    const data = this.menuItems;

    // create menu list
    const $menuList = document.createElement('ul');
    $menuList.className = classMenuList;
    $menuList.style.position = 'absolute';
    $menuList.style.display = 'none';

    this.node.$menuList = $menuList;

    this.parentBlock.appendChild($menuList);

    // create menu items
    const $menuItemsFragment = document.createDocumentFragment();

    [].forEach.call(data, (item) => {
      const { lable, items } = item;
      const $listItem = document.createElement('li');
      $listItem.className = `${classMenuItem} drop-down`;
      $listItem.addEventListener('mouseenter', this.handlerMouseEnterMenuItem);

      const $label = document.createElement('span');
      $label.innerText = lable;
      $listItem.appendChild($label);

      if (Array.isArray(items)) {
        // create submenu list
        const $menuSublist = document.createElement('ul');
        $menuSublist.className = classSubMenu;
        $menuSublist.style.position = 'absolute';
        $menuSublist.style.display = 'none';
        $listItem.appendChild($menuSublist);

        const $labelSublist = document.createElement('div');
        $labelSublist.className = classTitleSubMenu;
        $labelSublist.innerText = lable;
        $menuSublist.appendChild($labelSublist);

        //   create submenu items
        const $menuSubitemsFragment = document.createDocumentFragment();

        [].forEach.call(items, (subitem) => {
          const { id, key, type } = subitem;
          const { lable, isDisplay, isAlwaysVisible } = subitem.columnOptions;

          if (!isAlwaysVisible && type === 'DATA') {
            const $listSubitem = document.createElement('li');
            $listSubitem.className = classMenuItem;

            const $sublable = document.createElement('div');
            $listSubitem.appendChild($sublable);

            const $checkbox = document.createElement('input');
            $checkbox.type = 'checkbox';
            $checkbox.name = key;
            $checkbox.className = classTitleCheckbox;
            $checkbox.value = lable;
            $checkbox.checked = isDisplay;
            $checkbox.id = `id-${key}-${id}`;
            $checkbox.dataset.columnId = id;
            $sublable.appendChild($checkbox);

            $checkbox.addEventListener('change', this.handlerChangeCheckbox);

            const $labelCheckbox = document.createElement('label');
            $labelCheckbox.htmlFor = `id-${key}-${id}`;
            $sublable.appendChild($labelCheckbox);

            const $labelText = document.createTextNode(lable);
            $labelCheckbox.appendChild($labelText);

            $menuSubitemsFragment.appendChild($listSubitem);
          } // if(type !== 'SYSTEM' && isEditable)
        });

        $menuSublist.appendChild($menuSubitemsFragment);
      }

      $menuItemsFragment.appendChild($listItem);
    });
    $menuList.appendChild($menuItemsFragment);
  }

  openMenuList() {
    const { $menuList, $menuButtonToggler } = this.node;

    $menuList.style.display = '';
    $menuList.classList.add('open');
    $menuButtonToggler.classList.add('open');
    setTimeout(() => {
      document.addEventListener('click', this.hendlerOutsideClickEvent);
    }, 0);
  }

  closeMenuList() {
    const { $menuList, $menuButtonToggler } = this.node;

    $menuList.style.display = 'none';
    $menuList.classList.remove('open');
    $menuButtonToggler.classList.remove('open');
    document.removeEventListener('click', this.hendlerOutsideClickEvent);
  }

  // handlers

  handlerToggleMenu(event) {
    if (event.target.classList.contains('open')) {
      this.closeMenuList();
    } else {
      this.openMenuList();
    }
  }

  handlerMouseEnterMenuItem(event) {
    const menuItem = event.target;
    const menuList = menuItem.querySelector('ul');

    const hendlerMoseLive = () => {
      menuList.style.display = 'none';
      menuItem.removeEventListener('mouseleave', hendlerMoseLive);
    };

    menuList.style.display = '';

    menuItem.addEventListener('mouseleave', hendlerMoseLive);
  }

  hendlerOutsideClickEvent(event) {
    const { $menuList } = this.node;
    const $elemEvent = event.target;

    if ($menuList.classList.contains('open')) {
      if (!$menuList.contains($elemEvent)) {
        this.closeMenuList();
        document.removeEventListener('click', this.hendlerOutsideClickEvent);
      }
    }
  }

  handlerChangeCheckbox(event) {
    const columns = this.getOptionDataTable();
    const $checkbox = event.target;
    const { columnId } = $checkbox.dataset;
    const { checked } = $checkbox;

    const arr = [].map.call(columns, (column) => {
      if (column.id === Number(columnId)) {
        return { ...column, columnOptions: { ...column.columnOptions, isDisplay: checked } };
      }
      return column;
    });

    setTimeout(() => {
      this.setOptionDataTable(arr);
      this.renderTable();
    }, 0);
  }

  destroy() {
    console.log('destroy(), no functionality!');
  }
}

export default ContextMenu;
