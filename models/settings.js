system.model.settings = {
    get: function() {
        var settings = util.storage.get('settings');

        if(!Object.keys(settings).length) {
            this.update(settings = this.default);
        }
        return settings;
    },
    update: function(obj, path) {
        util.storage.update('settings', obj, path);
    },
    remove: function(path) {
        util.storage.remove('settings', path);
    },
    default: {
        setdefault: 'false',
        pagesize: 5,
        pageturner: ['<', null, '>'],
        theme: 'default'
    }
};