system.cmp.edit = {
    controller: function(args) {
        return {
            model: args.model || system.model.categories,
            selectedCategory: args.selectedCategory || m.prop('Master'),
            alert: args.alert || m.prop(),
            allowEdit: args.allowEdit || m.prop(false),
            categories: args.categories || m.prop(model.get(false)),
            form: args.form || m.prop({
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
                            value: ctrl.selectedCategory(),
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
                            value: form.players().min(),
                            onchange: m.withAttr('value', form.players().min)
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'Max People'),
                        m('input[type="number"].form-control', {
                            placeholder: 'Max People',
                            value: form.players().max(),
                            onchange: m.withAttr('value', form.players().max)
                        })
                    ]),
                    mutil.formControls([
                        m('button.pure-button.btn', {
                            onclick: function(e) {
                                e.preventDefault();
                                ctrl.alert(null);
                                
                                if(ctrl.selectedCategory()) {
                                    ctrl.model.remove(form.name() ? [ctrl.selectedCategory(), form.name()].join('.') : ctrl.selectedCategory());
                                    ctrl.categories(ctrl.model.get(false));
                                    ctrl.categories()['Add New'] = {};
                                
                                    var selCat = Object.keys(ctrl.categories())[0];

                                    ctrl.selectedCategory(selCat == 'Add New' ? '' : selCat);
                                    ctrl.form({
                                        name: m.prop(null),
                                        cost: m.prop(1),
                                        players: m.prop({
                                            min: m.prop(null),
                                            max: m.prop(null)
                                        })
                                    });
                                    ctrl.alert({
                                        message: 'Activity successfully removed',
                                        type: 'success'
                                    });
                                }
                                else {
                                    ctrl.alert({
                                        message: 'You must select a valid category',
                                        type: 'warning'
                                    });
                                }
                            }
                        }, 'Remove'),
                        m('button.pure-button.btn-primary', {
                            onclick: function(e) {
                                e.preventDefault();
                                ctrl.alert(null);

                                var act = {
                                    cost: form.cost(),
                                    players: {
                                        min:form.players().min(),
                                        max: form.players().max()
                                    }
                                };

                                if(form.name() && ctrl.selectedCategory(), act.cost && act.players.min && act.players.max) {
                                    ctrl.model.update(form, [ctrl.selectedCategory(), form.name()].join('.'));
                                    ctrl.categories(ctrl.model.get(false));
                                    ctrl.form({
                                        name: m.prop(null),
                                        cost: m.prop(1),
                                        players: m.prop({
                                            min: m.prop(null),
                                            max: m.prop(null)
                                        })
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
                            }
                        }, 'Submit')
                    ])
                ])
            ])
        ]);
    }
};