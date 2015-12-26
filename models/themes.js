system.model.themes = {
    get: function() {
        var themes = util.storage.get('themes');

        if(!Object.keys(themes).length) {
            this.update(themes = this.default);
        }
        return themes;
    },
    update: function(obj, path) {
        util.storage.update('themes', obj, path);
    },
    remove: function(path) {
        util.storage.remove('themes', path);
    },
    default: themes = {
        'default': {
            'css': 'main',
            'js': 'main'
        },
        'two': {
            'css': 'main',
            'js': 'main'
        }
    }
};