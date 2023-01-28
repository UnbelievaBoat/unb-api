module.exports.toSnakeCase = (input) => input.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`);

module.exports.toSnakeCaseDeep = (value) => {
  if (value && value.toJSON) {
    value = value.toJSON();
  }

  if (Array.isArray(value)) {
    return value.map(exports.toSnakeCaseDeep);
  }

  if (value !== null && typeof value === 'object') {
    let obj = {};
    for (let key of Object.keys(value)) {
      obj[exports.toSnakeCase(key)] = exports.toSnakeCaseDeep(value[key]);
    }
    return obj;
  }

  return value;
};
