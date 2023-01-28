class Enum {
  #keys = [];
  #values = [];

  constructor(object) {
    const result = {};
    for (const [key, value] of Object.entries(object)) {
      if (key === null) continue;
      result[key] = value;
      result[value] = key;

      this.#keys.push(key);
      this.#values.push(value);
    }

    this.entries = Object.freeze(result);
  }

  get keys() {
    return this.#keys;
  }

  get values() {
    return this.#values;
  }

  /**
   * Compare if two enum value are equal
   * @param a
   * @param b
   * @returns {boolean}
   */
  equal(a, b) {
    if (!this.entries.hasOwnProperty(a)) return false;
    if (!this.entries.hasOwnProperty(b)) return false;

    return a === b || this.entries[a] === b;
  }

  /**
   * Convert an enum value to string
   * @param value
   * @returns {*}
   */
  toString(value) {
    const number = parseInt(value);
    if (isNaN(number)) return value;
    return this.entries[number];
  }

  /**
   * Convert an enum value to number
   * @param value
   * @returns {number}
   */
  toNumber(value) {
    const number = parseInt(value);
    if (isNaN(number)) return this.entries[value];
    return number;
  }

  /**
   * Check if a value exists
   * @param value
   */
  exists(value) {
    return !!this.entries[value];
  }
}

module.exports = Enum;
