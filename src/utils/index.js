
export const capNumber = (value, min, max) => {
  return Math.max(min, Math.min(value, max))
}

export const is = ({
  undefined(value) {
    return typeof value === 'undefined';
  },
  null(value) {
    return value === null;
  },
  nullOrUndefined(value) {
    return this.null(value) || this.undefined(value);
  },
  array(value) {
    return Array.isArray(value);
  },
  emptyArray(value) {
    return Array.isArray(value) && value.length === 0;
  },
  nonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
  },
  object(value) {
    return typeof value === 'object' && !this.array(value);
  },
  nonEmptyObject(value) {
    return this.object(value) && Object.keys(value).length > 0;
  },
  NaN(value) {
    return value !== value;
  },
  integer(value) {
    return parseInt(value) === Number(value);
  },
  positiveInteger(value) {
    return this.integer(value) && value > 0;
  },
  id(value) {
    return this.integer(value) && value >= 0;
  },
})
