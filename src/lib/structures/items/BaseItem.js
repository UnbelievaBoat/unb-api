const StoreItemRequirement = require('./StoreItemRequirement');
const StoreItemAction = require('./StoreItemAction');

class BaseItem {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.isUsable = data.is_usable;
    this.isSellable = data.is_sellable;
    this.requirements = data.requirements.map(requirement => new StoreItemRequirement(requirement));
    this.actions = data.actions.map(action => new StoreItemAction(action));
    this.emojiUnicode = data.emoji_unicode;
    this.emojiId = data.emoji_id;
  }

  get isChicken() {
    return (this.name || '').toLowerCase().includes('chicken');
  }
}

module.exports = BaseItem;
