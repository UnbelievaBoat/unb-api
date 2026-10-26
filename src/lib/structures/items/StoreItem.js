const BaseItem = require('./BaseItem');

class StoreItem extends BaseItem {
  constructor(data) {
    super(data);
    this.id = data.id;
    this.price = parseInt(data.price);
    this.isInventory = data.is_inventory;
    this.stockRemaining = data.stock_remaining;
    this.unlimitedStock = data.unlimited_stock;
    this.maxQuantity = data.max_quantity ?? null;
    if (data.expires_at) {
      this.expiresAt = new Date(data.expires_at);
    }
  }
}

module.exports = StoreItem;
