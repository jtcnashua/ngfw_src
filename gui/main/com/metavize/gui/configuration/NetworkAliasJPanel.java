/*
 * Copyright (c) 2003,2004 Metavize Inc.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * Metavize Inc. ("Confidential Information").  You shall
 * not disclose such Confidential Information.
 *
 * $Id$
 */

package com.metavize.gui.configuration;

import com.metavize.gui.transform.*;
import com.metavize.gui.pipeline.MPipelineJPanel;
import com.metavize.gui.widgets.editTable.*;
import com.metavize.gui.util.*;

import java.awt.*;
import java.util.*;
import java.util.List;
import javax.swing.*;
import javax.swing.table.*;
import javax.swing.event.*;

import com.metavize.mvvm.NetworkingConfiguration;
import com.metavize.mvvm.InterfaceAlias;
import com.metavize.mvvm.tran.IPaddr;

public class NetworkAliasJPanel extends MEditTableJPanel{

    public NetworkAliasJPanel() {
        super(true, true);
        super.setFillJButtonEnabled( true );
        super.setInsets(new Insets(4, 4, 2, 2));
        super.setTableTitle("");
        super.setDetailsTitle("");
        super.setAddRemoveEnabled(true);
	super.setAuxJPanelEnabled(true);
        
	// add a basic description
	JLabel descriptionJLabel = new JLabel("XXX Put a description here.... XXX");
	auxJPanel.add(descriptionJLabel);

        // create actual table model
        InterfaceAliasModel interfaceAliasModel = new InterfaceAliasModel();
        this.setTableModel( interfaceAliasModel );

    }
    



class InterfaceAliasModel extends MSortedTableModel{ 
    
    private static final int  T_TW  = Util.TABLE_TOTAL_WIDTH;
    private static final int  C0_MW = Util.STATUS_MIN_WIDTH; /* status */
    private static final int  C1_MW = Util.LINENO_MIN_WIDTH; /* # */
    private static final int  C2_MW = 120;  /* address */
    private static final int  C3_MW = 120;  /* netmask */
    
    protected boolean getSortable(){ return false; }
    
    public TableColumnModel getTableColumnModel(){
        
        DefaultTableColumnModel tableColumnModel = new DefaultTableColumnModel();
        //                                 #   min    rsz    edit   remv   desc   typ            def
        addTableColumn( tableColumnModel,  0,  C0_MW, false, false, false, false, String.class,  null, sc.TITLE_STATUS );
        addTableColumn( tableColumnModel,  1,  C1_MW, false, false, false, false, Integer.class, null, sc.TITLE_INDEX );
        addTableColumn( tableColumnModel,  2,  C2_MW, false, true,  false, false, String.class, "1.2.3.4", "address" );
        addTableColumn( tableColumnModel,  3,  C3_MW, false, true,  false, false, String.class, "255.255.255.0", "netmask" );
        addTableColumn( tableColumnModel,  4, 10,     false, false, true,  false, InterfaceAlias.class, null, "");
        return tableColumnModel;
    }
    
    
    public void generateSettings(Object settings, Vector<Vector> tableVector, boolean validateOnly) throws Exception {        
        List<InterfaceAlias> elemList = new ArrayList(tableVector.size());
	InterfaceAlias newElem = null;
        int rowIndex = 0;

        for( Vector rowVector : tableVector ){
	    rowIndex++;
            newElem = (InterfaceAlias) rowVector.elementAt(4);
            try{ newElem.setAddress( IPaddr.parse((String)rowVector.elementAt(2)) ); }
            catch(Exception e){ throw new Exception("Invalid \"address\" in row: " + rowIndex); }
            try{ newElem.setNetmask( IPaddr.parse((String) rowVector.elementAt(3)) ); }
            catch(Exception e){ throw new Exception("Invalid \"netmask\" in row: " + rowIndex); }
            elemList.add(newElem);
        }
        
	// SAVE SETTINGS //////////
	if( !validateOnly ){
	    NetworkingConfiguration networkingConfiguraion = (NetworkingConfiguration) settings;
	    networkingConfiguraion.setAliasList( elemList );
	}
    }

    public Vector<Vector> generateRows(Object settings) {
        NetworkingConfiguration networkingConfiguration = (NetworkingConfiguration) settings;
	List<InterfaceAlias> interfaceAliasList = 
            (List<InterfaceAlias>) networkingConfiguration.getAliasList();
        Vector<Vector> allRows = new Vector<Vector>(interfaceAliasList.size());
	Vector tempRow = null;
        int rowIndex = 0;

        for( InterfaceAlias alias : interfaceAliasList ){
	    rowIndex++;
	    tempRow = new Vector(5);
	    tempRow.add( super.ROW_SAVED );
	    tempRow.add( rowIndex );
            tempRow.add( alias.getAddress().toString());
            tempRow.add( alias.getNetmask().toString());
	    tempRow.add( alias );
	    allRows.add( tempRow );
        }
        return allRows;
    }
    
    
}

}
