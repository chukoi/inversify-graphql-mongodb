export function filterSensitiveData(value: any): any {
  // serialize all items within array
  if (Array.isArray(value)) {
    return value.map(filterSensitiveData);
  }

  // check if this property is a model object
  if (typeof value === "object" && value !== null) {
    const propNames = Object.keys(value);
    propNames.map(key => (value[key] = filterSensitiveData(value[key])));
    // we have a model object, filter, serialise & send
    return typeof value.filterSensitiveData === "function"
      ? value.filterSensitiveData()
      : value;
  }

  // don't modify value
  return value;
}
