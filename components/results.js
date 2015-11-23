system.cmp.results = {
    controller: function(args) {
        return {
            curPage: m.prop(0),
            pageSize: m.prop(5),
            resultSet: args.resultSet || m.prop()
        };
    },
    view: function(ctrl, args) {
        return m('div.results', {
            hidden: !(ctrl.resultSet() && Object.keys(ctrl.resultSet()).length)
        }, [
            m('table.pure-table.pure-table-horizontal', [m('thead',m('tr', [
                m('td', 'Name'),
                m('td', 'Cost'),
                m('td', 'Min'),
                m('td', 'Max')
            ]))].concat(util.forEach(ctrl.resultSet(), function(activity, name, obj, i){
                var start = ctrl.curPage() * ctrl.pageSize();

                if(i >= start && i < start + ctrl.pageSize()) {
                    return m('tr', [
                        m('td', name),
                        m('td', Object.keys(eutil.costs)[activity.cost - 1]),
                        m('td', activity.players.min),
                        m('td', activity.players.max)
                    ]);
                }
            })).concat((ctrl.resultSet() && Object.keys(ctrl.resultSet()).length > ctrl.pageSize()) ? [
                m('tr.pagination', [
                    m('td', {
                        onclick: function() {
                            var curPage = ctrl.curPage();
                            if(curPage > 0){
                                ctrl.curPage(--curPage);
                            }
                        }
                    }, '<'),
                    m('td', {
                        onclick: function() {
                            ctrl.curPage(0);
                        }
                    }, '<<'),
                    m('td', {
                        onclick: function() {
                            ctrl.curPage(Math.ceil(Object.keys(ctrl.resultSet()).length / ctrl.pageSize() - 1));
                        }
                    }, '>>'),
                    m('td',{
                        onclick: function() {
                            var curPage = ctrl.curPage();
                            if(curPage < Math.ceil(Object.keys(ctrl.resultSet()).length / ctrl.pageSize() - 1)){
                                ctrl.curPage(++curPage);
                            }
                        }
                    }, '>')
                ])
            ] : []))
        ]);
    }
};