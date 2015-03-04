Ext.define('Webui.config.hostMonitorNew', {
    extend: 'Ung.StatusWin',
    helpSource: 'host_viewer',
    sortField:'bypassed',
    sortOrder: 'ASC',
    defaultBandwidthColumns: false,
    enableBandwidthColumns: false,
    initComponent: function() {
        this.breadcrumbs = [{
            title: this.i18n._('Host Viewer')
        }];
        this.buildGridCurrentHosts();
        this.buildGridPenaltyBox();
        this.buildPenaltyBoxEventLog();
        this.buildGridQuotaBox();
        this.buildQuotaEventLog();
        this.buildTabPanel([this.gridCurrentHosts, this.gridPenaltyBox, this.gridPenaltyBoxEventLog, this.gridQuotaBox, this.gridQuotaEventLog]);
        this.callParent(arguments);
    },
    closeWindow: function() {
        this.gridCurrentHosts.stopAutoRefresh(true);
        this.hide();
    },
    getHosts: function(handler) {
        if (!this.isVisible()) {
            handler({javaClass:"java.util.LinkedList", list:[]});
            return;
        }
        rpc.hostTable.getHosts(Ext.bind(function(result, exception) {
            if(testMode && result != null && result.list!=null ) {
                var testSize = 450 + Math.floor((Math.random()*100));
                for(var i=0;i<testSize;i++) {
                    var ii=i+Math.floor((Math.random()*10));
                    var d=new Date();
                    result.list.push({
                        "address": "184.27.239."+(ii%10),
                        "hostname": i%3?("p.twitter.com"+i):null,
                        "licensed": true,
                        "lastAccessTime": 0,//d.getTime()+(i*86400000),
                        "lastSessionTime": 0,//d.getTime()+(i*86400000),
                        "username": "testuser"+i,
                        "usernameAdConnector": "uad"+ii,
                        "captivePortalAuthenticated":(ii%2)==1,
                        "usernameCapture": "ucap"+(ii%50),
                        "penaltyBoxed":(ii%2)==1,
                        "penaltyBoxEntryTime": d.getTime()-(ii*86400000),
                        "penaltyBoxExitTime": d.getTime()+(ii*86400000),
                        "quotaSize": ii * 10000,
                        "quotaRemaining": ii * 5000,
                        "quotaIssueTime": 0,
                        "quotaExpirationTime": 0,
                        "httpUserAgent": (ii%3)?("MOZFirefox"+i):null,
                        "httpUserAgentOs": (ii%4)?("Win"+ii):null
                    });
                }
            }
            handler(result, exception);
        }, this));
    },
    getPenaltyBoxedHosts: function() {
        return rpc.hostTable.getPenaltyBoxedHosts();
    },
    megaByteRenderer: function(bytes) {
        var units = ["bytes","Kbytes","Mbytes","Gbytes"];
        var units_itr = 0;

        while ((bytes >= 1000 || bytes <= -1000) && units_itr < 3) {
            bytes = bytes/1000;
            units_itr++;
        }

        bytes = Math.round(bytes*100)/100;

        return "" + bytes + " " + units[units_itr];
    },
    getQuotaHosts: function() {
        return rpc.hostTable.getQuotaHosts();
    },
    // Current Hosts Grid
    buildGridCurrentHosts: function(columns, groupField) {
        var dateConvertFn = function(value) {
            if( value == 0 || value == "") {
                return "";
            } else {
                var d=new Date();
                d.setTime(value);
                return d;
            }
        };
        this.gridCurrentHosts = Ext.create('Ung.MonitorGrid',{
            name: "hostMonitorGrid",
            helpSource: 'host_viewer_current_hosts',
            settingsCmp: this,
            height: 500,
            sortField: this.sortField,
            sortOrder: this.sortOrder,
            groupField: this.groupField,
            title: this.i18n._("Current Hosts"),
            tooltip: this.i18n._("This shows all current hosts."),
            dataFn: Ext.bind(this.getHosts, this),
            fields: [{
                name: "id"
            },{
                name: "address",
                type: 'string',
                sortType: Ung.SortTypes.asIp
            },{
                name: "hostname",
                type: 'string'
            }, {
                name: "lastAccessTime"
            }, {
                name: "lastAccessTimeDate",
                mapping: "lastAccessTime",
                convert: dateConvertFn
            }, {
                name: "lastSessionTime"
            }, {
                name: "lastSessionTimeDate",
                mapping: "lastSessionTime",
                convert: dateConvertFn
            }, {
                name: "licensed",
                type: 'boolean'
            },{
                name: "username",
                type: 'string'
            },{
                name: "usernameAdConnector",
                type: 'string'
            },{
                name: "captivePortalAuthenticated"
            },{
                name: "usernameCapture",
                type: 'string'
            },{
                name: "usernameTunnel",
                type: 'string'
            },{
                name: "usernameOpenvpn",
                type: 'string'
            },{
                name: "penaltyBoxed"
            },{
                name: "penaltyBoxEntryTime"
            },{
                name: "penaltyBoxEntryTimeDate",
                mapping: "penaltyBoxEntryTime",
                convert: dateConvertFn
            },{
                name: "penaltyBoxExitTime"
            },{
                name: "penaltyBoxExitTimeDate",
                mapping: "penaltyBoxExitTime",
                convert: dateConvertFn
            },{
                name: "quotaSize"
            },{
                name: "quotaRemaining"
            },{
                name: "quotaIssueTime"
            },{
                name: "quotaIssueTimeDate",
                mapping: "quotaIssueTime",
                convert: dateConvertFn
            },{
                name: "quotaExpirationTime"
            },{
                name: "quotaExpirationTimeDate",
                mapping: "quotaExpirationTime",
                convert: dateConvertFn
            },{
                name: "httpUserAgent",
                type: 'string'
            },{
                name: "httpUserAgentOs",
                type: 'string'
            }],
            columns: [{
                header: this.i18n._("IP"),
                dataIndex: "address",
                width: 100,
                filter: {
                    type: 'string'
                }
            }, {
                hidden: true,
                header: this.i18n._("Last Access Time"),
                dataIndex: "lastAccessTimeDate",
                width: 150,
                renderer: function(value, metaData, record) {
                    var val=record.get("lastAccessTime");
                    return val == 0 || val == "" ? "" : i18n.timestampFormat(val);
                },
                filter: {
                    type: 'date'
                }
            }, {
                hidden: true,
                header: this.i18n._("Last Session Time"),
                dataIndex: "lastSessionTimeDate",
                width: 150,
                renderer: function(value, metaData, record) {
                    var val=record.get("lastSessionTime");
                    return val == 0 || val == "" ? "" : i18n.timestampFormat(val);
                },
                filter: {
                    type: 'date'
                }
            }, {
                hidden: true,
                header: this.i18n._("Licensed"),
                dataIndex: "licensed",
                width: 80,
                filter: {
                    type: 'boolean'
                }
            }, {
                header: this.i18n._("Hostname"),
                dataIndex: "hostname",
                width: 100,
                filter: {
                    type: 'string'
                }
            },{
                header: this.i18n._("Username"),
                dataIndex: "username",
                width: 100,
                filter: {
                    type: 'string'
                }
            },{
                header: this.i18n._("Penalty Boxed"),
                dataIndex: "penaltyBoxed",
                width: 100,
                filter: {
                    type: 'boolean'
                }
            },{
                hidden: true,
                header: this.i18n._("Penalty Box Entry Time"),
                dataIndex: "penaltyBoxEntryTimeDate",
                width: 100,
                renderer: function(value, metaData, record) {
                    var val=record.get("penaltyBoxEntryTime");
                    return val == 0 || val == "" ? "" : i18n.timestampFormat(val);
                },
                filter: {
                    type: 'date'
                }
            },{
                hidden: true,
                header: this.i18n._("Penalty Box Exit Time"),
                dataIndex: "penaltyBoxExitTimeDate",
                width: 100,
                renderer: function(value, metaData, record) {
                    var val=record.get("penaltyBoxExitTime");
                    return val == 0 || val == "" ? "" : i18n.timestampFormat(val);
                },
                filter: {
                    type: 'date'
                }
            },{
                header: this.i18n._("Quota Size"),
                dataIndex: "quotaSize",
                width: 100,
                renderer: function(value) {
                    return value == 0 || value == "" ? "" : value;
                },
                filter: {
                    type: 'numeric'
                }
            },{
                hidden: true,
                header: this.i18n._("Quota Remaining"),
                dataIndex: "quotaRemaining",
                width: 100,
                filter: {
                    type: 'numeric'
                }
            },{
                hidden: true,
                header: this.i18n._("Quota Issue Time"),
                dataIndex: "quotaIssueTimeDate",
                width: 100,
                renderer: function(value, metaData, record) {
                    var val=record.get("quotaIssueTime");
                    return val == 0 || val == "" ? "" : i18n.timestampFormat(val);
                },
                filter: {
                    type: 'date'
                }
            },{
                hidden: true,
                header: this.i18n._("Quota Expiration Time"),
                dataIndex: "quotaExpirationTimeDate",
                width: 100,
                renderer: function(value, metaData, record) {
                    var val=record.get("quotaExpirationTime");
                    return val == 0 || val == "" ? "" : i18n.timestampFormat(val);
                },
                filter: {
                    type: 'date'
                }
            },{
                hidden: true,
                header: "HTTP" + " - " + this.i18n._("User Agent"),
                dataIndex: "httpUserAgent",
                width: 200,
                filter: {
                    type: 'string'
                }
            },{
                header: "HTTP" + " - " + this.i18n._("User Agent OS"),
                dataIndex: "httpUserAgentOs",
                width: 200,
                filter: {
                    type: 'string'
                }
            },{
                hidden: true,
                header: "Captive Portal" + " - " + this.i18n._("Authenticated"),
                dataIndex: "captivePortalAuthenticated",
                width: 100,
                filter: {
                    type: 'boolean'
                }
            },{
                hidden: true,
                header: "Captive Portal" + " - " + this.i18n._("Username"),
                dataIndex: "usernameCapture",
                width: 100,
                filter: {
                    type: 'string'
                }
            },{
                hidden: true,
                header: "Directory Connector" + " - " + this.i18n._("Username"),
                dataIndex: "usernameAdConnector",
                width: 100,
                filter: {
                    type: 'string'
                }
            },{
                hidden: true,
                header: "L2TP" + " - " + this.i18n._("Username"),
                dataIndex: "usernameTunnel",
                width: 100,
                filter: {
                    type: 'string'
                }
            },{
                hidden: true,
                header: "OpenVPN" + " - " + this.i18n._("Username"),
                dataIndex: "usernameOpenvpn",
                width: 100,
                filter: {
                    type: 'string'
                }
            }]
        });
    },
    buildGridPenaltyBox: function() {
        this.gridPenaltyBox = Ext.create('Ung.EditorGrid',{
            anchor: '100% -60',
            helpSource: 'host_viewer_penalty_box_hosts',
            name: "PenaltyBoxHosts",
            settingsCmp: this,
            parentId: this.getId(),
            hasAdd: false,
            hasEdit: false,
            hasDelete: false,
            columnsDefaultSortable: true,
            title: this.i18n._("Penalty Box Hosts"),
            qtip: this.i18n._("This shows all hosts currently in the Penalty Box."),
            paginated: false,
            bbar: Ext.create('Ext.toolbar.Toolbar',{
                items: [
                    '-',
                    {
                        xtype: 'button',
                        text: i18n._('Refresh'),
                        name: "Refresh",
                        tooltip: i18n._('Refresh'),
                        iconCls: 'icon-refresh',
                        handler: Ext.bind(function() {
                            this.gridPenaltyBox.reload();
                        }, this)
                    }
                ]
            }),
            recordJavaClass: "com.untangle.uvm.HostTableEntry",
            dataFn: Ext.bind(this.getPenaltyBoxedHosts, this),
            fields: [{
                name: "address",
                sortType: Ung.SortTypes.asIp
            },{
                name: "penaltyBoxEntryTime"
            },{
                name: "penaltyBoxExitTime"
            },{
                name: "id"
            }],
            columns: [{
                header: this.i18n._("IP Address"),
                dataIndex: 'address',
                width: 150
            },{
                header: this.i18n._("Entry Time"),
                dataIndex: 'penaltyBoxEntryTime',
                width: 180,
                renderer: function(value) { return i18n.timestampFormat(value); }
            },{
                header: this.i18n._("Planned Exit Time"),
                dataIndex: 'penaltyBoxExitTime',
                width: 180,
                renderer: function(value) { return i18n.timestampFormat(value); }
            }, {
                width: 85,
                header: this.i18n._("Control"),
                dataIndex: null,
                renderer: Ext.bind(function(value, metadata, record,rowIndex,colIndex,store,view) {
                    var out= '';
                    if(record.data.internalId>=0) {
                        var id = Ext.id();
                        Ext.defer(function () {
                            var button = Ext.widget('button', {
                                renderTo: id,
                                text: this.i18n._("Release"),
                                width: 75,
                                handler: Ext.bind(function () {
                                    Ext.MessageBox.wait(this.i18n._("Releasing host..."), this.i18n._("Please wait"));
                                    rpc.hostTable.releaseHostFromPenaltyBox(Ext.bind(function(result,exception) {
                                        Ext.MessageBox.hide();
                                        if(Ung.Util.handleException(exception)) return;
                                        this.gridPenaltyBox.reload();
                                    }, this), record.data.address );
                                }, this)
                            });
                            this.subCmps.push(button);
                        }, 50, this);
                        out=  Ext.String.format('<div id="{0}"></div>', id);
                    }
                    return out;
                }, this)
            }]
        });

    },
    buildGridQuotaBox: function() {
        this.gridQuotaBox = Ext.create('Ung.EditorGrid',{
            anchor: '100% -60',
            name: "CurrentQuotas",
            helpSource: 'host_viewer_current_quotas',
            settingsCmp: this,
            parentId: this.getId(),
            hasAdd: false,
            hasEdit: false,
            hasDelete: false,
            columnsDefaultSortable: true,
            title: this.i18n._("Current Quotas"),
            qtip: this.i18n._("This shows all hosts currently with quotas."),
            paginated: false,
            bbar: Ext.create('Ext.toolbar.Toolbar',{
                items: [
                    '-',
                    {
                        xtype: 'button',
                        text: i18n._('Refresh'),
                        name: "Refresh",
                        tooltip: i18n._('Refresh'),
                        iconCls: 'icon-refresh',
                        handler: Ext.bind(function() {
                            this.gridQuotaBox.reload();
                        }, this)
                    }
                ]
            }),
            recordJavaClass: "com.untangle.uvm.HostTableEntry",
            dataFn: Ext.bind(this.getQuotaHosts, this),
            fields: [{
                name: "address",
                sortType: Ung.SortTypes.asIp
            },{
                name: "quotaSize"
            },{
                name: "quotaRemaining"
            },{
                name: "quotaIssueTime"
            },{
                name: "quotaExpirationTime"
            },{
                name: "id"
            }],
            columns: [{
                header: this.i18n._("IP Address"),
                dataIndex: 'address',
                width: 150
            },{
                header: this.i18n._("Quota Size"),
                dataIndex: 'quotaSize',
                width: 100,
                renderer: Ext.bind(this.megaByteRenderer, this)
            },{
                header: this.i18n._("Quota Remaining"),
                dataIndex: 'quotaRemaining',
                width: 100,
                renderer: Ext.bind(this.megaByteRenderer, this)
            },{
                header: this.i18n._("Allocated"),
                dataIndex: 'quotaIssueTime',
                width: 180,
                renderer: function(value) { return i18n.timestampFormat(value); }
            },{
                header: this.i18n._("Expires"),
                dataIndex: 'quotaExpirationTime',
                width: 180,
                renderer: function(value) { return i18n.timestampFormat(value); }
            }, {
                width: 85,
                header: this.i18n._("Refill Quota"),
                dataIndex: null,
                renderer: Ext.bind(function(value, metadata, record,rowIndex,colIndex,store,view) {
                    var out= '';
                    if(record.data.internalId>=0) {
                        var id = Ext.id();
                        Ext.defer(function () {
                            var button = Ext.widget('button', {
                                renderTo: id,
                                text: this.i18n._("Refill"),
                                width: 75,
                                handler: Ext.bind(function () {
                                    Ext.MessageBox.wait(this.i18n._("Refilling..."), this.i18n._("Please wait"));
                                    rpc.hostTable.refillQuota(Ext.bind(function(result,exception) {
                                        Ext.MessageBox.hide();
                                        if(Ung.Util.handleException(exception)) return;
                                        this.gridQuotaBox.reload();
                                    }, this), record.data.address );
                                }, this)
                            });
                            this.subCmps.push(button);
                        }, 50, this);
                        out=  Ext.String.format('<div id="{0}"></div>', id);
                    }
                    return out;
                }, this)
            }, {
                width: 85,
                header: this.i18n._("Drop Quota"),
                dataIndex: null,
                renderer: Ext.bind(function(value, metadata, record,rowIndex,colIndex,store,view) {
                    var out= '';
                    if(record.data.internalId>=0) {
                        var id = Ext.id();
                        Ext.defer(function () {
                            var button = Ext.widget('button', {
                                renderTo: id,
                                text: this.i18n._("Drop"),
                                width: 75,
                                handler: Ext.bind(function () {
                                    Ext.MessageBox.wait(this.i18n._("Removing Quota..."), this.i18n._("Please wait"));
                                    rpc.hostTable.removeQuota(Ext.bind(function(result,exception) {
                                        Ext.MessageBox.hide();
                                        if(Ung.Util.handleException(exception)) return;
                                        this.gridQuotaBox.reload();
                                    }, this), record.data.address );
                                }, this)
                            });
                            this.subCmps.push(button);
                        }, 50, this);
                        out=  Ext.String.format('<div id="{0}"></div>', id);
                    }
                    return out;
                }, this)
            }]
        });
    },
    buildPenaltyBoxEventLog: function() {
        this.gridPenaltyBoxEventLog = Ext.create('Ung.GridEventLog',{
            settingsCmp: this,
            name: 'PenaltyBoxEventLog',
            helpSource: 'host_viewer_penalty_box_event_log',
            eventQueriesFn: rpc.hostTable.getPenaltyBoxEventQueries,
            title: this.i18n._("Penalty Box Event Log"),
            fields: [{
                name: 'time_stamp',
                sortType: Ung.SortTypes.asTimestamp
            }, {
                name: 'start_time',
                sortType: Ung.SortTypes.asTimestamp
            }, {
                name: 'end_time',
                sortType: Ung.SortTypes.asTimestamp
            }, {
                name: 'address',
                sortType: Ung.SortTypes.asIp
            }, {
                name: 'reason'
            }],
            columns: [{
                header: this.i18n._("Start Time"),
                width: Ung.Util.timestampFieldWidth,
                sortable: true,
                dataIndex: 'start_time',
                renderer: function(value) {
                    return i18n.timestampFormat(value);
                }
            }, {
                header: this.i18n._("End Time"),
                width: Ung.Util.timestampFieldWidth,
                sortable: true,
                dataIndex: 'end_time',
                renderer: function(value) {
                    return i18n.timestampFormat(value);
                }
            }, {
                header: this.i18n._("Address"),
                width: Ung.Util.ipFieldWidth,
                sortable: true,
                dataIndex: 'address'
            },{
                header: this.i18n._("Reason"),
                width: 100,
                flex: 1,
                dataIndex: 'reason'
            }]
        });
    },
    buildQuotaEventLog: function() {
        this.gridQuotaEventLog = Ext.create('Ung.GridEventLog',{
            settingsCmp: this,
            name: 'QuotaEventLog',
            helpSource: 'host_viewer_quota_event_log',
            eventQueriesFn: rpc.hostTable.getQuotaEventQueries,
            title: this.i18n._("Quota Event Log"),
            fields: [{
                name: 'time_stamp',
                sortType: Ung.SortTypes.asTimestamp
            }, {
                name: 'action'
            }, {
                name: 'address',
                sortType: Ung.SortTypes.asIp
            }, {
                name: 'size'
            }, {
                name: 'reason'
            }],
            columns: [{
                header: this.i18n._("Timestamp"),
                width: Ung.Util.timestampFieldWidth,
                sortable: true,
                dataIndex: 'time_stamp',
                renderer: function(value) {
                    return i18n.timestampFormat(value);
                }
            }, {
                header: this.i18n._("Address"),
                width: Ung.Util.ipFieldWidth,
                sortable: true,
                dataIndex: 'address'
            }, {
                header: this.i18n._("Action"),
                width: 150,
                sortable: true,
                dataIndex: 'action',
                renderer: Ext.bind(function(value, metadata, record) {
                    switch (value) {
                        case 0: return "";
                        case 1: return "Quota Given";
                        case 2: return "Quota Exceeded";
                        default: return "Unknown";
                    }
                }, this)
            },{
                header: this.i18n._("Quota Size"),
                width: 150,
                dataIndex: 'size',
                renderer: Ext.bind(this.megaByteRenderer, this)
            },{
                header: this.i18n._("Reason"),
                width: 100,
                flex: 1,
                dataIndex: 'reason'
            }]
        });
    }
});
//# sourceURL=hostMonitor.js