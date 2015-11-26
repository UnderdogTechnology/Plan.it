system.cmp.settings = {
    controller: function(args) {
            return {
                resetConfig: function() {
                    util.storage.create('config', {
                        setdefault: 'false',
                        pagesize: 5,
                        pageturner: ['<', null, '>'],
                        theme: 'one'
                    });
                    util.storage.create('categories', {});
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