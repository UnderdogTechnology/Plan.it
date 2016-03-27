system.model.themes = function() {
    var _ = {
        get: function(filter) {
            var themes = this.default();
            if (Object.keys(filter || {}).length){
                themes = themes.filter(function(t){
                    var match = true;
                    for(var f in filter) {
                        match = (filter.hasOwnProperty(f) && t.hasOwnProperty(f) && filter[f] == t[f]);
                        if(!match) break;
                    }
                    return match;
                });
            }

            return themes;
        },
        default: function() {
            var themes = util.storage.get('themes');
            if(!themes.length && !system.model.settings().get('defaulted')['themes']) {
                themes = [
                    {
                        'name': 'default',
                        'css': 'main',
                        'js': 'main'
                    },
                    {
                        'name': 'two',
                        'css': 'main',
                        'js': 'main'
                    }
                ];
                util.storage.create('themes', themes);
                util.storage.update('settings', true, 'defaulted.themes');
            }
            return themes;
        }
    };
    _.get();
    return _;
};