const { ItemActionType } = require('../../Constants');

class StoreItemAction {
  constructor(data) {
    this.type = ItemActionType.toString(data.type);

    switch (this.type) {
      case 'RESPOND':
        this.message = data.message;
        break;
      case 'ADD_ROLES':
      case 'ADD_ITEMS':
      case 'REMOVE_ROLES':
      case 'REMOVE_ITEMS':
        this.ids = data.ids || [];
        break;
      case 'ADD_BALANCE':
      case 'REMOVE_BALANCE':
        this.balance = data.balance;
        break;
    }
  }

  toJSON() {
    return {
      ...this,
      type: ItemActionType.toNumber(this.type),
    };
  }

}

module.exports = StoreItemAction;
