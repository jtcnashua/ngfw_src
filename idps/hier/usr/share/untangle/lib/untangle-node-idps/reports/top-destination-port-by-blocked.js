{
    "uniqueId": "intrusion-prevention-dco2NjjW",
    "category": "Intrusion Prevention",
    "description": "The number of intrusions blocked by destination port.",
    "displayOrder": 802,
    "enabled": true,
    "javaClass": "com.untangle.node.reporting.ReportEntry",
    "orderByColumn": "value",
    "orderDesc": true,
    "units": "hits",
    "pieGroupColumn": "dest_port",
    "pieSumColumn": "count(*)",
    "conditions": [{
        "column": "blocked",
        "javaClass": "com.untangle.node.reporting.SqlCondition",
        "operator": "=",
        "value": "true"
    }],
    "readOnly": true,
    "table": "intrusion_prevention_events",
    "title": "Top Destination Port (blocked)",
    "type": "PIE_GRAPH"
}
