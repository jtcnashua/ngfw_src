CREATE INDEX tr_nat_evt_dhcp_idx     ON tr_nat_evt_dhcp     ( time_stamp );
CREATE INDEX tr_nat_evt_dhcp_abs_idx ON tr_nat_evt_dhcp_abs ( time_stamp );

-- Use 3 days to make sure there are no lease events that other logs may need
DELETE FROM tr_nat_evt_dhcp_abs WHERE time_stamp < ((:cutoff)::timestamp - interval '3 days' );
DELETE FROM tr_nat_evt_dhcp     WHERE time_stamp < ((:cutoff)::timestamp - interval '3 days' );

ANALYZE tr_nat_evt_dhcp;
ANALYZE tr_nat_evt_dhcp_abs;

DELETE FROM tr_nat_evt_dhcp_abs_leases
    WHERE NOT EXISTS
        (SELECT 1 FROM tr_nat_evt_dhcp_abs
            WHERE tr_nat_evt_dhcp_abs_leases.event_id = event_id);

DELETE FROM dhcp_abs_lease
    WHERE NOT EXISTS
        (SELECT 1 FROM tr_nat_evt_dhcp_abs_leases
            WHERE dhcp_abs_lease.event_id = lease_id);

DROP INDEX tr_nat_evt_dhcp_idx;
DROP INDEX tr_nat_evt_dhcp_abs_idx;

-- Delete all of the old events from statistics
DELETE FROM tr_nat_statistic_evt WHERE time_stamp < (:cutoff)::timestamp

