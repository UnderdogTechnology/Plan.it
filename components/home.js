system.cmp.home = {
        controller: function(args) {
                var model = system.model.categories;

                var ctrl = {
                        model: model,
                        categories: m.prop(model.get(true)),
                        selectedCategory: args.selectedCategory || m.prop('Master'),
                        selectedRow: m.prop(),
                        resultSet: m.prop(),
                        alert: m.prop(),
                        allowEdit: m.prop(false),
                        allowFind: m.prop(true),
                        allowFilter: m.prop(false),
                        form: m.prop({
                                name: m.prop(null),
                                cost: m.prop(null),
                                players: {
                                        min: m.prop(null),
                                        max: m.prop(null)
                                }
                        }),
                        switchMode: function(evt) {
                                ctrl.allowFind(evt.target.checked);
                                ctrl.allowEdit(!evt.target.checked);
                                ctrl.form(ctrl.allowEdit() && ctrl.selectedRow() ? ctrl.selectedRow() : {
                                        name: m.prop(null),
                                        cost: m.prop(!ctrl.allowFind() || ctrl.allowFilter()  ? 1 : null),
                                        players: {
                                                min: m.prop(null),
                                                max: m.prop(null)
                                        }
                                });

                                ctrl.resultSet(null);
                                ctrl.selectedRow(null);
                                ctrl.alert(null);
                                ctrl.categories(ctrl.model.get(evt.target.checked));
                                console.log(ctrl.selectedCategory());
                                if(!evt.target.checked) {
                                        ctrl.categories()['Add New'] = {};

                                        ctrl.selectedCategory(ctrl.selectedCategory() == 'Master' ? 'Add New' : ctrl.selectedCategory());
                                }
                                else {
                                        ctrl.selectedCategory(ctrl.selectedCategory() == 'Add New' ? 'Master' : ctrl.selectedCategory());
                                }
                                console.log(ctrl.selectedCategory());

                        }
                };
                return ctrl;
        },
    view: function(ctrl, args) {
        return m('div.home', [
                m('form.center-form.pure-form.pure-form-aligned', [
                        mutil.formGroup([
                                m('label', 'Category'),
                                m('select.form-control', {
                                    onchange: function(evt) {
                                         ctrl.selectedCategory(evt.target.value != 'Add New' ? evt.target.value : '');
                                    }
                                }, util.forEach(ctrl.categories(), function(val, key) {
                                    return m('option', {
                                        style: ['Master', 'Add New'].indexOf(key) >= 0 ? 'border-top:1px solid #000;' : '',
                                        selected: key == ctrl.selectedCategory()
                                    }, key);
                                }))
                        ]),
                        mutil.formGroup(mutil.createSwitch(['FIND', 'EDIT'], ctrl.allowFind(), 'Mode', ctrl.switchMode))
                ]),
                m.component(system.cmp.edit, {
                        allowEdit: ctrl.allowEdit,
                        selectedCategory: ctrl.selectedCategory,
                        model: ctrl.model,
                        form: ctrl.form,
                        categories: ctrl.categories,
                        alert: ctrl.alert
                }),
                m.component(system.cmp.find, {
                        allowFind: ctrl.allowFind,
                        allowFilter: ctrl.allowFilter,
                        resultSet: ctrl.resultSet,
                        selectedCategory: ctrl.selectedCategory,
                        selectedRow: ctrl.selectedRow,
                        model: ctrl.model,
                        form: ctrl.form,
                        alert: ctrl.alert
                }),
                m.component(system.cmp.alert, {
                        alert: ctrl.alert
                })
        ]);
    }
};