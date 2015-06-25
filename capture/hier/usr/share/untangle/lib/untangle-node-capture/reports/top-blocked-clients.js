{
    "uniqueId": "captive-portal-IPiZ5SS7",
    "category": "Captive Portal",
    "description": "The top clients that were blocked by Captive Portal because they were not logged in.",
    "displayOrder": 300,
    "enabled": true,
    "javaClass": "com.untangle.node.reporting.ReportEntry",
    "orderByColumn": "value",
    "orderDesc": true,
    "units": "hits",
    "pieGroupColumn": "client_addr",
    "pieSumColumn": "count(*)",
    "readOnly": true,
    "table": "capture_user_events",
    "conditions": [
        {
            "javaClass": "com.untangle.node.reporting.SqlCondition",
            "column": "event_info",
            "operator": "=",
            "value": "FAILED"
        }
    ],
    "title": "Top Blocked Clients",
    "type": "PIE_GRAPH"
}

