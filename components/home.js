system.cmp.home = {
    controller: function(args) {
        var model = system.model.categories;

        return {
            model: model,
            output: m.prop(null),
            categories: model.get(true),
            selectedCategory: model.selectedCategory,
            filter: model.filter,
            applyFilter: m.prop(false)
        };
    },
    view: function(ctrl, args) {
        var filter = ctrl.filter();

        return m('div.home', [
            m('form.center-form.pure-form.pure-form-aligned', [
                mutil.formGroup([
                    m('label', 'Selected Activity'),
                    m('div.form-control', {
                        innerHTML: ctrl.output(),
                        readonly: true
                    })
                ]),
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
                                    ctrl.selectedCategory(ctrl.applyFilter() ? Object.keys(ctrl.categories)[0] : 'Master');
                                    ctrl.filter({
                                        price: m.prop(ctrl.applyFilter() ? 1 : null),
                                        players: m.prop(null)
                                    });
                                }
                            }))
                    ])
                ]),
                m('div', {
                    hidden: !ctrl.applyFilter()
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
                        m('label', 'Cost'),
                        m('select.form-control', {
                            value: filter.price(),
                            onchange: m.withAttr('value', filter.price)
                        }, util.forEach(eutil.prices, function(val, key){
                            return m('option', {
                                value: val
                            }, key)
                        }))
                    ]),
                    mutil.formGroup([
                        m('label', 'Number of People'),
                        m('input[type="text"].form-control', {
                            placeholder: 'Number of People',
                            value: filter.players(),
                            onchange: m.withAttr('value', filter.players)
                        })
                    ])
                ]),
                mutil.formControls([
                    m('button.pure-button.btn', {
                        onclick: function(e) {
                            e.preventDefault();
                            var fList = ctrl.model.applyFilter();
                            
                            if(fList.length) {
                                ctrl.output(util.forEach(fList, function(val){
                                    return val.name;
                                }).join('<br/>'));
                            }
                            else {
                                ctrl.output('No activities found');
                            }
                        }
                    }, 'Find All'),
                    m('button.pure-button.btn-primary', {
                        onclick: function(e) {
                            e.preventDefault();
                            var fList = ctrl.model.applyFilter();
                            
                            if(fList.length) {
                                util.random(fList, function(val, key) {
                                    ctrl.output(val.name);
                                });
                            }
                            else {
                                ctrl.output('No activity found');
                            }
                        }
                    }, 'Random')
                ])
            ])
        ]);
    }
};