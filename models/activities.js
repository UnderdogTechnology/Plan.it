system.model.activities = function() {
        var _ = {
        get: function(filter) {
                var activities = this.default();
                if (Object.keys(filter || {}).length){
                    activities = activities.filter(function(act){
                        var match = true;
                        if(match && filter.id && !(filter.id.toString() == act.id.toString())) {
                            match = false;
                        }
                        
                        if(match && filter['category_id'] && !(filter['category_id'].toString() == act['category_id'].toString())) {
                            match = false;
                        }

                        if(match && (filter['in_master'] || filter['in_master'] === false)  && !(filter['in_master'].toString() == act['in_master'].toString())) {
                            match = false;
                        }

                        if(match && filter.name) {
                            if(!isNaN(filter.name))
                            {
                                match = act.name === filter.name;
                            } else {
                                match = act.name.toLowerCase().match(filter.name.toLowerCase());
                            }
                        }

                        if(match && filter.cost && filter.cost < act.cost) {
                            match = false;
                        }

                        var min = parseInt(act.players.min),
                            max = parseInt(act.players.max);

                        if(match && filter.players && filter.players.min) {
                            var fMin = parseInt(filter.players.min);
                            if(isNaN(fMin) || !(fMin >= min && fMin <= max)) {
                                match = false;
                            }
                        }

                        if(match && filter.players && filter.players.max) {
                            var fMax = parseInt(filter.players.max);
                            if(isNaN(fMin) || !(fMax >= min && fMax <= max)) {
                                match = false;
                            }
                        }
                        return match;
                    });
                }

                return activities;
            },
            upsert: function(obj) {
                return util.storage.upsert('activities', obj).id;
            },
            update: function(obj, path) {
                util.storage.update('activities', obj, path);
            },
            remove: function(obj) {
                return util.storage.remove('activities', obj).id;
            },
            default: function() {
                var activities = util.storage.get('activities');
                if(!activities.length && !system.model.settings().get('defaulted')['activities']) {
                    activities = [
                        {
                            'in_master': true,
                            'category_id': 1,
                            'id': 1,
                            'name': 'Lara Croft',
                            'cost': 1,
                            'players': {
                                'min': 2,
                                'max': 4
                            }
                        }, {
                            'in_master': true,
                            'category_id': 1,
                            'id': 2,
                            'name': 'Helldivers',
                            'cost': 1,
                            'players': {
                                'min': 2,
                                'max': 4
                            }
                        }, {
                            'in_master': true,
                            'category_id': 1,
                            'id': 3,
                            'name': 'Mario Party',
                            'cost': 1,
                            'players': {
                                'min': 2,
                                'max': 4
                            }
                        },  {
                            'in_master': true,
                            'category_id': 1,
                            'id': 4,
                            'name': 'Mario Cart',
                            'cost': 1,
                            'players': {
                                'min': 2,
                                'max': 4
                            }
                        }, {
                            'in_master': true,
                            'category_id': 1,
                            'id': 5,
                            'name': 'Battlefront',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 2
                            }
                        }, {
                            'in_master': true,
                            'category_id': 1,
                            'id': 6,
                            'name': 'Rocket League',
                            'cost': 1,
                            'players': {
                                'min': 2,
                                'max': 4
                            }
                        }, {
                            'in_master': true,
                            'category_id': 2,
                            'id': 7,
                            'name': 'Movie - Theatre',
                            'cost': 2,
                            'players': {
                                'min': 1,
                                'max': 6
                            }
                        }, {
                            'in_master': true,
                            'category_id': 2,
                            'id': 8,
                            'name': 'Movie - Home',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 6
                            }
                        }, {
                            'in_master': true,
                            'category_id': 2,
                            'id': 9,
                            'name': 'Netflix and Chill',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 6
                            }
                        }, {
                            'in_master': true,
                            'category_id': 3,
                            'id': 10,
                            'name': 'Camping',
                            'cost': 3,
                            'players': {
                                'min': 2,
                                'max': 10
                            }
                        }, {
                            'in_master': true,
                            'category_id': 3,
                            'id': 11,
                            'name': 'Road Trip',
                            'cost': 3,
                            'players': {
                                'min': 2,
                                'max': 5
                            }
                        }, {
                            'in_master': true,
                            'category_id': 3,
                            'id': 12,
                            'name': 'Ski Trip',
                            'cost': 3,
                            'players': {
                                'min': 2,
                                'max': 5
                            }
                        }, {
                            'in_master': true,
                            'category_id': 4,
                            'id': 13,
                            'name': 'Pool',
                            'cost': 2,
                            'players': {
                                'min': 2,
                                'max': 6
                            }
                        }, {
                            'in_master': true,
                            'category_id': 4,
                            'id': 14,
                            'name': 'Darts',
                            'cost': 2,
                            'players': {
                                'min': 2,
                                'max': 6
                            }
                        }, {
                            'in_master': true,
                            'category_id': 4,
                            'id': 15,
                            'name': 'Bar',
                            'cost': 3,
                            'players': {
                                'min': 2,
                                'max': 6
                            }
                        }, {
                            'in_master': true,
                            'category_id': 5,
                            'id': 16,
                            'name': 'Legendary',
                            'cost': 1,
                            'players': {
                                'min': 2,
                                'max': 5
                            }
                        }, {
                            'in_master': true,
                            'category_id': 5,
                            'id': 17,
                            'name':'Cards',
                            'cost': 1,
                            'players': {
                                'min': 2,
                                'max': 10
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 18,
                            'name':'1',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 6
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 19,
                            'name':'2',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 6
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 20,
                            'name':'3',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 6
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 21,
                            'name':'4',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 6
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 22,
                            'name':'5',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 6
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 23,
                            'name':'6',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 6
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 24,
                            'name':'7',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 8
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 25,
                            'name':'8',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 8
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 26,
                            'name':'9',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 10
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 27,
                            'name':'10',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 10
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 28,
                            'name':'11',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 20
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 29,
                            'name':'12',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 20
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 30,
                            'name':'13',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 20
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 31,
                            'name':'14',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 20
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 32,
                            'name':'15',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 20
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 33,
                            'name':'16',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 20
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 34,
                            'name':'17',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 20
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 35,
                            'name':'18',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 20
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 36,
                            'name':'19',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 20
                            }
                        }, {
                            'in_master': false,
                            'category_id': 6,
                            'id': 37,
                            'name':'20',
                            'cost': 1,
                            'players': {
                                'min': 1,
                                'max': 20
                            }
                        }
                    ];
                    util.storage.create('activities', activities);
                    util.storage.update('settings', true, 'defaulted.activities');
                }
                return activities;
            }
        }
        _.get();
        return _;
};