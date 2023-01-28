const { ItemRequirementType, ItemRequirementMatchType } = require('../../Constants');

class StoreItemRequirement {
  constructor(data) {
    this.type = ItemRequirementType.toString(data.type);

    switch (this.type) {
      case 'ROLE':
      case 'ITEM':
        this.matchType = ItemRequirementMatchType.toString(data.match_type);
        this.ids = data.ids || [];
        break;
      case 'TOTAL_BALANCE':
        this.balance = data.balance;
        break;
    }
  }

  toJSON() {
    return {
      ...this,
      type:      ItemRequirementType.toNumber(this.type),
      matchType: this.matchType ? ItemRequirementMatchType.toNumber(this.matchType) : undefined,
    };
  }
}

module.exports = StoreItemRequirement;
