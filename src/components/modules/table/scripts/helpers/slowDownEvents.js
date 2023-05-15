const throttle = (func, ms) => {
  let locked = false;

  return function () {
    if (locked) return;

    const context = this;
    const args = arguments;

    locked = true;

    setTimeout(() => {
      func.apply(context, args);
      locked = false;
    }, ms);
  };
};

function debounce(func, ms, now) {
  let onLast;

  return function () {
    const context = this;
    const args = arguments;

    const onFirst = now && !onLast;

    clearTimeout(onLast);

    onLast = setTimeout(() => {
      onLast = null;
      if (!now) func.apply(context, args);
    }, ms);

    if (onFirst) func.apply(context, args);
  };
}

export { throttle, debounce };
