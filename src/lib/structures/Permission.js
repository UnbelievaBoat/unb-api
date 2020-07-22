/**
 * UnbelievaBoat Application Permission
 */

const Permissions = {
    economy: 1
};

class Permission {
    constructor(allow) {
        this.allow = allow;
    }

    /**
     * Show the allowed and denied permissions in a json format
     * @return {Object}
     */
    get json() {
        const json = {};
        for (const permission of Object.keys(Permissions)) {
            json[permission] = !!(this.allow & Permissions[permission]);
        }
        return json;
    }

    /**
     * Check if this permission allows a specific permission
     * @param permissions {string|string[]} permission The name of the permission.
     * @return {boolean}
     */
    has(permissions) {
        if (Array.isArray(permissions)) {
            return permissions.filter(perm => !!(this.allow & Permissions[perm])).length === permissions.length;
        } else {
            return !!(this.allow & Permissions[permissions]);
        }
    }

}

module.exports = Permission;
