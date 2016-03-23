system.model.settings = function(){
    var _ = {
        get: function(label) {
            var settings = this.default();
            return label ? settings[label] : settings;
        },
        update: function(obj, path) {
            util.storage.update('settings', obj, path);
        },
        remove: function(path) {
            util.storage.remove('settings', path);
        },
        default: function() {
            var settings = util.storage.get('settings');

            if(!Object.keys(settings).length) {
                settings = {
                    defaulted: {},
                    pagesize: 5,
                    pageturner: ['<', null, '>'],
                    theme: 'default'
                };
                util.storage.create('settings', settings);
            }
            return settings;
        }
    }
    _.get();
    return _;
};