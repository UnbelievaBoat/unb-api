const StoreItemRequirement = require('./StoreItemRequirement');
const StoreItemAction = require('./StoreItemAction');

class BaseItem {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.isUsable = data.is_usable;
    this.isSellable = data.is_sellable;
    this.isReusable = data.is_reusable ?? false;
    this.useCooldownSeconds = data.use_cooldown_seconds ?? null;
    this.requirements = data.requirements.map(requirement => new StoreItemRequirement(requirement));
    this.actions = data.actions.map(action => new StoreItemAction(action));
    this.outcomePools = (data.outcome_pools || []).map(pool => ({
      triggerFlags: pool.trigger_flags,
      rolls:        pool.rolls || 1,
      outcomes:     (pool.outcomes || []).map(outcome => ({
        chance:  outcome.chance,
        actions: (outcome.actions || []).map(action => new StoreItemAction(action)),
      })),
    }));
    this.emojiUnicode = data.emoji_unicode;
    this.emojiId = data.emoji_id;
  }

  get isChicken() {
    return (this.name || '').toLowerCase().includes('chicken');
  }
}

module.exports = BaseItem;
