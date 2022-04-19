export const createNewEl = (str) => {
  const elTemp = document.createElement("template");
  elTemp.innerHTML = str.trim();

  return elTemp["content"].firstElementChild;
};

const createStyleEl = (tag, ...classes) => {
  const el = document.createElement(tag);
  el.classList.add(classes);
  return el;
};
const select = (select, scope = document) => {
  return scope.querySelector(select);
};
export const log = (...vars) => {
  console.log(...vars);
};
