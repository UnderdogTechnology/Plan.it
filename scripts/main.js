(function() {

    var system = window.system = window.system || {};

    var cmp = system.cmp = {};
    var model = system.model = {};

    var deps = {
        // EXTRA
        'scripts/': ['util'],
        // MODELS
        'models/': ['categories'],
        // COMPONENTS
        'components/': ['home', 'nav']
    };

    var layout = function(title, nav, content, needsSearch) {
        return {
            controller: function(args) {
                document.title = title;
                return {};
            },
            view: function(ctrl, args) {
                return m('div.wrapper', [
                    m('h1.header', title),
                    m.component(cmp.nav, {
                        active: title,
                        items: nav,
                        menuVisible: ctrl.menuVisible
                    }),
                    m('div.content', m.component(content))
                ]);
            }
        };
    };  

    var loadNavItems = function() {
        return m.prop([{
            name: 'Home',
            url: '/',
            icon: 'fa fa-home fa-lg',
            component: cmp.home
        }]);
    };

    var loadRoutes = function() {
        // fetch the nav items
        var navItems = loadNavItems();
        // apply the layout to each component in the nav and create the core route object
        var routes = {};
        navItems().forEach(function(item) {
            item.component = layout(item.name, navItems, item.component, item.needsSearch);
            routes[item.url] = item.component;
        });
        // add any extra non-core routes
        util.extend(routes, {});
        // use hash for routing, NOTE: we'll probably change this to slash later once it's hosted
        m.route.mode = 'hash';

        m.route(document.body, '/', routes);
    };
    
    // load models, then components
    system.loadModules(deps, loadRoutes);
    
}());