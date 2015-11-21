system.model.categories = {
    filter: m.prop(),
    selectedCategory: m.prop('Master'),
    applyFilter: function() {
        var category = this.get(true)[this.selectedCategory()],
            filter = this.filter();
            
        return util.forEach(category, function(obj, key){
            var match = true;

            if(match && filter.name() && filter.name() != key) {
                match = false;
            }

            if(match && filter.cost() && filter.cost() < obj.cost) {
                match = false;
            }

            if(match && filter.players().min() && !(filter.players().min() >= obj.players.min && filter.players().min() <= obj.players.max)) {
                match = false;
            }

            if(match && filter.players().max() && !(filter.players().max() >= obj.players.min && filter.players().max() <= obj.players.max)) {
                match = false;
            }

            if(match) {
                obj.name = key;
                return obj;
            }
        });
    },
    get: function(b) {
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