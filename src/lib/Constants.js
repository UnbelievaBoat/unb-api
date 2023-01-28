const Enum = require('./util/Enum');

/**
 * Item action type enum
 * @type {Enum}
 */
module.exports.ItemActionType = new Enum({
  RESPOND:        1,
  ADD_ROLES:      2,
  REMOVE_ROLES:   3,
  ADD_BALANCE:    4,
  REMOVE_BALANCE: 5,
  ADD_ITEMS:      6,
  REMOVE_ITEMS:   7,
});

/**
 * Item requirement type enum
 * @type {Enum}
 */
module.exports.ItemRequirementType = new Enum({
  ROLE:          1,
  TOTAL_BALANCE: 2,
  ITEM:          3,
});


/**
 * Item requirement match type enum
 * @type {Enum}
 */
module.exports.ItemRequirementMatchType = new Enum({
  EVERY:        1,
  AT_LEAST_ONE: 2,
  NONE:         3,
});
