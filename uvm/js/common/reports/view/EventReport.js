Ext.define('Ung.view.reports.EventReport', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.eventreport',

    viewModel: {
        stores: {
            events: {
                data: '{eventsData}',
                listeners: {
                    datachanged: 'onDataChanged'
                }
            },
            props: {
                data: '{propsData}'
            }
        }
    },
    controller: 'eventreport',

    layout: 'border',

    border: false,
    bodyBorder: false,

    defaults: {
        border: false
    },

    items: [{
        xtype: 'ungrid',
        stateful: true,
        itemId: 'eventsGrid',
        reference: 'eventsGrid',
        region: 'center',
        bind: '{events}',
        plugins: ['gridfilters'],
        // emptyText: '<p style="text-align: center; margin: 0; line-height: 2;"><i class="fa fa-info-circle fa-2x"></i> <br/>No Records!</p>',
        enableColumnHide: true,
        listeners: {
            select: 'onEventSelect'
        }
    }, {
        xtype: 'unpropertygrid',
        itemId: 'eventsProperties',
        reference: 'eventsProperties',
        region: 'east',
        title: 'Details'.t(),
        collapsed: true,

        bind: {
            source: '{eventProperty}',
        }
    }]
});