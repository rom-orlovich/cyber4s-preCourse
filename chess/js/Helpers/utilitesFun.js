export const toLog = (vars) => {
  const key = Object.keys(vars);
  key.forEach((el) => {
    console.log(el, vars[el]);
  });
};
export const makeArrayToSet = (arr) => [...new Set(arr)];
export const createEl = (str) => {
  const temp = document.createElement("template");
  temp.innerHTML = str.trim();
  return temp["content"].firstElementChild;
};

export const createImgHtml = (src, alt = "Image not found") => {
  return `<img src="${src}" alt="${alt}"/> `;
};
export const selectElement = (query, scope = document) => {
  return scope.querySelector(query);
};
export const selectAllElements = (query, scope = document) => {
  return scope.querySelectorAll(query);
};
export const addEventListenerByQuery = (nameEvent, handler, query) => {
  const element = selectElement(query);
  element.addEventListener(nameEvent, handler);
  return element;
};
export const removeEventListenerByQuery = (nameEvent, handler, query) => {
  const element = selectElement(query);
  element.removeEventListener(nameEvent, handler);
  return element;
};

export const addEventListenerByQueryAll = (nameEvent, handler, query) => {
  const elements = selectAllElements(query);
  elements.forEach((el) => el.addEventListener(nameEvent, handler));
  return elements;
};

export const makeArray = (
  num,
  handler = undefined,
  breakFun = (i) => false
) => {
  const arr = [];
  for (let i = 1; i < num; i++) {
    const breakRes = breakFun(i);
    handler ? arr.push(handler(i)) : arr.push(i);
    if (breakRes) break;
  }

  return makeArrayToSet(arr);
};

export const getObjKeyWithValue = (obj) => {
  let newObj = {};

  for (const key in obj) {
    if (obj[key])
      newObj = {
        ...newObj,
        [key]: obj[key],
      };
  }
  return newObj;
};

export const genrateObjKeyValueToArr = (obj) => {
  let arr = [];

  for (const key in obj) {
    if (obj[key] instanceof Array) arr = [...arr, ...obj[key]];
  }
  return makeArrayToSet(arr);
};

export const editDataSet = (str, pos, newStr, querySplit = "-") => {
  const arrStr = str.split(querySplit)?.slice();
  arrStr[pos] = newStr;
  return arrStr.join(querySplit);
};

//settimeoutfun implement
