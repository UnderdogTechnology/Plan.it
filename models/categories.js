system.model.categories = function() {
    var _ = {
        get: function(filter, primer) {
            var categories = this.default();

            if(Object.keys(filter || {}).length) {
                categories = categories.filter(function(cat) {
                    var total=0,
                        comply=0;
                    for(var f in filter) {
                        if(filter.hasOwnProperty(f) && cat.hasOwnProperty(f)) {
                            if((filter[f] || filter[f] === false) && f != 'id') {
                                ++total;
                                if((filter[f]).toString() == (cat[f]).toString()) {
                                    ++comply;
                                }
                            }
                        }
                    }
                    if(!filter.id && comply && total && comply == total) {
                        filter.id = cat.id;
                    }

                    return (filter.id == cat.id);
                });
            }

            if(Object.keys(primer || {}).length) {
                categories.unshift(primer);
            }

            return categories;
        },
        upsert: function(obj) {
            return util.storage.upsert('categories', obj).id;
        },
        update: function(obj, path) {
            util.storage.update('categories', obj, path);
        },
        remove: function(path) {
            util.storage.remove('categories', path);
        },
        default: function() {
            var categories = util.storage.get('categories');
            if(!Object.keys(categories).length && !system.model.settings.get().defaulted['categories']) {
                categories = [
                    {'id': 1, 'name': 'Video Games'}, 
                    {'id': 2, 'name': 'Film'},
                    {'id': 3, 'name': 'Weekend'},
                    {'id': 4, 'name': 'Night Out'},
                    {'id': 5, 'name': 'Misc'},
                    {'id': 6, 'name': 'Dice'}
                ];
                util.storage.create('categories', categories);
                util.storage.update('settings', true, 'defaulted.categories');
            }
            return categories;
        }
    }
    _.get();
    return _;
};