Ext.define('Ung.rpc.Rpc', {
    alternateClassName: 'Rpc',
    singleton: true,

    loadWebUi: function() {
        var deferred = new Ext.Deferred(), me = this;
        this.getWebuiStartupInfo(function (result, exception) {
            if (exception) { deferred.reject(exception); }
            Ext.apply(me, result);
            console.log('hahaha');


            String.prototype.translate = function() {
                var record = Rpc.rpc.translations[this.valueOf()], value;
                if (record === null) {
                    alert('Missing translation for: ' + this.valueOf()); // Key is not found in the corresponding messages_<locale>.properties file.
                    return this.valueOf(); // Return key name as placeholder
                }
                return value;
            };

            //console.log('Dashboard'.translate());

            if (me.nodeManager.node('untangle-node-reports')) {
                me.reportsManager = me.nodeManager.node('untangle-node-reports').getReportsManager();
            }
            deferred.resolve();
        });
        return deferred.promise;
    },

    loadReports: function () {
        var deferred = new Ext.Deferred();
        if (this.rpc.nodeManager.node('untangle-node-reports')) {
            this.rpc.reportsManager = this.rpc.nodeManager.node('untangle-node-reports').getReportsManager();
            this.rpc.reportsManager.getReportEntries(function (result, exception) {
                if (exception) { deferred.reject(exception); }
                deferred.resolve(result);
            });

        } else {
            deferred.reject('Reports not installed!');
        }
        return deferred.promise;
    },

    loadDashboardSettings: function () {
        var deferred = new Ext.Deferred();
        this.rpc.dashboardManager.getSettings(function (settings, exception) {
            if (exception) { deferred.reject(exception); }
            //Ung.app.dashboardSettings = result;

            //Ung.app.getStore('Widgets').loadRawData(result.widgets);
            //Ext.get('app-loader-text').setHtml('Loading widgets ...');
            deferred.resolve(settings);
        });
        return deferred.promise;
    },

    getReportData: function (entry, timeframe) {
        var deferred = new Ext.Deferred();
        this.rpc.reportsManager.getDataForReportEntry(function(result, exception) {
            if (exception) { deferred.reject(exception); }
            deferred.resolve(result);
        }, entry, timeframe, -1);
        return deferred.promise;
    },

    getRpcNode: function (nodeId) {
        var deferred = new Ext.Deferred();
        this.rpc.nodeManager.node(function (result, ex) {
            if (ex) { deferred.reject(ex); }
            deferred.resolve(result);
        }, nodeId);
        return deferred.promise;
    },

    getNodeSettings: function (node) {
        var deferred = new Ext.Deferred();
        node.getSettings(function (result, ex) {
            if (ex) { deferred.reject(ex); }
            deferred.resolve(result);
        });
        return deferred.promise;
    },

    setNodeSettings: function (node, settings) {
        console.log(settings);
        var deferred = new Ext.Deferred();
        node.setSettings(function (result, ex) {
            console.log(result);
            if (ex) { deferred.reject(ex); }
            deferred.resolve(result);
        }, settings);
        return deferred.promise;
    },




    readRecords: function () {
        console.log('read');
        return {};
    }


});
Ext.define('Ung.util.Util', {
    alternateClassName: 'Ung.Util',
    singleton: true,

    // node name to class mapping
    nodeClassMapping: {
        'untangle-node-web-filter': 'Ung.node.WebFilter',
        'untangle-node-web-filter-lite': 'Ung.node.WebFilterLite',
        'untangle-node-virus-blocker': 'Ung.node.VirusBlocker',
        'untangle-node-virus-blocker-lite': 'Ung.node.VirusBlockerLite',
        'untangle-node-spam-blocker': 'Ung.node.SpamBlocker',
        'untangle-node-spam-blocker-lite': 'Ung.node.SpamBlockerLite',
        'untangle-node-phish-blocker': 'Ung.node.PhishBlocker',
        'untangle-node-web-cache': 'Ung.node.WebCache',
        'untangle-node-bandwidth-control': 'Ung.node.BandwidthControl',
        'untangle-casing-ssl-inspector': 'Ung.node.SslInspector',
        'untangle-node-application-control': 'Ung.node.ApplicationControl',
        'untangle-node-application-control-lite': 'Ung.node.ApplicationControlLite',
        'untangle-node-captive-portal': 'Ung.node.CaptivePortal',
        'untangle-node-firewall': 'Ung.node.Firewall',
        'untangle-node-ad-blocker': 'Ung.node.AdBlocker',

        'untangle-node-reports': 'Ung.node.Reports'
    },

    iconTitle: function (text, icon) {
        var icn = icon.split('-') [0],
            size = icon.split('-') [1] || 24;
        return '<i class="material-icons" style="font-size: ' + size + 'px">' +
                icn + '</i> <span style="vertical-align: middle;">' +
                text + '</span>';
    },

    iconReportTitle: function (report) {
        var icon;
        switch (report.get('type')) {
        case 'TEXT':
            icon = 'subject';
            break;
        case 'EVENT_LIST':
            icon = 'format_list_bulleted';
            break;
        case 'PIE_GRAPH':
            icon = 'pie_chart';
            if (report.get('pieStyle') === 'COLUMN' || report.get('pieStyle') === 'COLUMN_3D') {
                icon = 'insert_chart';
            } else {
                if (report.get('pieStyle') === 'DONUT' || report.get('pieStyle') === 'DONUT_3D') {
                    icon = 'donut_large';
                }
            }
            break;
        case 'TIME_GRAPH':
        case 'TIME_GRAPH_DYNAMIC':
            if (report.get('timeStyle').indexOf('BAR') >= 0) {
                icon = 'insert_chart';
            } else {
                icon = 'show_chart';
            }
            break;
        default:
            icon = 'subject';
        }
        return '<i class="material-icons" style="font-size: 18px">' + icon + '</i>';
    },

    bytesToHumanReadable: function (bytes, si) {
        var thresh = si ? 1000 : 1024;
        if(Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while(Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1)+' '+units[u];
    },

    successToast: function (message) {
        Ext.toast({
            html: this.iconTitle(message, 'check-20'),
            bodyPadding: '8 10',
            baseCls: 'toast',
            border: false,
            bodyBorder: false,
            align: 'br',
            autoCloseDelay: 5000,
            slideInAnimation: 'easeOut',
            slideInDuration: 300,
            hideDuration: 0,
            paddingX: 30,
            paddingY: 50
        });
    },

    exceptionToast: function (message) {
        Ext.toast({
            html: this.iconTitle('<span style="color: #FFF; font-weight: bold;">Exception!</span> ' + message, 'error-20'),
            bodyPadding: '10',
            baseCls: 'toast',
            cls: 'exception',
            border: false,
            bodyBorder: false,
            align: 'br',
            autoCloseDelay: 5000,
            slideInAnimation: 'easeOut',
            slideInDuration: 300,
            hideDuration: 0,
            paddingX: 30,
            paddingY: 50
        });
    },

    urlValidator: function (val) {
        var res = val.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return res ? true : 'Url missing or in wrong format!'.t();
    },

    /**
     * Helper method that lists the order in which classes are loaded
     */
    getClassOrder: function () {
        var classes = [];

        Ext.Loader.history.forEach(function (cls) {
            if (cls.indexOf('Ung') === 0) {
                classes.push(cls.replace('Ung', 'app').replace(/\./g, '/') + '.js');
            }
        });

        classes.pop();

        Ext.create('Ext.Window', {
            title: 'Untangle Classes Load Order',
            width: 400,
            height: 600,

            // Constraining will pull the Window leftwards so that it's within the parent Window
            modal: true,
            draggable: false,
            resizable: false,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'end'
            },
            items: [{
                xtype: 'component',
                padding: 10,
                html: 'Copy this list into <strong>.buildorder</strong> file!'
            }, {
                xtype: 'textarea',
                border: false,
                flex: 1,
                editable: false,
                fieldStyle: {
                    background: '#FFF',
                    fontSize: '11px'
                },
                value: classes.join('\r\n')
            }]
        }).show();
    }
});
Ext.define('Ung.util.Metrics', {
    singleton: true,
    frequency: 3000,
    interval: null,
    running: false,

    start: function () {
        var me = this;
        me.stop();
        me.run();
        me.interval = window.setInterval(function () {
            me.run();
        }, me.frequency);
    },

    stop: function () {
        if (this.interval !== null) {
            window.clearInterval(this.interval);
        }
    },

    run: function () {
        var data = [];
        rpc.metricManager.getMetricsAndStats(Ext.bind(function(result, exception) {
            if (exception) { console.log(exception); }

            //console.log(result.metrics);
            data = [];

            Ext.getStore('stats').first().set(result.systemStats);

            for (var nodeId in result.metrics) {
                if (result.metrics.hasOwnProperty(nodeId)) {
                    data.push({
                        nodeId: nodeId,
                        metrics: result.metrics[nodeId]
                    });
                }
            }

            Ext.getStore('metrics').loadData(data);

            //Ext.getStore('metrics').loadData([result.metrics]);
        }));
    }

});
Ext.define('Ung.overrides.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',

    validators: function () {

    },

    // ip all
    ipall: function (val) {
        if ( val.indexOf('/') === -1 && val.indexOf(',') === -1 && val.indexOf('-') === -1) {
            switch (val) {
            case 'any':
                return true;
            default:
                return this.ip4(val);
            }
        }
        if (val.indexOf(',') !== -1) {
            return this.ipList(val);
        } else {
            if ( val.indexOf('-') !== -1) {
                return this.ipRange(val);
            }
            if ( val.indexOf('/') !== -1) {
                return this.cidrRange(val) || this.ipNetmask(val);
            }
            console.log('Unhandled case while handling vtype for ipAddr:', val, ' returning true!');
            return true;
        }
    },
    ipallText: 'Invalid IP Address.'.t(),

    // ip any
    ip: function (value) { return this.ip4Re.test(value) || this.ip6Re.test(value); },
    ipText: 'Invalid IP Address.'.t(),

    // ip4 address
    ip4: function (value) { return this.ip4Re.test(value); },
    ip4Re: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    ip4Text: 'Invalid IPv4 Address.'.t(),

    // ip6 address
    ip6: function (value) { return this.ip6Re.test(value); },
    ip6Re: '/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/',
    ip6Text: 'Invalid IPv6 Address.'.t(),

    // ip4 list
    ip4List: function (value) {
        var addr = value.split(','), i;
        for (i = 0 ; i < addr.length ; i++) {
            if (!this.ip4Re.test(addr[i])) {
                return false;
            }
        }
        return true;
    },
    ip4ListText: 'Invalid IPv4 Address(es).'.t(),

    // mac address
    mac: function (value) { return this.macRe.test(value); },
    macRe: /^[a-fA-F0-9]{2}:[a-fA-F0-9]{2}:[a-fA-F0-9]{2}:[a-fA-F0-9]{2}:[a-fA-F0-9]{2}:[a-fA-F0-9]{2}$/,
    macText: 'Invalid Mac Address.'.t(),

    // cidr block
    cidr: function (value) { return this.cidrRe.test(value); },
    cidrRe: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}$/,
    cidrText: 'Must be a network in CIDR format.'.t() + ' (192.168.123.0/24)',

    // cidr list
    cidrList: function (value) {
        var blocks = value.split(','), i;
        for (i = 0 ; i < blocks.length ; i++) {
            if (!this.cidrRe.test(blocks[i])) {
                return false;
            }
        }
        return true;
    },
    cidrListText: 'Must be a comma seperated list of networks in CIDR format.'.t() + ' (192.168.123.0/24,1.2.3.4/24)',

    // cidr block
    cidrBlock: function (value) {
        var blocks = value.split('\n'), i;
        for (i = 0 ; i < blocks.length ; i++) {
            if (!this.cidrRe.test(blocks[i])) {
                return false;
            }
        }
        return true;
    },
    cidrBlockText: 'Must be a one-per-line list of networks in CIDR format.'.t() + ' (192.168.123.0/24)',

    // port
    port: function(value) {
        var minValue = 1;
        var maxValue = 65535;
        return (value >= minValue && value <= maxValue);
    },
    portText: Ext.String.format('The port must be an integer number between {0} and {1} or one of the following values: any, all, n/a, none.'.t(), 1, 65535),


    ipRange: function (value) { return this.ipRangeRe.test(value); },
    ipRangeRe: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)-(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    ipRangeText: 'Invalid IP range'.t(),

    cidrRange: function (value)  { return this.cidrRangeRe.test(value); },
    cidrRangeRe: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/[0-3]?[0-9]$/,

    ipNetmask: function (value) { return this.cidrRangeRe.test(value); },
    ipNetmaskRe: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,


    ipList: function (val) {
        var ipList = val.split(',');
        var retVal = true;
        for ( var i = 0; i < ipList.length;i++) {
            if ( ipList[i].indexOf('-') !== -1) {
                retVal = retVal && this.ipRange(ipList[i]);
            } else {
                if ( ipList[i].indexOf('/') !== -1) {
                    retVal = retVal && ( this.cidRange(ipList[i]) || this.ipNetmask(ipList[i]));
                } else {
                    retVal = retVal && this.ip4(ipList[i]);
                }
            }
            if (!retVal) {
                return false;
            }
        }
        return true;
    }
});
Ext.define('Ung.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    control: {
        '#': {
            beforerender: 'onBeforeRender'
        }
    },

    init: function (view) {
        var vm = view.getViewModel();
        //view.getViewModel().set('widgets', Ext.getStore('widgets'));
        vm.set('reports', Ext.getStore('reports'));
        vm.set('policyId', 1);
    },

    routes: {
        '': 'onDashboard',
        'apps': 'onApps',
        'apps/:policyId': 'onApps',
        'apps/:policyId/:node': 'onApps',
        'config': 'onConfig',
        'reports': 'onReports'
    },

    onBeforeRender: function(view) {
        var vm = view.getViewModel();

        vm.bind('{reportsEnabled}', function(enabled) {
            if (enabled) {
                view.down('#main').insert(3, {
                    xtype: 'ung.reports',
                    itemId: 'reports'
                });
            } else {
                view.down('#main').remove('reports');
            }
        });

        vm.set('reportsInstalled', rpc.nodeManager.node('untangle-node-reports') !== null);
        if (rpc.nodeManager.node('untangle-node-reports')) {
            vm.set('reportsRunning', rpc.nodeManager.node('untangle-node-reports').getRunState() === 'RUNNING');
        }

        /*
        setTimeout(function () {
            vm.set('reportsInstalled', false);
        }, 5000);
        */

        view.getViewModel().set('policies', Ext.getStore('policies'));
        view.getViewModel().set('policy', Ext.getStore('policies').findRecord('policyId', 1));
        //this.getViewModel().set('activeItem', Ext.util.History.getHash());
    },

    afterRender: function () {
        this.redirectTo(Ext.util.History.getHash(), true);
    },

    onDashboard: function () {
        console.log('on dashboard');
        this.getViewModel().set('activeItem', 'dashboard');
    },

    onApps: function (policyId, node) {
        var vm = this.getViewModel();
        var _policyId = policyId || 1,
            _currentPolicy = vm.get('policyId'),
            _newPolicy;

        //if (!_currentPolicy || _currentPolicy.get('policyId') !== policyId) {
            //_newPolicy = Ext.getStore('policies').findRecord('policyId', _policyId) || Ext.getStore('policies').findRecord('policyId', 1);

        vm.set('policyId', policyId);
        //}

        if (node) {
            if (node === 'install') {
                vm.set('activeItem', 'appsinstall');
            } else {
                vm.set('nodeName', node);
                vm.set('activeItem', 'settings');
            }
        } else {
            vm.set('activeItem', 'apps', true);
        }
    },

    onConfig: function () {
        this.getViewModel().set('activeItem', 'config');
    },

    onReports: function () {
        this.getViewModel().set('activeItem', 'reports');
    }

});

Ext.define('Ung.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data: {
        reportsInstalled: false,
        reportsRunning: false
    },
    formulas: {
        // reports are enabled only if are installed and has running state
        reportsEnabled: function (get) {
            return (get('reportsInstalled') && get('reportsRunning'));
        },
        isDashboard: function(get) {
            return get('activeItem') === 'dashboard';
        },
        isApps: function(get) {
            return get('activeItem') === 'apps';
        },
        isConfig: function(get) {
            return get('activeItem') === 'config';
        },
        isReports: function(get) {
            return get('activeItem') === 'reports';
        }
    }
});

/**
 * Dashboard Controller which displays and manages the Dashboard Widgets
 * Widgets can be affected by following actions:
 * - remove/add/modify widget entry itself;
 * - install/uninstall Reports or start/stop Reports service
 * - install/uninstall Apps which can lead in a report widget to be available or not;
 * - modifying a report that is used by a widget, which requires reload of that affected widget
 */
Ext.define('Ung.view.dashboard.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard',

    control: {
        '#': {
            beforerender: 'initDashboard'
        }
    },

    listen: {
        global: {
            nodeinstall: 'onNodeInstall',
            removewidget: 'onRemoveWidget',
            addwidget: 'onAddWidget'
        }
    },

    init: function (view) {
        var me = this, vm = view.getViewModel();

        // update dashboard when Reports app is installed/removed or enabled/disabled
        vm.bind('{reportsEnabled}', function() {
            me.loadWidgets();
        });
    },

    /**
     * before rendering the Dashboard the settings are fetched form the server
     */
    initDashboard: function () {
        var me = this,
            vm = me.getViewModel();

        // load the dashboard settings
        Rpc.loadDashboardSettings().then(function(settings) {
            me.getView().setSettings(settings);

            if (vm.get('reportsInstalled')) {
                // load unavailable apps needed for showing the widgets
                rpc.reportsManager.getUnavailableApplicationsMap(function (result, ex) {
                    if (ex) { Ung.Util.exceptionToast(ex); return false; }

                    Ext.getStore('unavailableApps').loadRawData(result.map);
                    Ext.getStore('widgets').loadData(settings.widgets.list);
                    me.loadWidgets();
                });
            } else {
                Ext.getStore('widgets').loadData(settings.widgets.list);
                me.loadWidgets();
            }
        });
    },


    /**
     * Load initial dashboard widgets
     */
    loadWidgets: function() {
        var vm = this.getViewModel(),
            dashboard = this.getView().lookupReference('dashboard'),
            widgets = Ext.getStore('widgets').getRange(),
            i, widget, widgetComponents = [];

        // refresh the dashboard manager grid if the widgets were affected
        this.getView().lookupReference('dashboardNav').getView().refresh();

        for (i = 0; i < widgets.length; i += 1 ) {
            widget = widgets[i];

            if (widget.get('type') !== 'ReportEntry') {
                // it's a custom widget (not implemented yet)
                widgetComponents.push({
                    xtype: 'component',
                    baseCls: 'widget',
                    width: 250,
                    html: widget.get('type'),
                    itemId: widget.get('type'),
                    hidden: true,
                    bind: {
                        hidden: '{!widget.enabled}'
                    },
                    viewModel: {
                        data: {
                            widget: widget
                        }
                    }
                });
            } else {
                if (vm.get('reportsEnabled')) {
                    var entry = Ext.getStore('reports').findRecord('uniqueId', widget.get('entryId'));
                    if (entry && !Ext.getStore('unavailableApps').first().get(entry.get('category'))) {
                        widgetComponents.push({
                            xtype: 'reportwidget',
                            itemId: widget.get('entryId'),
                            widget: widget,
                            entry: entry,
                            hidden: true,
                            //userCls: entry.get('type') === 'PIE_GRAPH' ? 'medium' : 'large'
                            bind: {
                                hidden: '{!widget.enabled}'
                            }
                        });
                    } else {
                        widgetComponents.push({
                            itemId: widget.get('entryId'),
                            hidden: true
                        });
                    }
                }
            }
        }
        dashboard.removeAll(true);
        dashboard.add(widgetComponents);
    },

    /**
     * when a node is installed or removed apply changes to dashboard
     */
    onNodeInstall: function (action, node) {
        // refresh dashboard manager grid
        this.getView().lookupReference('dashboardNav').getView().refresh();

        var dashboard = this.getView().lookupReference('dashboard'),
            widgets = Ext.getStore('widgets').getRange(), widget, entry, i;

        // traverse all widgets and add/remove those with report category as the passed node
        for (i = 0; i < widgets.length; i += 1 ) {
            widget = widgets[i];
            entry = Ext.getStore('reports').findRecord('uniqueId', widget.get('entryId'));
            if (entry && entry.get('category') === node.displayName) {
                // remove widget placeholder
                dashboard.remove(widget.get('entryId'));
                if (action === 'install') {
                    // add real widget
                    dashboard.insert(i, {
                        xtype: 'reportwidget',
                        itemId: widget.get('entryId'),
                        widget: widget,
                        entry: entry,
                        hidden: true,
                        bind: {
                            hidden: '{!widget.enabled}'
                        }
                    });
                } else {
                    // add widget placeholder
                    dashboard.insert(i, {
                        itemId: widget.get('entryId'),
                        hidden: true
                    });
                }
            }
        }
    },

    enableRenderer: function (value, meta, record) {
        var vm = this.getViewModel();
        if (record.get('type') !== 'ReportEntry') {
            return '<i class="material-icons">' + (value ? 'check_box' : 'check_box_outline_blank') + '</i>';
        }
        var entry = Ext.getStore('reports').findRecord('uniqueId', record.get('entryId'));

        if (!entry || Ext.getStore('unavailableApps').first().get(entry.get('category')) || !vm.get('reportsRunning')) {
            return '<i class="material-icons" style="color: #F00;">info_outline</i>';
        }
        return '<i class="material-icons">' + (value ? 'check_box' : 'check_box_outline_blank') + '</i>';
    },

    settingsRenderer: function () {

    },

    /**
     * renders the title of the widget in the dashboard manager grid, based on various conditions
     */
    widgetTitleRenderer: function (value, metaData, record) {
        var vm = this.getViewModel(), entry, title, unavailApp, enabled;
        enabled = record.get('enabled');

        if (!value) {
            return '<span style="font-weight: 600; ' + (!enabled ? 'color: #999;' : '') + '">' + record.get('type') + '</span><br/><span style="font-size: 10px; color: #AAA;">Common</span>';
        }
        if (vm.get('reportsInstalled')) {
            entry = Ext.getStore('reports').findRecord('uniqueId', value);
            if (entry) {
                unavailApp = Ext.getStore('unavailableApps').first().get(entry.get('category'));
                title = '<span style="font-weight: 600; ' + ((unavailApp || !enabled) ? 'color: #999;' : '') + '">' + (entry.get('readOnly') ? entry.get('title').t() : entry.get('title')) + '</span>';

                if (entry.get('timeDataInterval') && entry.get('timeDataInterval') !== 'AUTO') {
                    title += '<span style="text-transform: lowercase; color: #333; font-weight: 300;"> per ' + entry.get('timeDataInterval') + '</span>';
                }
                if (unavailApp) {
                    title += '<br/><span style="font-size: 10px; color: #AAA;">' + entry.get('category') + '</span>';
                } else {
                    title += '<br/><span style="font-size: 10px; color: #AAA;">' + entry.get('category') + '</span>';
                }
                /*
                if (entry.get('readOnly')) {
                    title += ' <i class="material-icons" style="font-size: 14px; color: #999; vertical-align: top;">lock</i>';
                }
                */
                return title;
            } else {
                return 'Some ' + 'Widget'.t();
            }
        } else {
            return '<span style="color: #999;">' + 'App Widget'.t() + '</span>';
        }
    },


    /**
     * Method which sends modified dashboard settings to backend to be saved
     */
    applyChanges: function () {
        // because of the drag/drop reorder the settins widgets are updated to respect new ordering
        this.getView().getSettings().widgets.list = Ext.Array.pluck(Ext.getStore('widgets').getRange(), 'data');
        rpc.dashboardManager.setSettings(function (result, ex) {
            if (ex) { Ung.Util.exceptionToast(ex); return; }
            Ung.Util.successToast('<span style="color: yellow;">Dashboard Saved!</span>');
            Ext.getStore('widgets').sync();
        }, this.getView().getSettings());

    },

    managerHandler: function () {
        var state = this.getViewModel().get('managerOpen');
        this.getViewModel().set('managerOpen', !state);
    },


    onItemClick: function (cell, td, cellIndex, record) {
        var me = this,
            dashboard = me.getView().lookupReference('dashboard'),
            vm = this.getViewModel(),
            entry, widgetCmp;

        if (cellIndex === 0) {
            // toggle visibility or show alerts
            if (record.get('type') !== 'ReportEntry') {
                record.set('enabled', !record.get('enabled'));
            } else {
                if (!vm.get('reportsInstalled')) {
                    Ext.Msg.alert('Install required'.t(), 'To enable App Widgets please install Reports first!'.t());
                    return;
                }
                if (!vm.get('reportsRunning')) {
                    Ext.Msg.alert('Reports'.t(), 'To view App Widgets enable the Reports App first!'.t());
                    return;
                }

                entry = Ext.getStore('reports').findRecord('uniqueId', record.get('entryId'));
                if (entry) {
                    if (!Ext.getStore('unavailableApps').first().get(entry.get('category'))) {
                        record.set('enabled', !record.get('enabled'));
                    } else {
                        Ext.Msg.alert('Install required'.t(), Ext.String.format('To enable this Widget please install <strong>{0}</strong> app first!'.t(), entry.get('category')));
                    }
                } else {
                    Ung.Util.exceptionToast('This entry is not available and it should be removed!');
                }

            }
        }

        if (cellIndex === 1) {
            // highlights in the dashboard the widget which receives click event in the manager grid
            widgetCmp = dashboard.down('#' + record.get('entryId')) || dashboard.down('#' + record.get('type'));
            if (widgetCmp && !widgetCmp.isHidden()) {
                dashboard.addCls('highlight');
                widgetCmp.addCls('highlight-item');
                dashboard.scrollTo(0, dashboard.getEl().getScrollTop() + widgetCmp.getEl().getY() - 121, {duration: 500});
            }
        }
    },

    /**
     * removes the above set highlight
     */
    onItemLeave: function (view, record) {
        if (this.tout) {
            window.clearTimeout(this.tout);
        }
        var dashboard = this.getView().lookupReference('dashboard'), widgetCmp;
        if (record.get('type') !== 'ReportEntry') {
            widgetCmp = dashboard.down('#' + record.get('type'));
        } else {
            widgetCmp = dashboard.down('#' + record.get('entryId'));
        }
        if (widgetCmp) {
            dashboard.removeCls('highlight');
            widgetCmp.removeCls('highlight-item');
        }
    },


    /**
     * todo: after drag sort event
     */
    onDrop: function (node, data, overModel, dropPosition) {
        var dashboard = this.getView().lookupReference('dashboard');
        //console.log(data.view.getStore().findExact('entryId', data.records[0].get('entryId')));
        //console.log(data.records);

        var widgetMoved = this.getView().down('#' + data.records[0].get('entryId')) || this.getView().down('#' + data.records[0].get('type'));
        var widgetDropped = this.getView().down('#' + overModel.get('entryId')) || this.getView().down('#' + overModel.get('type'));

        /*
        widgetMoved.addCls('moved');

        window.setTimeout(function () {
            widgetMoved.removeCls('moved');
        }, 300);
        */

        if (dropPosition === 'before') {
            dashboard.moveBefore(widgetMoved, widgetDropped);
        } else {
            dashboard.moveAfter(widgetMoved, widgetDropped);
        }


    },

    resetDashboard: function () {
        var me = this;
        Ext.MessageBox.confirm('Warning'.t(),
            'This will overwrite the current dashboard settings with the defaults.'.t() + '<br/><br/>' +
            'Do you want to continue?'.t(),
            function (btn) {
                if (btn === 'yes') {
                    rpc.dashboardManager.resetSettingsToDefault(function (result, ex) {
                        if (ex) { Ung.Util.exceptionToast(ex); return; }
                        Ung.Util.successToast('Dashboard reset done!');
                        me.initDashboard();
                    });
                }
            });
    },


    onRemoveWidget: function (id) {
        var dashboard = this.getView().lookupReference('dashboard');
        if (dashboard.down('#' + id)) {
            dashboard.remove(id);
        }
    },

    onAddWidget: function (widget, entry) {
        var dashboard = this.getView().lookupReference('dashboard');
        dashboard.add({
            xtype: 'reportwidget',
            itemId: widget.get('entryId'),
            widget: widget,
            entry: entry,
            hidden: true,
            bind: {
                hidden: '{!widget.enabled}'
            }
        });
    }


});

/**
 * An ActionColumn which renders material icons
 * extends Ext.grid.column.Action
 */
Ext.define('Ung.view.grid.ActionColumn', {
    extend: 'Ext.grid.column.Action',
    xtype: 'ung.actioncolumn',

    /**
     * @cfg {string} materialIcon - the icon name e.g. 'settings'
     * @cfg {string} materialIconColor - the icon color, e.g. 'red', '#999'
     * @cfg {boolean} dragEnabled - for reorder actioncolumn
     */

    defaultRenderer: function(v, cellValues, record, rowIdx, colIdx, store, view) {
        var me = this,
            scope = me.origScope || me,
            items = me.items,
            len = items.length,
            i, item, ret, disabled, tooltip, altText, icon, glyph, tabIndex, ariaRole, dragEnabled, materialIcon, materialIconColor;

        // Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!)
        // Assign a new variable here, since if we modify "v" it will also modify the arguments collection, meaning
        // we will pass an incorrect value to getClass/getTip
        ret = Ext.isFunction(me.origRenderer) ? me.origRenderer.apply(scope, arguments) || '' : '';

        cellValues.tdCls += ' ' + Ext.baseCSSPrefix + 'action-col-cell';
        for (i = 0; i < len; i++) {
            item = items[i];
            icon = item.icon;
            glyph = item.glyph;
            materialIcon = item.materialIcon;
            materialIconColor = item.materialIconColor;

            disabled = item.disabled || (item.isDisabled ? Ext.callback(item.isDisabled, item.scope || me.origScope, [view, rowIdx, colIdx, item, record], 0, me) : false);
            tooltip  = item.tooltip  || (item.getTip     ? Ext.callback(item.getTip, item.scope || me.origScope, arguments, 0, me) : null);
            altText  =                   item.getAltText ? Ext.callback(item.getAltText, item.scope || me.origScope, arguments, 0, me) : item.altText || me.altText;
            dragEnabled = item.dragEnabled;

            // Only process the item action setup once.
            if (!item.hasActionConfiguration) {
                // Apply our documented default to all items
                item.stopSelection = me.stopSelection;
                item.disable = Ext.Function.bind(me.disableAction, me, [i], 0);
                item.enable = Ext.Function.bind(me.enableAction, me, [i], 0);
                item.hasActionConfiguration = true;
            }

            // If the ActionItem is using a glyph, convert it to an Ext.Glyph instance so we can extract the data easily.
            if (glyph) {
                glyph = Ext.Glyph.fly(glyph);
            }

            // Pull in tabIndex and ariarRols from item, unless the item is this, in which case
            // that would be wrong, and the icon would get column header values.
            tabIndex = (item !== me && item.tabIndex !== undefined) ? item.tabIndex : me.itemTabIndex;
            ariaRole = (item !== me && item.ariaRole !== undefined) ? item.ariaRole : me.itemAriaRole;

            if (materialIcon) {
                ret += '<i style="font-size: 18px; ' + (materialIconColor ? 'color: ' + materialIconColor + ';' : '') + '"' +
                    (typeof tabIndex === 'number' ? ' tabIndex="' + tabIndex + '"' : '') +
                    (ariaRole ? ' role="' + ariaRole + '"' : ' role="presentation"') +
                    ' class="material-icons ' + me.actionIconCls + ' ' + Ext.baseCSSPrefix + 'action-col-' + String(i) + ' ' +
                    (disabled ? me.disabledCls + ' ' : ' ') +
                    (item.hidden ? Ext.baseCSSPrefix + 'hidden-display ' : '') +
                    (dragEnabled ? ' draggable' : ' ') +
                    (item.getClass ? Ext.callback(item.getClass, item.scope || me.origScope, arguments, undefined, me) : (item.iconCls || me.iconCls || '')) + '"' +
                    (tooltip ? ' data-qtip="' + tooltip + '"' : '') + '>' + materialIcon + '</i>';
            } else {
                ret += '<' + (icon ? 'img' : 'div') +
                    (typeof tabIndex === 'number' ? ' tabIndex="' + tabIndex + '"' : '') +
                    (ariaRole ? ' role="' + ariaRole + '"' : ' role="presentation"') +
                    (icon ? (' alt="' + altText + '" src="' + item.icon + '"') : '') +
                    ' class="' + me.actionIconCls + ' ' + Ext.baseCSSPrefix + 'action-col-' + String(i) + ' ' +
                    (disabled ? me.disabledCls + ' ' : ' ') +
                    (item.hidden ? Ext.baseCSSPrefix + 'hidden-display ' : '') +
                    (item.getClass ? Ext.callback(item.getClass, item.scope || me.origScope, arguments, undefined, me) : (item.iconCls || me.iconCls || '')) + '"' +
                    (tooltip ? ' data-qtip="' + tooltip + '"' : '') + (icon ? '/>' : glyph ? (' style="font-family:' + glyph.fontFamily + '">' + glyph.character + '</div>') : '></div>');
            }
        }

        return ret;
    }
});

Ext.define('Ung.view.apps.AppsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.apps',

    listen: {
        store: {
            '#policies': {
                datachanged: 'updateNodes'
            }
        }
    },

    init: function (view) {
        view.getViewModel().bind({
            bindTo: '{policyId}'
        }, this.onPolicy, this);
    },

    updateNodes: function () {
        var filtersRef = this.getView().lookupReference('filters');
        var servicesRef = this.getView().lookupReference('services');

        var i, node, instance, ref,
            policy = Ext.getStore('policies').findRecord('policyId', this.getViewModel().get('policyId')),
            nodes = policy.get('nodeProperties').list,
            instances = policy.get('instances').list;

        nodes.sort(function (a, b) {
            return a.viewPosition - b.viewPosition;
        });

        for (i = 0; i < nodes.length; i += 1) {
            node = nodes[i];
            instance = instances.filter(function (instance) {
                return instance.nodeName === node.name;
            })[0];

            ref = node.type === 'FILTER' ? filtersRef : servicesRef;
            if (!ref.down('#' + node.name)) {
                ref.insert(i, {
                    xtype: 'ung.appitem',
                    itemId: node.name,
                    cls: 'insert',
                    node: node,
                    state: instance.targetState === 'RUNNING' ? 'on' : '',
                    href: '#apps/' + this.getViewModel().get('policyId') + '/' + node.name
                });
            }
        }

        // remove uninstalled nodes
        filtersRef.query('button').forEach(function (nodeCmp) {
            if (instances.filter(function (instance) {
                return instance.nodeName === nodeCmp.itemId;
            }).length === 0) {
                nodeCmp.addCls('insert');
                Ext.defer(function () {
                    filtersRef.remove(nodeCmp);
                    Ung.Util.successToast(nodeCmp.node.displayName + ' removed successfully!');
                }, 500);
            }
        });

        servicesRef.query('button').forEach(function (nodeCmp) {
            if (instances.filter(function (instance) {
                return instance.nodeName === nodeCmp.itemId;
            }).length === 0) {
                nodeCmp.addCls('insert');
                Ext.defer(function () {
                    servicesRef.remove(nodeCmp);
                    Ung.Util.successToast(nodeCmp.node.displayName + ' removed successfully!');
                }, 500);
            }
        });
    },

    onPolicy: function () {
        this.getView().lookupReference('filters').removeAll();
        this.getView().lookupReference('services').removeAll();
        this.updateNodes();
    },

    setPolicy: function (combo, newValue, oldValue) {
        if (oldValue !== null) {
            this.redirectTo('#apps/' + newValue, false);
        }
    },

    onItemAfterRender: function (item) {
        Ext.defer(function () {
            item.removeCls('insert');
        }, 50);
    }

});

Ext.define('Ung.view.apps.AppsModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.apps',

    stores: {
        //policies: {
            //autoLoad: true
        //}
    }

});

Ext.define('Ung.view.apps.AppItem', {
    extend: 'Ext.Button',
    xtype: 'ung.appitem',
    baseCls: 'app-item',

    viewModel: true,

    hrefTarget: '_self',

    renderTpl: [
        '<span id="{id}-btnWrap" data-ref="btnWrap" role="presentation" unselectable="on" style="{btnWrapStyle}" ' +
                '<span class="app-icon"><img src="' + resourcesBaseHref + '/skins/modern-rack/images/admin/apps/{node.name}_80x80.png" width=80 height=80/>' +
                '<span class="app-name">{node.displayName}</span>' +
                '</span>' +
            '<span class="app-state {state}"><i class="material-icons">power_settings_new</i></span>' +
        '</span>'
    ],

    initRenderData: function() {
        var data = this.callParent();
        Ext.apply(data, {
            node: this.node,
            state: this.state
        });
        return data;
    },

    listeners: {
        afterrender: 'onItemAfterRender'
    }
});

Ext.define('Ung.view.apps.Apps', {
    extend: 'Ext.container.Container',
    xtype: 'ung.apps',
    layout: 'border',
    requires: [
        'Ung.view.apps.AppsController',
        'Ung.view.apps.AppsModel',

        'Ung.view.apps.AppItem'
    ],

    controller: 'apps',
    viewModel: 'apps',

    config: {
        policy: undefined
    },

    defaults: {
        border: false
    },

    items: [{
        region: 'north',
        border: false,
        height: 44,
        itemId: 'apps-topnav',
        bodyStyle: {
            background: '#555',
            padding: '0 5px'
        },
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        items: [{
            xtype: 'combobox',
            editable: false,
            multiSelect: false,
            queryMode: 'local',
            bind: {
                value: '{policyId}',
                store: '{policies}'
            },
            valueField: 'policyId',
            displayField: 'displayName',
            listeners: {
                change: 'setPolicy'
            }
        }, {
            xtype: 'button',
            html: 'Install Apps'.t(),
            hrefTarget: '_self',
            bind: {
                href: '#apps/{policyId}/install'
            }
        }]
    }, {
        region: 'center',
        itemId: 'apps-list',
        border: false,
        scrollable: true,
        bodyStyle: {
            background: 'transparent'
        },
        items: [{
            xtype: 'container',
            margin: 10,
            reference: 'filters',

            style: {
                display: 'inline-block'
            }
        }, {
            xtype: 'component',
            cls: 'apps-separator',
            html: 'Service Apps'.t()
        }, {
            xtype: 'container',
            margin: 10,
            reference: 'services',
            style: {
                display: 'inline-block'
            }

        }]
    }],
    listeners: {
        //beforeRender: 'onBeforeRender'
        //onPolicyChange: 'onPolicyChange'
    }
});
Ext.define('Ung.view.apps.install.InstallController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.appsinstall',

    control: {
        '#': {
            beforeactivate: 'onPolicy'
        }
    },

    listen: {
        store: {
            '#policies': {
                //datachanged: 'onPolicy'
            }
        }
    },

    init: function (view) {
        view.getViewModel().bind({
            bindTo: '{policyId}'
        }, this.onPolicy, this);
    },

    onPolicy: function () {
        var policy = Ext.getStore('policies').findRecord('policyId', this.getViewModel().get('policyId')),
            installable = policy.get('installable').list, i, node, filters = [], services = [];

        for (i = 0; i < installable.length; i += 1) {
            node = installable[i];
            if (node.type === 'FILTER') {
                filters.push({
                    xtype: 'ung.appinstallitem',
                    node: node
                });
            }
            if (node.type === 'SERVICE') {
                services.push({
                    xtype: 'ung.appinstallitem',
                    node: node
                });
            }
        }

        this.getView().lookupReference('filters').removeAll(true);
        this.getView().lookupReference('filters').add(filters);
        this.getView().lookupReference('services').removeAll(true);
        this.getView().lookupReference('services').add(services);
    },

    setPolicy: function (combo, newValue, oldValue) {
        if (oldValue !== null) {
            this.redirectTo('#apps/' + newValue + '/install', true);
        }
    },

    installNode: function (nodeItem) {
        var vm = this.getViewModel();
        var policyId = this.getViewModel().get('policyId'),
            nodeName = nodeItem.node.name;

        if (!nodeItem.hasCls('installed')) {
            nodeItem.setDisabled(true);
            nodeItem.addCls('progress');

            rpc.nodeManager.instantiate(function (result, ex) {
                if (ex) { Ung.Util.exceptionToast(ex); return; }

                try {
                    nodeItem.removeCls('progress');
                    nodeItem.addCls('installed');
                    nodeItem.setDisabled(false);
                    //nodeItem.removeListener('click', this.installnoi);
                    //nodeItem.setHref('#apps/' + policyId + '/' + nodeName);
                } catch (exception) {
                    console.log(exception);
                }

                Ung.Util.successToast(nodeItem.node.displayName + ' installed successfully!');

                // update policies
                rpc.nodeManager.getAppsViews(function (result, ex) {
                    if (ex) { Ung.Util.exceptionToast(ex); return; }
                    Ext.getStore('policies').loadData(result);
                });

                // update unavailable apps if reports are enabled

                //console.log(vm.getParent());

                if (nodeItem.node.name === 'untangle-node-reports') {
                    rpc.reportsManager = rpc.nodeManager.node('untangle-node-reports').getReportsManager();
                    Rpc.loadReports().then(function (reports) {
                        Ext.getStore('reports').loadData(reports.list);
                        vm.getParent().set({
                            reportsInstalled: true,
                            reportsRunning: rpc.nodeManager.node('untangle-node-reports').getRunState() === 'RUNNING'
                        });
                    });
                }

                if (rpc.reportsManager) {
                    rpc.reportsManager.getUnavailableApplicationsMap(function (result, ex) {
                        if (ex) { Ung.Util.exceptionToast(ex); return; }
                        Ext.getStore('unavailableApps').loadRawData(result.map);

                        // fire nodeinstall event to update widgets on dashboard
                        Ext.GlobalEvents.fireEvent('nodeinstall', 'install', nodeItem.node);
                    });
                }

            }, nodeName, policyId);
        } else {
            Ung.app.redirectTo('#apps/' + policyId + '/' + nodeName);
        }
    }

});

Ext.define('Ung.view.apps.install.Item', {
    extend: 'Ext.Button',
    xtype: 'ung.appinstallitem',

    baseCls: 'app-item install',

    hrefTarget: '_self',

    renderTpl: [
        '<span id="{id}-btnWrap" data-ref="btnWrap" role="presentation" unselectable="on" style="{btnWrapStyle}" ' +
                'class="{btnWrapCls} {btnWrapCls}-{ui} {splitCls}{childElCls}">' +
                '<span class="app-icon"><img src="' + resourcesBaseHref + '/skins/modern-rack/images/admin/apps/{node.name}_80x80.png" width=80 height=80/>' +
                '<span class="app-name">{node.displayName}</span>' +
                '</span>' +
                '<div class="app-install"><i class="material-icons">get_app</i></div>' +
                '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' +
                '<div class="app-done"><i class="material-icons">check</i></div>' +
        '</span>'
    ],

    initRenderData: function() {
        var data = this.callParent();
        data.node = this.node;
        return data;
    },
    listeners: {
        click: 'installNode'
    }
});

Ext.define('Ung.view.apps.install.Install', {
    extend: 'Ext.container.Container',
    xtype: 'ung.appsinstall',
    layout: 'border',
    requires: [
        'Ung.view.apps.install.InstallController',
        'Ung.view.apps.install.Item'
        //'Ung.view.main.MainModel'
    ],

    controller: 'appsinstall',
    viewModel: true,

    defaults: {
        border: false
    },
    items: [{
        region: 'north',
        border: false,
        height: 44,
        itemId: 'apps-topnav',
        bodyStyle: {
            background: '#555',
            padding: '0 5px'
        },
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        items: [{
            xtype: 'component',
            style: {
                color: '#CCC'
            },
            flex: 1,
            html: 'Select Apps and Services to Install'.t()
        }, {
            xtype: 'button',
            html: 'Done'.t(),
            hrefTarget: '_self',
            bind: {
                href: '#apps/{policyId}'
            }
        }]
    }, {
        region: 'center',
        itemId: 'apps-list',
        bodyStyle: {
            background: 'transparent'
        },
        scrollable: true,
        items: [{
            xtype: 'component',
            cls: 'apps-separator',
            html: Ung.Util.iconTitle('Apps'.t(), 'apps')
        }, {
            xtype: 'container',
            margin: 10,
            reference: 'filters',
            style: {
                display: 'inline-block'
            }
        }, {
            xtype: 'component',
            cls: 'apps-separator',
            html: Ung.Util.iconTitle('Service Apps'.t(), 'build')
        }, {
            xtype: 'container',
            margin: 10,
            reference: 'services',
            style: {
                display: 'inline-block'
            }

        }]
    }]
});
Ext.define('Ung.view.config.ConfigController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.config',

    init: function (view) {
        this.configNames = ['Network', 'Administration', 'Email', 'Local Directory', 'Upgrade', 'System', 'About'];
        this.toolNames = ['Policy Manager', 'Sessions', 'Hosts', 'Devices'];
    },

    onBeforeRender: function () {
        var configName, toolName, i, configs = [], tools = [];

        for (i = 0; i < this.configNames.length; i += 1) {
            configName = this.configNames[i];
            configs.push({
                xtype: 'ung.configitem',
                viewModel: {
                    data: {
                        displayName: configName.t(),
                        iconName: configName.toLowerCase().replace(/ /g, '_')
                    }
                }
            });
        }

        for (i = 0; i < this.toolNames.length; i += 1) {
            toolName = this.toolNames[i];
            tools.push({
                xtype: 'ung.configitem',
                viewModel: {
                    data: {
                        displayName: toolName.t(),
                        iconName: toolName.toLowerCase().replace(/ /g, '_')
                    }
                }
            });
        }

        this.getView().lookupReference('configs').removeAll(true);
        this.getView().lookupReference('configs').add(configs);
        this.getView().lookupReference('tools').removeAll(true);
        this.getView().lookupReference('tools').add(tools);

    },

    onItemBeforeRender: function (item) {
        item.el.on('click', function () {
            Ung.app.redirectTo('#config/' + item.getViewModel().get('name'), true);
        });
    }

});

Ext.define('Ung.view.config.ConfigItem', {
    extend: 'Ext.Component',
    xtype: 'ung.configitem',
    cls: 'appitem',

    viewModel: true,

    bind: {
        html: '<div class="node-image">' +
              '<img src="' + resourcesBaseHref + '/skins/modern-rack/images/admin/config/icon_config_{iconName}.png" width=80 height=80/></div>' +
              '<div class="node-label">{displayName}</div>'
    },

    listeners: {
        afterrender: 'onItemBeforeRender'
    }
});

Ext.define('Ung.view.config.Config', {
    extend: 'Ext.container.Container',
    xtype: 'ung.config',
    layout: 'fit',
    requires: [
        'Ung.view.config.ConfigController',
        //'Ung.view.apps.AppsModel',

        'Ung.view.config.ConfigItem'
    ],

    controller: 'config',
    //viewModel: 'apps',

    defaults: {
        border: false
    },

    items: [{
        border: false,
        scrollable: true,
        bodyStyle: {
            background: 'transparent'
        },
        items: [{
            xtype: 'component',
            cls: 'apps-separator',
            html: Ung.Util.iconTitle('Configuration'.t(), 'tune')
        }, {
            xtype: 'container',
            margin: 10,
            reference: 'configs',

            style: {
                display: 'inline-block'
            }
        }, {
            xtype: 'component',
            cls: 'apps-separator',
            html: Ung.Util.iconTitle('Tools'.t(), 'build')
        }, {
            xtype: 'container',
            margin: 10,
            reference: 'tools',
            style: {
                display: 'inline-block'
            }

        }]
    }],
    listeners: {
        beforerender: 'onBeforeRender'
        //onPolicyChange: 'onPolicyChange'
    }
});
Ext.define('Ung.view.reports.ReportsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.reports',

    init: function () {
        this.getAvailableTables();
    },

    control: {
        '#': { beforeactivate: 'onBeforeActivate', beforedeactivate: 'onBeforeDeactivate', beforerender: 'onBeforeRender' },
        '#categoriesGrid': { selectionchange: 'onCategorySelect' },
        '#reportsGrid': { selectionchange: 'onReportSelect' },
        '#chart': { afterrender: 'fetchReportData' },

        '#startDate': { select: 'onSelectStartDate' },
        '#startTime': { select: 'onSelectStartTime' },
        '#startDateTimeBtn': { click: 'setStartDateTime' },
        '#endDate': { select: 'onSelectEndDate' },
        '#endTime': { select: 'onSelectEndTime' },
        '#endtDateTimeBtn': { click: 'setEndDateTime' },

        '#refreshBtn': { click: 'fetchReportData' },
        '#applyBtn': { click: 'fetchReportData' },
        '#chartStyleBtn': { toggle: 'fetchReportData' },
        '#timeIntervalBtn': { toggle: 'fetchReportData' },

        '#saveNewBtn': { click: 'saveReport' },
        '#updateBtn': { click: 'updateReport' },
        '#removeBtn': { click: 'removeReport' },

        '#dashboardBtn': { click: 'toggleDashboardWidget' }
    },

    /*
    listen: {
        store: {
            '#reports': {
                remove: 'onRemoveReport'
            }
        }
    },
    */

    onBeforeRender: function () {
        var me = this;
        rpc.dashboardManager.getSettings(function (settings, ex) {
            if (ex) { Ung.Util.exceptionToast(ex); return false; }
            me.getView().setDashboardSettings(settings);
        });
    },

    onBeforeActivate: function () {
        var vm = this.getViewModel();

        // if Reports inside Node settings
        if (this.getView().getInitCategory()) {
            vm.set({
                isNodeReporting: true,
                activeCard: 'categoryCard',
                category: null,
                report: null,
                categoriesData: null,
                startDateTime: null,
                endDateTime: null
            });

            this.getView().down('#categoriesGrid').setCollapsed(false); // expand categories panel if collapsed

            // filter reports based on selected category
            Ext.getStore('reports').filter({
                property: 'category',
                value: this.getView().getInitCategory().categoryName,
                exactMatch: true
            });
            this.buildReportsList();
            return;
        }

        // if main Reports view
        vm.set({
            isNodeReporting: false,
            activeCard: 'allCategoriesCard',
            category: null,
            report: null,
            categoriesData: null,
            startDateTime: null,
            endDateTime: null
        });

        this.getCurrentApplications();
    },

    onBeforeDeactivate: function () {
        this.getView().down('#categoriesGrid').getSelectionModel().deselectAll();
        this.getView().down('#reportsGrid').getSelectionModel().deselectAll();
        Ext.getStore('reports').clearFilter();
    },

    getCurrentApplications: function () {
        var app, i, vm = this.getViewModel(), me = this;
        var categories = [
            { categoryName: 'Hosts', displayName: 'Hosts'.t(), icon: resourcesBaseHref + '/skins/modern-rack/images/admin/config/icon_config_hosts.png' },
            { categoryName: 'Devices', displayName: 'Devices'.t(), icon: resourcesBaseHref + '/skins/modern-rack/images/admin/config/icon_config_devices.png' },
            { categoryName: 'Network', displayName: 'Network'.t(), icon: resourcesBaseHref + '/skins/modern-rack/images/admin/config/icon_config_network.png' },
            { categoryName: 'Administration', displayName: 'Administration'.t(), icon: resourcesBaseHref + '/skins/modern-rack/images/admin/config/icon_config_administration.png' },
            { categoryName: 'System', displayName: 'System'.t(), icon: resourcesBaseHref + '/skins/modern-rack/images/admin/config/icon_config_system.png' },
            { categoryName: 'Shield', displayName: 'Shield'.t(), icon: resourcesBaseHref + '/skins/modern-rack/images/admin/apps/untangle-node-shield_17x17.png' }
        ];

        rpc.reportsManager.getCurrentApplications(function (result, ex) {
            if (ex) { Ung.Util.exceptionToast(ex); return false; }

            for (i = 0; i < result.list.length; i += 1) {
                app = result.list[i];
                if (app.name !== 'untangle-node-branding-manager' && app.name !== 'untangle-node-live-support') {
                    categories.push({
                        categoryName: app.displayName,
                        appName: app.name,
                        displayName: app.displayName, // t()
                        icon: resourcesBaseHref + '/skins/modern-rack/images/admin/apps/' + app.name + '_80x80.png'
                    });
                }
            }
            Ext.getStore('categories').loadData(categories);
            vm.set('categoriesData', Ext.getStore('categories').getRange());
            //me.getView().down('#categoriesGrid').getSelectionModel().select(0);

            var allCategItems = [];
            categories.forEach(function (category, idx) {
                allCategItems.push({
                    xtype: 'button',
                    baseCls: 'category-btn',
                    html: '<img src="' + category.icon + '"/><br/><span>' + category.displayName + '</span>',
                    index: idx,
                    handler: function () {
                        me.getView().down('#categoriesGrid').getSelectionModel().select(this.index);
                    }
                });
            });
            me.getView().down('#allCategoriesList').removeAll();

            if (me.getView().down('#categoriesLoader')) {
                me.getView().down('#categoriesLoader').destroy();
            }

            me.getView().down('#allCategoriesList').add(allCategItems);
        });
    },

    getAvailableTables: function() {
        var me = this;
        rpc.reportsManager.getTables(function (result, ex) {
            if (ex) { Ung.Util.exceptionToast(ex); return false; }
            me.getViewModel().set('tableNames', result);
        });
    },

    onCategorySelect: function (selModel, records) {
        if (records.length === 0) {
            return false;
        }

        this.getViewModel().set('activeCard', 'categoryCard'); // set category view card as active
        this.getViewModel().set('category', records[0]);
        this.getViewModel().set('report', null);
        this.getView().down('#categoriesGrid').setCollapsed(false); // expand categories panel if collapsed

        this.getView().down('#reportsGrid').getSelectionModel().deselectAll();

        // filter reports based on selected category
        Ext.getStore('reports').filter({
            property: 'category',
            value: records[0].get('categoryName'),
            exactMatch: true
        });
        this.buildReportsList();
    },

    buildReportsList: function () {
        var me = this;
        var entries = [], entryHtml = '';

        // add reports list in category view card
        this.getView().down('#categoryReportsList').removeAll();
        Ext.getStore('reports').getRange().forEach(function (report) {

            entryHtml = Ung.Util.iconReportTitle(report);
            entryHtml += '<span class="ttl">' + (report.get('readOnly') ? report.get('title').t() : report.get('title')) + '</span><p>' +
                          (report.get('readOnly') ? report.get('description').t() : report.get('description')) + '</p>';
            entries.push({
                xtype: 'button',
                html: entryHtml,
                baseCls: 'entry-btn',
                //cls: (!entries[i].readOnly && entries[i].type !== 'EVENT_LIST') ? 'entry-btn custom' : 'entry-btn',
                border: false,
                textAlign: 'left',
                item: report,
                handler: function () {
                    //console.log('handler');
                    me.getView().down('#reportsGrid').getSelectionModel().select(this.item);
                    //_that.entryList.getSelectionModel().select(this.item);
                }
            });
        });
        this.getView().down('#categoryReportsList').add(entries);
    },

    onReportSelect: function (selModel, records) {
        if (records.length === 0) {
            this.getViewModel().set({
                activeCard: 'categoryCard'
            });
            return;
        }
        var report = records[0],
            chartContainer = this.getView().down('#report');

        this.getViewModel().set({
            activeCard: 'reportCard',
            report: report
        });

        this.getView().down('#customization').setActiveItem(0);
        chartContainer.remove('chart');

        if (report.get('type') === 'TIME_GRAPH' || report.get('type') === 'TIME_GRAPH_DYNAMIC') {
            chartContainer.add({
                xtype: 'timechart',
                itemId: 'chart',
                entry: report
            });
        }

        if (report.get('type') === 'PIE_GRAPH') {
            chartContainer.add({
                xtype: 'piechart',
                itemId: 'chart',
                entry: report
            });
        }

        if (report.get('type') === 'EVENT_LIST') {
            chartContainer.add({
                xtype: 'eventchart',
                itemId: 'chart',
                entry: report
            });
        }

        if (report.get('type') === 'TEXT') {
            chartContainer.add({
                xtype: 'component',
                itemId: 'chart',
                html: 'Not Implemented'
            });
        }


    },

    fetchReportData: function () {
        var me = this,
            vm = me.getViewModel(),
            chart = me.getView().down('#chart');

        chart.fireEvent('beginfetchdata');

        if (vm.get('report.type') !== 'EVENT_LIST') {
            rpc.reportsManager.getDataForReportEntry(function (result, ex) {
                if (ex) { Ung.Util.exceptionToast(ex); return false; }
                chart.fireEvent('setseries', result.list);
            }, chart.getEntry().getData(), vm.get('startDateTime'), vm.get('endDateTime'), -1);
        } else {
            var extraCond = null, limit = 100;
            rpc.reportsManager.getEventsForDateRangeResultSet(function (result, ex) {
                if (ex) { Ung.Util.exceptionToast(ex); return false; }
                //console.log(result);
                //this.loadResultSet(result);
                result.getNextChunk(function (result2, ex2) {
                    if (ex2) { Ung.Util.exceptionToast(ex2); return false; }
                    console.log(result2);
                    chart.fireEvent('setdata', result2.list);
                }, 100);

            }, chart.getEntry().getData(), extraCond, limit,  vm.get('startDateTime'), vm.get('endDateTime'));
        }
    },

    onSelectStartDate: function (picker, date) {
        var vm = this.getViewModel(), _date;
        if (!vm.get('startDateTime')) {
            this.getViewModel().set('startDateTime', date);
        } else {
            _date = new Date(vm.get('startDateTime'));
            _date.setDate(date.getDate());
            _date.setMonth(date.getMonth());
            vm.set('startDateTime', _date);
        }
    },

    onSelectStartTime: function (combo, record) {
        var vm = this.getViewModel(), _date;
        if (!vm.get('startDateTime')) {
            _date = new Date();
            //_date = _date.setDate(_date.getDate() - 1);
        } else {
            _date = new Date(vm.get('startDateTime'));
        }
        _date.setHours(record.get('date').getHours());
        _date.setMinutes(record.get('date').getMinutes());
        vm.set('startDateTime', _date);
    },

    setStartDateTime: function () {
        var view = this.getView();
        console.log(this.getViewModel().get('startDateTime'));
        view.down('#startDateTimeMenu').hide();
    },

    onSelectEndDate: function (picker, date) {
        var vm = this.getViewModel(), _date;
        if (!vm.get('endDateTime')) {
            this.getViewModel().set('endDateTime', date);
        } else {
            _date = new Date(vm.get('endDateTime'));
            _date.setDate(date.getDate());
            _date.setMonth(date.getMonth());
            vm.set('endDateTime', _date);
        }
    },

    onSelectEndTime: function (combo, record) {
        var vm = this.getViewModel(), _date;
        if (!vm.get('endDateTime')) {
            _date = new Date();
            //_date = _date.setDate(_date.getDate() - 1);
        } else {
            _date = new Date(vm.get('endDateTime'));
        }
        _date.setHours(record.get('date').getHours());
        _date.setMinutes(record.get('date').getMinutes());
        vm.set('endDateTime', _date);
    },

    setEndDateTime: function () {
        var view = this.getView();
        view.down('#endDateTimeMenu').hide();
    },

    saveReport: function () {
        var me = this, report,
            vm = this.getViewModel();

        report = vm.get('report').copy(null);
        report.set('uniqueId', 'report-' + Math.random().toString(36).substr(2));
        report.set('readOnly', false);

        rpc.reportsManager.saveReportEntry(function (result, ex) {
            if (ex) { Ung.Util.exceptionToast(ex); return false; }
            vm.get('report').reject();
            Ext.getStore('reports').add(report);
            report.commit();
            me.getView().down('#reportsGrid').getSelectionModel().select(report);
            Ung.Util.successToast('<span style="color: yellow; font-weight: 600;">' + report.get('title') + ' report added!');
        }, report.getData());
    },

    updateReport: function () {
        var vm = this.getViewModel();

        rpc.reportsManager.saveReportEntry(function (result, ex) {
            if (ex) { Ung.Util.exceptionToast(ex); return false; }
            vm.get('report').commit();
            Ung.Util.successToast('<span style="color: yellow; font-weight: 600;">' + vm.get('report.title') + '</span> report updated!');
        }, vm.get('report').getData());
    },

    removeReport: function () {
        var me = this,
            vm = this.getViewModel();

        Ext.MessageBox.confirm('Warning'.t(),
            'This will remove also the Widget from Dashboard'.t() + '<br/><br/>' +
            'Do you want to continue?'.t(),
            function (btn) {
                if (btn === 'yes') {
                    rpc.reportsManager.removeReportEntry(function (result, ex) {
                        if (ex) { Ung.Util.exceptionToast(ex); return false; }

                        Ext.getStore('reports').remove(vm.get('report'));
                        me.buildReportsList();
                        me.getView().down('#reportsGrid').getSelectionModel().deselectAll();

                        Ung.Util.successToast('Report removed!');

                        me.toggleDashboardWidget();
                    }, vm.get('report').getData());
                }
            });
    },

    toggleDashboardWidget: function () {
        var vm = this.getViewModel(), record, me = this;
        if (vm.get('isWidget')) {
            // remove from dashboard
            record = Ext.getStore('widgets').findRecord('entryId', vm.get('report.uniqueId'));
            if (record) {
                Ext.getStore('widgets').remove(record);
                this.getView().getDashboardSettings().widgets.list = Ext.Array.pluck(Ext.getStore('widgets').getRange(), 'data');
                rpc.dashboardManager.setSettings(function (result, ex) {
                    if (ex) { Ung.Util.exceptionToast(ex); return; }
                    Ung.Util.successToast('<span style="color: yellow; font-weight: 600;">' + vm.get('report.title') + '</span> was removed from dashboard!');
                    Ext.GlobalEvents.fireEvent('removewidget', vm.get('report.uniqueId'));
                    vm.set('isWidget', !vm.get('isWidget'));
                    me.getView().down('#reportsGrid').getView().refresh();
                }, this.getView().getDashboardSettings());
            } else {
                Ung.Util.exceptionToast('<span style="color: yellow; font-weight: 600;">' + vm.get('report.title') + '</span> was not found on Dashboard!');
            }
        } else {
            // add to dashboard
            record = Ext.create('Ung.model.Widget', {
                displayColumns: vm.get('report.displayColumns'),
                enabled: true,
                entryId: vm.get('report.uniqueId'),
                javaClass: 'com.untangle.uvm.DashboardWidgetSettings',
                refreshIntervalSec: 60,
                timeframe: 3600,
                type: 'ReportEntry'
            });
            Ext.getStore('widgets').add(record);

            this.getView().getDashboardSettings().widgets.list = Ext.Array.pluck(Ext.getStore('widgets').getRange(), 'data');
            rpc.dashboardManager.setSettings(function (result, ex) {
                if (ex) { Ung.Util.exceptionToast(ex); return; }
                Ung.Util.successToast('<span style="color: yellow; font-weight: 600;">' + vm.get('report.title') + '</span> was added to dashboard!');
                Ext.GlobalEvents.fireEvent('addwidget', record, vm.get('report'));
                vm.set('isWidget', !vm.get('isWidget'));
                me.getView().down('#reportsGrid').getView().refresh();
            }, this.getView().getDashboardSettings());
        }
    }

});

Ext.define('Ung.view.reports.ReportsModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.reports',

    data: {
        isNodeReporting: false,
        activeCard: 'allCategoriesCard', // allCategoriesCard, categoryCard, reportCard
        category: null,
        report: null,
        categoriesData: null,
        startDateTime: null,
        endDateTime: null
    },

    formulas: {
        isCategorySelected: function (get) {
            return get('activeCard') !== 'allCategoriesCard';
        },

        areCategoriesHidden: function (get) {
            return !get('isCategorySelected') || get('isNodeReporting');
        },

        reportHeading: function (get) {
            if (get('report.readOnly')) {
                return '<h2>' + get('report.title').t() + '</h2><p>' + get('report.description').t() + '</p>';
            }
            return '<h2>' + get('report.title') + '</h2><p>' + get('report.description') + '</p>';
        },

        isTimeGraph: function (get) {
            if (!get('report.type')) {
                return false;
            }
            return get('report.type').indexOf('TIME_GRAPH') >= 0;
        },
        isPieGraph: function (get) {
            if (!get('report.type')) {
                return false;
            }
            return get('report.type').indexOf('PIE_GRAPH') >= 0;
        },

        startDate: function (get) {
            if (!get('startDateTime')) {
                return 'One day ago'.t();
            }
            return Ext.Date.format(get('startDateTime'), 'M j, h:i a');
        },
        endDate: function (get) {
            if (!get('endDateTime')) {
                return 'Present'.t();
            }
            return Ext.Date.format(get('endDateTime'), 'M j, h:i a');
        },
        startTimeMax: function (get) {
            var now = new Date(),
                ref = new Date(get('startDateTime'));
            if (now.getYear() === ref.getYear() && now.getMonth() === ref.getMonth() && now.getDate() === ref.getDate()) {
                return now;
            }
        },

        customizeTitle: function (get) {
            if (get('report.readOnly')) {
                return 'Customize'.t() + ' <span style="font-weight: 300; color: #777;">(' + 'Readonly report! Changes can be saved as a new custom report!' + ')</span>';
            }
            return 'Customize'.t();
        },

        isWidget: function (get) {
            return Ext.getStore('widgets').findRecord('entryId', get('report.uniqueId')) ? true : false;
        },

        dashboardBtnLabel: function (get) {
            if (get('isWidget')) {
                return Ung.Util.iconTitle('Remove from Dashboard'.t(), 'home-16');
            }
            return Ung.Util.iconTitle('Add to Dashboard'.t(), 'home-16');
        }
    },

    stores: {
        categories: {
            model: 'Ung.model.Category',
            data: '{categoriesData}'
        }
        /*
        tables: {
            data: '{tablesData}'
        }
        */
    }
});
Ext.define ('Ung.model.Category', {
    extend: 'Ext.data.Model' ,
    fields: [
        { name: 'name', type: 'string' },
        { name: 'displayName', type: 'string' },
        { name: 'icon', type: 'string' }
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});
Ext.define('Ung.view.reports.Reports', {
    extend: 'Ext.container.Container',
    xtype: 'ung.reports',
    layout: 'border',

    requires: [
        'Ung.view.reports.ReportsController',
        'Ung.view.reports.ReportsModel',

        'Ung.model.Category'
    ],

    controller: 'reports',
    viewModel: {
        type: 'reports'
    },

    config: {
        // initial category used for reports inside nodes
        initCategory: null,
        dashboardSettings: null
    },

    items: [{
        region: 'west',
        xtype: 'grid',
        itemId: 'categoriesGrid',
        title: 'Select Category'.t(),
        width: 200,
        hideHeaders: true,
        shadow: false,
        collapsible: true,
        floatable: false,
        titleCollapse: true,
        animCollapse: false,
        //allowDeselect: true,
        viewConfig: {
            stripeRows: false
            /*
            getRowClass: function(record) {
                if (record.dirty) {
                    return 'dirty';
                }
            }
            */
        },
        hidden: true,
        bind: {
            hidden: '{areCategoriesHidden}',
            store: '{categories}'
        },
        columns: [{
            dataIndex: 'icon',
            width: 20,
            renderer: function (value, meta) {
                meta.tdCls = 'app-icon';
                return '<img src="' + value + '"/>';
            }
        }, {
            dataIndex: 'displayName',
            flex: 1
            /*
            renderer: function (value, meta) {
                //meta.tdCls = 'app-icon';
                return '<span style="font-weight: 600;">' + value + '</span>';
            }
            */
        }]
    }, {
        region: 'center',
        layout: 'border',
        border: false,
        items: [{
            region: 'west',
            xtype: 'grid',
            itemId: 'reportsGrid',
            title: 'Select Report'.t(),
            width: 250,
            hideHeaders: true,
            shadow: false,
            collapsible: true,
            layout: 'fit',
            animCollapse: false,
            floatable: false,
            titleCollapse: true,
            viewConfig: {
                stripeRows: false
            },
            bind: {
                //hidden: '{!report}',
                hidden: '{!isCategorySelected}',
                store: '{reports}'
            },
            columns: [{
                dataIndex: 'title',
                width: 20,
                renderer: function (value, meta, record) {
                    meta.tdCls = 'app-icon';
                    return Ung.Util.iconReportTitle(record);
                }
            }, {
                dataIndex: 'title',
                flex: 1,
                renderer: function (value, meta, record) {
                    return record.get('readOnly') ? value.t() : value;
                }
            }, {
                dataIndex: 'readOnly',
                width: 20,
                align: 'center',
                renderer: function (value, meta) {
                    meta.tdCls = 'app-icon';
                    return !value ? '<i class="material-icons" style="font-size: 14px; color: #999;">brush</i>' : '';
                }
            }, {
                dataIndex: 'uniqueId',
                width: 20,
                align: 'center',
                renderer: function (value, meta) {
                    meta.tdCls = 'app-icon';
                    if (Ext.getStore('widgets').findRecord('entryId', value)) {
                        return '<i class="material-icons" style="font-size: 14px; color: #999;">home</i>';
                    }
                    return '';
                }
            }]
        }, {
            region: 'center',
            border: false,
            layout: 'card',
            bind: {
                activeItem: '{activeCard}'
            },
            defaults: {
                border: false
            },
            items: [{
                // initial view which displays all available categories / apps
                itemId: 'allCategoriesCard',
                scrollable: true,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                    //pack: 'center'
                },
                items: [{
                    xtype: 'component',
                    cls: 'headline',
                    margin: '50 0',
                    html: 'Please select a category first!'
                }, {
                    xtype: 'component',
                    itemId: 'categoriesLoader',
                    margin: '50 0',
                    cls: 'loader',
                    html: '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'
                }, {
                    xtype: 'container',
                    itemId: 'allCategoriesList',
                    //layout: 'fit',
                    //maxWidth: 600,
                    style: {
                        textAlign: 'center'
                    }
                }]
            }, {
                // view which displays all reports from a specific category
                itemId: 'categoryCard',
                scrollable: true,
                items: [{
                    xtype: 'component',
                    cls: 'headline',
                    margin: '50 0',
                    bind: {
                        html: '<img src="{category.icon}" style="width: 80px; height: 80px;"/><br/>{category.displayName}'
                    }
                }, {
                    xtype: 'container',
                    style: {
                        textAlign: 'center'
                    },
                    itemId: 'categoryReportsList'
                }]
            }, {
                // report display
                layout: 'border',
                itemId: 'reportCard',
                defaults: {
                    border: false,
                    bodyBorder: false
                },
                items: [{
                    // report heading
                    region: 'north',
                    height: 60,
                    items: [{
                        xtype: 'component',
                        cls: 'report-header',
                        bind: {
                            html: '{reportHeading}'
                        }
                    }]
                }, {
                    // report chart/event grid
                    region: 'center',
                    itemId: 'report',
                    //height: 40,
                    layout: 'fit',
                    items: [],
                    bbar: [{
                        xtype: 'component',
                        margin: '0 5 0 5',
                        html: Ung.Util.iconTitle('', 'date_range-16')
                    }, {
                        xtype: 'button',
                        bind: {
                            text: '{startDate}'
                        },
                        menu: {
                            itemId: 'startDateTimeMenu',
                            plain: true,
                            showSeparator: false,
                            shadow: false,
                            //xtype: 'form',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [{
                                xtype: 'datepicker',
                                maxDate: new Date(),
                                itemId: 'startDate'
                            }, {
                                xtype: 'timefield',
                                itemId: 'startTime',
                                format: 'h:i a',
                                increment: 30,
                                margin: '5',
                                fieldLabel: 'Time'.t(),
                                labelAlign: 'right',
                                labelWidth: 60,
                                width: 160,
                                plain: true,
                                editable: false,
                                value: '12:00 am',
                                bind: {
                                    maxValue: '{startTimeMax}'
                                }
                            }, {
                                xtype: 'button',
                                itemId: 'startDateTimeBtn',
                                text: Ung.Util.iconTitle('OK'.t(), 'check-16')
                            }]
                        }
                    }, {
                        xtype: 'button',
                        bind: {
                            text: '{endDate}'
                        },
                        menu: {
                            itemId: 'endDateTimeMenu',
                            plain: true,
                            showSeparator: false,
                            shadow: false,
                            //xtype: 'form',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [{
                                xtype: 'datepicker',
                                maxDate: new Date(),
                                itemId: 'endDate',
                                bind: {
                                    minDate: '{startDateTime}'
                                }
                            }, {
                                xtype: 'timefield',
                                itemId: 'endTime',
                                format: 'h:i a',
                                increment: 30,
                                margin: '5',
                                fieldLabel: 'Time'.t(),
                                labelAlign: 'right',
                                labelWidth: 60,
                                width: 160,
                                plain: true,
                                editable: false,
                                value: '12:00 am',
                                bind: {
                                    maxValue: '{endTimeMax}'
                                }
                            }, {
                                xtype: 'button',
                                itemId: 'endDateTimeBtn',
                                text: Ung.Util.iconTitle('OK'.t(), 'check-16')
                            }]
                        }
                    }, '-' , {
                        text: Ung.Util.iconTitle('Refresh'.t(), 'update-16'),
                        itemId: 'refreshBtn'
                    }, '->', {
                        itemId: 'downloadBtn',
                        text: Ung.Util.iconTitle('Download'.t(), 'file_download-16')
                    }, '-', {
                        itemId: 'dashboardBtn',
                        bind: {
                            text: '{dashboardBtnLabel}'
                        }

                    }]
                }, {
                    // report customization
                    region: 'south',
                    xtype: 'form',
                    layout: 'fit',
                    minHeight: 300,
                    shadow: false,
                    split: true,
                    collapsible: true,
                    collapsed: false,
                    floatable: false,
                    titleCollapse: true,
                    animCollapse: false,
                    border: false,
                    bodyBorder: false,

                    bind: {
                        title: '{customizeTitle}'
                    },

                    items: [{
                        xtype: 'tabpanel',
                        itemId: 'customization',
                        border: false,
                        defaults: {
                            border: false,
                            bodyBorder: false,
                            bodyPadding: 5
                        },
                        items: [{
                            title: Ung.Util.iconTitle('Style'.t(), 'color_lens-16'),
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [{
                                // ALL - report title
                                xtype: 'textfield',
                                fieldLabel: 'Title'.t(),
                                maxWidth: 400,
                                labelWidth: 150,
                                labelAlign: 'right',
                                allowBlank: false,
                                bind: {
                                    value: '{report.title}'
                                }
                            }, {
                                // ALL - report description
                                xtype: 'textfield',
                                fieldLabel: 'Description'.t(),
                                labelWidth: 150,
                                labelAlign: 'right',
                                bind: {
                                    value: '{report.description}'
                                }
                            }, {
                                // ALL - report enabled
                                xtype: 'container',
                                layout: 'hbox',
                                margin: '0 0 5 0',
                                items: [{
                                    xtype: 'label',
                                    cls: 'x-form-item-label-default',
                                    width: 155,
                                    style: {
                                        textAlign: 'right'
                                    },
                                    text: 'Enabled'.t() + ':'
                                }, {
                                    xtype: 'segmentedbutton',
                                    bind: {
                                        value: '{report.enabled}'
                                    },
                                    items: [
                                        {text: 'YES'.t(), value: true },
                                        {text: 'NO'.t(), value: false }
                                    ]
                                }]
                            }, {
                                // TIME_GRAPH - chart style
                                xtype: 'container',
                                layout: 'hbox',
                                margin: '0 0 5 0',
                                hidden: true,
                                bind: {
                                    disabled: '{!isTimeGraph}',
                                    hidden: '{!isTimeGraph}'
                                },
                                items: [{
                                    xtype: 'label',
                                    cls: 'x-form-item-label-default',
                                    width: 155,
                                    style: {
                                        textAlign: 'right'
                                    },
                                    text: 'Time Chart Style'.t() + ':'
                                }, {
                                    xtype: 'segmentedbutton',
                                    itemId: 'chartStyleBtn',
                                    bind: {
                                        value: '{report.timeStyle}'
                                    },
                                    items: [
                                        {text: 'Line'.t(), value: 'LINE', styleType: 'spline'},
                                        {text: 'Area'.t(), value: 'AREA', styleType: 'areaspline'},
                                        {text: 'Stacked Area'.t(), value: 'AREA_STACKED', styleType: 'areaspline', stacked: true},
                                        {text: 'Column'.t(), value: 'BAR', styleType: 'column', grouped: true},
                                        {text: 'Overlapped Columns'.t(), value: 'BAR_OVERLAPPED', styleType: 'column', overlapped: true},
                                        {text: 'Stacked Columns'.t(), value: 'BAR_STACKED', styleType: 'column', stacked : true}
                                    ]
                                }]
                            }, {
                                // PIE_GRAPH - chart style
                                xtype: 'container',
                                layout: 'hbox',
                                margin: '0 0 5 0',
                                hidden: true,
                                bind: {
                                    disabled: '{!isPieGraph}',
                                    hidden: '{!isPieGraph}'
                                },
                                items: [{
                                    xtype: 'label',
                                    cls: 'x-form-item-label-default',
                                    width: 155,
                                    style: {
                                        textAlign: 'right'
                                    },
                                    text: 'Style'.t() + ':'
                                }, {
                                    xtype: 'segmentedbutton',
                                    itemId: 'chartStyleBtn',
                                    bind: {
                                        value: '{report.pieStyle}'
                                    },
                                    items: [
                                        {text: 'Pie', value: 'PIE', styleType: 'pie'},
                                        //{text: 'Pie 3D', value: 'PIE_3D', styleType: 'pie'},
                                        {text: 'Donut', value: 'DONUT', styleType: 'pie'},
                                        //{text: 'Donut 3D', value: 'DONUT_3D', styleType: 'pie'},
                                        {text: 'Column', value: 'COLUMN', styleType: 'column'}
                                        //{text: 'Column 3D', value: 'COLUMN_3D', styleType: 'column'}
                                    ]
                                }]
                            }, {
                                // TIME_GRAPH - data interval
                                xtype: 'container',
                                layout: 'hbox',
                                margin: '0 0 5 0',
                                hidden: true,
                                bind: {
                                    disabled: '{!isTimeGraph}',
                                    hidden: '{!isTimeGraph}'
                                },
                                items: [{
                                    xtype: 'label',
                                    cls: 'x-form-item-label-default',
                                    width: 155,
                                    style: {
                                        textAlign: 'right'
                                    },
                                    text: 'Time Data Interval'.t() + ':'
                                }, {
                                    xtype: 'segmentedbutton',
                                    itemId: 'timeIntervalBtn',
                                    bind: {
                                        value: '{report.timeDataInterval}'
                                    },
                                    items: [
                                        {text: 'Auto'.t(), value: 'AUTO'},
                                        {text: 'Second'.t(), value: 'SECOND', defaultTimeFrame: 60 },
                                        {text: 'Minute'.t(), value: 'MINUTE', defaultTimeFrame: 60 },
                                        {text: '10 Minutes'.t(), value: 'TENMINUTE', defaultTimeFrame: 600 },
                                        {text: 'Hour'.t(), value: 'HOUR', defaultTimeFrame: 24 },
                                        {text: 'Day'.t(), value: 'DAY', defaultTimeFrame: 7 },
                                        {text: 'Week'.t(), value: 'WEEK', defaultTimeFrame: 12 },
                                        {text: 'Month'.t(), value: 'MONTH', defaultTimeFrame: 6 }
                                    ]
                                }]
                            }, {
                                // PIE_GRAPH - number of pie slices
                                xtype: 'numberfield',
                                fieldLabel: 'Pie Slices Number'.t(),
                                labelWidth: 150,
                                maxWidth: 200,
                                labelAlign: 'right',
                                minValue: 1,
                                maxValue: 25,
                                allowBlank: false,
                                hidden: true,
                                bind: {
                                    disabled: '{!isPieGraph}',
                                    hidden: '{!isPieGraph}',
                                    value: '{report.pieNumSlices}'
                                }
                            }]
                        }, {
                            title: Ung.Util.iconTitle('Conditions'.t(), 'find_in_page-16')
                        }, {
                            title: Ung.Util.iconTitle('Advanced'.t(), 'settings-16'),
                            scrollable: true,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [{
                                // TIME_GRAPH - table
                                xtype: 'combobox',
                                fieldLabel: 'Table'.t(),
                                maxWidth: 400,
                                labelWidth: 150,
                                labelAlign: 'right',
                                editable: false,
                                hidden: true,
                                bind: {
                                    store: '{tableNames}',
                                    disabled: '{!isTimeGraph}',
                                    hidden: '{!isTimeGraph}',
                                    value: '{report.table}'
                                }
                            }, {
                                // TIME_GRAPH - units
                                xtype: 'textfield',
                                fieldLabel: 'Units'.t(),
                                maxWidth: 305,
                                labelWidth: 150,
                                labelAlign: 'right',
                                hidden: true,
                                bind: {
                                    disabled: '{!isTimeGraph}',
                                    hidden: '{!isTimeGraph}',
                                    value: '{report.units}'
                                }
                            }, {
                                // TIME_GRAPH - time data columns
                                xtype: 'textarea',
                                fieldLabel: 'Time Data Columns'.t(),
                                grow: true,
                                maxWidth: 500,
                                labelWidth: 150,
                                labelAlign: 'right',
                                hidden: true,
                                bind: {
                                    disabled: '{!isTimeGraph}',
                                    hidden: '{!isTimeGraph}',
                                    value: '{report.timeDataColumns}'
                                }
                            }, {
                                // TIME_GRAPH - series renderer
                                xtype: 'textfield',
                                fieldLabel: 'Series Renderer'.t(),
                                maxWidth: 305,
                                labelWidth: 150,
                                labelAlign: 'right',
                                hidden: true,
                                bind: {
                                    disabled: '{!isTimeGraph}',
                                    hidden: '{!isTimeGraph}',
                                    value: '{report.seriesRenderer}'
                                }
                            }, {
                                // ALL - column ordering
                                xtype: 'container',
                                layout: 'hbox',
                                margin: '0 0 5 0',
                                items: [{
                                    xtype: 'label',
                                    cls: 'x-form-item-label-default',
                                    width: 155,
                                    style: {
                                        textAlign: 'right'
                                    },
                                    text: 'Order By Column'.t() + ':'
                                }, {
                                    xtype: 'textfield',
                                    bind: {
                                        value: '{report.orderByColumn}'
                                    }
                                }, {
                                    xtype: 'segmentedbutton',
                                    margin: '0 0 0 5',
                                    bind: {
                                        value: '{report.orderDesc}'
                                    },
                                    items: [
                                        {text: Ung.Util.iconTitle('Ascending'.t(), 'arrow_upward-16'), value: true },
                                        {text: Ung.Util.iconTitle('Descending'.t(), 'arrow_downward-16'), value: false }
                                    ]
                                }]
                            }, {
                                // ALL - display order
                                xtype: 'numberfield',
                                fieldLabel: 'Display Order'.t(),
                                maxWidth: 220,
                                labelWidth: 150,
                                labelAlign: 'right',
                                bind: {
                                    value: '{report.displayOrder}'
                                }
                            }]
                        }]
                    }],
                    fbar: [/*{
                        text: Ung.Util.iconTitle('Preview'.t(), 'rotate_left-16'),
                        itemId: 'applyBtn',
                        formBind: true
                    },*/ {
                        text: Ung.Util.iconTitle('Remove'.t(), 'delete-16'),
                        itemId: 'removeBtn',
                        bind: {
                            hidden: '{report.readOnly}'
                        }
                    }, {
                        text: Ung.Util.iconTitle('Update'.t(), 'save-16'),
                        itemId: 'updateBtn',
                        formBind: true,
                        bind: {
                            hidden: '{report.readOnly}'
                        }
                    }, {
                        text: Ung.Util.iconTitle('Save as New Report'.t(), 'add-16'),
                        itemId: 'saveNewBtn',
                        formBind: true
                    }]
                }]
            }]

        }]
    }]
});
Ext.define('Ung.view.node.SettingsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.nodesettings',

    config: {
        nodeManager: null
    },

    control: {
        '#': { // main settings view listeners
            beforeactivate: 'onBeforeActivate',
            beforedeactivate: 'onBeforeDeactivate'
        }
    },

    listen: {
        store: {
            '#metrics': {
                datachanged: 'updateMetrics'
            }
        }
    },

    onBeforeActivate: function () {
        var me = this,
            vm = this.getViewModel();

        var policy = Ext.getStore('policies').findRecord('policyId', vm.get('policyId'));

        // get node instance based on policy and node name

        var nodeInstance = policy.get('instances').list.filter(function (node) {
            return node.nodeName === vm.get('nodeName');
        })[0];
        // get node properties based on policy and node instance
        var nodeProps = vm.get('policy.nodeProperties.list').filter(function (prop) {
            return nodeInstance.nodeName === prop.name;
        })[0];

        vm.set('nodeInstance', nodeInstance);
        vm.set('nodeProps', nodeProps);

        var mask = new Ext.LoadMask({
            msg: 'Loading...'.t(),
            target: this.getView()
        }).show();

        // dynamic require node class
        Ext.require(Ung.Util.nodeClassMapping[nodeInstance.nodeName], function () {
            // get node manager
            rpc.nodeManager.node(function (nodeManager, ex) {
                if (ex) { Ung.Util.exceptionToast(ex); return false; }
                me.setNodeManager(nodeManager);
                // get node settings
                nodeManager.getSettings(function (settings) {
                    // add the node settings view, based on node type and instance
                    me.getView().add({
                        xtype: 'ung.' + nodeInstance.nodeName,
                        region: 'center',
                        itemId: 'settings'
                        //manager: nodeManager
                    });
                    //console.log(settings);
                    vm.set('settings', settings);
                    mask.hide();
                });
            }, nodeInstance.id);
        });
    },

    /**
     * Updates the node metrics everytime the global metrics store is changed
     */
    updateMetrics: function () {
        //console.log('update metrics');
        var vm = this.getViewModel();
        var nodeMetrics = Ext.getStore('metrics').findRecord('nodeId', vm.get('nodeInstance.id'));
        if (nodeMetrics) {
            vm.set('metrics', nodeMetrics.get('metrics').list);
        }

        if (this.getView().down('nodechart')) {
            this.getView().down('nodechart').fireEvent('addPoint');
        }

    },

    /**
     * methos called when starting/stopping the node
     */
    onPower: function (btn) {
        var nodeManager = this.getNodeManager(),
            vm = this.getViewModel();

        btn.setDisabled(true);
        if (vm.get('nodeInstance.targetState') === 'RUNNING') {
            // stop node
            nodeManager.stop(function (result, ex) {
                if (ex) { Ung.Util.exceptionToast(ex); return false; }
                nodeManager.getRunState(function (result2, ex2) {
                    if (ex2) { Ung.Util.exceptionToast(ex2); return false; }
                    vm.set('nodeInstance.targetState', result2);
                    vm.notify();
                    btn.setDisabled(false);

                    if (nodeManager.getNodeProperties().name === 'untangle-node-reports') {
                        vm.getParent().set('reportsRunning', false);
                    }

                    Ung.Util.successToast(vm.get('powerMessage'));
                });
            });
        } else {
            // start node
            nodeManager.start(function (result, ex) {
                if (ex) {
                    Ext.Msg.alert('Error', ex.message);
                    btn.setDisabled(false);
                    return false;
                }
                nodeManager.getRunState(function (result2, ex2) {
                    if (ex2) { Ung.Util.exceptionToast(ex2); return false; }
                    vm.set('nodeInstance.targetState', result2);
                    vm.notify();
                    btn.setDisabled(false);

                    if (nodeManager.getNodeProperties().name === 'untangle-node-reports') {
                        vm.getParent().set('reportsRunning', true);
                    }

                    Ung.Util.successToast(vm.get('powerMessage'));
                });
            });
        }
    },

    onBeforeDeactivate: function (view) {
        console.log('on deactivate');
        view.remove('settings', {destroy: true});
    },

    /**
     * Saves the whole node settings object sending the new settings to backend via RPC
     */
    saveSettings: function () {
        var me = this,
            vm = this.getViewModel(),
            nodeManager = this.getNodeManager();
            //newSettings = me.getViewModel().get('settings');

        // all outstanding changes made on grids are commited and transferred to the node settings
        this.getView().query('grid').forEach(function(grid) {
            grid.fireEvent('save');
        });

        var myMask = new Ext.LoadMask({
            msg    : 'Saving ...',
            target : this.getView()
        }).show();

        // send settings to backend
        nodeManager.setSettings(function (result, ex) {
            myMask.hide();
            if (ex) { Ung.Util.exceptionToast(ex); return false; }

            Ung.util.Util.successToast('Settings saved!');

            // retreive again settings from backend as pushed changes might have extra effects on the data
            nodeManager.getSettings(function (settings, ex) {
                if (ex) { Ung.Util.exceptionToast(ex); return false; }
                vm.set('settings', settings); // apply fresh settings on the viewmodel
                me.getView().query('grid').forEach(function(grid) {
                    grid.fireEvent('reloaded');
                });
            });
        }, vm.get('settings'));
    },

    removeNode: function () {
        var vm = this.getViewModel(), settingsView = this.getView();
        var message = Ext.String.format('{0} will be uninstalled from this policy.'.t(), 'display name') + '<br/>' +
            'All of its settings will be lost.'.t() + '\n' + '<br/>' + '<br/>' +
            'Would you like to continue?'.t();

        Ext.Msg.confirm('Warning:'.t(), message, function(btn) {
            if (btn === 'yes') {
                var nodeItem = settingsView.up('#main').down('#apps').down('#' + vm.get('nodeInstance.nodeName'));
                //nodeItem.setDisabled(true);
                nodeItem.addCls('remove');
                Ung.app.redirectTo('#apps/' + vm.get('policyId'));

                rpc.nodeManager.destroy(function (result, ex) {
                    if (ex) { Ung.Util.exceptionToast(ex); return false; }

                    rpc.nodeManager.getAppsViews(function (result2, ex2) {
                        if (ex2) { Ung.Util.exceptionToast(ex2); return; }
                        Ext.getStore('policies').loadData(result2);
                    });

                    if (nodeItem.node.name === 'untangle-node-reports') {
                        delete rpc.reportsManager;
                        vm.getParent().set('reportsInstalled', false);
                        vm.getParent().set('reportsRunning', false);
                    }

                    if (rpc.reportsManager) {
                        rpc.reportsManager.getUnavailableApplicationsMap(function (result3, ex3) {
                            if (ex3) { Ung.Util.exceptionToast(ex3); return; }
                            Ext.getStore('unavailableApps').loadRawData(result3.map);

                            // fire nodeinstall event to update widgets on dashboard
                            Ext.GlobalEvents.fireEvent('nodeinstall', 'remove', nodeItem.node);
                        });
                    }
                }, vm.get('nodeInstance.id'));
            }
        });
    }
});

Ext.define('Ung.view.node.SettingsModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.nodesettings',

    data: {
        nodeInstance: null,
        nodeProps: null,
        metrics: null,
        nodeReports: null
    },

    formulas: {
        powerMessage: function (get) {
            if (get('nodeInstance.targetState') === 'RUNNING') {
                return Ext.String.format('{0} is enabled.'.t(), get('nodeProps.displayName'));
            }
            return Ext.String.format('{0} is disabled.'.t(), get('nodeProps.displayName'));
        },
        powerButton: function (get) {
            if (get('nodeInstance.targetState') === 'RUNNING') {
                return Ung.Util.iconTitle('Disable', 'power_settings_new-16');
            }
            return Ung.Util.iconTitle('Enable', 'power_settings_new-16');
        }
    },

    stores: {
        // holds the metrics for a specific node instance, which are rendered in Node Status
        nodeMetrics: {
            model: 'Ung.model.NodeMetric',
            data: '{metrics}'
        },
        areports: {
            model: 'Ung.model.Report',
            data: '{nodeReports}'
        }
    }
});
Ext.define('Ung.view.node.Reports', {
    extend: 'Ext.panel.Panel',
    xtype: 'nodereports',

    requires: [
        //'Ung.chart.NodeChart'
    ],

    layout: 'border',

    border: false,

    title: 'Reports'.t(),
    //scrollable: true,
    items: [{
        region: 'west',
        xtype: 'grid',
        width: 300,
        border: false,
        bodyBorder: false,
        header: false,
        hideHeaders: true,
        trackMouseOver: false,
        viewConfig: {
            stripeRows: false
        },
        bind: {
            store: '{reports}'
        },
        columns: [{
            dataIndex: 'title',
            flex: 1
        }]
    }, {
        region: 'center',
        html: 'center'
    }]

});
Ext.define ('Ung.model.NodeMetric', {
    extend: 'Ext.data.Model' ,
    fields: [
        { name: 'displayName', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'value', type: 'int' },
        { name: 'javaClass', type: 'string', defaultValue: 'com.untangle.uvm.node.NodeMetric' }
    ],
    proxy: {
        autoLoad: true,
        type: 'memory',
        reader: {
            type: 'json'
            //rootProperty: 'list'
        }
    }
});
Ext.define ('Ung.model.GenericRule', {
    extend: 'Ext.data.Model' ,
    fields: [
        { name: 'name', type: 'string', defaultValue: null },
        { name: 'string', type: 'string', defaultValue: '' },
        { name: 'blocked', type: 'boolean', defaultValue: true },
        { name: 'flagged', type: 'boolean', defaultValue: true },
        { name: 'category', type: 'string', defaultValue: null },
        { name: 'description', type: 'string', defaultValue: '' },
        { name: 'enabled', type: 'boolean', defaultValue: true },
        { name: 'id', defaultValue: null },
        { name: 'readOnly', type: 'boolean', defaultValue: null },
        { name: 'javaClass', type: 'string', defaultValue: 'com.untangle.uvm.node.GenericRule' }
    ],
    proxy: {
        autoLoad: true,
        type: 'memory',
        reader: {
            type: 'json'
            //rootProperty: 'list'
        }
    }
});
Ext.define('Ung.widget.report.ReportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.reportwidget',
    //stores: ['widgetsStore'],
    init: function (view) {
        this.getViewModel().set('widget', view.getWidget());
        this.getViewModel().set('entry', view.getEntry());

        var type = view.getEntry().get('type');

        if (type === 'TIME_GRAPH' || type === 'TIME_GRAPH_DYNAMIC') {
            view.add({ xtype: 'timechart', reference: 'chart', height: 250 });
        }

        if (type === 'PIE_GRAPH') {
            view.add({ xtype: 'piechart', reference: 'chart',  height: 250 });
        }

        if (type === 'EVENT_LIST') {
            view.add({ xtype: 'component', html: 'Not Implemented',  height: 250 });
        }
    },

    fetchData: function () {
        var me = this,
            entry = me.getViewModel().get('entry'),
            timeframe = me.getViewModel().get('widget.timeframe');

        if (entry.get('type') === 'EVENT_LIST') {
            // fetch event data
            //console.log('Event List');
        } else {
            // fetch chart data
            me.getView().lookupReference('chart').fireEvent('beginfetchdata');
            Rpc.getReportData(entry.getData(), timeframe)
                .then(function (response) {
                    me.getView().lookupReference('chart').fireEvent('setseries', response.list);
                }, function (exception) {
                    console.log(exception);
                });
        }
    },

    /*
    showEditor: function () {
        this.getView().up('dashboardmain').fireEvent('showwidgeteditor', this.getView().getWidget());
    },
    */

    resizeWidget: function () {
        var view = this.getView();
        if (view.hasCls('small')) {
            view.removeCls('small').addCls('medium');
        } else {
            if (view.hasCls('medium')) {
                view.removeCls('medium').addCls('large');
            } else {
                if (view.hasCls('large')) {
                    view.removeCls('large').addCls('x-large');
                } else {
                    if (view.hasCls('x-large')) {
                        view.removeCls('x-large').addCls('small');
                    }
                }
            }
        }
        view.updateLayout();
    }

});

Ext.define('Ung.widget.report.ReportModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.reportwidget',

    formulas: {
        title: {
            get: function(get) {
                return '<h1>' +
                    //(get('entry.readOnly') ? ' <i class="material-icons" style="color: #ec3610; font-size: 16px;">lock</i>' : '') +
                    get('entry.title') +
                    (get('entry.timeDataInterval') ? ' <span style="text-transform: lowercase; color: #777; font-weight: 100;">per ' + get('entry.timeDataInterval') + '</span>' : '') +
                    '</h1><p>since ' + get('timeframe') + ' ago</p></h1>';
            }
        },
        timeframe: {
            get: function(get) {
                return get('widget.timeframe');
                //return Ung.util.Services.secondsToString(get('widget.timeframe'));
            }
        }
    }

});
Ext.define('Ung.view.grid.GridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ung.grid',

    init: function (view) {
        // add toolbar buttons
        if (view.getToolbarFeatures()) {
            var features = view.getToolbarFeatures(),
                toolbar = Ext.create('Ext.toolbar.Toolbar');

            if (Ext.Array.contains(features, 'add')) {
                toolbar.add({
                    text: Ung.Util.iconTitle('Add', 'add-16'),
                    handler: 'addRecord'
                });
            }
            if (Ext.Array.contains(features, 'revert')) {
                toolbar.add({
                    text: Ung.Util.iconTitle('Revert', 'undo-16'),
                    handler: 'revertChanges'
                });
            }
            if (Ext.Array.contains(features, 'delete')) {
                toolbar.add({
                    text: Ung.Util.iconTitle('Delete', 'delete-16'),
                    handler: 'deleteRecords'
                });
            }
            if (Ext.Array.contains(features, 'importexport')) {
                toolbar.add('->', {
                    text: Ung.Util.iconTitle('Import', 'arrow_downward-16')
                }, {
                    text: Ung.Util.iconTitle('Export', 'arrow_upward-16')
                });
            }
            view.addDocked(toolbar);
        }

        // add celledit plugin
        if (view.getInlineEdit() === 'cell') {
            view.addPlugin({
                ptype: 'cellediting',
                clicksToEdit: 2
            });
        }

        // add row plugin (not used)
        if (view.getInlineEdit() === 'row') {
            view.addPlugin({
                ptype: 'rowediting',
                clicksToEdit: 2,
                clicksToMoveEditor: 1,
                //autoCancel: true,
                errorSummary: false,
                //removeUnmodified: true,
                pluginId: 'rowediting'
            });
        }
    },

    onBeforeDestory: function (view) {
        //console.log('on before destroy');
        //view.getPlugin('gridviewdragdrop').destroy();
    },


    checkChanges: function(store) {
        //console.log('checkchanges');
        this.getViewModel().set('isDirty', (store.getUpdatedRecords().length > 0 || store.getRemovedRecords().length > 0 || store.getModifiedRecords().length > 0));
    },

    /*
    onBeforeRender: function (view) {
        var vm = this.getViewModel();
        if (!view.getSettings().reorderColumn && view.getSettings().initialSortData) {
            vm.get('store').setSorters(view.getSettings().initialSortData);
        }
    },
    */
    addRecord: function () {
        var me = this;
        var vm = this.getViewModel();
        var win = Ext.create('Ung.view.grid.Editor', {
            title: 'Add'.t(),
            width: 500,
            y: 200,
            //height: 250,
            columns: me.getView().getColumns(),
            viewModel: {
                data: {
                    record: Ext.create('Ung.model.GenericRule')
                }
            }
        }).show();
        win.on('close', function () {
            if (win.getCloseAction() === 'save') {
                //console.log(win.getViewModel().get('record'));
                vm.get('store').add(win.getViewModel().get('record'));
            }
        });

    },

    deleteRecords: function () {
        this.getViewModel().get('store').remove(this.getView().getSelectionModel().getSelection());
    },

    editRecord: function (view, rowIndex, colIndex, item, e, record, row) {
        var vm = this.getViewModel();
        var rec = record.copy(null);

        var win = Ext.create('Ung.view.grid.Editor', {
            title: 'Edit'.t(),
            width: 800,
            y: 200,
            columns: item.up('grid').getColumns(),
            //record: record

            viewModel: {
                data: {
                    record: rec
                }
            }
        }).show();
        win.on('close', function () {
            //record.copyFrom(win.getViewModel().get('record'));
            //record.beginEdit();
            record.copyFrom(win.getViewModel().get('record'));
            record.dirty = true;

            //console.log(win.getViewModel().get('record'));

            //record.endEdit();
            //record.set('string', 'hahahahah');
            //record.setDirty(true);
            record.commit();
            vm.get('store').update();

        });
    },

    deleteRecord: function (view, rowIndex, colIndex, item, e, record, row) {
        record.drop();
        //console.log(record);
        //record.setConfig('markDelete', true);
        //record.markDelete = true;
        //console.log(record);
    },

    // applies changes into the settings object before pushing to server
    onSave: function () {
        var vm = this.getViewModel();
        if (vm.get('store')) {
            vm.set('settings.' + this.getView().getDataProperty() + '.list', Ext.Array.pluck(vm.get('store').getRange(), 'data'));
        }
    }


    /*
    onEdit: function (editor, e) {
        console.log(e);
    },

    revertChanges: function () {
        this.getViewModel().get('store').rejectChanges();
    },

    onSelectionChange: function (model, selected) {
        this.getViewModel().set('selectedRecords', selected.length);
    },

    onSave: function () {
        var vm = this.getViewModel();
        console.log('onsave');
        vm.set(this.getView().getSettings().dataPath, Ext.Array.pluck(vm.get('store').getRange(), 'data'));
        //vm.get('store').commitChanges();
    },

    onReloaded: function () {
        console.log('onreloaded');
        this.getViewModel().get('store').commitChanges();
        console.log(this.getViewModel().get('store'));
    }
    */
});
Ext.define('Ung.view.grid.ConditionsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ung.gridconditions',

    init: function (view) {
    },
    onBeforeRender: function (view) {
        var vm = view.getViewModel();
        var conditions = vm.get('record.conditions.list');
        //console.log(vm.get('record'));
        /*
        conditions.forEach(function (cond) {
            console.log(cond);
            view.add({
                text: cond.conditionType,
                columnWidth: 1
            });
        });
        */
    },
    onChange: function () {
        console.log('on change');
    },
    typeRenderer: function (value) {
        return Ext.getStore('conditions').findRecord('name', value).get('displayName');
    },
    valueRenderer: function (value, metaData, record) {
        var editorType = Ext.getStore('conditions').findRecord('name', record.get('conditionType')).get('editorType');
        switch (editorType) {
        case ('countryselector'):
            var str = '';
            value.split(',').forEach(function (iso) {
                str += Ext.getStore('countries').findRecord('code', iso).get('name') + ', ';
            });
            return str;
        }
        return value;
    },
    onConditionSelect: function (row, record, index) {
        var me = this;
        var condEditorWin = Ext.create('Ung.view.grid.ConditionEditor', {
            bind: {
                title: 'Edit'.t()
            },
            width: 400,
            y: 250,
            //constrain: true,
            //constrainTo: this.getView().getEl(),

            viewModel: {
                data: {
                    condition: record
                }
            }

        }).show();

        condEditorWin.on('close', function () {
            console.log(this.getViewModel().get('condition'));
        });

        me.getView().getSelectionModel().deselectAll();
    },

    onConditionTypeChange: function () {
        console.log('cond chage');
    },
    onAddCondition: function () {
        var rec = Ext.create('Ung.model.Condition');
        var condEditorWin = Ext.create('Ung.view.grid.ConditionEditor', {
            bind: {
                title: 'Add Condition'.t()
            },
            width: 400,
            y: 250,
            viewModel: {
                data: {
                    condition: rec
                }
            }
        }).show();
    }

});
Ext.define('Ung.store.Conditions', {
    extend: 'Ext.data.Store',
    storeId: 'conditions',
    fields: ['name', 'displayName', 'type'],
    data: [
        {name:'DST_ADDR', displayName: 'Destination Address'.t(), editorType: 'textfield', vtype:'ipall', visible: true },
        {name:'DST_PORT',displayName: 'Destination Port'.t(), editorType: 'textfield', vtype:'port', visible: true },
        {name:'DST_INTF',displayName: 'Destination Interface'.t(), editorType: 'checkgroup', /*values: Ung.Util.getInterfaceList(true, false),*/ visible: true},
        {name:'SRC_ADDR',displayName: 'Source Address'.t(), editorType: 'textfield', visible: true, vtype:'ipall'},
        {name:'SRC_PORT',displayName: 'Source Port'.t(), editorType: 'textfield', vtype:'portMatcher', visible: rpc.isExpertMode},
        {name:'SRC_INTF',displayName: 'Source Interface'.t(), editorType: 'checkgroup', /*values: Ung.Util.getInterfaceList(true, false),*/ visible: true},
        {name:'PROTOCOL',displayName: 'Protocol'.t(), editorType: 'checkgroup', values: [['TCP','TCP'],['UDP','UDP'],['any','any']], visible: true},
        {name:'USERNAME',displayName: 'Username'.t(), editorType: 'userselection', /*editor: Ext.create('Ung.UserEditorWindow',{}),*/ visible: true},
        {name:'CLIENT_HOSTNAME',displayName: 'Client Hostname'.t(), editorType: 'textfield', visible: true},
        {name:'SERVER_HOSTNAME',displayName: 'Server Hostname'.t(), editorType: 'textfield', visible: rpc.isExpertMode},
        {name:'SRC_MAC', displayName: 'Client MAC Address'.t(), editorType: 'textfield', visible: true },
        {name:'DST_MAC', displayName: 'Server MAC Address'.t(), editorType: 'textfield', visible: true },
        {name:'CLIENT_MAC_VENDOR',displayName: 'Client MAC Vendor'.t(), editorType: 'textfield', visible: true},
        {name:'SERVER_MAC_VENDOR',displayName: 'Server MAC Vendor'.t(), editorType: 'textfield', visible: true},
        {name:'CLIENT_IN_PENALTY_BOX',displayName: 'Client in Penalty Box'.t(), editorType: 'boolean', visible: true},
        {name:'SERVER_IN_PENALTY_BOX',displayName: 'Server in Penalty Box'.t(), editorType: 'boolean', visible: true},
        {name:'CLIENT_HAS_NO_QUOTA',displayName: 'Client has no Quota'.t(), editorType: 'boolean', visible: true},
        {name:'SERVER_HAS_NO_QUOTA',displayName: 'Server has no Quota'.t(), editorType: 'boolean', visible: true},
        {name:'CLIENT_QUOTA_EXCEEDED',displayName: 'Client has exceeded Quota'.t(), editorType: 'boolean', visible: true},
        {name:'SERVER_QUOTA_EXCEEDED',displayName: 'Server has exceeded Quota'.t(), editorType: 'boolean', visible: true},
        {name:'CLIENT_QUOTA_ATTAINMENT',displayName: 'Client Quota Attainment'.t(), editorType: 'textfield', visible: true},
        {name:'SERVER_QUOTA_ATTAINMENT',displayName: 'Server Quota Attainment'.t(), editorType: 'textfield', visible: true},
        {name:'HTTP_HOST',displayName: 'HTTP: Hostname'.t(), editorType: 'textfield', visible: true},
        {name:'HTTP_REFERER',displayName: 'HTTP: Referer'.t(), editorType: 'textfield', visible: true},
        {name:'HTTP_URI',displayName: 'HTTP: URI'.t(), editorType: 'textfield', visible: true},
        {name:'HTTP_URL',displayName: 'HTTP: URL'.t(), editorType: 'textfield', visible: true},
        {name:'HTTP_CONTENT_TYPE',displayName: 'HTTP: Content Type'.t(), editorType: 'textfield', visible: true},
        {name:'HTTP_CONTENT_LENGTH',displayName: 'HTTP: Content Length'.t(), editorType: 'textfield', visible: true},
        {name:'HTTP_USER_AGENT',displayName: 'HTTP: Client User Agent'.t(), editorType: 'textfield', visible: true},
        {name:'HTTP_USER_AGENT_OS',displayName: 'HTTP: Client User OS'.t(), editorType: 'textfield', visible: false},
        {name:'APPLICATION_CONTROL_APPLICATION',displayName: 'Application Control: Application'.t(), editorType: 'textfield', visible: true},
        {name:'APPLICATION_CONTROL_CATEGORY',displayName: 'Application Control: Application Category'.t(), editorType: 'textfield', visible: true},
        {name:'APPLICATION_CONTROL_PROTOCHAIN',displayName: 'Application Control: Protochain'.t(), editorType: 'textfield', visible: true},
        {name:'APPLICATION_CONTROL_DETAIL',displayName: 'Application Control: Detail'.t(), editorType: 'textfield', visible: true},
        {name:'APPLICATION_CONTROL_CONFIDENCE',displayName: 'Application Control: Confidence'.t(), editorType: 'textfield', visible: true},
        {name:'APPLICATION_CONTROL_PRODUCTIVITY',displayName: 'Application Control: Productivity'.t(), editorType: 'textfield', visible: true},
        {name:'APPLICATION_CONTROL_RISK',displayName: 'Application Control: Risk'.t(), editorType: 'textfield', visible: true},
        {name:'PROTOCOL_CONTROL_SIGNATURE',displayName: 'Application Control Lite: Signature'.t(), editorType: 'textfield', visible: true},
        {name:'PROTOCOL_CONTROL_CATEGORY',displayName: 'Application Control Lite: Category'.t(), editorType: 'textfield', visible: true},
        {name:'PROTOCOL_CONTROL_DESCRIPTION',displayName: 'Application Control Lite: Description'.t(), editorType: 'textfield', visible: true},
        {name:'WEB_FILTER_CATEGORY',displayName: 'Web Filter: Category'.t(), editorType: 'textfield', visible: true},
        {name:'WEB_FILTER_CATEGORY_DESCRIPTION',displayName: 'Web Filter: Category Description'.t(), editorType: 'textfield', visible: true},
        {name:'WEB_FILTER_FLAGGED',displayName: 'Web Filter: Website is Flagged'.t(), editorType: 'boolean', visible: true},
        {name:'DIRECTORY_CONNECTOR_GROUP',displayName: 'Directory Connector: User in Group'.t(), type: 'editor', /*editor: Ext.create('Ung.GroupEditorWindow',{}),*/ visible: true},
        {name:'CLIENT_COUNTRY',displayName: 'Client Country'.t(), editorType: 'countryselector', /*editor: Ext.create('Ung.CountryEditorWindow',{}),*/ visible: true},
        {name:'SERVER_COUNTRY',displayName: 'Server Country'.t(), editorType: 'countryselector', /*editor: Ext.create('Ung.CountryEditorWindow',{}),*/ visible: true}
    ]


});
Ext.define('Ung.store.Countries', {
    extend: 'Ext.data.Store',
    storeId: 'countries',
    data: [
        { code: 'AF', name: 'Afghanistan'.t() },
        { code: 'AX', name: 'Aland Islands'.t() },
        { code: 'AL', name: 'Albania'.t() },
        { code: 'DZ', name: 'Algeria'.t() },
        { code: 'AS', name: 'American Samoa'.t() },
        { code: 'AD', name: 'Andorra'.t() },
        { code: 'AO', name: 'Angola'.t() },
        { code: 'AI', name: 'Anguilla'.t() },
        { code: 'AQ', name: 'Antarctica'.t() },
        { code: 'AG', name: 'Antigua and Barbuda'.t() },
        { code: 'AR', name: 'Argentina'.t() },
        { code: 'AM', name: 'Armenia'.t() },
        { code: 'AW', name: 'Aruba'.t() },
        { code: 'AU', name: 'Australia'.t() },
        { code: 'AT', name: 'Austria'.t() },
        { code: 'AZ', name: 'Azerbaijan'.t() },
        { code: 'BS', name: 'Bahamas'.t() },
        { code: 'BH', name: 'Bahrain'.t() },
        { code: 'BD', name: 'Bangladesh'.t() },
        { code: 'BB', name: 'Barbados'.t() },
        { code: 'BY', name: 'Belarus'.t() },
        { code: 'BE', name: 'Belgium'.t() },
        { code: 'BZ', name: 'Belize'.t() },
        { code: 'BJ', name: 'Benin'.t() },
        { code: 'BM', name: 'Bermuda'.t() },
        { code: 'BT', name: 'Bhutan'.t() },
        { code: 'BO', name: 'Bolivia, Plurinational State of'.t() },
        { code: 'BQ', name: 'Bonaire, Sint Eustatius and Saba'.t() },
        { code: 'BA', name: 'Bosnia and Herzegovina'.t() },
        { code: 'BW', name: 'Botswana'.t() },
        { code: 'BV', name: 'Bouvet Island'.t() },
        { code: 'BR', name: 'Brazil'.t() },
        { code: 'IO', name: 'British Indian Ocean Territory'.t() },
        { code: 'BN', name: 'Brunei Darussalam'.t() },
        { code: 'BG', name: 'Bulgaria'.t() },
        { code: 'BF', name: 'Burkina Faso'.t() },
        { code: 'BI', name: 'Burundi'.t() },
        { code: 'KH', name: 'Cambodia'.t() },
        { code: 'CM', name: 'Cameroon'.t() },
        { code: 'CA', name: 'Canada'.t() },
        { code: 'CV', name: 'Cape Verde'.t() },
        { code: 'KY', name: 'Cayman Islands'.t() },
        { code: 'CF', name: 'Central African Republic'.t() },
        { code: 'TD', name: 'Chad'.t() },
        { code: 'CL', name: 'Chile'.t() },
        { code: 'CN', name: 'China'.t() },
        { code: 'CX', name: 'Christmas Island'.t() },
        { code: 'CC', name: 'Cocos (Keeling) Islands'.t() },
        { code: 'CO', name: 'Colombia'.t() },
        { code: 'KM', name: 'Comoros'.t() },
        { code: 'CG', name: 'Congo'.t() },
        { code: 'CD', name: 'Congo, the Democratic Republic of the'.t() },
        { code: 'CK', name: 'Cook Islands'.t() },
        { code: 'CR', name: 'Costa Rica'.t() },
        { code: 'CI', name: 'Cote d\'Ivoire'.t() },
        { code: 'HR', name: 'Croatia'.t() },
        { code: 'CU', name: 'Cuba'.t() },
        { code: 'CW', name: 'Curacao'.t() },
        { code: 'CY', name: 'Cyprus'.t() },
        { code: 'CZ', name: 'Czech Republic'.t() },
        { code: 'DK', name: 'Denmark'.t() },
        { code: 'DJ', name: 'Djibouti'.t() },
        { code: 'DM', name: 'Dominica'.t() },
        { code: 'DO', name: 'Dominican Republic'.t() },
        { code: 'EC', name: 'Ecuador'.t() },
        { code: 'EG', name: 'Egypt'.t() },
        { code: 'SV', name: 'El Salvador'.t() },
        { code: 'GQ', name: 'Equatorial Guinea'.t() },
        { code: 'ER', name: 'Eritrea'.t() },
        { code: 'EE', name: 'Estonia'.t() },
        { code: 'ET', name: 'Ethiopia'.t() },
        { code: 'FK', name: 'Falkland Islands (Malvinas)'.t() },
        { code: 'FO', name: 'Faroe Islands'.t() },
        { code: 'FJ', name: 'Fiji'.t() },
        { code: 'FI', name: 'Finland'.t() },
        { code: 'FR', name: 'France'.t() },
        { code: 'GF', name: 'French Guiana'.t() },
        { code: 'PF', name: 'French Polynesia'.t() },
        { code: 'TF', name: 'French Southern Territories'.t() },
        { code: 'GA', name: 'Gabon'.t() },
        { code: 'GM', name: 'Gambia'.t() },
        { code: 'GE', name: 'Georgia'.t() },
        { code: 'DE', name: 'Germany'.t() },
        { code: 'GH', name: 'Ghana'.t() },
        { code: 'GI', name: 'Gibraltar'.t() },
        { code: 'GR', name: 'Greece'.t() },
        { code: 'GL', name: 'Greenland'.t() },
        { code: 'GD', name: 'Grenada'.t() },
        { code: 'GP', name: 'Guadeloupe'.t() },
        { code: 'GU', name: 'Guam'.t() },
        { code: 'GT', name: 'Guatemala'.t() },
        { code: 'GG', name: 'Guernsey'.t() },
        { code: 'GN', name: 'Guinea'.t() },
        { code: 'GW', name: 'Guinea-Bissau'.t() },
        { code: 'GY', name: 'Guyana'.t() },
        { code: 'HT', name: 'Haiti'.t() },
        { code: 'HM', name: 'Heard Island and McDonald Islands'.t() },
        { code: 'VA', name: 'Holy See (Vatican City State)'.t() },
        { code: 'HN', name: 'Honduras'.t() },
        { code: 'HK', name: 'Hong Kong'.t() },
        { code: 'HU', name: 'Hungary'.t() },
        { code: 'IS', name: 'Iceland'.t() },
        { code: 'IN', name: 'India'.t() },
        { code: 'ID', name: 'Indonesia'.t() },
        { code: 'IR', name: 'Iran, Islamic Republic of'.t() },
        { code: 'IQ', name: 'Iraq'.t() },
        { code: 'IE', name: 'Ireland'.t() },
        { code: 'IM', name: 'Isle of Man'.t() },
        { code: 'IL', name: 'Israel'.t() },
        { code: 'IT', name: 'Italy'.t() },
        { code: 'JM', name: 'Jamaica'.t() },
        { code: 'JP', name: 'Japan'.t() },
        { code: 'JE', name: 'Jersey'.t() },
        { code: 'JO', name: 'Jordan'.t() },
        { code: 'KZ', name: 'Kazakhstan'.t() },
        { code: 'KE', name: 'Kenya'.t() },
        { code: 'KI', name: 'Kiribati'.t() },
        { code: 'KP', name: 'Korea, Democratic People\'s Republic of'.t() },
        { code: 'KR', name: 'Korea, Republic of'.t() },
        { code: 'KW', name: 'Kuwait'.t() },
        { code: 'KG', name: 'Kyrgyzstan'.t() },
        { code: 'LA', name: 'Lao People\'s Democratic Republic'.t() },
        { code: 'LV', name: 'Latvia'.t() },
        { code: 'LB', name: 'Lebanon'.t() },
        { code: 'LS', name: 'Lesotho'.t() },
        { code: 'LR', name: 'Liberia'.t() },
        { code: 'LY', name: 'Libya'.t() },
        { code: 'LI', name: 'Liechtenstein'.t() },
        { code: 'LT', name: 'Lithuania'.t() },
        { code: 'LU', name: 'Luxembourg'.t() },
        { code: 'MO', name: 'Macao'.t() },
        { code: 'MK', name: 'Macedonia, the Former Yugoslav Republic of'.t() },
        { code: 'MG', name: 'Madagascar'.t() },
        { code: 'MW', name: 'Malawi'.t() },
        { code: 'MY', name: 'Malaysia'.t() },
        { code: 'MV', name: 'Maldives'.t() },
        { code: 'ML', name: 'Mali'.t() },
        { code: 'MT', name: 'Malta'.t() },
        { code: 'MH', name: 'Marshall Islands'.t() },
        { code: 'MQ', name: 'Martinique'.t() },
        { code: 'MR', name: 'Mauritania'.t() },
        { code: 'MU', name: 'Mauritius'.t() },
        { code: 'YT', name: 'Mayotte'.t() },
        { code: 'MX', name: 'Mexico'.t() },
        { code: 'FM', name: 'Micronesia, Federated States of'.t() },
        { code: 'MD', name: 'Moldova, Republic of'.t() },
        { code: 'MC', name: 'Monaco'.t() },
        { code: 'MN', name: 'Mongolia'.t() },
        { code: 'ME', name: 'Montenegro'.t() },
        { code: 'MS', name: 'Montserrat'.t() },
        { code: 'MA', name: 'Morocco'.t() },
        { code: 'MZ', name: 'Mozambique'.t() },
        { code: 'MM', name: 'Myanmar'.t() },
        { code: 'NA', name: 'Namibia'.t() },
        { code: 'NR', name: 'Nauru'.t() },
        { code: 'NP', name: 'Nepal'.t() },
        { code: 'NL', name: 'Netherlands'.t() },
        { code: 'NC', name: 'New Caledonia'.t() },
        { code: 'NZ', name: 'New Zealand'.t() },
        { code: 'NI', name: 'Nicaragua'.t() },
        { code: 'NE', name: 'Niger'.t() },
        { code: 'NG', name: 'Nigeria'.t() },
        { code: 'NU', name: 'Niue'.t() },
        { code: 'NF', name: 'Norfolk Island'.t() },
        { code: 'MP', name: 'Northern Mariana Islands'.t() },
        { code: 'NO', name: 'Norway'.t() },
        { code: 'OM', name: 'Oman'.t() },
        { code: 'PK', name: 'Pakistan'.t() },
        { code: 'PW', name: 'Palau'.t() },
        { code: 'PS', name: 'Palestine, State of'.t() },
        { code: 'PA', name: 'Panama'.t() },
        { code: 'PG', name: 'Papua New Guinea'.t() },
        { code: 'PY', name: 'Paraguay'.t() },
        { code: 'PE', name: 'Peru'.t() },
        { code: 'PH', name: 'Philippines'.t() },
        { code: 'PN', name: 'Pitcairn'.t() },
        { code: 'PL', name: 'Poland'.t() },
        { code: 'PT', name: 'Portugal'.t() },
        { code: 'PR', name: 'Puerto Rico'.t() },
        { code: 'QA', name: 'Qatar'.t() },
        { code: 'RE', name: 'Reunion'.t() },
        { code: 'RO', name: 'Romania'.t() },
        { code: 'RU', name: 'Russian Federation'.t() },
        { code: 'RW', name: 'Rwanda'.t() },
        { code: 'BL', name: 'Saint Barthelemy'.t() },
        { code: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha'.t() },
        { code: 'KN', name: 'Saint Kitts and Nevis'.t() },
        { code: 'LC', name: 'Saint Lucia'.t() },
        { code: 'MF', name: 'Saint Martin (French part)'.t() },
        { code: 'PM', name: 'Saint Pierre and Miquelon'.t() },
        { code: 'VC', name: 'Saint Vincent and the Grenadines'.t() },
        { code: 'WS', name: 'Samoa'.t() },
        { code: 'SM', name: 'San Marino'.t() },
        { code: 'ST', name: 'Sao Tome and Principe'.t() },
        { code: 'SA', name: 'Saudi Arabia'.t() },
        { code: 'SN', name: 'Senegal'.t() },
        { code: 'RS', name: 'Serbia'.t() },
        { code: 'SC', name: 'Seychelles'.t() },
        { code: 'SL', name: 'Sierra Leone'.t() },
        { code: 'SG', name: 'Singapore'.t() },
        { code: 'SX', name: 'Sint Maarten (Dutch part)'.t() },
        { code: 'SK', name: 'Slovakia'.t() },
        { code: 'SI', name: 'Slovenia'.t() },
        { code: 'SB', name: 'Solomon Islands'.t() },
        { code: 'SO', name: 'Somalia'.t() },
        { code: 'ZA', name: 'South Africa'.t() },
        { code: 'GS', name: 'South Georgia and the South Sandwich Islands'.t() },
        { code: 'SS', name: 'South Sudan'.t() },
        { code: 'ES', name: 'Spain'.t() },
        { code: 'LK', name: 'Sri Lanka'.t() },
        { code: 'SD', name: 'Sudan'.t() },
        { code: 'SR', name: 'Suriname'.t() },
        { code: 'SJ', name: 'Svalbard and Jan Mayen'.t() },
        { code: 'SZ', name: 'Swaziland'.t() },
        { code: 'SE', name: 'Sweden'.t() },
        { code: 'CH', name: 'Switzerland'.t() },
        { code: 'SY', name: 'Syrian Arab Republic'.t() },
        { code: 'TW', name: 'Taiwan, Province of China'.t() },
        { code: 'TJ', name: 'Tajikistan'.t() },
        { code: 'TZ', name: 'Tanzania, United Republic of'.t() },
        { code: 'TH', name: 'Thailand'.t() },
        { code: 'TL', name: 'Timor-Leste'.t() },
        { code: 'TG', name: 'Togo'.t() },
        { code: 'TK', name: 'Tokelau'.t() },
        { code: 'TO', name: 'Tonga'.t() },
        { code: 'TT', name: 'Trinidad and Tobago'.t() },
        { code: 'TN', name: 'Tunisia'.t() },
        { code: 'TR', name: 'Turkey'.t() },
        { code: 'TM', name: 'Turkmenistan'.t() },
        { code: 'TC', name: 'Turks and Caicos Islands'.t() },
        { code: 'TV', name: 'Tuvalu'.t() },
        { code: 'UG', name: 'Uganda'.t() },
        { code: 'UA', name: 'Ukraine'.t() },
        { code: 'AE', name: 'United Arab Emirates'.t() },
        { code: 'GB', name: 'United Kingdom'.t() },
        { code: 'US', name: 'United States'.t() },
        { code: 'UM', name: 'United States Minor Outlying Islands'.t() },
        { code: 'UY', name: 'Uruguay'.t() },
        { code: 'UZ', name: 'Uzbekistan'.t() },
        { code: 'VU', name: 'Vanuatu'.t() },
        { code: 'VE', name: 'Venezuela, Bolivarian Republic of'.t() },
        { code: 'VN', name: 'Viet Nam'.t() },
        { code: 'VG', name: 'Virgin Islands, British'.t() },
        { code: 'VI', name: 'Virgin Islands, U.S.'.t() },
        { code: 'WF', name: 'Wallis and Futuna'.t() },
        { code: 'EH', name: 'Western Sahara'.t() },
        { code: 'YE', name: 'Yemen'.t() },
        { code: 'ZM', name: 'Zambia'.t() },
        { code: 'ZW', name: 'Zimbabwe'.t() }
    ]
});
Ext.define('Ung.chart.TimeChartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.timechart',

    control: {
        '#': {
            resize: 'onResize'
        }
    },

    styles: {
        'LINE': { styleType: 'spline' },
        'AREA': { styleType: 'areaspline' },
        'AREA_STACKED': {styleType: 'areaspline', stacking: true },
        'BAR': {styleType: 'column', grouping: true },
        'BAR_OVERLAPPED': {styleType: 'column', overlapped: true },
        'BAR_STACKED': {styleType: 'column', stacking: true }
    },
    init: function () {
        this.defaultColors = ['#00b000', '#3030ff', '#009090', '#00ffff', '#707070', '#b000b0', '#fff000', '#b00000', '#ff0000', '#ff6347', '#c0c0c0'];
    },
    setChartType: function (timeStyle) {
        var type = 'areaspline';
        switch (timeStyle) {
        case 'LINE':
            type = 'spline';
            break;
        case 'AREA':
        case 'AREA_STACKED':
            type = 'areaspline';
            break;
        case 'BAR':
        case 'BAR_3D':
        case 'BAR_OVERLAPPED':
        case 'BAR_3D_OVERLAPPED':
        case 'BAR_STACKED':
            type = 'column';
            break;
        default:
            type = 'areaspline';
        }
        return type;
    },

    onAfterRender: function (view) {
        var me = this;
        this.entry = view.getViewModel().get('entry') || this.getView().getEntry();

        this.chart = new Highcharts.StockChart({
            chart: {
                type: me.setChartType(me.entry.get('timeStyle')),
                zoomType: 'x',
                renderTo: view.lookupReference('timechart').getEl().dom,
                //marginBottom: !forDashboard ? 40 : 50,
                marginTop: 10,
                //marginRight: 0,
                //marginLeft: 0,
                padding: [0, 0, 0, 0],
                backgroundColor: 'transparent',
                animation: false,
                style: {
                    fontFamily: 'Source Sans Pro',
                    fontSize: '12px'
                }
            },
            title: null,
            noData: {
                style: {
                    fontSize: '16px',
                    fontWeight: 'normal',
                    color: '#999'
                }
            },
            colors: (me.entry.get('colors') !== null && me.entry.get('colors') > 0) ? me.entry.get('colors') : me.defaultColors,
            navigator: {
                enabled: false
            },
            rangeSelector : {
                enabled: false,
                inputEnabled: false
            },
            scrollbar: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            xAxis: [{
                type: 'datetime',
                alternateGridColor: 'rgba(220, 220, 220, 0.1)',
                crosshair: {
                    width: 1,
                    dashStyle: 'ShortDot',
                    color: 'rgba(100, 100, 100, 0.3)'
                },
                lineColor: '#C0D0E0',
                lineWidth: 1,
                tickLength: 3,
                gridLineWidth: 1,
                gridLineDashStyle: 'dash',
                gridLineColor: '#EEE',
                labels: {
                    style: {
                        fontFamily: 'Source Sans Pro',
                        color: '#555',
                        fontSize: '11px',
                        fontWeight: 600
                    },
                    y: 12
                },
                maxPadding: 0,
                minPadding: 0
            }],
            yAxis: {
                allowDecimals: true,
                min: 0,
                minRange: me.entry.get('units') === 'percent' ? 100 : 0.4,
                maxRange: me.entry.get('units') === 'percent' ? 100 : undefined,
                lineColor: '#C0D0E0',
                lineWidth: 1,
                gridLineWidth: 1,
                gridLineDashStyle: 'dash',
                gridLineColor: '#EEE',
                //tickPixelInterval: 50,
                tickLength: 5,
                tickWidth: 1,
                //tickPosition: 'inside',
                showFirstLabel: false,
                showLastLabel: true,
                endOnTick: me.entry.get('units') !== 'percent',
                tickInterval: me.entry.get('units') === 'percent' ? 20 : undefined,
                maxPadding: 0,
                opposite: false,
                labels: {
                    align: 'right',
                    useHTML: true,
                    padding: 0,
                    style: {
                        fontFamily: 'Source Sans Pro',
                        color: '#555',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: 'rgba(255, 255, 255, 0.6)',
                        padding: '0 1px',
                        borderRadius: '2px',
                        //textShadow: '1px 1px 1px #000'
                        lineHeight: '11px'
                    },
                    x: -10,
                    y: 5,
                    formatter: function() {
                        var finalVal = this.value;

                        if (me.entry.get('units') === 'bytes/s') {
                            finalVal = Ung.Util.bytesToHumanReadable(this.value, true);
                            /*
                            if (this.isLast) {
                                return '<span style="color: #555; font-size: 12px;"><strong>' + finalVal + '</strong> (per second)</span>';
                            }
                            */
                        } else {
                            /*
                            if (this.isLast) {
                                return '<span style="color: #555; font-size: 12px;"><strong>' + this.value + '</strong> (' + entry.get('units') + ')</span>';
                            }
                            */
                        }
                        return finalVal;
                    }
                },
                title: {
                    align: 'high',
                    offset: -10,
                    y: 3,
                    //rotation: 0,
                    //text: entry.units,
                    text: me.entry.get('units'),
                    //textAlign: 'left',
                    style: {
                        fontFamily: 'Source Sans Pro',
                        color: '#555',
                        fontSize: '10px',
                        fontWeight: 600
                    }
                }
            },
            legend: {
                enabled: true,
                padding: 5,
                margin: 0,
                y: 10,
                lineHeight: 12,
                itemDistance: 10,
                itemStyle: {
                    fontFamily: 'Source Sans Pro',
                    color: '#555',
                    fontSize: '12px',
                    fontWeight: 600
                },
                symbolHeight: 7,
                symbolWidth: 7,
                symbolRadius: 3
            },
            tooltip: {
                shared: true,
                animation: true,
                followPointer: true,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                style: {
                    textAlign: 'right',
                    fontFamily: 'Source Sans Pro',
                    padding: '5px',
                    fontSize: '10px',
                    marginBottom: '40px'
                },
                //useHTML: true,
                hideDelay: 0,
                shadow: false,
                headerFormat: '<span style="font-size: 11px; line-height: 1.5; font-weight: bold;">{point.key}</span><br/>',
                pointFormatter: function () {
                    var str = '<span>' + this.series.name + '</span>';
                    if (me.entry.get('units') === 'bytes' || me.entry.get('units') === 'bytes/s') {
                        str += ': <span style="color: ' + this.color + '; font-weight: bold;">' + this.y + '</span>';
                    } else {
                        str += ': <spanstyle="color: ' + this.color + '; font-weight: bold;">' + this.y + '</span> ' + me.entry.get('units');
                    }
                    return str + '<br/>';
                }

            },
            plotOptions: {
                column: {
                    edgeWidth: 0,
                    borderWidth: 0,
                    pointPadding: 0,
                    groupPadding: 0.2,
                    dataGrouping: {
                        groupPixelWidth: 40
                    },
                    pointPlacement: 'on',
                    dataLabels: {
                        enabled: false,
                        align: 'left',
                        rotation: -45,
                        x: 0,
                        y: -2,
                        style: {
                            fontSize: '9px',
                            color: '#999',
                            textShadow: false
                        }
                    }
                },
                areaspline: {
                    lineWidth: 0
                },
                spline: {
                    lineWidth: 2,
                    softThreshold: false
                },
                series: {
                    animation: false,
                    marker: {
                        enabled: true,
                        radius: 0,
                        states: {
                            hover: {
                                enabled: true,
                                lineWidthPlus: 2,
                                radius: 4,
                                radiusPlus: 2
                            }
                        }
                    },
                    states: {
                        hover: {
                            enabled: true,
                            lineWidthPlus: 0,
                            halo: {
                                size: 2
                            }
                        }
                    }
                }
            }
        });
    },

    onResize: function () {
        this.chart.reflow();
    },

    onSetSeries: function (data) {
        //var newData = [], me = this;
        var me = this, newData = [], i, j, _column,
            timeDataColumns = Ext.clone(this.entry.get('timeDataColumns')),
            style = this.entry.get('timeStyle'),
            colors = this.entry.get('colors') || this.defaultColors;

            /*
            timeDataColumns = Ext.clone(me.getViewModel().get('entry.timeDataColumns')),
            style = me.getViewModel().get('entry.timeStyle'),
            colors = me.getViewModel().get('entry.colors') || this.defaultColors;
            */

        this.getView().lookupReference('loader').hide(); // hide chart loader


        if (!timeDataColumns) {
            timeDataColumns = [];
            for (j = 0; j < data.length; j += 1) {
                for (_column in data[j]) {
                    if (data[j].hasOwnProperty(_column) && _column !== 'time_trunc' && _column !== 'time' && timeDataColumns.indexOf(_column) < 0) {
                        timeDataColumns.push(_column);
                    }
                }
            }
        } else {
            for (i = 0; i < timeDataColumns.length; i += 1) {
                timeDataColumns[i] = timeDataColumns[i].split(' ').splice(-1)[0];
            }
        }

        for (i = 0; i < timeDataColumns.length; i += 1) {
            newData = [];
            for (j = 0; j < data.length; j += 1) {
                newData.push([
                    data[j].time_trunc.time,
                    data[j][timeDataColumns[i]] || 0
                ]);
            }
            if (this.chart.get('series-' + timeDataColumns[i])) {
                this.chart.get('series-' + timeDataColumns[i]).update({
                    data: newData,
                    type: me.styles[style].styleType,
                    color: colors[i] || undefined,
                    fillOpacity: (style === 'AREA_STACKED' || style === 'BAR_STACKED') ? 1 : 0.5,
                    grouping: me.styles[style].grouping || false,
                    stacking: me.styles[style].stacking || undefined,
                    pointPadding: me.styles[style].overlapped ? (timeDataColumns.length <= 3 ? 0.10 : 0.075) * i : 0.1,
                    visible: !(timeDataColumns[i] === 'total' && me.styles[style].stacking)
                });
            } else {
                this.chart.addSeries({
                    id: 'series-' + timeDataColumns[i],
                    name: timeDataColumns[i],
                    data: newData,
                    type: me.styles[style].styleType,
                    color: colors[i] || undefined,
                    fillOpacity: (style === 'AREA_STACKED' || style === 'BAR_STACKED') ? 1 : 0.5,
                    grouping: me.styles[style].grouping || false,
                    stacking: me.styles[style].stacking || undefined,
                    pointPlacement: 0,
                    pointPadding: me.styles[style].overlapped ? (timeDataColumns.length <= 3 ? 0.12 : 0.075) * (i + 1) : 0.1,
                    visible: !(timeDataColumns[i] === 'total' && me.styles[style].stacking)
                }, false, false);
            }
        }
        this.chart.redraw();

    },

    onSetStyle: function () {
        var me = this,
            style = me.getViewModel().get('entry.timeStyle'),
            colors = me.getViewModel().get('entry.colors') || this.defaultColors;
        if (this.chart) {
            var seriesLength = this.chart.series.length;
            this.chart.series.forEach( function (series, idx) {
                series.update({
                    type: me.styles[style].styleType,
                    color: colors[idx] || undefined,
                    fillOpacity: (style === 'AREA_STACKED' || style === 'BAR_STACKED') ? 1 : 0.5,
                    grouping: me.styles[style].grouping || false,
                    stacking: me.styles[style].stacking || undefined,
                    pointPadding: me.styles[style].overlapped ? (seriesLength <= 3 ? 0.15 : 0.075) * idx : 0.1,
                    visible: !(series.name === 'total' && me.styles[style].stacking)
                });
            });
        }
    },

    onBeginFetchData: function() {
        this.getView().lookupReference('loader').show();
    }

});
Ext.define('Ung.chart.TimeChart', {
    extend: 'Ext.container.Container',
    alias: 'widget.timechart',
    requires: [
        'Ung.chart.TimeChartController'
    ],

    controller: 'timechart',
    viewModel: true,

    config: {
        widget: null,
        entry: null
    },

    listeners: {
        afterrender: 'onAfterRender',
        resize: 'onResize',
        setseries: 'onSetSeries',
        //setstyle: 'onSetStyle',
        //setcolors: 'onSetColors',
        beginfetchdata: 'onBeginFetchData'
    },

    items: [{
        xtype: 'component',
        reference: 'timechart',
        cls: 'chart'
    }, {
        xtype: 'component',
        reference: 'loader',
        cls: 'loader',
        hideMode: 'visibility',
        html: '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'
    }]
});
Ext.define('Ung.chart.PieChartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.piechart',
    styles: {
        'LINE': { styleType: 'spline' },
        'AREA': { styleType: 'areaspline' },
        'AREA_STACKED': {styleType: 'areaspline', stacking: true },
        'BAR': {styleType: 'column', grouping: true },
        'BAR_OVERLAPPED': {styleType: 'column', overlapped: true },
        'BAR_STACKED': {styleType: 'column', stacking: true }
    },
    init: function () {
        this.defaultColors = ['#00b000', '#3030ff', '#009090', '#00ffff', '#707070', '#b000b0', '#fff000', '#b00000', '#ff0000', '#ff6347', '#c0c0c0'];
    },

    onAfterRender: function (view) {
        var me = this;
        //console.log(cmp.viewModel.get('timeStyle'));
        this.entry = view.getViewModel().get('entry') || this.getView().getEntry();

        this.chart =  new Highcharts.Chart({
            chart: {
                type: me.entry.get('pieStyle').indexOf('COLUMN') >= 0 ? 'column' : 'pie',
                renderTo: view.lookupReference('piechart').getEl().dom,
                //margin: (entry.chartType === 'pie' && !forDashboard) ? [80, 20, 50, 20] : undefined,
                marginTop: 10,
                marginRight: 0,
                marginLeft: 0,
                //spacing: [10, 10, 20, 10],
                backgroundColor: 'transparent',
                style: {
                    fontFamily: 'Source Sans Pro', // default font
                    fontSize: '12px'
                },
                options3d: {
                    enabled: false,
                    alpha: 45,
                    beta: 5
                }
            },
            title: null,
            lang: {
                noData: 'No data available yet!',
                drillUpText: '< ' + 'Back'
            },
            noData: {
                style: {
                    fontSize: '16px',
                    fontWeight: 'normal',
                    color: '#999'
                }
            },
            colors: (me.entry.get('colors') !== null && me.entry.get('colors') > 0) ? me.entry.get('colors') : this.defaultColors,
            credits: {
                enabled: false
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            /*
            exporting: {
                chartOptions: {
                    title: {
                        text: entry.category + ' - ' + entry.title,
                        style: {
                            fontSize: '12px'
                        }
                    }
                },
                type: 'image/jpeg'
            },
            */
            xAxis: {
                type: 'category',
                crosshair: true,
                alternateGridColor: 'rgba(220, 220, 220, 0.1)',
                labels: {
                    style: {
                        fontSize: '11px'
                    }
                },
                lineColor: '#C0D0E0',
                lineWidth: 1,
                tickLength: 3,
                gridLineWidth: 1,
                gridLineDashStyle: 'dash',
                gridLineColor: '#EEE',
                /*
                title: {
                    align: 'middle',
                    text: 'some name',
                    style: {
                        //fontSize: !forDashboard ? '14px' : '12px',
                        fontWeight: 'bold'
                    }
                },
                */
                maxPadding: 0,
                minPadding: 0
            },
            yAxis: {
                lineColor: '#C0D0E0',
                lineWidth: 1,
                gridLineWidth: 1,
                gridLineDashStyle: 'dash',
                gridLineColor: '#EEE',
                tickLength: 5,
                tickWidth: 1,
                tickPosition: 'inside',
                showFirstLabel: false,
                showLastLabel: true,
                endOnTick: true,
                labels: {
                    align: 'left',
                    useHTML: true,
                    padding: 0,
                    style: {
                        fontFamily: 'Source Sans Pro',
                        color: '#555',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: 'rgba(255, 255, 255, 0.6)',
                        padding: '0 1px',
                        borderRadius: '2px',
                        //textShadow: '1px 1px 1px #000'
                        lineHeight: '11px'
                    },
                    x: 9,
                    y: 6,
                    formatter: function() {
                        if (this.isLast) {
                            return '<span style="color: #555; font-size: 12px;"><strong>' + this.value + '</strong> (' + me.entry.get('units') + ')</span>';
                        }
                        return this.value;
                    }
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size: 14px; font-weight: bold;">aaa : {point.key}</span><br/>',
                hideDelay: 0
                //pointFormat: '{series.name}: <b>{point.y}</b>' + (entry.pieStyle.indexOf('COLUMN') < 0 ? ' ({point.percentage:.1f}%)' : '')
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    center: ['50%', '50%'],
                    showInLegend: true,
                    colorByPoint: true,
                    //depth: 0,
                    minSize: 150,
                    borderWidth: 1,
                    borderColor: '#EEE',
                    dataLabels: {
                        enabled: true,
                        distance: 5,
                        padding: 0,
                        reserveSpace: false,
                        style: {
                            fontSize: '11px',
                            color: '#777',
                            fontFamily: 'Source Sans Pro',
                            fontWeight: 400
                        },
                        formatter: function () {
                            if (this.point.percentage < 3) {
                                return null;
                            }
                            if (this.point.name.length > 25) {
                                return this.point.name.substring(0, 25) + '...';
                            }
                            return this.point.name;
                        }
                        //color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#555'
                    }
                },
                column: {
                    borderWidth: 0,
                    colorByPoint: true,
                    depth: 25,
                    dataLabels: {
                        enabled: false,
                        align: 'center'
                    }
                },
                series: {
                    animation: false
                }
            },
            legend: {
                enabled: false,
                backgroundColor: '#EEE',
                borderRadius: 3,
                padding: 15,
                style: {
                    overflow: 'hidden'
                },
                title: {
                    text: 'aaa',
                    style: {
                        fontSize: '14px'
                    }
                },
                itemStyle: {
                    fontSize: '11px',
                    width: '120px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                },
                //itemWidth: 120,
                useHTML: true,
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                symbolHeight: 8,
                symbolWidth: 8,
                symbolRadius: 4
            }
        });

    },

    onResize: function () {
        this.chart.reflow();
    },

    onSetSeries: function (data) {
        this.getView().lookupReference('loader').hide();

        while(this.chart.series.length > 0) {
            this.chart.series[0].remove(true);
        }

        //var entry = this.getViewModel().get('entry');
        var _mainData = [], _otherCumulateVal = 0, i;

        for (i = 0; i < data.length; i += 1) {
            if (i < this.entry.get('pieNumSlices')) {
                _mainData.push({
                    name: data[i][this.entry.get('pieGroupColumn')] !== undefined ? data[i][this.entry.get('pieGroupColumn')] : 'None',
                    y: data[i].value
                });
            } else {
                _otherCumulateVal += data[i].value;
            }
        }

        if (_otherCumulateVal > 0) {
            _mainData.push({
                name: 'Other',
                color: '#DDD',
                y: _otherCumulateVal
            });
        }

        //this.chart.series[0].setData(_mainData, true, true);
        this.chart.addSeries({
            name: 'aaa',
            type: this.entry.get('pieStyle').indexOf('COLUMN') >= 0 ? 'column' : 'pie',
            colors: this.entry.get('colors') || this.defaultColors,
            innerSize: this.entry.get('pieStyle').indexOf('DONUT') >= 0 ? '50%' : 0,
            data: _mainData
        }, true, true);
    },

    onSetStyle: function () {
        var me = this,
            style = me.getViewModel().get('entry.pieStyle'),
            colors = me.getViewModel().get('entry.colors') || this.defaultColors;
        if (this.chart) {
            this.chart.series[0].update({
                type: style.indexOf('COLUMN') >= 0 ? 'column' : 'pie',
                colors: colors,
                innerSize: style.indexOf('DONUT') >= 0 ? '50%' : 0
            });
        }
    },

    onBeginFetchData: function() {
        this.getView().lookupReference('loader').show();
    }

});
Ext.define('Ung.chart.PieChart', {
    extend: 'Ext.container.Container',
    alias: 'widget.piechart',
    requires: [
        'Ung.chart.PieChartController'
    ],

    controller: 'piechart',
    viewModel: true,

    config: {
        widget: null,
        entry: null
    },

    listeners: {
        afterrender: 'onAfterRender',
        resize: 'onResize',
        setseries: 'onSetSeries',
        //setstyle: 'onSetStyle',
        beginfetchdata: 'onBeginFetchData'
    },

    items: [{
        xtype: 'component',
        reference: 'piechart',
        cls: 'chart'
    }, {
        xtype: 'component',
        reference: 'loader',
        cls: 'loader',
        hideMode: 'visibility',
        html: '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'
    }]
});
Ext.define('Ung.chart.EventChartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.eventchart',

    control: {
        '#': { setdata: 'onSetData', beginfetchdata: 'onBeforeData' }
    },

    onBeforeData: function () {
        this.getView().setLoading('Querying Database...'.t());
    },

    onSetData: function (data) {
        this.getView().setLoading(false);
        this.getViewModel().set('customData', data);
        //console.log(data);
    }
});
Ext.define('Ung.util.TableConfig', {
    alternateClassName: 'Ung.TableConfig',
    singleton: true,

    columnWidth: {
        hostname: 120,
        ip: 100,
        port: 70,
        timestamp: 135,
        username: 120
    },

    table: {
        sessions: ['session_id', 'time_stamp', 'end_time', 'bypassed', 'entitled', 'protocol', 'icmp_type', 'hostname', 'username', 'policy_id', 'policy_rule_id', 'c_client_addr', 'c_client_port', 'c_server_addr', 'c_server_port', 's_client_addr', 's_client_port', 's_server_addr', 's_server_port', 'client_intf', 'server_intf', 'client_country', 'client_latitude', 'client_longitude', 'server_country', 'server_latitude', 'server_longitude', "c2p_bytes", "p2c_bytes", "s2p_bytes", "p2s_bytes", 'filter_prefix', 'firewall_blocked', 'firewall_flagged', 'firewall_rule_index', 'application_control_lite_blocked', 'application_control_lite_protocol', 'captive_portal_rule_index', 'captive_portal_blocked', 'application_control_application', 'application_control_protochain', 'application_control_category', 'application_control_flagged', 'application_control_blocked', 'application_control_confidence', 'application_control_detail', 'application_control_ruleid', 'bandwidth_control_priority', 'bandwidth_control_rule', 'ssl_inspector_status', 'ssl_inspector_detail', 'ssl_inspector_ruleid'],
        session_minutes: ['session_id', 'time_stamp', 'end_time', 'bypassed', 'entitled', 'protocol', 'icmp_type', 'hostname', 'username', 'policy_id', 'policy_rule_id', 'c_client_addr', 'c_client_port', 'c_server_addr', 'c_server_port', 's_client_addr', 's_client_port', 's_server_addr', 's_server_port', 'client_intf', 'server_intf', 'client_country', 'client_latitude', 'client_longitude', 'server_country', 'server_latitude', 'server_longitude', "c2p_bytes", "p2c_bytes", "s2p_bytes", "p2s_bytes", 'filter_prefix', 'firewall_blocked', 'firewall_flagged', 'firewall_rule_index', 'application_control_lite_blocked', 'application_control_lite_protocol', 'captive_portal_rule_index', 'captive_portal_blocked', 'application_control_application', 'application_control_protochain', 'application_control_category', 'application_control_flagged', 'application_control_blocked', 'application_control_confidence', 'application_control_detail', 'application_control_ruleid', 'bandwidth_control_priority', 'bandwidth_control_rule', 'ssl_inspector_status', 'ssl_inspector_detail', 'ssl_inspector_ruleid'],
        http_events: ['request_id', 'policy_id', 'time_stamp', 'session_id', 'client_intf', 'server_intf', 'c_client_addr', 'c_client_port', 'c_server_addr', 'c_server_port', 's_client_addr', 's_client_port', 's_server_addr', 's_server_port', 'username', 'hostname', 'method', 'domain', 'host', 'uri', 'referer', 'c2s_content_length', 's2c_content_length', 's2c_content_type', 'web_filter_lite_blocked', 'web_filter_blocked', 'web_filter_lite_flagged', 'web_filter_flagged', 'web_filter_lite_category', 'web_filter_category', 'web_filter_lite_reason', 'web_filter_reason', 'ad_blocker_action', 'ad_blocker_cookie_ident', 'virus_blocker_clean', 'virus_blocker_name', 'virus_blocker_lite_clean', 'virus_blocker_lite_name']
    },

    getColumns: function () {
        return {
            c_client_port: {
                header: 'Client Port'.t(),
                width: this.columnWidth.port,
                renderer: function (value) { return Ung.TableConfig.protocols[value] || value; }
            },
            hostname: {
                header: 'Hostname'.t(),
                width: this.columnWidth.hostname
            },
            protocol: {
                header: 'Protocol'.t(),
                width: this.columnWidth.port,
                renderer: function (value) { return Ung.TableConfig.protocols[value] || value; }
            },
            s_server_addr: {
                header: 'Server'.t(),
                width: this.columnWidth.ip
            },
            s_server_port: {
                header: 'Server Port'.t(),
                width: this.columnWidth.port
            },
            session_id: {
                header: 'Session Id'.t()
            },
            time_stamp: {
                header: 'Timestamp'.t(),
                width: this.columnWidth.timestamp,
                renderer: function (value) {
                    var date = new Date(value.time);
                    return Ext.Date.format(date, 'M d, H:i:s.u');
                }
            },
            username: {
                header: 'Username'.t(),
                width: this.columnWidth.username
            }
        };
    },

    protocols: {
        0: 'HOPOPT (0)',
        1: 'ICMP (1)',
        2: 'IGMP (2)',
        3: 'GGP (3)',
        4: 'IP-in-IP (4)',
        5: 'ST (5)',
        6: 'TCP (6)',
        7: 'CBT (7)',
        8: 'EGP (8)',
        9: 'IGP (9)',
        10: 'BBN-RCC-MON (10)',
        11: 'NVP-II (11)',
        12: 'PUP (12)',
        13: 'ARGUS (13)',
        14: 'EMCON (14)',
        15: 'XNET (15)',
        16: 'CHAOS (16)',
        17: 'UDP (17)',
        18: 'MUX (18)',
        19: 'DCN-MEAS (19)',
        20: 'HMP (20)',
        21: 'PRM (21)',
        22: 'XNS-IDP (22)',
        23: 'TRUNK-1 (23)',
        24: 'TRUNK-2 (24)',
        25: 'LEAF-1 (25)',
        26: 'LEAF-2 (26)',
        27: 'RDP (27)',
        28: 'IRTP (28)',
        29: 'ISO-TP4 (29)',
        30: 'NETBLT (30)',
        31: 'MFE-NSP (31)',
        32: 'MERIT-INP (32)',
        33: 'DCCP (33)',
        34: '3PC (34)',
        35: 'IDPR (35)',
        36: 'XTP (36)',
        37: 'DDP (37)',
        38: 'IDPR-CMTP (38)',
        39: 'TP++ (39)',
        40: 'IL (40)',
        41: 'IPv6 (41)',
        42: 'SDRP (42)',
        43: 'IPv6-Route (43)',
        44: 'IPv6-Frag (44)',
        45: 'IDRP (45)',
        46: 'RSVP (46)',
        47: 'GRE (47)',
        48: 'MHRP (48)',
        49: 'BNA (49)',
        50: 'ESP (50)',
        51: 'AH (51)',
        52: 'I-NLSP (52)',
        53: 'SWIPE (53)',
        54: 'NARP (54)',
        55: 'MOBILE (55)',
        56: 'TLSP (56)',
        57: 'SKIP (57)',
        58: 'IPv6-ICMP (58)',
        59: 'IPv6-NoNxt (59)',
        60: 'IPv6-Opts (60)',
        62: 'CFTP (62)',
        64: 'SAT-EXPAK (64)',
        65: 'KRYPTOLAN (65)',
        66: 'RVD (66)',
        67: 'IPPC (67)',
        69: 'SAT-MON (69)',
        70: 'VISA (70)',
        71: 'IPCU (71)',
        72: 'CPNX (72)',
        73: 'CPHB (73)',
        74: 'WSN (74)',
        75: 'PVP (75)',
        76: 'BR-SAT-MON (76)',
        77: 'SUN-ND (77)',
        78: 'WB-MON (78)',
        79: 'WB-EXPAK (79)',
        80: 'ISO-IP (80)',
        81: 'VMTP (81)',
        82: 'SECURE-VMTP (82)',
        83: 'VINES (83)',
        84: 'TTP (84)',
        85: 'NSFNET-IGP (85)',
        86: 'DGP (86)',
        87: 'TCF (87)',
        88: 'EIGRP (88)',
        89: 'OSPF (89)',
        90: 'Sprite-RPC (90)',
        91: 'LARP (91)',
        92: 'MTP (92)',
        93: 'AX.25 (93)',
        94: 'IPIP (94)',
        95: 'MICP (95)',
        96: 'SCC-SP (96)',
        97: 'ETHERIP (97)',
        98: 'ENCAP (98)',
        100: 'GMTP (100)',
        101: 'IFMP (101)',
        102: 'PNNI (102)',
        103: 'PIM (103)',
        104: 'ARIS (104)',
        105: 'SCPS (105)',
        106: 'QNX (106)',
        107: 'A/N (107)',
        108: 'IPComp (108)',
        109: 'SNP (109)',
        110: 'Compaq-Peer (110)',
        111: 'IPX-in-IP (111)',
        112: 'VRRP (112)',
        113: 'PGM (113)',
        115: 'L2TP (115)',
        116: 'DDX (116)',
        117: 'IATP (117)',
        118: 'STP (118)',
        119: 'SRP (119)',
        120: 'UTI (120)',
        121: 'SMP (121)',
        122: 'SM (122)',
        123: 'PTP (123)',
        124: 'IS-IS (124)',
        125: 'FIRE (125)',
        126: 'CRTP (126)',
        127: 'CRUDP (127)',
        128: 'SSCOPMCE (128)',
        129: 'IPLT (129)',
        130: 'SPS (130)',
        131: 'PIPE (131)',
        132: 'SCTP (132)',
        133: 'FC (133)',
        134: 'RSVP-E2E-IGNORE (134)',
        135: 'Mobility (135)',
        136: 'UDPLite (136)',
        137: 'MPLS-in-IP (137)',
        138: 'manet (138)',
        139: 'HIP (139)',
        140: 'Shim6 (140)',
        141: 'WESP (141)',
        142: 'ROHC (142)'
    }
});
Ext.define('Ung.chart.EventChart', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.eventchart',
    requires: [
        'Ung.chart.EventChartController',
        'Ung.util.TableConfig'
    ],

    controller: 'eventchart',
    viewModel: {
        stores: {
            store: {
                data: '{customData}'
            }
        }
    },

    plugins: 'gridfilters',

    config: {
        entry: null
    },

    bind: {
        store: '{store}'
    },

    border: false,

    initComponent: function () {
        var me = this,
            col, columns = [],
            columnsConfig = Ung.TableConfig.getColumns();

        Ung.TableConfig.table[me.getEntry().get('table')].forEach(function (column) {
            // add columns from TableConfig and apply dataIndex
            col = columnsConfig[column] || { header: column };
            Ext.apply(col, {
                dataIndex: column,
                hidden: !Ext.Array.contains(me.getEntry().get('defaultColumns'), column)
            });
            columns.push(col);
        });

        // me.getEntry().get('defaultColumns')

        //var filterFeature = Ext.create('Ung.chart.EventFilter', {});


        Ext.apply(this, {
            columns: columns
        });
        this.callParent(arguments);

        //this.getStore().addFilter(filterFeature.globalFilter);
    }

});
Ext.define('Ung.widget.report.Report', {
    extend: 'Ext.container.Container',
    alias: 'widget.reportwidget',
    requires: [
        'Ung.widget.report.ReportController',
        'Ung.widget.report.ReportModel',
        //'Ung.view.widget.editor.TimeWidget',
        //'Ung.view.widget.editor.PieWidget',
        'Ung.chart.TimeChart',
        'Ung.chart.PieChart',
        'Ung.chart.EventChart'
        //'Ung.model.Widget'
    ],

    controller: 'reportwidget',
    viewModel: {
        type: 'reportwidget'
    },

    config: {
        widget: null,
        entry: null
    },

    bind: {
        hidden: '{!widget.enabled}'
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    border: false,
    baseCls: 'widget',

    items: [{
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'top'
        },
        cls: 'header',
        style: {
            height: '50px'
        },
        items: [{
            xtype: 'component',
            flex: 1,
            bind: {
                html: '{title}'
            }
        }, {
            xtype: 'container',
            margin: '10 5 0 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [/*{
                xtype: 'button',
                baseCls: 'action',
                text: '<i class="material-icons">settings_ethernet</i>',
                listeners: {
                    click: 'resizeWidget'
                }
            }, {
                xtype: 'button',
                baseCls: 'action',
                text: '<i class="material-icons">settings</i>',
                listeners: {
                    click: 'showEditor'
                }
            },*/ {
                xtype: 'button',
                baseCls: 'action',
                text: '<i class="material-icons">refresh</i>',
                listeners: {
                    click: 'fetchData'
                }
            }, {
                xtype: 'button',
                baseCls: 'action',
                text: '<i class="material-icons">call_made</i>',
                bind: {
                    href: '#reports/{widget.entryId}'
                },
                hrefTarget: '_self'
            }]
        }]
    }],

    listeners: {
        afterrender: 'fetchData',
        fetchdata: 'fetchData'
        //resize: 'resize'
    }

});
/**
 * Dashboard view which holds the widgets and manager
 */
Ext.define('Ung.view.dashboard.Dashboard', {
    extend: 'Ext.container.Container',
    xtype: 'ung.dashboard',

    requires: [
        'Ung.view.dashboard.DashboardController',
        'Ung.widget.report.Report',
        'Ung.view.grid.ActionColumn'
    ],

    controller: 'dashboard',
    viewModel: true,
    //viewModel: 'dashboard',

    config: {
        settings: null // the dashboard settings object
    },

    layout: 'border',
    defaults: {
        border: false
    },
    items: [{
        region: 'north',
        border: false,
        height: 44,
        itemId: 'apps-topnav',
        bodyStyle: {
            background: '#555',
            padding: '0 5px'
        },
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        items: [{
            xtype: 'button',
            itemId: 'policies-menu',
            hidden: true,
            style: {
                marginRight: '5px'
            }
        }, {
            xtype: 'button',
            html: Ung.Util.iconTitle('Manage Widgets', 'settings-16'),
            handler: 'managerHandler'
        }]
    }, {
        //baseCls: 'dashboard-manager',
        title: 'Manage Widgets'.t(),
        collapsible: true,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        region: 'west',
        //border: false,
        shadow: false,
        animCollapse: false,
        bind: {
            collapsed: '{!managerOpen}'
        },
        collapsed: false,
        titleCollapse: true,
        floatable: false,
        cls: 'widget-manager',
        //split: true,
        items: [{
            xtype: 'grid',
            reference: 'dashboardNav',
            forceFit: true,
            flex: 1,
            width: 300,
            border: false,
            header: false,
            hideHeaders: true,
            //disableSelection: true,
            //trackMouseOver: false,

            viewModel: {
                stores: {
                    wg: {
                        source: {
                            type: 'widgets' // chained store
                        }
                    }
                }
            },

            bind: {
                store: '{wg}'
            },
            bodyStyle: {
                border: 0
            },
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragText: 'Drag and drop to reorganize'
                },
                stripeRows: false,
                getRowClass: function (record) {
                    return !record.get('enabled') ? 'disabled' : '';
                },
                listeners: {
                    drop: 'onDrop'
                }
            },
            columns: [{
                width: 25,
                align: 'center',
                sortable: false,
                hideable: false,
                resizable: false,
                menuDisabled: true,
                //handler: 'toggleWidgetEnabled',
                dataIndex: 'enabled',
                renderer: 'enableRenderer'
            }, {
                dataIndex: 'entryId',
                renderer: 'widgetTitleRenderer'
            }/*, {
                xtype: 'actioncolumn',
                align: 'center',
                width: 25,
                sortable: false,
                hideable: false,
                resizable: false,
                menuDisabled: true,
                renderer: function (value, meta, record) {
                    if (record.get('type') !== 'ReportEntry') {
                        return '';
                    }
                    return '<i style="font-size: 16px; color: #777; padding-top: 4px;" class="material-icons">settings</i>';
                }
            }*/],
            listeners: {
                itemmouseleave : 'onItemLeave',
                cellclick: 'onItemClick'
            },
            tbar: [{
                text: Ung.Util.iconTitle('Add'.t(), 'add-16')
                //handler: 'resetDashboard'
            }, '->', {
                text: Ung.Util.iconTitle('Import'.t(), 'file_download-16')
                //handler: 'applyChanges'
            }, {
                text: Ung.Util.iconTitle('Export'.t(), 'file_upload-16')
                //handler: 'applyChanges'
            }],
            bbar: [{
                text: Ung.Util.iconTitle('Reset'.t(), 'replay-16'),
                handler: 'resetDashboard'
            }, '->', {
                text: Ung.Util.iconTitle('Apply'.t(), 'save-16'),
                handler: 'applyChanges'
            }]
        }, {
            xtype: 'component',
            html: '<table>' +
                    '<tr><td style="text-align: right;"><i class="material-icons" style="color: #333; font-size: 16px; vertical-align: middle;">check_box</i> | <i class="material-icons" style="color: #999; font-size: 16px; vertical-align: middle;">check_box_outline_blank</i></td><td>' +
                    'enables or disables the widget'.t() + '</td></tr>' +
                    '<tr><td style="width: 45px; text-align: right; vertical-align: top;"><i class="material-icons" style="color: #F00; font-size: 16px; vertical-align: middle;">info_outline</i></td><td>' + 'requires Reports and App to be installed'.t() + '</td></tr>' +
                    '<tr><td style="text-align: right;"><i class="material-icons" style="color: #999; font-size: 16px; vertical-align: middle;">format_line_spacing</i></td><td>' + 'drag widgets to sort them'.t() + '</td></tr>' +
                    '</table>',
            style: {
                color: '#555',
                fontSize: '11px',
                background: '#efefef'
            },
            padding: '10',
            border: false
        }]
    }, {
        xtype: 'container',
        region: 'center',
        reference: 'dashboard',
        baseCls: 'dashboard',
        scrollable: true
    }],
    listeners: {
        //afterrender: 'onAfterRender',
        showwidgeteditor: 'showWidgetEditor'
    }
});
Ext.define('Ung.chart.NodeChartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.nodechart',

    init: function () {
        this.defaultColors = ['#00b000', '#3030ff', '#009090', '#00ffff', '#707070', '#b000b0', '#fff000', '#b00000', '#ff0000', '#ff6347', '#c0c0c0'];
    },

    onAfterRender: function (view) {
        this.chart = new Highcharts.Chart({
            chart: {
                type: 'areaspline',
                //zoomType: 'x',
                renderTo: view.lookupReference('nodechart').getEl().dom,
                marginBottom: 15,
                marginRight: 0,
                //padding: [0, 0, 0, 0],
                backgroundColor: 'transparent',
                animation: true,
                style: {
                    fontFamily: 'Source Sans Pro',
                    fontSize: '12px'
                }
            },
            title: null,
            credits: {
                enabled: false
            },
            xAxis: [{
                type: 'datetime',
                crosshair: {
                    width: 1,
                    dashStyle: 'ShortDot',
                    color: 'rgba(100, 100, 100, 0.3)'
                },
                lineColor: '#C0D0E0',
                lineWidth: 1,
                tickLength: 3,
                gridLineWidth: 1,
                gridLineDashStyle: 'dash',
                gridLineColor: '#EEE',
                labels: {
                    style: {
                        fontFamily: 'Source Sans Pro',
                        color: '#555',
                        fontSize: '11px',
                        fontWeight: 600
                    },
                    y: 12
                },
                maxPadding: 0,
                minPadding: 0
            }],
            yAxis: {
                allowDecimals: false,
                min: 0,
                lineColor: '#C0D0E0',
                lineWidth: 1,
                gridLineWidth: 1,
                gridLineDashStyle: 'dash',
                gridLineColor: '#EEE',
                minRange: 1,
                tickPixelInterval: 30,
                tickLength: 5,
                tickWidth: 1,
                //tickPosition: 'inside',
                showFirstLabel: false,
                showLastLabel: true,
                maxPadding: 0,
                opposite: false,
                labels: {
                    align: 'right',
                    useHTML: true,
                    padding: 0,
                    style: {
                        fontFamily: 'Source Sans Pro',
                        color: '#555',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: 'rgba(255, 255, 255, 0.6)',
                        padding: '0 1px',
                        borderRadius: '2px',
                        //textShadow: '1px 1px 1px #000'
                        lineHeight: '11px'
                    },
                    x: -10,
                    y: 5
                },
                title: {
                    align: 'high',
                    offset: -10,
                    y: 3,
                    //rotation: 0,
                    //text: entry.units,
                    text: 'sessions',
                    //textAlign: 'left',
                    style: {
                        fontFamily: 'Source Sans Pro',
                        color: '#555',
                        fontSize: '10px',
                        fontWeight: 600
                    }
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                shared: true,
                animation: true,
                followPointer: true,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                style: {
                    textAlign: 'right',
                    fontFamily: 'Source Sans Pro',
                    padding: '5px',
                    fontSize: '10px',
                    marginBottom: '40px'
                },
                //useHTML: true,
                hideDelay: 0,
                shadow: false,
                headerFormat: '<span style="font-size: 11px; line-height: 1.5; font-weight: bold;">{point.key}</span><br/>',
                pointFormatter: function () {
                    var str = '<span>' + this.series.name + '</span>';
                    str += ': <span style="color: ' + this.color + '; font-weight: bold;">' + this.y + '</span> sessions';
                    return str + '<br/>';
                }
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.15,
                    lineWidth: 1
                },
                spline: {
                    lineWidth: 2,
                    softThreshold: false
                },
                series: {
                    marker: {
                        enabled: true,
                        radius: 0,
                        states: {
                            hover: {
                                enabled: true,
                                lineWidthPlus: 2,
                                radius: 4,
                                radiusPlus: 2
                            }
                        }
                    },
                    states: {
                        hover: {
                            enabled: true,
                            lineWidthPlus: 0,
                            halo: {
                                size: 2
                            }
                        }
                    }
                }
            },
            series: [{
                data: (function () {
                    var data = [], time = Date.now(), i;
                    try {
                        time = rpc.systemManager.getMilliseconds();
                    } catch (e) {
                        console.log('Unable to get current millis.');
                    }
                    time = Math.round(time/1000) * 1000;
                    for (i = -39; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 3000,
                            y: 0
                        });
                    }
                    return data;
                }())
            }]
        });
    },

    onResize: function () {
        this.chart.reflow();
    },

    onAddPoint: function () {
        var newVal = this.getViewModel().get('metrics').filter(function (metric) {
            return metric.name === 'live-sessions';
        })[0].value || 0;

        this.chart.series[0].addPoint({
            x: Date.now(),
            y: newVal
        }, true, true);

    }
});
Ext.define('Ung.chart.NodeChart', {
    extend: 'Ext.container.Container',
    alias: 'widget.nodechart',
    requires: [
        'Ung.chart.NodeChartController'
    ],

    controller: 'nodechart',
    viewModel: true,

    listeners: {
        afterrender: 'onAfterRender',
        addPoint: 'onAddPoint'
        //resize: 'onResize',
        //setseries: 'onSetSeries',
        //beginfetchdata: 'onBeginFetchData'
    },

    items: [{
        xtype: 'component',
        reference: 'nodechart',
        width: 400,
        height: 150
    }]
});
Ext.define('Ung.view.node.Status', {
    extend: 'Ext.panel.Panel',
    xtype: 'nodestatus',

    requires: [
        'Ung.chart.NodeChart'
    ],

    layout: {
        type: 'vbox'
    },

    config: {
        summary: null,
        hasChart: null,
        hasMetrics: true
    },

    defaults: {
        border: false,
        xtype: 'panel',
        baseCls: 'status-item',
        padding: 10,
        bodyPadding: '10 0 0 0'
    },

    title: 'Status'.t(),
    scrollable: true,
    items: [],

    initComponent: function () {

        var vm = this.getViewModel(),
            items = [{
                title: 'Summary'.t(),
                //baseCls: 'status-item',
                items: [{
                    xtype: 'component',
                    bind: '{summary}'
                }]
            }];

        if (vm.get('nodeProps.hasPowerButton')) {
            items.push({
                title: 'Power'.t(),
                //baseCls: 'status-item',
                //cls: isRunning? 'app-on': 'app-off',
                items: [{
                    xtype: 'component',
                    html: 'test',
                    bind: {
                        html: '{powerMessage}'
                    }
                }, {
                    xtype: 'button',
                    margin: '5 0',
                    cls: 'power-btn',
                    bind: {
                        text: '{powerButton}',
                        userCls: '{nodeInstance.targetState}'
                    },
                    handler: 'onPower'
                }]
            });
        }

        if (this.getHasChart()) {
            items.push({
                title: 'Sessions'.t(),
                items: [{
                    xtype: 'nodechart'
                }]
            });
        }

        if (this.getHasMetrics()) {
            items.push({
                title: 'Metrics'.t(),
                baseCls: 'status-item',
                items: [{
                    xtype: 'grid',
                    header: false,
                    hideHeaders: true,
                    baseCls: 'metrics-grid',
                    focusable: false,
                    width: 300,
                    border: false,
                    bodyBorder: false,
                    disableSelection: true,
                    trackMouseOver: false,
                    viewConfig: {
                        stripeRows: false
                    },
                    bind: {
                        store: '{nodeMetrics}'
                    },
                    columns: [{
                        dataIndex: 'displayName',
                        flex: 1,
                        align: 'right',
                        renderer: function (value) {
                            return value.t() + ':';
                        }
                    }, {
                        dataIndex: 'value'
                    }]
                }]
            });
        }

        Ext.apply(this, { items: items });
        this.callParent(arguments);
    }

});
Ext.define('Ung.view.grid.EditorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ung.grideditor',

    onBeforeRender: function (view) {
        var form = view.lookupReference('form');

        var vm = view.getViewModel();

        view.columns.forEach(function (column) {
            if (column.editorField === 'textfield' || column.editorField === 'textarea') {
                form.add({
                    xtype: column.editorField,
                    fieldLabel: column.text,
                    labelAlign: 'right',
                    labelWidth: 150,
                    width: '100%',
                    disabled: column.editDisabled,
                    vtype: column.getEditor().vtype,
                    allowBlank: column.getEditor() ? column.getEditor().allowBlank : true,
                    emptyText  : column.text,
                    //maskRe     : /[a-z]/i,
                    msgTarget : 'under',
                    bind: {
                        value: '{record.' + column.dataIndex + '}'
                    }
                });
            }

            if (column.editorField === 'checkbox') {
                form.add({
                    xtype: column.editorField,
                    fieldLabel: column.text,
                    labelAlign: 'right',
                    labelWidth: 150,
                    disabled: column.editDisabled,
                    msgTarget : 'under',
                    bind: {
                        value: '{record.' + column.dataIndex + '}'
                    }
                });
            }

            if (column.editorField === 'action') {
                var formulas = {
                    showPriority: {
                        get: function (get) {
                            return get('record.actionType') === 'SET_PRIORITY';
                        }
                    },
                    showPenalty: {
                        get: function (get) {
                            return get('record.actionType') === 'PENALTY_BOX_CLIENT_HOST';
                        }
                    },
                    showQuota: {
                        get: function (get) {
                            return get('record.actionType') === 'GIVE_CLIENT_HOST_QUOTA';
                        }
                    }
                };
                vm.setFormulas(formulas);

                vm.bind({
                    bindTo: '{record.actionType}'
                }, function (val) {
                    if (val === 'SET_PRIORITY') {
                        vm.set('record.actionPriority', 1);
                    }
                    if (val === 'GIVE_CLIENT_HOST_QUOTA') {
                        vm.set('record.actionQuotaTime', -3);
                    }
                });

                form.add([{
                    xtype: 'component',
                    padding: '10 0 5 0',
                    margin: '0 0 0 155',
                    style: {
                        fontWeight: 'bold'
                    },
                    html: 'Perform the following action:'.t()
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Action Type'.t(),
                    labelAlign: 'right',
                    labelWidth: 150,
                    width: 400,
                    displayField: 'displayName',
                    valueField: 'name',
                    msgTarget : 'under',
                    editable: false,
                    bind: '{record.actionType}',
                    queryMode: 'local',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'displayName'],
                        data: [
                            { name: 'SET_PRIORITY', displayName: 'Set Priority'.t() },
                            { name: 'PENALTY_BOX_CLIENT_HOST', displayName: 'Send Client to Penalty Box'.t() },
                            { name: 'GIVE_CLIENT_HOST_QUOTA', displayName: 'Give Client a Quota'.t() }
                        ]
                    })
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Priority'.t(),
                    labelAlign: 'right',
                    labelWidth: 150,
                    width: 300,
                    displayField: 'displayName',
                    valueField: 'value',
                    msgTarget : 'under',
                    editable: false,
                    hidden: true,
                    bind: {
                        value: '{record.actionPriority}',
                        hidden: '{!showPriority}',
                        disabled: '{!showPriority}'
                    },
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'displayName'],
                        data: [
                            //{ value: 0, displayName: '' },
                            { value: 1, displayName: 'Very High'.t() },
                            { value: 2, displayName: 'High'.t() },
                            { value: 3, displayName: 'Medium'.t() },
                            { value: 4, displayName: 'Low'.t() },
                            { value: 5, displayName: 'Limited'.t() },
                            { value: 6, displayName: 'Limited More'.t() },
                            { value: 7, displayName: 'Limited Severely'.t() }
                        ]
                    })
                }, {
                    xtype: 'numberfield',
                    fieldLabel: 'Penalty Time'.t(),
                    labelAlign: 'right',
                    labelWidth: 150,
                    width: 250,
                    hidden: true,
                    bind: {
                        hidden: '{!showPenalty}',
                        disabled: '{!showPenalty}',
                        value: '{record.actionPenaltyTime}'
                    }
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Quota Expiration'.t(),
                    labelAlign: 'right',
                    labelWidth: 150,
                    displayField: 'displayName',
                    valueField: 'value',
                    msgTarget : 'under',
                    editable: false,
                    hidden: true,
                    bind: {
                        hidden: '{!showQuota}',
                        disabled: '{!showQuota}',
                        value: '{record.actionQuotaTime}'
                    },
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'displayName'],
                        data: [
                            //{ value: 0, displayName: '' },
                            { value: -3, displayName: 'End of Week'.t() },
                            { value: -2, displayName: 'End of Day'.t() },
                            { value: -1, displayName: 'End of Hour'.t() }
                        ]
                    })
                }, {
                    xtype: 'container',
                    hidden: true,
                    layout: {
                        type: 'hbox'
                    },
                    bind: {
                        hidden: '{!showQuota}',
                        disabled: '{!showQuota}'
                    },
                    items: [{
                        xtype: 'numberfield',
                        fieldLabel: 'Quota Size'.t(),
                        labelAlign: 'right',
                        labelWidth: 150,
                        width: 250,
                        bind: {
                            value: '{record.actionQuotaBytes}'
                        }
                    }, {
                        xtype: 'combo',
                        displayField: 'unit',
                        valueField: 'value',
                        editable: false,
                        value: 1,
                        width: 100,
                        margin: '0 0 0 5',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'unit'],
                            data: [
                                { value: 1, unit: 'bytes'.t() },
                                { value: 1000, unit: 'Kilobytes'.t() },
                                { value: 1000000, unit: 'Megabytes'.t() },
                                { value: 1000000000, unit: 'Gigabytes'.t() },
                                { value: 1000000000000, unit: 'Terrabytes'.t() }
                            ]
                        })
                    }]
                }]);
            }

            if (column.editorField === 'conditions') {
                console.log(vm.get('record.conditions'));
                form.add([{
                    xtype: 'component',
                    padding: '10 0 5 0',
                    margin: '0 0 0 155',
                    style: {
                        fontWeight: 'bold'
                    },
                    html: 'If all of the following conditions are met:'.t()
                }, {
                    xtype: 'ung.gridconditions',
                    margin: '0 0 0 155',
                    viewModel: {
                        stores: {
                            store: {
                                model: 'Ung.model.Condition',
                                data: '{record.' + column.dataIndex + '}'
                            }
                        }
                    }

                }]);
            }


            /*
            if (column.dataIndex && column.editorField) {
                console.log(column.dataIndex);
                if (column.editorField === 'ung.gridconditions') {
                    form.add({
                        xtype: 'ung.gridconditions',
                        bind: {
                            //record: '{record}',
                            conditions: '{record.' + column.dataIndex + '}'
                        },
                        /*
                        viewModel: {
                            data: {
                                conditions: '{record.' + column.dataIndex + '}'
                            }
                        }


                        viewModel: {
                            stores: {
                                store: {
                                    model: 'Ung.model.Rule',
                                    data: '{record.' + column.dataIndex + '}'
                                }
                            }
                        }

                    });
                } else {

                }
            }
            */
        });
    },

    /*
    onBeforeRender: function () {
        var vm = this.getViewModel();
        vm.bind({
            bindTo: '{record}',
            single: true
        }, function () {});
    },
    */

    /*
    onAfterRender: function (form) {
        form.keyNav = Ext.create('Ext.util.KeyNav', form.el, {
            enter: function () {
                console.log('enter');
            }
        });
    },
    */

    onSave: function () {
        this.getView().setCloseAction('save');
        this.getView().close();
    },

    onCancel: function () {
        this.getView().setCloseAction('cancel');
        this.getView().close();
    }

});
Ext.define ('Ung.model.Rule', {
    extend: 'Ext.data.Model' ,
    fields: [
        //{ name: 'conditions'},
        { name: 'name', type: 'string', defaultValue: null },
        { name: 'string', type: 'string', defaultValue: '' },
        { name: 'blocked', type: 'boolean', defaultValue: true },
        { name: 'flagged', type: 'boolean', defaultValue: true },
        { name: 'category', type: 'string', defaultValue: null },
        { name: 'description', type: 'string', defaultValue: '' },
        { name: 'enabled', type: 'boolean', defaultValue: true },
        { name: 'id', defaultValue: null },
        { name: 'readOnly', type: 'boolean', defaultValue: null },
        { name: 'javaClass', type: 'string', defaultValue: 'com.untangle.node.bandwidth_control.BandwidthControlRule' },
        { name: 'ruleId', type: 'int', defaultValue: null },

        { name: 'action', type: 'auto'},
        { name: 'actionType', type: 'string', mapping: 'action.actionType', defaultValue: 'SET_PRIORITY' },
        { name: 'actionPriority', type: 'int', mapping: 'action.priority', defaultValue: 1 },
        { name: 'actionPenaltyTime', type: 'int', mapping: 'action.penaltyTime', defaultValue: 0 },
        { name: 'actionQuotaBytes', type: 'int', mapping: 'action.quotaBytes', defaultValue: 1 },
        { name: 'actionQuotaTime', type: 'int', mapping: 'action.quotaTime', defaultValue: -1 }
    ],
    hasMany: 'Ung.model.Condition',
    proxy: {
        autoLoad: true,
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'list'
        }
    }
});
Ext.define ('Ung.model.Condition', {
    extend: 'Ext.data.Model' ,
    fields: [
        { name: 'conditionType', type: 'string', defaultValue: 'DST_ADDR' },
        { name: 'invert', type: 'boolean', defaultValue: false },
        { name: 'javaClass', type: 'string', defaultValue: 'com.untangle.node.bandwidth_control.BandwidthControlRuleCondition' },
        { name: 'value', type: 'auto', defaultValue: ''}
    ],
    proxy: {
        autoLoad: true,
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'list'
        }
    }
});
Ext.define('Ung.view.grid.Editor', {
    extend: 'Ext.window.Window',

    requires: [
        'Ung.view.grid.EditorController',
        'Ung.model.Rule',
        'Ung.model.Condition'
    ],

    controller: 'ung.grideditor',
    //viewModel: true,

    config: {
        closeAction: undefined
    },

    modal: true,
    draggable: false,
    resizable: false,
    //bodyPadding: 10,
    bodyStyle: {
        background: '#FFF'
    },
    layout: 'fit',
    items: [{
        xtype: 'form',
        padding: 10,
        layout: {
            type: 'anchor'
            //align: 'stretch'
        },
        border: 0,
        reference: 'form',
        buttons: [{
            text: Ung.Util.iconTitle('Cancel', 'cancel-16'),
            handler: 'onCancel'
        }, {
            text: Ung.Util.iconTitle('Done', 'check-16'),
            formBind: true,
            disabled: true,
            handler: 'onSave'
        }],
        listeners: {
            //afterrender: 'onAfterRender'
        }
    }],
    listeners: {
        beforeRender: 'onBeforeRender'
    }
    /*
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: ['->', {
            bind: {
                text: 'Cancel {record.dirty}'
            }
        }, {
            text: Ung.Util.iconTitle('Save', 'save-16')
        }]
    }]
    */
});

Ext.define('Ung.view.grid.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'ung.grid',

    requires: [
        'Ung.view.grid.GridController',
        'Ung.view.grid.Editor'
    ],

    controller: 'ung.grid',

    config: {
        toolbarFeatures: null, // ['add', 'delete', 'revert', 'importexport'] add specific buttons to top toolbar
        columnFeatures: null, // ['delete', 'edit', 'reorder', 'select'] add specific actioncolumns to grid
        inlineEdit: null, // 'cell' or 'row',
        dataProperty: null // the settings data property, e.g. settings.dataProperty.list
    },

    bind: {
        store: '{store}'
    },

    resizable: false,
    //border: false,
    bodyBorder: false,

    viewConfig: {
        plugins: [],
        stripeRows: false,
        getRowClass: function(record) {
            //console.log(record);
            if (record.markDelete) {
                return 'delete';
            }
            //if (record.phantom) {
            //    return 'added';
            //}
            if (record.dirty) {
                return 'dirty';
            }
        }
    },

    listeners: {
        beforedestroy: 'onBeforeDestory',
        //beforerender: 'onBeforeRender',
        //selectionchange: 'onSelectionChange',
        //beforeedit: 'onBeforeEdit',
        save: 'onSave'
        //reloaded: 'onReloaded'
        //edit: 'onEdit'
    },

    initComponent: function () {
        // add any action columns
        var columnFeatures = this.getColumnFeatures(),
            actionColumns = [];

        // Edit column
        if (Ext.Array.contains(columnFeatures, 'edit')) {
            actionColumns.push({
                xtype: 'ung.actioncolumn',
                text: 'Edit'.t(),
                align: 'center',
                width: 50,
                sortable: false,
                hideable: false,
                resizable: false,
                menuDisabled: true,
                materialIcon: 'edit',
                handler: 'editRecord',
                editor: false,
                type: 'edit'
            });
        }

        // Delete column
        if (Ext.Array.contains(columnFeatures, 'delete')) {
            actionColumns.push({
                xtype: 'ung.actioncolumn',
                text: 'Delete'.t(),
                align: 'center',
                width: 50,
                //tdCls: 'stripe-col',
                sortable: false,
                hideable: false,
                resizable: false,
                menuDisabled: true,
                materialIcon: 'delete',
                handler: 'deleteRecord',
                type: 'delete'
            });
        }

        // Select column which add checkboxes for each row
        if (Ext.Array.contains(columnFeatures, 'select')) {
            this.selModel = {
                type: 'checkboxmodel'
            };
        }

        // Reorder column, allows sorting columns, overriding any other sorters
        if (Ext.Array.contains(columnFeatures, 'reorder')) {
            this.sortableColumns = false; // disable column sorting as it would affect drag sorting

            Ext.apply(this, {
                viewConfig: {
                    plugins: {
                        ptype: 'gridviewdragdrop',
                        dragText: 'Drag and drop to reorganize'.t(),
                        // allow drag only from drag column icons
                        dragZone: {
                            onBeforeDrag: function(data, e) {
                                return Ext.get(e.target).hasCls('draggable');
                            }
                        }
                    }
                }
            });

            // add the droag/drop sorting column as the first column
            actionColumns.unshift({
                xtype: 'ung.actioncolumn',
                align: 'center',
                width: 30,
                sortable: false,
                hideable: false,
                resizable: false,
                menuDisabled: true,

                dragEnabled: true,
                materialIcon: 'more_vert'
            });
        }

        // set action columns
        this.columns = this.columns.concat(actionColumns);

        this.callParent(arguments);
    }
});
Ext.define('Ung.view.grid.ConditionEditorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ung.conditioneditor',

    init: function (view) {
        console.log(this.getViewModel());
        this.getViewModel().bind({
            bindTo: '{condition}',
            single: true
        }, function (cond) {
            console.log(cond);
        });
    },

    onCancel: function () {
        this.getView().close();
    },

    onConditionTypeChange: function (combo, newValue, oldValue) {
        var vm = this.getViewModel(),
            form = this.getView().lookupReference('form'),
            comboRecord = combo.getStore().findRecord('name', newValue),
            xtype = comboRecord.get('editorType'),
            vtype = comboRecord.get('vtype');

        if (form.down('#condType')) {
            //form.lookupReference('condType').destroy();
            form.remove('condType', true);
        }

        switch (xtype) {
        case ('textfield'):
            form.add({
                xtype: xtype,
                id: 'condType',
                margin: '0 5 0 5',
                //width: 400,
                //fieldLabel: 'Value'.t(),
                allowBlank: false,
                vtype: vtype,
                bind: {
                    value: '{condition.value}'
                }
            });
            break;

        case ('countryselector'):
            form.add({
                xtype: 'tagfield',
                id: 'condType',
                margin: '0 5 0 5',
                //width: 400,
                //fieldLabel: 'Value'.t(),
                store: 'countries',
                queryMode: 'local',
                typeAhead: true,
                filterPickList: true,
                displayField: 'name',
                valueField: 'code',
                clearFilterOnEnter: true,
                bind: {
                    value: '{condition.value}'
                }

            });
            break;
        }
    }

});
Ext.define('Ung.view.grid.ConditionEditor', {
    extend: 'Ext.window.Window',

    requires: [
        'Ung.view.grid.ConditionEditorController'
    ],

    controller: 'ung.conditioneditor',

    modal: true,
    draggable: false,
    resizable: false,
    layout: 'fit',

    //header: false,
    border: false,
    bodyBorder: false,
    bodyStyle: {
        background: '#FFF'
    },

    items: [{
        xtype: 'form',
        reference: 'form',
        padding: 0,
        border: false,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'combo',
            store: 'conditions',
            //fieldLabel: 'Type'.t(),
            margin: 5,
            valueField: 'name',
            displayField: 'displayName',
            editable: false,
            //width: 400,
            bind: {
                value: '{condition.conditionType}'
            },
            listeners: {
                change: 'onConditionTypeChange'
            }
        }, {
            xtype: 'container',
            items: [{
                xtype: 'segmentedbutton',
                margin: '0 0 5 5',
                bind: {
                    value: '{condition.invert}'
                },
                items: [{
                    text: 'IS',
                    value: false
                }, {
                    text: 'IS NOT',
                    value: true
                }]
            }]
        }],

        buttons: [{
            text: Ung.Util.iconTitle('Cancel', 'cancel-16'),
            handler: 'onCancel'
        }, {
            text: Ung.Util.iconTitle('Done', 'check-16'),
            formBind: true
        }]
    }]
});
Ext.define('Ung.view.grid.Conditions', {
    extend: 'Ext.grid.Panel',
    xtype: 'ung.gridconditions',
    //viewType: 'tableview',

    layout: 'column',

    requires: [
        'Ung.view.grid.ConditionsController',
        'Ung.store.Conditions',
        'Ung.store.Countries',
        'Ung.view.grid.ConditionEditor'
        //'Ung.view.grid.Editor'
    ],

    //height: 200,

    controller: 'ung.gridconditions',
    viewModel: true,

    config: {
        conditions: null
    },


    bind: {
        store: '{store}'
    },


    /*
    plugins: [{
        ptype: 'rowediting',
        clicksToEdit: 1,
        clicksToMoveEditor: 1
    }],
    */

    resizable: false,
    //border: false,
    bodyBorder: false,
    //title: 'Conditions'.t(),
    columns: [{
        text: 'Type'.t(),
        dataIndex: 'conditionType',
        width: 250,
        menuDisabled: true,
        hideable: false,
        sortable: false,
        renderer: 'typeRenderer',
        editor: {
            xtype: 'combo',
            store: 'conditions',
            valueField: 'name',
            displayField: 'displayName',
            editable: false,
            listeners: {
                change: 'onChange'
            }
        }
    }, {
        //text: 'Value'.t(),
        width: 80,
        menuDisabled: true,
        hideable: false,
        sortable: false,
        resizable: false,
        dataIndex: 'invert',
        renderer: function (value) {
            return value ? 'is NOT'.t() : 'is'.t();
        }
    }, {
        text: 'Value'.t(),
        flex: 1,
        menuDisabled: true,
        hideable: false,
        sortable: false,
        dataIndex: 'value',
        renderer: 'valueRenderer'

    }, {
        xtype: 'ung.actioncolumn',
        text: 'Delete'.t(),
        align: 'center',
        width: 50,
        sortable: false,
        hideable: false,
        resizable: false,
        menuDisabled: true,
        materialIcon: 'delete'
    }],
    tbar: [{
        text: Ung.Util.iconTitle('Add Condition', 'add-16'),
        handler: 'onAddCondition'
    }],
    listeners: {
        select: 'onConditionSelect',
        beforerender: 'onBeforeRender'
    }

    /*
    initComponent: function () {
        var str = Ext.create('Ung.store.Conditions');
        this.columns.push({
            header: 'Type'.t(),
            width: 200,
            dataIndex: 'conditionType',
            editor: {
                xtype: 'combo',
                store: Ext.create('Ung.store.Conditions'),
                displayField: 'displayName',
                valueField: 'name'
            },
            renderer: function(value) {
                return str.findRecord('name', value).get('displayName');
            }
        });

        this.columns.push({
            header: 'Value'.t(),
            flex: 1,
            dataIndex: 'conditionType',
            editor: {
                xtype: 'textfield'
            },
            renderer: function(value) {
                return str.findRecord('name', value).get('displayName');
            }
        });
        this.callParent(arguments);
    }
    */

});
/**
 * Holds the node settings and controls all the nodes
 */
Ext.define('Ung.view.node.Settings', {
    extend: 'Ext.panel.Panel',
    xtype: 'ung.nodesettings',
    layout: 'border',
    requires: [
        'Ung.view.node.SettingsController',
        'Ung.view.node.SettingsModel',
        'Ung.view.node.Status',
        'Ung.view.node.Reports',

        'Ung.util.Util',
        //'Ung.node.WebFilter',
        //'Ung.node.BandwidthControl',
        //'Ung.node.VirusBlocker',
        //'Ung.node.SpamBlocker',

        'Ung.model.NodeMetric',
        'Ung.view.grid.Grid',
        'Ung.view.grid.Conditions',
        'Ung.view.grid.ActionColumn',
        'Ung.model.GenericRule'
    ],

    controller: 'nodesettings',
    viewModel: {
        type: 'nodesettings'
    },

    border: false,
    defaults: {
        border: false
    },

    //title: 'test',

    items: [{
        region: 'north',
        border: false,
        height: 44,
        layout: {
            type: 'hbox',
            align: 'middle'
        },
        bodyStyle: {
            background: '#555',
            padding: '0 5px',
            color: '#FFF',
            lineHeight: '44px'
        },
        items: [{
            xtype: 'button',
            text: 'Back to Apps'.t(),
            hrefTarget: '_self',
            bind: {
                href: '#apps/{policyId}'
            }
        }, {
            xtype: 'component',
            margin: '0 0 0 10',
            bind: {
                html: '{nodeProps.displayName}'
            }
        }]
    }],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [{
            xtype: 'button',
            text: Ung.Util.iconTitle('Remove', 'remove_circle-16'),
            handler: 'removeNode'
        }, {
            xtype: 'button',
            text: Ung.Util.iconTitle('Save', 'save-16'),
            handler: 'saveSettings'
        }]
    }]
});
Ext.define('Ung.view.main.Main', {
    extend: 'Ext.container.Viewport',
    //xtype: 'ung-main',

    plugins: [
        'viewport'
    ],

    requires: [
        'Ext.plugin.Viewport',
        'Ung.view.main.MainController',
        'Ung.view.main.MainModel',
        'Ung.view.dashboard.Dashboard',
        'Ung.view.apps.Apps',
        'Ung.view.apps.install.Install',
        'Ung.view.config.Config',
        'Ung.view.reports.Reports',
        'Ung.view.node.Settings'
    ],


    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: 'border',
    border: false,

    items: [{
        region: 'north',
        layout: { type: 'hbox', align: 'middle' },
        border: false,
        height: 66,
        ui: 'navigation',
        items: [{
            xtype: 'container',
            layout: { type: 'hbox', align: 'middle' },
            defaults: {
                xtype: 'button',
                baseCls: 'nav-item',
                height: 30,
                hrefTarget: '_self'
            },
            items: [{
                html: '<img src="/images/BrandingLogo.png" style="height: 40px;"/>',
                width: 100,
                height: 40,
                href: '#'
            }, {
                html: Ung.Util.iconTitle('Dashboard'.t(), 'home-16'),
                href: '#',
                bind: {
                    pressed: '{isDashboard}'
                }
            }, {
                html: Ung.Util.iconTitle('Apps'.t(), 'apps-16'),
                bind: {
                    href: '#apps/{policyId}',
                    pressed: '{isApps}'
                }
            }, {
                html: Ung.Util.iconTitle('Config'.t(), 'tune-16'),
                href: '#config',
                bind: {
                    pressed: '{isConfig}'
                }
            }, {
                html: Ung.Util.iconTitle('Reports'.t(), 'show_chart-16'),
                href: '#reports',
                bind: {
                    //html: '{reportsEnabled}',
                    hidden: '{!reportsEnabled}',
                    pressed: '{isReports}'
                }
            }]
        }]
    }, {
        xtype: 'container',
        region: 'center',
        layout: 'card',
        itemId: 'main',
        border: false,
        bind: {
            activeItem: '{activeItem}'
        },
        items: [{
            xtype: 'ung.dashboard',
            itemId: 'dashboard'
        }, {
            xtype: 'ung.apps',
            itemId: 'apps'
        }, {
            xtype: 'ung.config',
            itemId: 'config'
        }, {
            xtype: 'ung.appsinstall',
            itemId: 'appsinstall'
        }, {
            xtype: 'ung.nodesettings',
            itemId: 'settings'
        }]
    }]
});

Ext.define('Ung.store.Metrics', {
    extend: 'Ext.data.Store',
    storeId: 'metrics',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
            //rootProperty: 'users'
        }
    }
});
Ext.define('Ung.store.Stats', {
    extend: 'Ext.data.Store',
    storeId: 'stats',
    data: [{}],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});
Ext.define('Ung.store.Categories', {
    extend: 'Ext.data.Store',
    storeId: 'categories',
    model: 'Ung.model.Category'
});
Ext.define('Ung.store.UnavailableApps', {
    extend: 'Ext.data.Store',
    storeId: 'unavailableApps',
    alias: 'store.unavailableApps',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});
Ext.define ('Ung.model.Policy', {
    extend: 'Ext.data.Model' ,
    fields: [
        {name: 'policyId', type: 'int'},
        {name: 'displayName', type: 'string', convert: function (value, record) {
            return 'Policy ' + record.get('policyId');
        }}
    ],
    hasMany: {
        model: 'Ung.model.NodeProperty',
        name: 'nodeProperties'
    },
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});

Ext.define('Ung.store.Policies', {
    extend: 'Ext.data.Store',
    storeId: 'policies',
    model: 'Ung.model.Policy',
    //fields: ['policyId'],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
            //rootProperty: 'list'
        }
    }
});
Ext.define ('Ung.model.Report', {
    extend: 'Ext.data.Model' ,
    fields: [
        'category', 'colors', 'conditions', 'defaultColumns', 'description',
        'displayOrder', 'enabled',
        'javaClass',
        'orderByColumn',
        'orderDesc',

        'pieGroupColumn',
        'pieNumSlices',
        'pieStyle',
        'pieSumColumn',

        'readOnly',
        'seriesRenderer',
        'table',
        'textColumns',
        'textString',

        'timeDataColumns',
        'timeDataDynamicAggregationFunction',
        'timeDataDynamicAllowNull',
        'timeDataDynamicColumn',
        'timeDataDynamicLimit',
        'timeDataDynamicValue',
        'timeDataInterval',
        'timeStyle',
        'title',
        'type',
        'uniqueId',
        'units'
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
            //rootProperty: 'list'
        }
    }
});

Ext.define('Ung.store.Reports', {
    extend: 'Ext.data.Store',
    storeId: 'reports',
    model: 'Ung.model.Report',
    sorters: [{
        property: 'displayOrder',
        direction: 'ASC'
    }]
});
Ext.define ('Ung.model.Widget', {
    extend: 'Ext.data.Model' ,
    fields: [
        { name: 'displayColumns', type: 'auto', default: null },
        { name: 'enabled', type: 'auto', default: true },
        { name: 'entryId', type: 'auto', default: null },
        { name: 'javaClass', type: 'string', defaultValue: 'com.untangle.uvm.DashboardWidgetSettings' },
        { name: 'refreshIntervalSec', type: 'auto', default: null },
        { name: 'timeframe', type: 'auto', default: null },
        { name: 'type', type: 'string' }
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'list'
        }
    }
});
Ext.define('Ung.store.Widgets', {
    extend: 'Ext.data.Store',
    alias: 'store.widgets',
    storeId: 'widgets',
    model: 'Ung.model.Widget'
});
// test
Ext.define('Ung.Application', {
    extend: 'Ext.app.Application',
    autoCreateViewport: false,
    name: 'Ung',

    rpc: null,

    requires: [
        'Ung.rpc.Rpc',
        'Ung.util.Util',
        'Ung.util.Metrics',
        'Ung.view.main.Main',
        'Ung.overrides.form.field.VTypes'
    ],


    stores: [
        'Policies', 'Metrics', 'Stats', 'Reports', 'Widgets', 'Conditions', 'Countries', 'Categories', 'UnavailableApps'
    ],

    defaultToken : '',

    init: function () {

    },

    launch: function () {
        var me = this;
        Rpc.rpc = me.rpc;

        var resBaseHref = resourcesBaseHref || '';
        console.log(resBaseHref);

        Ext.getStore('policies').loadData(me.rpc.appsViews);

        // need to check if reports enabled an load it if so
        if (me.rpc.nodeManager.node('untangle-node-reports')) {
            Rpc.loadReports().then(function (reports) {
                Ext.getStore('reports').loadData(reports.list);
                me.loadMainView();
            });
        } else {
            me.loadMainView();
        }

        // uncomment this to retreive the class load order inside browser
        //Ung.Util.getClassOrder();
    },

    loadMainView: function () {
        try {
            Ung.app.setMainView('Ung.view.main.Main');
        } catch (ex) {
            Ung.Util.exceptionToast(ex);
            return;
        }

        // start metrics
        Ung.util.Metrics.start();

        // destroy app loader
        Ext.Function.defer(function() {
            Ext.get('app-loader').addCls('removing');
            Ext.Function.defer(function () {
                Ext.get('app-loader').destroy();
            }, 200);
        }, 150);
    }
});