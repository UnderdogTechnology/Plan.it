system.cmp.edit = {
    controller: function(args) {
        var model = system.model.categories;

        return {
            model: model,
            applyFilter: m.prop(true)
        };
    },
    view: function(ctrl, args) {
        return m('div.edit', [
            m('p', 'arstarst')
        ]);
    }
};