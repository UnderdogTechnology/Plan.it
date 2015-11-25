(function() {
    
    if (!Object.keys(util.storage.get('config')).length) {
        util.storage.create('config', {
            setdefault: 'false',
            pagesize: 5,
            pageturner: ['<', null, '>'],
            theme: 'one'
        });
    }
    
    var system = window.system = window.system || {};
    
    var cmp = system.cmp = {};
    var model = system.model = {};
    
    var deps = {
        // MODELS
        'models/': ['categories'],
        // COMPONENTS
        'components/': ['home', 'alert', 'find', 'results', 'edit']
    };
    
    var layout = function(title, nav, content, needsSearch) {
        var config = util.storage.get('config');
        return {
            controller: function(args) {
                document.title = title;
                return {};
            },
            view: function(ctrl, args) {
                return m('div.wrapper.theme-' + (config.theme || 'one'), [
                    m('h1.header.primary', title), 
                    m('div.content', m.component(content, {}))
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
