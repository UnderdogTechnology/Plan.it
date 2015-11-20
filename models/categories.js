system.model.categories = {
    filter: m.prop({
        price: m.prop(1),
        players: m.prop(null)
    }),
    selectedCategory: m.prop('Master'),
    applyFilter: function() {
        var category = this.get(true)[this.selectedCategory()],
            filter = this.filter();
            
        return util.forEach(category, function(obj, key){
            var match = true;

            if(match && filter.price() && filter.price() < obj.price) {
                match = false;
            }

            if(match && filter.players() && !(filter.players() >= obj.players.min && filter.players() <= obj.players.max)) {
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
    }
};

/*
util.storage.update('categories', {
    'Video Games': {
        'Lara Croft': {
            price: 1,
            players: {
                min: 2,
                max: 4
            }
         },
        'Helldivers': {
            price: 1,
            players: {
                min: 2,
                max: 4
            }
         },
        'Mario Party': {
            price: 1,
            players: {
                min: 2,
                max: 4
            }
         },
        'Mario Cart': {
            price: 1,
            players: {
                min: 2,
                max: 4
            }
         },
        'Battlefront': {
            price: 1,
            players: {
                min: 1,
                max: 2
            }
         },
        'Rocket League': {
            price: 1,
            players: {
                min: 2,
                max: 4
            }
         }
    },
    'Misc': {
        'Pool': {
            price: 2,
            players: {
                min: 2,
                max: 6
            }
         },
        'Legendary': {
            price: 1,
            players: {
                min: 2,
                max: 5
            }
         },
        'Cards': {
            price: 1,
            players: {
                min: 2,
                max: 10
            }
         }
    }
});
*/