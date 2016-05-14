/* global system,m,mutil,localStorage,location */
system.cmp.settings = {
    controller: function(args) {
            var mySettings = system.model.settings().get();
            var ctrl = {
                form: m.prop({
                    theme: m.prop(mySettings.theme),
                    pagesize: m.prop(mySettings.pagesize)
                }),
                resetConfig: function() {
                    localStorage.clear();
                    location.reload();
                },
                submit: function() {
                    system.model.settings().update({
                        'defaulted': mySettings.defaulted,
                        'pageturner': mySettings.pageturner,
                        'pagesize': ctrl.form().pagesize(),
                        'theme': ctrl.form().theme()
                    });
                    location.reload();
                }
            };
            return ctrl;
    },
    view: function(ctrl, args) {
        var form = ctrl.form();
        return m('div.settings', [
            m('form.center-form.pure-form.pure-form-aligned', [
                mutil.formGroup([
                    m('label', 'Theme'),
                    m('select.form-control', {
                        value: form.theme(),
                        onchange: m.withAttr('value', form.theme)
                    }, system.model.themes().get().map(function(t){
                        return m('option', t.name);
                    }))
                ]),
                mutil.formGroup([
                    m('label', 'Page Size'),
                    m('input[type="number"].form-control', {
                        placeholder: 'Page Size',
                        value: form.pagesize(),
                        onchange: m.withAttr('value', form.pagesize)
                    })
                ]),
                mutil.formControls([
                    m('a.pure-button.btn.secondary', {
                        onclick: ctrl.submit
                    }, 'Submit'),
                    m('a.pure-button.btn.primary', {
                        onclick: ctrl.resetConfig
                    }, 'Reset')
                ])
            ])
        ]);
    }
};