system.cmp.home = {
        controller: function(args) {
                var model = system.model.categories;

                return {
                        model: model,
                        categories: m.prop(model.get(true)),
                        selectedCategory: args.selectedCategory || m.prop('Master'),
                        resultSet: m.prop(),
                        alert: m.prop(),
                        allowEdit: m.prop(false),
                        allowFind: m.prop(true),
                        form: m.prop({
                                name: m.prop(null),
                                cost: m.prop(null),
                                players: m.prop({
                                        min: m.prop(null),
                                        max: m.prop(null)
                                })
                        })
                };
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
                        mutil.formGroup(mutil.createSwitch(['FIND', 'EDIT'], ctrl.allowFind(), 'Mode', function(evt) {
                                ctrl.allowFind(evt.target.checked);
                                ctrl.allowEdit(!evt.target.checked);
                                ctrl.form({
                                        name: m.prop(null),
                                        cost: m.prop(!ctrl.allowFind() ? 1 : null),
                                        players: m.prop({
                                                min: m.prop(null),
                                                max: m.prop(null)
                                        })
                                });
                                ctrl.alert(null);
                                ctrl.categories(ctrl.model.get(evt.target.checked));

                                if(!evt.target.checked) {
                                        ctrl.categories()['Add New'] = {};
                                
                                        var selCat = Object.keys(ctrl.categories())[0];
                                        ctrl.selectedCategory(selCat == 'Add New' ? '' : selCat);
                                }
                                else {
                                        ctrl.selectedCategory('Master');
                                }

                        }))
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
                        selectedCategory: ctrl.selectedCategory,
                        model: ctrl.model,
                        form: ctrl.form,
                        alert: ctrl.alert
                }),
                m('div.alert', {
                        class: (!ctrl.alert() ? 'alert-hidden' : 'alert-'.concat(ctrl.alert().type)),
                        onclick: function() {
                                ctrl.alert(null);
                        }
                }, [
                        m('span', ctrl.alert() ? ctrl.alert().message : ''),
                        m('span.alert-x', 'x')
                ]),
        ]);
    }
};