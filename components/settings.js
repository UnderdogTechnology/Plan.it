system.cmp.settings = {
    controller: function(args) {
            return {
                resetConfig: function() {
                    localStorage.clear();
                    /*
                    util.storage.create('config', {
                        defaulted: {},
                        pagesize: 5,
                        pageturner: ['<', null, '>'],
                        theme: 'one'
                    });
                    util.storage.create('categories', {});
                    util.storage.create('activities', {});*/
                }
            };
    },
    view: function(ctrl, args) {
        return m('div.settings', [
            m('button', {
                onclick: ctrl.resetConfig
            }, 'Reset')
        ])
    }
};