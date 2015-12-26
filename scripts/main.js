(function() {
    var system = window.system = window.system || {};

    var cmp = system.cmp = {};
    var model = system.model = {};
    
    var deps = {
        // MODELS
        'models/': ['categories', 'themes', 'settings'],
        // COMPONENTS
        'components/': ['home', 'alert', 'find', 'results', 'edit', 'settings']
    };
    
    var layout = function(title, nav, content, needsSearch) {
        return {
            controller: function(args) {
                document.title = title;

                var settings = system.model.settings.get();

                var themes = system.model.themes.get();
                system.loadTheme(settings.theme, themes[settings.theme]);

                return {settings: settings};
            },
            view: function(ctrl, args) {
                return m('div.wrapper', [
                    m('h1.header.primary', title), 
                    m('div.content', m.component(content, args[0]))
                ]);
            }
        };
    }
    ;
    
    var loadNavItems = function() {
        return m.prop([{
            name: 'Plan.it',
            url: '/',
            icon: 'fa fa-home fa-lg',
            component: cmp.home
        }, {
            name: 'Settings',
            url: '/settings',
            icon: 'fa fa-home fa-lg',
            component: cmp.settings
        }]);
    }
    ;
    
    var loadRoutes = function() {
        // fetch the nav items
        var navItems = loadNavItems();
        // apply the layout to each component in the nav and create the core route object
        var routes = {};
        navItems().forEach(function(item) {
            item.component = layout(item.name, navItems, item.component, item.needsSearch);
            routes[item.url] = item.component;
        }
        );
        // add any extra non-core routes
        util.extend(routes, {});
        // use hash for routing, NOTE: we'll probably change this to slash later once it's hosted
        m.route.mode = 'hash';
        
        m.route(document.body, '/', routes);
    }
    ;
    
    // load models, then components
    system.loadModules(deps, loadRoutes);
}
());
