/**
 * $Id: ReportingManagerNewImpl.java,v 1.00 2015/03/04 13:59:12 dmorris Exp $
 */
package com.untangle.node.reporting;

import java.util.ArrayList;

import org.apache.log4j.Logger;

import com.untangle.uvm.ExecManagerResult;
import com.untangle.uvm.UvmContextFactory;

public class ReportingManagerNewImpl implements ReportingManagerNew
{
    private static final Logger logger = Logger.getLogger(ReportingManagerNewImpl.class);

    private ArrayList<ReportEntry> reportEntries;

    private ReportingNodeImpl node;

    public ReportingManagerNewImpl( ReportingNodeImpl node )
    {
        this.node = node;

        loadReportEntries();
    }

    public ArrayList<ReportEntry> getReportEntries()
    {
        return this.reportEntries;
    }

    public void setReportEntries( ArrayList<ReportEntry> newEntries )
    {
        this.reportEntries = newEntries;

        try {
            String nodeID = node.getNodeSettings().getId().toString();
            String settingsFileName = System.getProperty("uvm.settings.dir") + "/untangle-node-reporting/" + "report_entries_" + nodeID + ".js";
            UvmContextFactory.context().settingsManager().save( settingsFileName, this.reportEntries );
        } catch ( Exception e ) {
            logger.warn( "Failed to save report entries.", e );
        }
    }

    @SuppressWarnings("unchecked")
    private void loadReportEntries()
    {
        try {
            String nodeID = node.getNodeSettings().getId().toString();
            String settingsFileName = System.getProperty("uvm.settings.dir") + "/untangle-node-reporting/" + "report_entries_" + nodeID + ".js";

            logger.info("Loading report entries from file... ");
            ArrayList<ReportEntry> reportEntries = UvmContextFactory.context().settingsManager().load( ArrayList.class, settingsFileName );

            if ( reportEntries == null ) {
                reportEntries = new ArrayList<ReportEntry>();
            }

            checkForNewReportEntries( reportEntries );

        } catch (Exception e) {
            logger.warn( "Failed to load report entries", e );
        }
    }

    private void checkForNewReportEntries( ArrayList<ReportEntry> reportEntries )
    {
        String cmd = "/usr/bin/find " + System.getProperty("uvm.lib.dir") + " -path '*/reports/*.js' -print";
        ExecManagerResult result = UvmContextFactory.context().execManager().exec( cmd );
        if (result.getResult() != 0) {
            logger.warn("Failed to find report entries: \"" + cmd + "\" -> "  + result.getResult());
            return;
        }
        try {
            boolean added = false;
            String lines[] = result.getOutput().split("\\r?\\n");
            logger.info("Creating Schema: ");
            for ( String line : lines ) {
                logger.info("Reading file: " + line);
                try {
                    ReportEntry newEntry = UvmContextFactory.context().settingsManager().load( ReportEntry.class, line );
                    if ( ! reportEntriesContainsEntryWithTitle( reportEntries, newEntry.getTitle() ) ) {
                        logger.info("Adding new Report Entry: " + newEntry.getTitle());
                        reportEntries.add( newEntry );
                        added = true;
                    }
                } catch (Exception e) {
                    logger.warn( "Failed to read report entry from: " + line, e );
                }
            }

            if ( added ) {
                setReportEntries( reportEntries );
            }
            
        } catch (Exception e) {
            logger.warn( "Failed to check for new entries.", e );
        }

        return;
    }

    private boolean reportEntriesContainsEntryWithTitle( ArrayList<ReportEntry> reportEntries, String title )
    {
        if ( title == null )
            return false;
        
        for ( ReportEntry reportEntry : reportEntries ) {
            if ( title.equals( reportEntry.getTitle() ) )
                return true;
        }

        return false;
    }
    
}