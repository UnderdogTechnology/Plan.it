system.cmp.home = {
        controller: function(args) {
                var model = {
                        c: system.model.categories(),
                        a: system.model.activities()
                };
                var ctrl = {
                        model: model,
                        categories: m.prop(model.c.get({},{'id': -1, 'name': 'Master'})),
                        selected: m.prop({}),
                        alert: m.prop(),
                        visibility: {
                                allowEdit: m.prop(false),
                                allowFind: m.prop(true),
                                allowFilter: m.prop(false)
                        },
                        form: m.prop({
                                category: m.prop(-1),
                                inMaster: m.prop(true),
                                name: m.prop(null),
                                cost: m.prop(null),
                                players: {
                                        min: m.prop(null),
                                        max: m.prop(null)
                                }
                        }),
                        switchMode: function(evt) {
                                ctrl.visibility.allowFind(evt.target.checked);
                                ctrl.visibility.allowEdit(!evt.target.checked);
                                if(ctrl.visibility.allowEdit() && Object.keys(ctrl.selected()).length) {
                                        var act = model.a.get({id: ctrl.selected()['id']})[0];
                                        ctrl.form({
                                                id: m.prop(act.id),
                                                inMaster: m.prop(ctrl.selected()['in_master']),
                                                category: m.prop(ctrl.selected()['category_id']),
                                                name: m.prop(act.name),
                                                cost: m.prop(act.cost),
                                                players: {
                                                        min: m.prop(act.players.min),
                                                        max: m.prop(act.players.max)
                                                }
                                        });
                                        ctrl.selected({});
                                }
                                else {
                                        ctrl.form({
                                                id: m.prop(null),
                                                inMaster: m.prop(true),
                                                category: m.prop(-1),
                                                name: m.prop(null),
                                                cost: m.prop(!ctrl.visibility.allowFind() || ctrl.visibility.allowFilter()  ? 1 : null),
                                                players: {
                                                        min: m.prop(null),
                                                        max: m.prop(null)
                                                }
                                        });
                                }

                                ctrl.categories(model.c.get({},{'id': -1, 'name': (evt.target.checked ? 'Master' : 'Add New')}));
                        }
                };
                return ctrl;
        },
    view: function(ctrl, args) {
        var form = ctrl.form();
        
        return m('div.home', [
                m('form.center-form.pure-form.pure-form-aligned', [
                        mutil.formGroup([
                                m('label', 'Category'),
                                m('select.form-control', {
                                    onchange: m.withAttr('value', form.category)
                                }, ctrl.categories().map(function(val, key) {
                                    return m('option', {
                                        value: val.id,
                                        selected: val.id == form.category()
                                    }, val.name);
                                }))
                        ]),
                        mutil.formGroup(mutil.createSwitch(['FIND', 'EDIT'], ctrl.visibility.allowFind(), 'Mode', ctrl.switchMode))
                ]),
                m.component(system.cmp.edit, {
                        visibility: ctrl.visibility,
                        model: ctrl.model,
                        form: ctrl.form,
                        categories: ctrl.categories,
                        alert: ctrl.alert,
                        settings: args.settings
                }),
                m.component(system.cmp.find, {
                        visibility: ctrl.visibility,
                        selected: ctrl.selected,
                        model: ctrl.model,
                        form: ctrl.form,
                        alert: ctrl.alert,
                        settings: args.settings
                }),
                m.component(system.cmp.alert, {
                        alert: ctrl.alert,
                        settings: args.settings
                })
        ]);
    }
};