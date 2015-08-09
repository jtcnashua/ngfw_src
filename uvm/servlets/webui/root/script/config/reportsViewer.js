Ext.define('Webui.config.reportsViewer', {
    extend : 'Ung.StatusWin',
    helpSource : 'reports_viewer',
    displayName : 'Reports Viewer',
    initComponent : function() {
        this.breadcrumbs = [ {
            title : this.i18n._('Reports Viewer')
        } ];
        var treeNodes = [ {
            text : i18n._('Summary'),
            category : 'Summary',
            leaf : true,
            icon : '/skins/'+rpc.skinSettings.skinName+'/images/admin/icons/icon_summary.png'
        }, {
            text : i18n._('Host Viewer'),
            category : 'Host Viewer',
            leaf : true,
            icon : '/skins/'+rpc.skinSettings.skinName+'/images/admin/icons/icon_hosts.png'
        }, {
            text : i18n._("Configuration"),
            leaf : false,
            expanded : true,
            children : [ {
                text : i18n._('Network'),
                category : 'Network',
                leaf : true,
                icon : '/skins/'+rpc.skinSettings.skinName+'/images/admin/config/icon_config_network_17x17.png'
            }, {
                text : i18n._('Administration'),
                category : 'Administration',
                leaf : true,
                icon : '/skins/'+rpc.skinSettings.skinName+'/images/admin/config/icon_config_admin_17x17.png'
            }, {
                text : i18n._('System'),
                category : 'System',
                leaf : true,
                icon : '/skins/'+rpc.skinSettings.skinName+'/images/admin/config/icon_config_system_17x17.png'
            }, {
                text : i18n._("Shield"),
                category : "Shield",
                leaf : true,
                icon : "/reports/node-icons/untangle-node-shield.png"
            } ]
        }];
        if (rpc.rackView && rpc.rackView.instances.list.length > 0) {
            var i, node, apps = [];
            for (i = 0; i < rpc.rackView.instances.list.length; i++) {
                var nodeSettings = rpc.rackView.instances.list[i];
                var nodeProperties = rpc.rackView.nodeProperties.list[i];
                if(nodeProperties.name != 'untangle-node-branding' && nodeProperties.name != 'untangle-node-support' ) {
                    apps.push({
                        text : nodeProperties.displayName,
                        category : nodeProperties.displayName,
                        leaf : true,
                        viewPosition : nodeProperties.viewPosition,
                        icon : '/skins/'+rpc.skinSettings.skinName+'/images/admin/apps/'+nodeProperties.name+'_17x17.png'
                    });
                }
                
            }
            apps.sort(function(a, b) {
                return a.viewPosition - b.viewPosition;
            });
            treeNodes.push({
                text : i18n._("Applications"),
                leaf : false,
                expanded : true,
                children : apps
            });
        }

        this.items = {
            xtype : "panel",
            border : false,
            layout : "border",
            items : [ {
                xtype : 'treepanel',
                region : 'west',
                margin : '1 1 0 1',
                autoScroll : true,
                rootVisible : false,
                title : i18n._('Reports'),
                enableDrag : false,
                width : 200,
                minWidth : 65,
                maxWidth : 350,
                split : true,
                store : Ext.create('Ext.data.TreeStore', {
                    root : {
                        expanded : true,
                        children : treeNodes
                    }
                }),
                selModel : {
                    selType : 'rowmodel',
                    listeners : {
                        select : Ext.bind(function(rowModel, record, rowIndex, eOpts) {
                            this.panelReports.setConfig("icon", record.get("icon"));
                            this.panelReports.setTitle(record.get("category"));
                            this.panelReports.setCategory(record.get("category"));
                        }, this)
                    }
                }
            }, this.panelReports = Ext.create('Ung.panel.Reports', {
                region : "center"
            }) ]
        };
        this.callParent(arguments);
        
        this.down("treepanel").getSelectionModel().select(0);
    },
    doSize : function() {
        this.maximize();
    },
    closeWindow : function() {
        this.hide();
        this.destroy();
    }
});
// # sourceURL=reportsViewer.js