system.model.categories = {
    get: function(b, filter, selectedCategory) {
        var categories = util.storage.get('categories');

        if(!Object.keys(categories).length && util.storage.get('config')['setdefault'] === 'false') {
            this.update(categories = this.default);
            util.storage.update('config', true, 'setdefault');
        }

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

                    var match = true,
                        fName = filter.name();

                    if(match && fName) {
                        if(!isNaN(fName))
                        {
                            match = key === fName;
                        } else {
                            match = key.toLowerCase().match(fName.toLowerCase());
                        }
                    }

                    if(match && filter.cost() && filter.cost() < activity.cost) {
                        match = false;
                    }

                    var min = parseInt(activity.players.min),
                        max = parseInt(activity.players.max);

                    if(match && filter.players.min()) {
                        var fMin = parseInt(filter.players.min());
                        if(!isNaN(fMin) && !(fMin >= fMin && fMin <= fMin)) {
                            match = false;
                        }
                    }

                    if(match && filter.players.max()) {
                        var fMax = parseInt(filter.players.max());
                        if(!isNaN(fMax) && !(fMax >= min && max <= fMax)) {
                            match = false;
                        }
                    }
                    
                    if(match) {
                        return {
                            key: key,
                            value: activity
                        };
                    }
                });
                if(Object.keys(activities).length) {
                    return {
                        key: name,
                        value: activities
                    };
                }
            });
        }
        return categories;
    },
    update: function(obj, path) {
        util.storage.update('categories', obj, path);
    },
    remove: function(path) {
        util.storage.remove('categories', path);
    },
    default: {
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
        'Film': {
            'Movie - Theatre': {
                cost: 2,
                players: {
                    min: 1,
                    max: 6
                }
             },
            'Movie - Home': {
                cost: 1,
                players: {
                    min: 1,
                    max: 6
                }
             },
            'Netflix and Chill': {
                cost: 1,
                players: {
                    min: 1,
                    max: 6
                }
             }
        },
        'Weekend': {
            'Camping': {
                cost: 3,
                players: {
                    min: 2,
                    max: 10
                }
            },
            'Road Trip': {
                cost: 3,
                players: {
                    min: 2,
                    max: 5
                }
            },
            'Ski Trip': {
                cost: 3,
                players: {
                    min: 2,
                    max: 5
                }
            }
        },
        'Night Out': {
            'Pool': {
                cost: 2,
                players: {
                    min: 2,
                    max: 6
                }
             },
            'Darts': {
                cost: 2,
                players: {
                    min: 2,
                    max: 6
                }
             },
            'Bar': {
                cost: 3,
                players: {
                    min: 2,
                    max: 6
                }
             }
        },
        'Misc': {
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
    }
};