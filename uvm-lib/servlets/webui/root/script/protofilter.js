//<script type="text/javascript">
if(!Ext.untangle._hasResource["Ext.untangle.ProtocolControlSettings"]) {
Ext.untangle._hasResource["Ext.untangle.ProtocolControlSettings"]=true;

Ext.grid.CheckColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype ={
    init: function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    onMouseDown: function(e, t){
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
        }
    },

    renderer: function(value, metadata, record){
        metadata.css += ' x-grid3-check-col-td'; 
        return '<div class="x-grid3-check-col'+(value?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }
};
Ext.grid.EditColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};
Ext.grid.EditColumn.prototype ={
    init: function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    onMouseDown: function(e, t){
        if(t.className && t.className.indexOf('editRow') != -1){
            e.stopEvent();
           var index = this.grid.getView().findRowIndex(t);
           var record = this.grid.store.getAt(index);
            //populate row editor
           this.grid.rowEditor.show();
        }
    },

    renderer: function(value, metadata, record){
        return '<div class="editRow">&nbsp;</div>';
    }
};
Ext.grid.RemoveColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};
Ext.grid.RemoveColumn.prototype ={
    init: function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    onMouseDown: function(e, t){
        if(t.className && t.className.indexOf('removeRow') != -1){
            e.stopEvent();
            
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            this.grid.store.remove(record);
            //alert("Delete row:"+index+"\n"+record.data);
        }
    },

    renderer: function(value, metadata, record){
        return '<div class="removeRow">&nbsp;</div>';
    }
};

Ext.untangle.ProtocolControlSettings = Ext.extend(Ext.untangle.Settings, {
    node:null,
    tabs: null,
    storePL: null,
    gridPL: null,
    gridEventLog: null,
    rowEditPL: null,
    rpc: null,
    onRender: function(container, position) {
    	//alert("Render protocol control");
    	var el= document.createElement("div");
	    container.dom.insertBefore(el, position);
        this.el = Ext.get(el);
    	this.rpc={};
    	this.rpc.repository={};
    	Ext.untangle.ProtocolControlSettings.instanceId=this.getId();
    	if(this.node.nodeContext.node.eventManager==null) {
			this.node.nodeContext.node.eventManager=this.node.nodeContext.node.getEventManager();
		}
		this.rpc.node = this.node.nodeContext.node;
		this.rpc.eventManager=this.node.nodeContext.node.eventManager;
	    // create the data store
	    this.storePL = new Ext.data.JsonStore({
	        fields: [
	           {name: 'category'},
	           {name: 'protocol'},
	           {name: 'blocked'},
	           {name: 'log'},
	           {name: 'description'},
	           {name: 'definition'},
	        ]
	    });
	    // the column model has information about grid columns
	    // dataIndex maps the column to the specific data field in
	    // the data store (created below)
	    
	    var blockedColumn = new Ext.grid.CheckColumn({
	       header: "<b>block</b>", width: 40, dataIndex: 'blocked', fixed:true
	    });
	    var logColumn = new Ext.grid.CheckColumn({
	       header: "<b>log</b>", width: 35, dataIndex: 'log', fixed:true
	    });
	    var editColumn=new Ext.grid.EditColumn({
	    	header: "Edit", width: 35, fixed:true, dataIndex: null
	    });
	    var removeColumn=new Ext.grid.RemoveColumn({
	    	header: "Delete", width: 40, fixed:true, dataIndex: null
	    });
	    var cmPL = new Ext.grid.ColumnModel([
	          {id:'category',header: "category", width: 140,  dataIndex: 'category',
		          editor: new Ext.form.TextField({allowBlank: false})
	          },
	          {id:'protocol',header: "protocol", width: 100, dataIndex: 'protocol',
		          editor: new Ext.form.TextField({allowBlank: false})
	          },
	          blockedColumn,
	          logColumn,
	          {id:'description',header: "description", width: 120, dataIndex: 'description',
		          editor: new Ext.form.TextField({allowBlank: false})
	          },
	          {id:'definition',header: "signature", width: 120, dataIndex: 'definition',
		          editor: new Ext.form.TextField({allowBlank: false})
	          },
	          editColumn,
	          removeColumn
		]);
	
	    // by default columns are sortable
	    cmPL.defaultSortable = false;
		
		var editPLTemplate=new Ext.Template(
		'<div class="inputLine"><span class="label">Category:</span><span class="formw"><input type="text" id="field_category_pl_{tid}" size="30"/></span></div>',
		'<div class="inputLine"><span class="label">Protocol:</span><span class="formw"><input type="text" id="field_protocol_pl_{tid}" size="30"/></span></div>',
		'<div class="inputLine"><span class="label">Block:</span><span class="formw"><input type="checkbox" id="field_blocked_pl_{tid}" /></span></div>',
		'<div class="inputLine"><span class="label">Log:</span><span class="formw"><input type="checkbox" id="field_log_pl_{tid}" /></span></div>',
		'<div class="inputLine"><span class="label">Description:</span><span class="formw"><input type="text" id="field_description_pl_{tid}" size="30"/></span></div>',
		'<div class="inputLine"><span class="label">Signature:</span><span class="formw"><input type="text" id="field_definition_pl_{tid}" size="30"/></span></div>'
		);
		var winHTML=editPLTemplate.applyTemplate({'tid':this.tid})
		this.rowEditPLWin=new Ext.Window({
                id: 'rowEditPLWin_'+this.tid,
                parentId: this.getId(),
                tid: this.tid,
                layout:'fit',
                modal:true,
                title:'Edit',
                closeAction:'hide',
                autoCreate:true,                
                width:400,
                height:300,
                draggable:false,
                resizable:false,
	            items: {
			        html: winHTML,
			        border: false,
			        deferredRender:false,
			        cls: 'windowBackground',
			        bodyStyle: 'background-color: transparent;'
			    },
			    buttons: [
			    	{
						'parentId':this.getId(),
				        'iconCls': 'helpIcon',
				        'text': 'Help',
				        'handler': function() {alert("TODO: Implement Help Page")}
			        },
			    	{
						'parentId':this.getId(),
				        'iconCls': 'saveIcon',
				        'text': 'Update',
				        'handler': function() {Ext.getCmp(this.parentId).rowEditPLWin.hide()}
			        },
			    	{
						'parentId':this.getId(),
				        'iconCls': 'cancelIcon',
				        'text': 'Cancel',
				        'handler': function() {Ext.getCmp(this.parentId).rowEditPLWin.hide()}
			        }
			    ],
				listeners: {
		       		'show': {
		       			fn: function() {
		       				var gridPL=Ext.getCmp(this.parentId).gridPL;
		       				var objPosition=gridPL.getPosition();
			        		this.setPosition(objPosition);
		       				//var objSize=gridPL.getSize();
			        		//this.setSize(objSize);
			        		
					    },
					    scope: this.rowEditPLWin
		        	}
		       },
		       initContent: function() {
		       		
		       },
		       
		       
			   
        });
		this.rowEditPLWin.render('container');
		this.rowEditPLWin.initContent();
		
		// create the Grid
	    this.gridPL = new Ext.grid.EditorGridPanel({
	        store: this.storePL,
	        cm: cmPL,
	        tbar:[{
		            text:'Add',
		            tooltip:'Add New Row',
		            iconCls:'add',
		            parentId:this.getId(),
		            handler: function() {
		            	var cmp=Ext.getCmp(this.parentId);
		            	var rec=new Ext.data.Record({"category":"","protocol":"","blocked":false,"log":false,"description":"","definition":""});
						cmp.gridPL.stopEditing();
						cmp.gridPL.getStore().insert(0, [rec]);
						cmp.gridPL.startEditing(0, 0);		            	
		            }
		        }],
	        stripeRows: true,
	        plugins:[blockedColumn,logColumn,editColumn,removeColumn],
	        autoExpandColumn: 'category',
	        clicksToEdit:1,
	        rowEditor:this.rowEditPLWin,
	        title:'Protocol List'
	    });
		
    	this.gridEventLog = new Ext.grid.GridPanel({
			store: new Ext.data.JsonStore({
		        fields: [
		           {name: 'timeStamp'},
		           {name: 'blocked'},
		           {name: 'pipelineEndpoints'},
		           {name: 'protocol'},
		           {name: 'blocked'},
		           {name: 'server'}
		        ]
	    	}),

			columns: [
			    {header: "timestamp", width: 120, sortable: true, dataIndex: 'timeStamp', renderer: function(value) {
			    	var date=new Date();
			    	date.setTime(value.time);
			    	return date.toLocaleString();
			    }},
			    {header: "action", width: 70, sortable: true, dataIndex: 'blocked', renderer: function(value) {return value?"blocked" : "passed"}},
			    {header: "client", width: 120, sortable: true, dataIndex: 'pipelineEndpoints', renderer: function(value) {return value==null?"" : value.CClientAddr.hostAddress+":"+value.CClientPort}},
			    {header: "request", width: 120, sortable: true, dataIndex: 'protocol'},
			    {header: "reason for action", width: 120, sortable: true, dataIndex: 'blocked', renderer: function(value) {return value?"blocked in block list" : "not blocked in block list"}},
			    {header: "server", width: 120, sortable: true, dataIndex: 'pipelineEndpoints', renderer: function(value) {return value==null?"" : value.SServerAddr.hostAddress+":"+value.SServerPort}}
			],
			//sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			title: 'Event Log',
			bbar: 
				[{ xtype:'tbtext',
				   text:'<span id="boxReposytoryDescEventLog_'+this.tid+'"></span>'},
				 {xtype:'tbbutton',
		            text:'Refresh',
		            tooltip:'Refresh',
		            iconCls:'iconRefresh',
		            parentId:this.getId(),
		            handler: function() {
		            	Ext.getCmp(this.parentId).refreshEventLog();	            	
		            }
		        }],
		    listeners: {
	       		'render': {
	       			fn: function() {
	       				this.rpc.eventManager.getRepositoryDescs(function (result, exception) {
							if(exception) {alert(exception.message); return;}
							var cmp=Ext.untangle.ProtocolControlSettings.getInstanceCmp();
							if(cmp!=null) {
								cmp.rpc.repositoryDescs=result;
								var out=[];
								out.push('<select id="selectReposytoryDescEventLog_'+cmp.tid+'">');
								var repList=cmp.rpc.repositoryDescs.list;
								for(var i=0;i<repList.length;i++) {
									var repDesc=repList[i];
									var selOpt=(i==0)?"selected":"";
									out.push('<option value="'+repDesc.name+'" '+selOpt+'>'+repDesc.name+'</option>');
								}
								out.push('</select>');
					    		
					    		var boxReposytoryDescEventLog=document.getElementById('boxReposytoryDescEventLog_'+cmp.tid);
					    		boxReposytoryDescEventLog.innerHTML=out.join("");
							}
						});
				    },
				    scope: this
	        	}
	       }
		});
    	
    	this.tabs = new Ext.TabPanel({
	        renderTo: this.getEl().id,
	        width: 690,
	        height: 400,
	        activeTab: 0,
	        frame: true,
	        deferredRender: false,
	        items: [
	            this.gridPL,
	            this.gridEventLog
	        ]
	    });
	    
	    ;
    },
    
    getSelectedEventLogRepository: function () {
    	var selObj=document.getElementById('selectReposytoryDescEventLog_'+this.tid);
    	var result=null;
    	if(selObj!=null && selObj.selectedIndex>=0) {
    		result = selObj.options[selObj.selectedIndex].value;
    	}
		return result;
    },
    
    loadPL: function() {
    	this.gridPL.getStore().loadData(this.rpc.settings.patterns.list);
    	
    },
    
    refreshEventLog: function() {
    	var selRepository=this.getSelectedEventLogRepository();
    	if(selRepository!=null) {
    		if(this.rpc.repository[selRepository]==null) {
    			this.rpc.repository[selRepository]=this.rpc.eventManager.getRepository(selRepository);
    		}
    		this.rpc.repository[selRepository].getEvents(function (result, exception) {
				if(exception) {alert(exception.message); return;}
				var events = result;
				aaa=result;
				var cmp=Ext.untangle.ProtocolControlSettings.getInstanceCmp();
				if(cmp!=null) {
					cmp.gridEventLog.getStore().loadData(events.list);
				}
			});
    	}
    },
    
    savePL: function() {
    	this.tabs.disable();
    	this.gridPL.getStore().commitChanges();
    	var recordsPL=this.gridPL.getStore().getRange();
    	var patternsList=[];
    	for(var i=0;i<recordsPL.length;i++) {
    		var pattern=recordsPL[i].data;
    		pattern.javaClass="com.untangle.node.protofilter.ProtoFilterPattern";
    		patternsList.push(pattern);
    	}
    	this.rpc.settings.patterns.list=patternsList;
    	this.rpc.settings.patterns.javaClass="java.util.ArrayList";
    	this.rpc.node.setProtoFilterSettings(function (result, exception) {
			if(exception) {alert(exception.message); return;}
			var cmp=Ext.untangle.ProtocolControlSettings.getInstanceCmp();
			if(cmp!=null) {
				cmp.tabs.enable();
			}
		}, this.rpc.settings);
    },
    
	loadData: function() {
		this.rpc.node.getProtoFilterSettings(function (result, exception) {
			if(exception) {alert(exception.message); return;}
			var cmp=Ext.untangle.ProtocolControlSettings.getInstanceCmp();
			if(cmp!=null) {
				cmp.rpc.settings=result;
				cmp.loadPL();
			}
		});
		
	},
	
	save: function() {
		this.savePL();
	}
});
Ext.untangle.ProtocolControlSettings.instanceId=null;
Ext.untangle.ProtocolControlSettings.getInstanceCmp =function() {
	var cmp=null;
	if(Ext.untangle.ProtocolControlSettings.instanceId!=null) {
		cmp=Ext.getCmp(Ext.untangle.ProtocolControlSettings.instanceId);
	}
	return cmp;
};
Ext.untangle.Settings.registerClassName('untangle-node-protofilter','Ext.untangle.ProtocolControlSettings')
Ext.reg('untangleProtocolControlSettings', Ext.untangle.ProtocolControlSettings);
}
//</script>