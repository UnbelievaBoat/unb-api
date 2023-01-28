const BaseItem = require('./BaseItem');

class InventoryItem extends BaseItem {
  constructor(data) {
    super(data);
    this.itemId = data.item_id;
    this.quantity = data.quantity;
  }
}

module.exports = InventoryItem;
