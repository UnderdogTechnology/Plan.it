system.model.x = function(mOne, mTwo) {

    var _ = {
        get: function(filter) {
            var x = _.default();
            if(filter) {
                x = x.filter(function(row) {
                    for(var f in filter) {
                        if(filter.hasOwnProperty(f) && row.hasOwnProperty(f)) {
                            if(filter[f] == row[f]) {
                                return row;
                            }
                            else if(filter[f].toString() === row[f].toString()) {
                                return row;
                            }
                        }
                    }
                });
            }
            return x && x.length ? x : [];
        },
        upsert: function(obj) {
            util.storage.upsert(this.id, obj);
        },
        update: function(obj, path) {
            util.storage.update(this.id, obj, path);
        },
        remove: function(obj) {
            util.storage.remove(this.id, obj);
        },
        default: function() {
            var x = [],
                defaulted,
                d = {};
            if((o = util.storage.get(mOne + '_' + mTwo)).length) {
                x = o;
                _.id = mOne + '_' + mTwo;
            }
            else if ((o = util.storage.get(mTwo + '_' + mOne)).length) {
                x = o;
                _.id = mTwo + '_' + mOne;
            }
            else {
                if ((o = d[mOne + '_' + mTwo]) && o.length) {
                    x = o;
                    defaulted = true;
                    _.id = mOne + '_' + mTwo;
                }
                else if ((o = d[mTwo + '_' + mOne]) && o.length) {
                    x = o;
                    defaulted = true;
                    _.id = mTwo + '_' + mOne;
                }
            }

            if(defaulted && !system.model.settings.get().defaulted[_.id]) {
                util.storage.create(_.id, d[_.id]);
                util.storage.update('settings', true, 'defaulted.' + _.id);
            }
            return x;
        }
    };

    _.get();
    
    return _;
}