{
    "category": "Captive Portal",
    "conditions": [
        {
            "column": "policy_id",
            "javaClass": "com.untangle.node.reporting.SqlCondition",
            "operator": "=",
            "value": ":policyId"
        },
        {
            "column": "captive_portal_blocked",
            "javaClass": "com.untangle.node.reporting.SqlCondition",
            "operator": "is",
            "value": "NOT NULL"
        }
    ],
    "defaultColumns": ["time_stamp","username","hostname","c_client_port","s_server_addr","s_server_port","captive_portal_rule_index","captive_portal_blocked"],
    "displayOrder": 10,
    "javaClass": "com.untangle.node.reporting.EventEntry",
    "table": "sessions",
    "title": "All Session Events",
    "uniqueId": "captive-portal-582CXXAAA1H"
}
