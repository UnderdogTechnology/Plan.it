system.cmp.alert = {
    controller: function(args) {
            return {
                    alert: args.alert || m.prop(null)
            };
    },
    view: function(ctrl, args) {
        return m('div.alert', {
                class: (!ctrl.alert() ? 'alert-hidden' : 'alert-'.concat(ctrl.alert().type)),
                onclick: function() {
                        ctrl.alert(null);
                }
        }, [
                m('span', ctrl.alert() ? ctrl.alert().message : ''),
                m('div.alert-confirm', {
                        hidden: !(ctrl.alert() && ctrl.alert().cb)
                }, [
                        m('div.right.btn.primary', {
                                onclick: ctrl.alert() ? ctrl.alert().cb : null
                        }, 'Yes'),
                        m('div.btn.secondary', 'No')
                ])
        ])
    }
};