{
    "uniqueId": "intrusion-prevention-qqyU6Nsv",
    "category": "Intrusion Prevention",
    "description": "The number of intrusions blocked by destination IP address.",
    "displayOrder": 702,
    "enabled": true,
    "javaClass": "com.untangle.node.reporting.ReportEntry",
    "orderByColumn": "value",
    "orderDesc": true,
    "units": "hits",
    "pieGroupColumn": "dest_addr",
    "pieSumColumn": "count(*)",
    "conditions": [{
        "column": "blocked",
        "javaClass": "com.untangle.node.reporting.SqlCondition",
        "operator": "=",
        "value": "true"
    }],
    "readOnly": true,
    "table": "intrusion_prevention_events",
    "title": "Top Destination IP Addresses (blocked)",
    "type": "PIE_GRAPH"
}
