function autocomplete($input, arrAutocomplete) {
  const classWrapper = 'table-body__autocomplete-wrapper';
  const classList = 'table-body__autocomplete-list';
  const classItem = 'table-body__autocomplete-item';
  const classActive = 'active';

  let currentFocus;
  const dataID = $input.dataset.dataId;

  $input.addEventListener('focus', handlerFocus);
  $input.addEventListener('blur', handlerBlur);

  // function handlerFocus

  function handlerFocus(e) {
    // console.log('focus');
    addEvents();
  }

  // function handlerBlur

  function handlerBlur(e) {
    // console.log('Blur');
    removeEvents();
  }

  // function removeEvents

  function removeEvents() {
    $input.removeEventListener('input', handlerInput);
    $input.removeEventListener('keydown', handlerKeydown);
    document.removeEventListener('scroll', handlerScrollDoc);
  }

  // function addEvents

  function addEvents() {
    $input.addEventListener('input', handlerInput);
    $input.addEventListener('keydown', handlerKeydown);
    document.addEventListener('scroll', handlerScrollDoc);
  }

  // function handlerScrollDoc

  function handlerScrollDoc(e) {
    closeAllLists();
    console.log('scroll');
    // removeEvents();
  }

  // function handlerInput

  function handlerInput(e) {
    const inputValue = e.target.value;

    closeAllLists();

    if (!inputValue.trim()) { return false; }

    currentFocus = -1;

    const $wrapper = document.createElement('div');
    $wrapper.classList = classWrapper;
    $wrapper.style.position = 'absolute';
    $wrapper.style.display = 'none';
    $wrapper.style.zIndex = '999';
    e.target.parentNode.appendChild($wrapper);

    const $list = document.createElement('ul');
    $list.id = dataID;
    $list.classList = classList;
    // $list.style.position = 'fixed';
    $list.style.width = `${$input.getBoundingClientRect().width}px`;

    // console.log($input.getBoundingClientRect().width);

    $wrapper.appendChild($list);

    for (let i = 0; i < arrAutocomplete.length; i += 1) {
      const string = arrAutocomplete[i];
      // console.log(string);
      if (
        string
          .substr(0, inputValue.length)
          .toUpperCase()
          === inputValue
            .toUpperCase()
      ) {
        $wrapper.style.display = '';

        const $item = document.createElement('li');
        $item.classList = classItem;
        $item.innerHTML = `<strong>${string.substr(0, inputValue.length)}</strong>`;
        $item.innerHTML += string.substr(inputValue.length);
        $item.innerHTML += `<input type='hidden' value='${string}'>`;
        $item.addEventListener('click', (event) => {
          // console.log('click');
          $input.value = event.currentTarget.getElementsByTagName('input')[0].value;
          closeAllLists();
        });
        $list.appendChild($item);
      }
    }
  }

  // function handlerKeydown
  // TODO: доделать выбор элемента по ID...

  function handlerKeydown(e) {
    let $list = document.getElementById(dataID);

    if ($list) $list = $list.getElementsByTagName('li');

    // console.log(e.keyCode);

    if (e.keyCode === 40) {
      e.preventDefault();
      currentFocus += 1;
      addActiveClass($list);
    } else if (e.keyCode === 38) { // вверх
      currentFocus -= 1;
      addActiveClass($list);
    } else if (e.keyCode === 13) {
      if (currentFocus > -1) {
        if ($list) $list[currentFocus].click();
      }
    } else if (e.keyCode === 9 || e.keyCode === 27) {
      closeAllLists();
    }
  }

  // function addActiveClass

  function addActiveClass($list) {
    if (!$list) return false;

    removeActiveClass($list);

    if (currentFocus >= $list.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = ($list.length - 1);

    $list[currentFocus].classList.add(classActive);
    $list[currentFocus].scrollIntoView();
  }

  // function removeActiveClass

  function removeActiveClass($list) {
    for (let i = 0; i < $list.length; i += 1) {
      $list[i].classList.remove(classActive);
    }
  }

  // function closeAllLists

  function closeAllLists(elmnt) {
    const $list = document.getElementsByClassName(classWrapper);

    for (let i = 0; i < $list.length; i += 1) {
      if (elmnt !== $list[i] && elmnt !== $input) {
        $list[i].parentNode.removeChild($list[i]);
      }
    }
  }

  document.addEventListener('click', (e) => {
    closeAllLists(e.target);
  });
}

export default autocomplete;
