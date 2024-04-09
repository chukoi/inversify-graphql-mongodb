/**
 * clone a model object
 *
 * @param {T} obj
 * @returns {T}
 */
export function cloneModelObject<T>(obj: T): T {
  // create an empty object with the same prototype of the original object
  // then copy the fields from the original object to the new object
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}
