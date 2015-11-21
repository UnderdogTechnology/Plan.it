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
    update: function(srcObj, newObj, path, index) {
        index = index || 0;
        path = (typeof path) == 'string' ? path.split('.') : path;
        
        if(!path || index == path.length) {
            return newObj;
        }
        srcObj[path[index]] = this.update(srcObj[path[index]], newObj, path, ++index);
        return srcObj;
    },
    remove: function(obj, path, index) {
        index = index || 0;
        path = (typeof path) == 'string' ? path.split('.') : path;

        if(!path || index == path.length - 1) {
            delete obj[path[index]];
            return obj;
        }
        obj[path[index]] = this.remove(obj[path[index]], path, ++index);
        return obj;
    },
    extend: function(aObj, bObj) {
        for(var key in bObj)
        {
            if(bObj.hasOwnProperty(key)) {
                aObj[key] = bObj[key];
            }
        }
        return aObj;
    },
    forEach: function(obj, cb) {
        var arr = [];
        for(var key in obj){
            if(obj.hasOwnProperty(key)) {
                var tmp = cb(obj[key], key, obj);
                if(tmp) {
                    arr.push(tmp);
                }
            }
        }
        return arr;
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
                return JSON.parse(localStorage.getItem(name)) || {};
            }
            alert('Local Storage is not supported!');
        },
        create: function(name, obj) {
            localStorage.setItem(name, JSON.stringify(obj));
        },
        update: function(name, obj, path) {
            this.create(name, util.update(this.get(name), obj, path));
        },
        remove: function(name, path) {
            this.create(name, util.remove(this.get(name), path));
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

var eutil = {
    costs: {
        'Free': 1,
        'Cheap': 2,
        'Expensive': 3
    }
}