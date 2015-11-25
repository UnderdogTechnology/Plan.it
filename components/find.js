system.cmp.find = {
    controller: function(args) {
        var ctrl = {
            model: args.model || system.model.categories,
            selectedCategory: args.selectedCategory || m.prop('Master'),
            selectedRow: args.selectedRow || m.prop(),
            allowFind: args.allowFind || m.prop(true),
            allowFilter: args.allowFilter || m.prop(false),
            resultSet: args.resultSet || m.prop(),
            alert: args.alert || m.prop(),
            form: args.form || m.prop({
                name: m.prop(null),
                cost: m.prop(null),
                players: {
                    min: m.prop(null),
                    max: m.prop(null)
                }
            }),
            curPage: m.prop(0),
            findAll: function(e) {
                    e.preventDefault();
                    ctrl.alert(null);
                    ctrl.curPage(0);

                    var form = ctrl.form();

                    var fList = ctrl.model.get(true, form, ctrl.selectedCategory());

                    if(Object.keys(fList).length && Object.keys(fList[ctrl.selectedCategory()]).length) {
                        ctrl.resultSet(fList[ctrl.selectedCategory()]);
                    }
                    else {
                        ctrl.resultSet({});
                        ctrl.alert({
                                message: 'No activites found',
                                type: 'info'
                            });
                    }
                },
            findRandom: function(e) {
                    e.preventDefault();
                    ctrl.alert(null);
                    ctrl.curPage(0);

                    var form = ctrl.form();

                    var fList = ctrl.model.get(true, form);

                    if(Object.keys(fList).length) {
                        ctrl.resultSet(util.random(fList[ctrl.selectedCategory()], function(activity, name) {
                            if(name && activity) {
                                var o = {};
                                o[name] = activity;
                                return o;
                            }
                            else {
                                ctrl.alert({
                                    message: 'No activites found',
                                    type: 'info'
                                });
                                return {};
                            }
                        }));
                    }
                    else {
                        ctrl.resultSet({});
                        ctrl.alert({
                            message: 'No activites found',
                            type: 'info'
                        });
                    }
                }
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        var form = ctrl.form();

        return m('div.find', {
            hidden: !ctrl.allowFind()
        }, [
            m('form.center-form.pure-form.pure-form-aligned', [
                mutil.formGroup(mutil.createSwitch(['ON', 'OFF'], ctrl.allowFilter(), 'Filter', function(evt) {
                    ctrl.alert(null);
                    ctrl.allowFilter(evt.target.checked);
                    ctrl.form({
                        category: m.prop(null),
                        name: m.prop(ctrl.allowFilter() ? form.name() : null),
                        cost: m.prop(ctrl.allowFilter() ? form.cost() || 1 : null),
                        players: {
                            min: m.prop(ctrl.allowFilter() ? form.players.min() : null),
                            max: m.prop(ctrl.allowFilter() ? form.players.max() : null)
                        }
                    });
                })),
                m('div', {
                    hidden: !ctrl.allowFilter()
                }, [
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
                    ])
                ]),
                mutil.formControls([
                    m('button.pure-button.btn', {
                        onclick: ctrl.findAll
                    }, 'Find All'),
                    m('button.pure-button.btn-primary', {
                        onclick: ctrl.findRandom
                    }, 'Random')
                ]),
                m.component(system.cmp.results, {
                    resultSet:ctrl.resultSet,
                    selectedRow: ctrl.selectedRow,
                    curPage: ctrl.curPage
                })
            ])
        ]);
    }
};