module.exports = {
    version:              require('../package').version,
    Client:               require('./lib/Client'),
    Constants:            require('./lib/Constants'),
    StoreItem:            require('./lib/structures/items/StoreItem'),
    StoreItemRequirement: require('./lib/structures/items/StoreItemRequirement'),
    StoreItemAction:      require('./lib/structures/items/StoreItemAction'),
    InventoryItem:        require('./lib/structures/items/InventoryItem'),
    Permission:           require('./lib/structures/Permission'),
    User:                 require('./lib/structures/User'),
};
