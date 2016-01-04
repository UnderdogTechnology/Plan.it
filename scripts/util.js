/**
 ** Generic Utilities
 **/
var util = {
    q: function(q, c) {
        return (c || document).querySelector(q);
    },
    qq: function(q, c) {
        return [].slice.call((c || document).querySelectorAll(q));
    },
    oneup: function(arr, prop, cb) {
        var tmp = [];
        for(var i in arr) {
            if(arr[i].hasOwnProperty(prop)) {
                tmp.push(parseInt(arr[i][prop]));
            }
        }
        tmp = tmp.sort(function(a,b) {
            return a-b;
        });

        return tmp.length ? tmp.pop() + 1 : 1;
    },
    upsert: function(arr, obj) {
        if(!arr.length || !obj.id) {
            obj.id = this.oneup(arr, 'id');
            arr.push(obj);
        }
        else {
            arr = arr.map(function(o) {
                var total = 0,
                    comply = 0,
                    identifiers = [],
                    tmp = util.extend({}, o);
                for(var f in obj) {
                    if(obj.hasOwnProperty(f)) {
                        if((obj[f] || obj[f] === false) && f != 'id') {
                            ++total;
                            tmp[f] = obj[f];
                            if((o[f] || o[f] === false) && (obj[f]).toString() == (o[f]).toString()) {
                                ++comply;
                            }
                        }
                    }
                }
                console.log(comply, total);
                if(!obj.id && comply && total && comply == total) {
                    obj.id = o.id;
                }
                if(obj.id == o.id) {
                    o = tmp;
                }

                return o;
            });
        }
        return {
            arr: arr,
            obj: obj
        };
    },
    update: function(srcObj, newObj, path, index) {
        index = index || 0;
        path = (typeof path) == 'string' ? path.split('.') : path;
        
        if(!path || index == path.length) {
            return newObj;
        }

        if(!srcObj[path[index]]) {
            srcObj[path[index]] = {};
        }
        
        srcObj[path[index]] = this.update(srcObj[path[index]], newObj, path, ++index);
        return srcObj;
    },
    remove: function(arr, obj) {
        if(arr.length && Object.keys(obj).length) {
            arr = arr.filter(function(o) {
                var total = 0,
                    comply = 0;
                    
                for(var f in obj) {
                    if(obj[f] && obj.hasOwnProperty(f) && o.hasOwnProperty(f)) {
                        if((obj[f] || obj[f] === false) && f != 'id') {
                            ++total;
                            if((obj[f]).toString() == (o[f]).toString()) {
                                ++comply;
                            }
                        }
                    }
                }
                if(comply && total && comply == total) {
                    obj.id = o.id
                } 
                return !(obj.id == o.id);
            });
        }
        return {
            arr: arr,
            obj: obj
        };
    },
    extend: function(aObj, bObj) {
        if(Array.isArray(aObj) && !Array.isArray(bObj)) {
                aObj.push(bObj);
        }
        else {
            for(var key in bObj)
            {
                if(Array.isArray(aObj)) {
                    aObj.push(bObj[key]);
                } else if(bObj.hasOwnProperty(key)) {
                    aObj[key] = bObj[key];
                }

            }
        }
        return aObj;
    },
    range: function(f, t, cb) {
        var a = [],
            b = [],
            tmp;

        while(f <= t) {

            if(cb) {
                tmp = cb(f);
            }

            if(tmp) {
                b.push(tmp);
            }

            a.push(f++);
        }
        
        return b.length ? b : a;
    },
    forEach: function(obj, cb, returnType) {
        var o = Array.isArray(obj) ? [] : {},
            i = 0;
        for(var key in obj){
            if(obj.hasOwnProperty(key)) {
                var tmp = cb(obj[key], key, obj, i++);
                if(tmp) {
                    o = util.extend(o, tmp);
                }
            }
        }
        return o;
    },
    random: function(obj, cb) {
        var keys = Object.keys(obj),
        ranNum = Math.floor(Math.random() * keys.length);
        if(cb){
            return cb(obj[keys[ranNum]], keys[ranNum], ranNum, obj);
        }
        return obj[keys[ranNum]];
    },
    storage: {
        get: function(name) {
            if((typeof Storage) !== 'undefined') {
                return JSON.parse(localStorage.getItem(name)) || [];
            }
            alert('Local Storage is not supported!');
        },
        create: function(name, obj) {
            localStorage.setItem(name, JSON.stringify(obj));
            return this.get(name);
        },
        upsert: function(name, obj) {
            var status = util.upsert(this.get(name), obj);
            this.create(name, status.arr);
            return status.obj;
        },
        update: function(name, obj, path) {
            this.create(name, util.update(this.get(name), obj, path));
        },
        remove: function(name, obj) {
            var status = util.remove(this.get(name), obj);
            this.create(name, status.arr);
            return status.obj;
        }
    },
    formatter: function(string, obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                string = string.replace('{' + key + '}', obj[key], 'g');
            }
        }
        return string;
    }
};

/**
 ** Mithril Specific Utilities
 **/
var mutil = {
    convertRating: function(rating) {
        var i = 0,
            arr = [];

        while (i < 5) {
            arr[arr.length] = m('i', {
                class: (i < rating ? 'fa fa-star' : 'fa fa-star o')
            });
            i++;
        }
        return arr;
    },
    formGroup: function(attrs, children) {
        return m('div.pure-control-group', attrs, children);
    },
    formControls: function(attrs, children) {
        return m('div.pure-controls', attrs, children);
    },
    icon: function(name, children) {
        return m('i.fa.fa-' + name, children);
    },
    createSwitch: function(options, checked, label, cb, attr) {
        return [
            m('label', label),
            m('div.tgl', attr, [
                m('label.tgl-btn', {
                        class: checked ? 'tgl-on' : 'tgl-off'
                    },
                    m('div.tgl-opt.secondary', options[0]),
                    m('div.separator'),
                    m('div.tgl-opt.primary', options[1]),
                    m('input[type="checkbox"].tgl-switch', {
                        checked: checked,
                        onchange: cb
                    }))
            ])
        ];
    }
};

// reusable config attrs
mutil.c = {
    autofocus: function(elem, isInit) {
        elem.focus();
    }
};

/**
 ** Enumerators
 **/

var eutil = function(e, filter) {
    this.costs = [
        {
            'id': 1,
            'name': 'Free'
        }, {
            'id': 2,
            'name': 'Cheap'
        }, {
            'id': 3,
            'name': 'Pricey'
        }
    ]

    var tmp = this[e];

    if(filter) {
        tmp = tmp.filter(function(obj) {
            for(var f in filter) {
                return filter.hasOwnProperty(f) && obj.hasOwnProperty(f) && filter[f] == obj[f];
            }
        })
    }
    return tmp || [];
}