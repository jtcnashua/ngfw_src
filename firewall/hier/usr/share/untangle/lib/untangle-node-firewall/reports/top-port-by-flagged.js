{
    "uniqueId": "firewall-4UsnhNrCgI",
    "category": "Firewall",
    "description": "The number of flagged session grouped by server (destination) port.",
    "displayOrder": 701,
    "enabled": true,
    "javaClass": "com.untangle.node.reporting.ReportEntry",
    "orderByColumn": "value",
    "orderDesc": true,
    "units": "hits",
    "pieGroupColumn": "s_server_port",
    "pieSumColumn": "count(*)",
    "conditions": [
        {
            "javaClass": "com.untangle.node.reporting.SqlCondition",
            "column": "firewall_flagged",
            "operator": "=",
            "value": "true"
        }
    ],
    "readOnly": true,
    "table": "sessions",
    "title": "Top Flagged Server Ports",
    "type": "PIE_GRAPH"
}
