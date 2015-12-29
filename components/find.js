system.cmp.find = {
    controller: function(args) {
            var model = args.model;
        var ctrl = {
            model: model,
            selected: args.selected || m.prop({}),
            visibility: args.visibility,
            resultSet: m.prop(),
            alert: args.alert || m.prop(),
            resetForm: args.resetForm,
            form: args.form,
            curPage: m.prop(0),
            findAll: function(e) {
                    e.preventDefault();
                    ctrl.alert(null);
                    ctrl.curPage(0);

                    var form = ctrl.form();

                    var fList;
                    if (form.category().toString() == '-1') {
                            fList = model.a.get({
                                    'in_master': 'true',
                                    'name': form.name(),
                                    'cost': form.cost(),
                                    'players': {
                                            'min': form.players.min(),
                                            'max': form.players.max()
                                    }
                            });
                    } else {
                            fList = model.a.get({
                                    'category_id': form.category().toString(),
                                    'name': form.name(),
                                    'cost': form.cost(),
                                    'players': {
                                            'min': form.players.min(),
                                            'max': form.players.max()
                                    }
                            });
                    }
                    if(fList.length) {
                        ctrl.resultSet(fList);
                    }
                    else {
                        ctrl.resultSet({});
                        ctrl.alert({
                                message: 'No activites found',
                                type: 'info'
                            });
                    }
                    ctrl.selected({});
                },
            findRandom: function(e) {
                    e.preventDefault();
                    ctrl.alert(null);
                    ctrl.curPage(0);

                    var form = ctrl.form();

                    var fList;
                    if (form.category().toString() == '-1') {
                            fList = model.a.get({'in_master': 'true'});
                    } else {
                            fList = model.a.get({
                                    'category_id': form.category().toString(),
                                    'name': form.name(),
                                    'cost': form.cost(),
                                    'players': {
                                            'min': form.players.min(),
                                            'max': form.players.max()
                                    }
                            });
                    }

                    if(fList.length) {
                        ctrl.resultSet(util.random(fList, function(activity, name) {
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
                    ctrl.selected({});
                }
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        var form = ctrl.form();
        
        return m('div.find', {
            hidden: !ctrl.visibility.allowFind()
        }, [
            m('form.center-form.pure-form.pure-form-aligned', [
                mutil.formGroup(mutil.createSwitch(['ON', 'OFF'], ctrl.visibility.allowFilter(), 'Filter', function(evt) {
                    ctrl.visibility.allowFilter(evt.target.checked);
                    ctrl.form({
                        id: m.prop(null),
                        category: m.prop(-1),
                        inMaster: m.prop(true),
                        name: m.prop(ctrl.visibility.allowFilter() ? form.name() : null),
                        cost: m.prop(ctrl.visibility.allowFilter() ? form.cost() || 1 : null),
                        players: {
                            min: m.prop(ctrl.visibility.allowFilter() ? form.players.min() : null),
                            max: m.prop(ctrl.visibility.allowFilter() ? form.players.max() : null)
                        }
                    });
                })),
                m('div', {
                    hidden: !ctrl.visibility.allowFilter()
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
                        }, eutil('costs').map(function(cost){
                            return m('option', {
                                value: cost.id
                            }, cost.name)
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
                    m('button.pure-button.btn.secondary', {
                        onclick: ctrl.findAll
                    }, 'Find All'),
                    m('button.pure-button.btn.primary', {
                        onclick: ctrl.findRandom
                    }, 'Random')
                ]),
                m.component(system.cmp.results, {
                    resultSet:ctrl.resultSet,
                    selected: ctrl.selected,
                    curPage: ctrl.curPage,
                    model: ctrl.model,
                    settings: args.settings,
                    form: ctrl.form
                })
            ])
        ]);
    }
};