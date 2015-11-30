system.cmp.results = {
    controller: function(args) {
        var ctrl = {
            model: args.model || system.model.categories,
            pageturners: m.prop(util.storage.get('config')['pageturner'] || 'x'),
            curPage: args.curPage || m.prop(0),
            pageSize: m.prop(util.storage.get('config')['pagesize'] || 5),
            resultSet: args.resultSet || m.prop(),
            selectedResult: args.selectedResult || m.prop(),
            createPageturners: function() {
                var curPage = ctrl.curPage(),
                    pageturners = ctrl.pageturners(),
                    lastPage = ctrl.resultSet() ? Math.ceil(Object.keys(ctrl.resultSet()).length / ctrl.pageSize() - 1):0;

                 if(typeof pageturners == 'object') {
                    return util.forEach(pageturners, function(text){
                        if(typeof text == 'string') {
                            return m('td',{
                                onclick: function() {
                                    var addFirstLast = pageturners.length >= 4;

                                    switch(this.innerText) {
                                        case pageturners[0]:
                                            if(addFirstLast) {
                                                ctrl.curPage(0);
                                            } else if(curPage > 0){
                                                ctrl.curPage(--curPage);
                                            }
                                            break;
                                        case pageturners[1]:
                                            if(curPage > 0 && addFirstLast){
                                                ctrl.curPage(--curPage);
                                            } else if(curPage < lastPage){
                                                ctrl.curPage(++curPage);
                                            }
                                            break;
                                        case pageturners[pageturners.length - 2]:
                                            if(curPage < lastPage && addFirstLast){
                                                ctrl.curPage(++curPage);
                                            }
                                            break;
                                        case pageturners[pageturners.length - 1]:
                                            if(addFirstLast) {
                                                ctrl.curPage(lastPage);
                                            } else if(curPage < lastPage){
                                                ctrl.curPage(++curPage);
                                            }
                                            break;
                                    }
                                }
                            }, text);
                        } else {
                            return util.range(1, lastPage + 1, function(i) {
                                if(i >= curPage && (curPage + 2) >= i) {
                                    return m('td',{
                                        class: curPage + 1 == i ? 'page-selected' : '',
                                        onclick: function() {
                                            ctrl.select();
                                            ctrl.curPage(i - 1);
                                        }
                                    }, i)
                                }
                            });
                        }
                    });
                } else {
                    return util.range(1, lastPage + 1, function(i) {
                        if(i == 1 || i >= curPage - 1 && (curPage + 3) >= i || i == lastPage + 1) {
                            return m('td',{
                                class: curPage + 1 == i ? 'page-selected' : '',
                                onclick: function() {
                                    ctrl.curPage(i - 1);
                                }
                            }, (i == lastPage + 1 && i != curPage + 1? '..' : '') + i + (i == 1 && i != curPage + 1 ? '..' : ''))
                        }
                    });
                } 
            },
            selectedAct: m.prop(),
            select: function(name){
                if(name && ctrl.selectedAct() != name) {
                    var resultSet = ctrl.resultSet(),
                        result = resultSet[name];
                    ctrl.selectedAct(name);
                    var activity = {
                            name: m.prop(name),
                            cost: m.prop(result.cost),
                            players: {
                                    min: m.prop(result.players.min),
                                    max: m.prop(result.players.max)
                            }
                    };
                    ctrl.selectedResult({
                        activity: activity,
                        category: Object.keys(ctrl.model.get(false, activity))[0]
                    })
                } else {
                        ctrl.selectedAct(null);
                        ctrl.selectedResult(null);
                }
            }
        };
        return ctrl;
    },
    view: function(ctrl, args) {
        return m('div.results', {
            hidden: !(ctrl.resultSet() && Object.keys(ctrl.resultSet()).length)
        }, [
            m('table.pure-table.pure-table-horizontal', [
                m('thead.primary',
                    m('tr', [
                        m('td', 'Name'),
                        m('td', 'Cost'),
                        m('td', 'Min'),
                        m('td', 'Max')
                    ])
                ),
                m('tbody', util.forEach(ctrl.resultSet(), function(activity, name, obj, i){
                    var start = ctrl.curPage() * ctrl.pageSize();

                    if(ctrl.pageSize() <= 0 || (i >= start && i < start + ctrl.pageSize())) {
                        return m('tr.result-row', {
                            onclick: ctrl.select.bind(null, name),
                            class: ctrl.selectedAct() == name ? 'secondary' : ''
                        }, [
                            m('td', name),
                            m('td', Object.keys(eutil.costs)[activity.cost - 1]),
                            m('td', activity.players.min),
                            m('td', activity.players.max)
                        ]);
                    }
                }))
            ]),
            m('table.pagination', {
                hidden: !(ctrl.pageSize() > 0 && ctrl.resultSet() && Object.keys(ctrl.resultSet()).length > ctrl.pageSize())
            }, [
                m('tr', ctrl.createPageturners())
            ])
        ]);
    }
};