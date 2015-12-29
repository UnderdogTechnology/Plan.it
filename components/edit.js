system.cmp.edit = {
    controller: function(args) {
        var model = args.model;
        var ctrl = {
            model: model,
            alert: args.alert,
            visibility: args.visibility,
            categories: args.categories,
            form: args.form,
            submitActivity: function(e, i) {
                e.preventDefault();

                var form = ctrl.form();

                if(form.name() && form.category() && form.cost() && form.players.min() && form.players.max()) {
                    var catId = form.category();

                    if(isNaN(catId)) {
                            var tmp = model.c.get({name:form.category()});
                            if(tmp.length) {
                                    catId = tmp[0].id;
                            } else {
                                    catId = model.c.upsert({name:form.category()});
                            }
                    } else {
                            var tmp = model.c.get({id: catId});
                            if(tmp.length) {
                                    catId = tmp[0].id;
                            } else {
                                    catId = model.c.upsert({name:form.category()});
                            }
                    }
                    var actId = model.a.upsert({
                            category_id: catId,
                            in_master: form.inMaster(),
                            id: form.id(),
                            name: form.name(),
                            cost: form.cost(),
                            players: {
                                    min: form.players.min(),
                                    max: form.players.max()
                            }
                    });

                    if(actId) {
                            if(actId == i) {
                                    ctrl.alert({
                                        message: 'Activity successfully updated',
                                        type: 'success'
                                    });
                            } else {
                                    ctrl.alert({
                                        message: 'Activity successfully added',
                                        type: 'success'
                                    });
                            }
                            ctrl.categories(model.c.get({},{'id': -1, 'name': 'Add New'}));
                            form.category(catId);
                    } else {
                            ctrl.alert({
                                message: 'Errm something went wrong',
                                type: 'error'
                            });
                    }

                } else {
                    ctrl.alert({
                        message: 'All fields must be populated',
                        type: 'warning'
                    });
                }
            },
            removeActivity: function(e) {
                e.preventDefault();

                var form = ctrl.form(),
                    cat = model.c.get({id: form.category()})[0];
                if(form.category() && form.category().toString() != '-1' && (form.name() || cat && cat.name)) {
                    ctrl.alert({
                            message: 'Are you sure you want to remove the ' + (form.name() ? 'activity' : 'category') + ' "' + (form.name() || cat.name) + '"?',
                            type: 'warning',
                            cb: [function() {
                                    var catId = form.category().toString(),
                                        actId;
                                    if(form.id()) {
                                        actId = model.a.remove({
                                            id: form.id()
                                        });
                                    }
                                    else if(form.name() && form.cost() && form.players.min() && form.players.max()) {
                                        
                                        actId = model.a.remove({
                                            in_master: form.inMaster(),
                                            category_id: catId != '-1' ? catId : null,
                                            name: form.name(),
                                            cost: form.cost(),
                                            players: {
                                                    min: form.players.min(),
                                                    max: form.players.max()
                                            }
                                        });
                                    }

                                    if(catId != '-1') {
                                        var tmp = model.a.get({category_id: catId});
                                        if(!tmp.length) {
                                                    model.c.remove({id:catId});
                                        } else if(!(form.name() && form.cost() && form.players.min() && form.players.max())) {
                                                    var actId = model.a.remove({category_id:catId});
                                                    model.c.remove({id:catId});
                                        }
                                    }
                                    
                                    ctrl.form({
                                        id: m.prop(null),
                                        category: m.prop(-1),
                                        name: m.prop(null),
                                        cost: m.prop(1),
                                        inMaster: m.prop(true),
                                        players: {
                                            min: m.prop(null),
                                            max: m.prop(null)
                                        }
                                    });
                                    if(actId) {
                                            ctrl.categories(model.c.get({},{'id': -1, 'name': 'Add New'}));
                                            ctrl.alert({
                                                message: 'Activity successfully removed',
                                                type: 'success'
                                            });
                                    } else {
                                            ctrl.alert({
                                                message: 'Errm something went wrong',
                                                type: 'error'
                                            });
                                    }
                          }]
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
                    hidden: !ctrl.visibility.allowEdit()
                }, [
                    mutil.formGroup(mutil.createSwitch(['ON', 'EDIT'], form.inMaster(), 'In Master', function(evt){
                            form.inMaster(evt.target.checked)
                    })),
                    mutil.formGroup([
                        m('label', 'Category Name'),
                        m('input[type="text"].form-control', {
                            placeholder: 'Category Name',
                            value: (function() {
                                    var cat = ctrl.model.c.get({'id':form.category()});
                                    if(form.category().toString() == -1) {
                                            return '';
                                    } else if(cat.length) {
                                            return cat[0].name;
                                    } else {
                                            return form.category(); 
                                    }
                            })(),
                            onchange: m.withAttr('value', form.category)
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
                            onchange: m.withAttr('value', form.cost)
                        }, eutil('costs').map(function(cost){
                            return m('option', {
                                value: cost.id,
                                selected: cost.id == form.cost()
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
                    ]),
                    mutil.formControls([
                        m('a.pure-button.btn.secondary', {
                            onclick: ctrl.removeActivity
                        }, 'Remove'),
                        m('a.pure-button.btn.primary', {
                            onclick: function(evt) {
                                if(form.id()) {
                                    ctrl.alert({
                                        message: 'Update or create new?',
                                        type: 'warning',
                                        cb: [function() {
                                                ctrl.submitActivity(evt, form.id());
                                        }, function() {
                                                form.id(null);
                                                ctrl.submitActivity(evt);
                                        }],
                                        options: ['Update', 'New']
                                    });
                                } else {
                                        ctrl.submitActivity(evt);
                                }
                            }
                        }, 'Submit')
                    ])
                ])
            ])
        ]);
    }
};