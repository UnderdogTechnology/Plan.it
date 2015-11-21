system.cmp.home = {
    controller: function(args) {
        var model = system.model.categories;

        return {
            model: model,
            categories: model.get(true),
            selectedCategory: model.selectedCategory,
            applyFilter: m.prop(false),
            resultSet: m.prop(),
            alert: m.prop(),
            allowEdit: m.prop(false),
            form: m.prop({
                cost: m.prop(null),
                players: m.prop({
                    min: m.prop(null),
                    max: m.prop(null)
                }),
                name: m.prop(null)
            })
        };
    },
    view: function(ctrl, args) {
        var form = ctrl.form();

        return m('div.home', [
        m('form.center-form.pure-form.pure-form-aligned', [
            mutil.formGroup({
                    hidden: !ctrl.resultSet()
                }, ctrl.resultSet() && ctrl.resultSet().length ? [
                    m('table.pure-table.pure-table-horizontal', [m('thead',m('tr', [
                        m('td', 'Name'),
                        m('td', 'Cost'),
                        m('td', 'Min'),
                        m('td', 'Max')
                    ]))].concat(util.forEach(ctrl.resultSet(), function(obj){
                        return m('tr', {
                            onclick: function(evt) {
                                if(ctrl.allowEdit()) {
                                    var elem = evt.target.nodeName == 'TR' ? evt.target : evt.target.parentNode;
                                    var tds = util.qq('td', elem);
                                    form.name(tds[0].innerText);
                                    form.cost(eutil.costs[tds[1].innerText]);
                                    form.players().min(tds[2].innerText);
                                    form.players().max(tds[3].innerText);
                                }
                            }
                        }, [
                            m('td', obj.name),
                            m('td', Object.keys(eutil.costs)[obj.cost]),
                            m('td', obj.players.min),
                            m('td', obj.players.max)
                        ])
                    })))
                ] : ctrl.alert()),
                mutil.formGroup([
                    m('label', 'Filter'),
                    m('div.tgl', [
                        m('label.tgl-btn', {
                                class: ctrl.applyFilter() ? 'tgl-on' : 'tgl-off'
                            },
                            m('div.tgl-opt', 'ON'),
                            m('div.separator'),
                            m('div.tgl-opt', 'OFF'),
                            m('input[type="checkbox"].tgl-switch', {
                                checked: ctrl.applyFilter(),
                                onchange: function(evt) {
                                    ctrl.applyFilter(evt.target.checked);
                                    ctrl.selectedCategory(ctrl.applyFilter() || ctrl.allowEdit() ? Object.keys(ctrl.categories)[0] : 'Master');
                                    form.cost(ctrl.applyFilter() || ctrl.allowEdit() ? form.cost() || 1 : null);
                                    form.players().min(ctrl.applyFilter() || ctrl.allowEdit() ? form.players().min() : null);
                                    form.players().max(ctrl.applyFilter() || ctrl.allowEdit() ? form.players().max() : null);
                                    form.name(ctrl.applyFilter() || ctrl.allowEdit() ? form.name() : null);
                                }
                            }))
                    ]),
                    m('div.tgl', {
                        style: 'float:right;'
                    }, [
                        m('label.tgl-btn', {
                                class: !ctrl.allowEdit() ? 'tgl-on' : 'tgl-off'
                            },
                            m('div.tgl-opt', 'FIND'),
                            m('div.separator'),
                            m('div.tgl-opt', 'EDIT'),
                            m('input[type="checkbox"].tgl-switch', {
                                checked: ctrl.allowEdit(),
                                onchange: function(evt) {
                                    ctrl.allowEdit(evt.target.checked);
                                    ctrl.selectedCategory(ctrl.applyFilter() || ctrl.allowEdit() ? Object.keys(ctrl.categories)[0] : 'Master');
                                    form.cost(ctrl.applyFilter() || ctrl.allowEdit() ? form.cost() || 1 : null);
                                    form.players().min(ctrl.applyFilter() || ctrl.allowEdit() ? form.players().min() : null);
                                    form.players().max(ctrl.applyFilter() || ctrl.allowEdit() ? form.players().max() : null);
                                    form.name(ctrl.applyFilter() || ctrl.allowEdit() ? form.name() : null);
                                }
                            }))
                    ])
                ]),
                m('div', {
                    hidden: !ctrl.applyFilter() && !ctrl.allowEdit()
                }, [
                    mutil.formGroup([
                        m('label', 'Category'),
                        m('select.form-control', {
                            onchange: m.withAttr('value', ctrl.selectedCategory)
                        }, util.forEach(ctrl.categories, function(val, key) {
                            return m('option', {
                                selected: key == ctrl.selectedCategory()
                            }, key);
                        }))
                    ]),
                    mutil.formGroup([
                        m('label', 'Name'),
                        m('input[type="text"].form-control', {
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
                        m('input[type="text"].form-control', {
                            placeholder: 'Min People',
                            value: form.players().min(),
                            onchange: m.withAttr('value', form.players().min)
                        })
                    ]),
                    mutil.formGroup([
                        m('label', 'Max People'),
                        m('input[type="text"].form-control', {
                            placeholder: 'Max People',
                            value: form.players().max(),
                            onchange: m.withAttr('value', form.players().max)
                        })
                    ])
                ]),
                mutil.formControls({
                    hidden: ctrl.allowEdit() && !ctrl.applyFilter()
                }, [
                    m('button.pure-button.btn', {
                        onclick: function(e) {
                            e.preventDefault();
                            ctrl.model.filter(form);
                            var fList = ctrl.model.applyFilter();

                            ctrl.resultSet(fList);

                            if(!fList.length) {
                                ctrl.alert('No activites found');
                            }
                        }
                    }, 'Find All'),
                    m('button.pure-button.btn-primary', {
                        onclick: function(e) {
                            e.preventDefault();
                            ctrl.model.filter(form);
                            var fList = ctrl.model.applyFilter();
                            
                            if(fList.length) {
                                util.random(fList, function(val) {
                                        ctrl.resultSet([val]);
                                });
                            }
                            else {
                                ctrl.resultSet([]);
                                ctrl.alert('No activites found');
                            }
                        }
                    }, 'Random')
                ]),
                mutil.formControls({
                    hidden: !ctrl.allowEdit()
                }, [
                    m('button.pure-button.btn', {
                        onclick: function(e) {
                            e.preventDefault();
                            ctrl.model.remove([ctrl.selectedCategory(), form.name()].join('.'));
                        }
                    }, 'Remove'),
                    m('button.pure-button.btn-primary', {
                        onclick: function(e) {
                            e.preventDefault();
                            var act = {
                                cost: form.cost(),
                                players: {
                                    min:form.players().min(),
                                    max: form.players().max()
                                }
                            };

                            if(form.name() && act.cost && act.players.min && act.players.max) {
                                ctrl.model.update({
                                    cost: form.cost(),
                                    players: {
                                        min:form.players().min(),
                                        max: form.players().max()
                                    }
                                }, [ctrl.selectedCategory(), form.name()].join('.'));
                            }
                            else {
                                ctrl.resultSet([]);
                                ctrl.alert('All fields must be populated');
                            }
                        }
                    }, 'Submit')
                ])
            ])
        ]);
    }
};