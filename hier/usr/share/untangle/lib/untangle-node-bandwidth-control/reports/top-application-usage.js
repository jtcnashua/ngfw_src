{
    "uniqueId": "bandwidth-control-QwE1I0RYym",
    "category": "Bandwidth Control",
    "description": "The bandwidth usage of the top applications.",
    "displayOrder": 600,
    "enabled": true,
    "javaClass": "com.untangle.node.reports.ReportEntry",
    "orderDesc": false,
    "units": "bytes/s",
    "readOnly": true,
    "table": "session_minutes",
    "timeDataInterval": "AUTO",
    "timeDataDynamicValue": "(s2c_bytes+c2s_bytes)/60",
    "timeDataDynamicColumn": "application_control_application",
    "timeDataDynamicLimit": "10",
    "timeDataDynamicAggregationFunction": "sum",
    "timeDataDynamicAllowNull", true,
    "timeStyle": "AREA_STACKED",
    "title": "Top Applications Usage",
    "type": "TIME_GRAPH_DYNAMIC"
}
