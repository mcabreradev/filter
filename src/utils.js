export const isObject = (x) => x != null && typeof x === 'object';

export const isFunction = (x) => typeof x === 'function';

export const isUndefined = (x) => typeof x === 'undefined';

export const lowerCase = (x) =>  x.toLowerCase();

export const getTypeForFilter = (val) => (val === null) ? 'null' : typeof val;

export const hasCustomToString = (obj) => isFunction(obj.toString) && obj.toString !== toString;

export const isArray = Array.isArray || ((x) => x && typeof x.length === 'number');

export const isArrayLike = (x) => {
  return [...x], true || false;
};
