system.cmp.edit = {
    controller: function(args) {
        var ctrl = {
            model: args.model || system.model.categories,
            selectedCategory: args.selectedCategory || m.prop('Master'),
            alert: args.alert || m.prop(),
            allowEdit: args.allowEdit || m.prop(false),
            categories: args.categories || m.prop(model.get(false)),
            form: args.form || m.prop({
                name: m.prop(null),
                cost: m.prop(null),
                players: {
                    min: m.prop(null),
                    max: m.prop(null)
                }
            }),
            submitActivity: function(e) {
                e.preventDefault();
                ctrl.alert(null);

                var form = ctrl.form();

                if(form.name() && ctrl.selectedCategory() && form.cost() && form.players.min() && form.players.max()) {
                    ctrl.model.update(form, [ctrl.selectedCategory(), form.name()].join('.'));
                    ctrl.categories(ctrl.model.get(false));
                    ctrl.form({
                        name: m.prop(null),
                        cost: m.prop(1),
                        players: {
                            min: m.prop(null),
                            max: m.prop(null)
                        }
                    });
                    ctrl.alert({
                        message: 'Activity successfully added',
                        type: 'success'
                    });
                }
                else {
                    ctrl.alert({
                        message: 'All fields must be populated',
                        type: 'warning'
                    });
                }
            },
            removeActivity: function(e) {
                e.preventDefault();
                ctrl.alert(null);

                var form = ctrl.form();

                if(ctrl.selectedCategory() != 'Add New') {
                    ctrl.alert({
                            message: 'Are you sure you want to remove the ' + (form.name() ? 'activity' : 'category') + ' "' + (form.name() || ctrl.selectedCategory()) + '"?',
                            type: 'warning',
                            cb: function() {
                                    ctrl.model.remove(form.name() ? [ctrl.selectedCategory(), form.name()].join('.') : ctrl.selectedCategory());
                                    ctrl.categories(ctrl.model.get(false));
                                    ctrl.categories()['Add New'] = {};

                                    var selCat = Object.keys(ctrl.categories())[0];

                                    ctrl.selectedCategory(selCat == 'Add New' ? '' : selCat);
                                    ctrl.form({
                                        name: m.prop(null),
                                        cost: m.prop(1),
                                        players: {
                                            min: m.prop(null),
                                            max: m.prop(null)
                                        }
                                    });
                                    ctrl.alert({
                                        message: 'Activity successfully removed',
                                        type: 'success'
                                    });
                          }
                    })
                }
                else {
                    ctrl.alert({
                        message: 'You must select a valid category',
                        type: 'warning'
                    });
                }
            }
        };

        return ctrl;
    },
    view: function(ctrl, args) {
        var form = ctrl.form();

        return m('div.edit', [
        m('form.center-form.pure-form.pure-form-aligned', [
                m('div', {
                    hidden: !ctrl.allowEdit()
                }, [
                    mutil.formGroup([
                        m('label', 'Category Name'),
                        m('input[type="text"].form-control', {
                            placeholder: 'Category Name',
                            value: ctrl.selectedCategory() == 'Add New' ? '' : ctrl.selectedCategory(),
                            onchange: m.withAttr('value', ctrl.selectedCategory)
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'Name'),
                        m('input[type="text"].form-control', {
                            placeholder: 'Name',
                            value: form.name(),
                            onchange: m.withAttr('value', form.name)
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'Cost'),
                        m('select.form-control', {
                            value: form.cost(),
                            onchange: m.withAttr('value', form.cost)
                        }, util.forEach(eutil.costs, function(val, key){
                            return m('option', {
                                value: val
                            }, key)
                        }))
                    ]),
                    mutil.formGroup([
                        m('label', 'Min People'),
                        m('input[type="number"].form-control', {
                            placeholder: 'Min People',
                            value: form.players.min(),
                            onchange: m.withAttr('value', form.players.min)
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'Max People'),
                        m('input[type="number"].form-control', {
                            placeholder: 'Max People',
                            value: form.players.max(),
                            onchange: m.withAttr('value', form.players.max)
                        })
                    ]),
                    mutil.formControls([
                        m('button.pure-button.btn', {
                            onclick: ctrl.removeActivity
                        }, 'Remove'),
                        m('button.pure-button.btn-primary', {
                            onclick: ctrl.submitActivity
                        }, 'Submit')
                    ])
                ])
            ])
        ]);
    }
};