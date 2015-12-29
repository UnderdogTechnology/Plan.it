system.cmp.alert = {
    controller: function(args) {
            ctrl = {
                alert: args.alert || m.prop(null),
                lastAlert: m.prop(),
                clearAlert: function() {
                    ctrl.alert(null);
                    ctrl.lastAlert(null);
                },
                timeout: m.prop(),
                hideAlert: function() {
                    ctrl.lastAlert(ctrl.alert().message);
                    clearTimeout(ctrl.timeout());
                    ctrl.timeout(setTimeout(function() {
                        ctrl.clearAlert();
                        m.redraw();
                    }, 3000));
                }
            };
            return ctrl;
    },
    view: function(ctrl, args) {
            var alert = ctrl.alert();
            console.log(alert);
            if(alert && !alert.cb && ctrl.lastAlert() != alert.message) {
                ctrl.hideAlert();
            }
            if(alert) {
                alert.options = alert.options && alert.options.length ? alert.options : ['Yes', 'No'];
            }

            return m('div.alert', {
                class: (!alert ? 'alert-hidden' : 'alert-'.concat(alert.type)),
                onclick: ctrl.clearAlert
            }, [
                m('span', alert ? alert.message : ''),
                m('div.alert-confirm', {
                        hidden: !(alert && alert.cb)
                }, [
                    m('div.right.btn.primary', {
                            onclick: alert && alert.cb ? alert.cb[0] : null
                    }, alert ? alert.options[0] : null),
                    m('div.btn.secondary', {
                            onclick: alert && alert.cb && alert.cb.length > 1 ? alert.cb[1] : null
                    }, alert ? alert.options[1] : null)
            ])
        ]);
    }
};