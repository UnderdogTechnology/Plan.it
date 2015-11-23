system.model.categories = {
    get: function(b, filter, selectedCategory) {
        var categories = util.storage.get('categories');

        if(b) {
            categories.Master = (function(){
                var aObj = {};
                util.forEach(categories, function(bObj){
                    util.extend(aObj, bObj);
                });
                return aObj;
            })();
        }

        if(filter) {
            categories = selectedCategory ? (function() {
                var o = {}
                o[selectedCategory] = categories[selectedCategory];
                return o;
            })() : categories;

            categories = util.forEach(categories, function(cat, name) {
                var activities = util.forEach(cat, function(activity, key){
                    var match = true;

                    if(match && filter.name() && !(key.toLowerCase().match(filter.name().toLowerCase()))) {
                        match = false;
                    }

                    if(match && filter.cost() && filter.cost() < activity.cost) {
                        match = false;
                    }

                    if(match && filter.players().min() && !(filter.players().min() >= activity.players.min && filter.players().min() <= activity.players.max)) {
                        match = false;
                    }

                    if(match && filter.players().max() && !(filter.players().max() >= activity.players.min && filter.players().max() <= activity.players.max)) {
                        match = false;
                    }

                    if(match) {
                        return {
                            key: key,
                            value: activity
                        };
                    }
                });
                return {
                    key: name,
                    value: activities
                };
            });
        }
        return categories;
    },
    update: function(obj, path) {
        util.storage.update('categories', obj, path);
    },
    remove: function(path) {
        util.storage.remove('categories', path);
    }
};

/*
util.storage.update('categories', {
    'Video Games': {
        'Lara Croft': {
            cost: 1,
            players: {
                min: 2,
                max: 4
            }
         },
        'Helldivers': {
            cost: 1,
            players: {
                min: 2,
                max: 4
            }
         },
        'Mario Party': {
            cost: 1,
            players: {
                min: 2,
                max: 4
            }
         },
        'Mario Cart': {
            cost: 1,
            players: {
                min: 2,
                max: 4
            }
         },
        'Battlefront': {
            cost: 1,
            players: {
                min: 1,
                max: 2
            }
         },
        'Rocket League': {
            cost: 1,
            players: {
                min: 2,
                max: 4
            }
         }
    },
    'Misc': {
        'Pool': {
            cost: 2,
            players: {
                min: 2,
                max: 6
            }
         },
        'Legendary': {
            cost: 1,
            players: {
                min: 2,
                max: 5
            }
         },
        'Cards': {
            cost: 1,
            players: {
                min: 2,
                max: 10
            }
         }
    }
});
*/