/*
 * $HeadURL$
 * Copyright (c) 2003-2007 Untangle, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but
 * AS-IS and WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE, TITLE, or
 * NONINFRINGEMENT.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
package com.untangle.node.router.gui;

import java.awt.Insets;
import java.util.*;
import javax.swing.*;
import javax.swing.event.*;
import javax.swing.table.*;

import com.untangle.gui.node.*;
import com.untangle.gui.util.*;
import com.untangle.gui.widgets.editTable.*;
import com.untangle.node.router.*;
import com.untangle.uvm.IntfEnum;
import com.untangle.uvm.networking.RedirectRule;
import com.untangle.uvm.node.*;
import com.untangle.uvm.node.firewall.intf.IntfDBMatcher;
import com.untangle.uvm.node.firewall.intf.IntfMatcherFactory;
import com.untangle.uvm.node.firewall.ip.IPMatcherFactory;
import com.untangle.uvm.node.firewall.port.PortMatcherFactory;
import com.untangle.uvm.node.firewall.protocol.ProtocolMatcherFactory;

public class RedirectJPanel extends MEditTableJPanel {


    public RedirectJPanel() {
        super(true, true);
        super.setFillJButtonEnabled( true );
        super.setInsets(new Insets(4, 4, 2, 2));
        super.setTableTitle("");
        super.setDetailsTitle("");
        super.setAddRemoveEnabled(true);

        // create actual table model
        RedirectTableModel redirectTableModel = new RedirectTableModel();
        //redirectTableModel.setOrderModelIndex(0);
        this.setTableModel( redirectTableModel );

    }



    class RedirectTableModel extends MSortedTableModel<Object>{

        private static final int  T_TW = Util.TABLE_TOTAL_WIDTH_LARGE;
        private static final int  C0_MW = Util.STATUS_MIN_WIDTH; /* status */
        private static final int  C1_MW = Util.LINENO_EDIT_MIN_WIDTH; /* # */
        private static final int  C2_MW = 75;   /* redirect */
        private static final int  C3_MW = 55;   /* log */
        private static final int  C4_MW = 100;  /* traffic type */
        private static final int  C5_MW = 145;  /* source interface */
        private static final int  C6_MW = 145;  /* destination interface */
        private static final int  C7_MW = 130;  /* source address */
        private static final int  C8_MW = 130;  /* destination address */
        private static final int  C9_MW = 110;  /* source port */
        private static final int C10_MW = 110;  /* destination port */
        private static final int C11_MW = 130;  /* redirect to new address */
        private static final int C12_MW = 110;  /* redirect to new port */
        private static final int C13_MW = 120;  /* category */

        private final int C14_MW = Util.chooseMax(T_TW - (C0_MW + C1_MW + C2_MW + C3_MW + C4_MW + C5_MW + C6_MW + C7_MW + C8_MW + C9_MW + C10_MW + C11_MW + C12_MW + C13_MW), 120); /* description */


        private ComboBoxModel protocolModel = super.generateComboBoxModel( ProtocolMatcherFactory.getProtocolEnumeration(), ProtocolMatcherFactory.getProtocolDefault() );


        protected boolean getSortable(){ return false; }

        public TableColumnModel getTableColumnModel(){
            IntfMatcherFactory imf = IntfMatcherFactory.getInstance();
            IntfEnum intfEnum = Util.getIntfManager().getIntfEnum();

            UtComboBoxModel sIfaceModel = super.generateComboBoxModel( imf.getEnumeration(), imf.getDefault() );
            sIfaceModel.insertElementAt(new UtComboBoxRenderer.Separator(), 1);
            sIfaceModel.insertElementAt(new UtComboBoxRenderer.Separator(), sIfaceModel.getSize() - 2);

            UtComboBoxModel cIfaceModel = super.generateComboBoxModel( imf.getEnumeration(), imf.getDefault() );
            cIfaceModel.insertElementAt(new UtComboBoxRenderer.Separator(), 1);
            cIfaceModel.insertElementAt(new UtComboBoxRenderer.Separator(), cIfaceModel.getSize() - 2);

            DefaultTableColumnModel tableColumnModel = new DefaultTableColumnModel();
            //                                 #   min    rsz    edit   remv   desc   typ            def
            addTableColumn( tableColumnModel,  0,  C0_MW, false, false, true, false, String.class,  null, sc.TITLE_STATUS );
            addTableColumn( tableColumnModel,  1,  C1_MW, false, true,  false, false, Integer.class, null, sc.TITLE_INDEX );
            addTableColumn( tableColumnModel,  2,  C2_MW, false, true,  false, false, Boolean.class, "true", sc.bold("enable") );
            addTableColumn( tableColumnModel,  3,  C3_MW, false, true,  false, false, Boolean.class, "false",  sc.bold("log"));
            addTableColumn( tableColumnModel,  4,  C4_MW, false, true,  false, false, ComboBoxModel.class, protocolModel, sc.html("traffic<br>type") );
            addTableColumn( tableColumnModel,  5,  C5_MW, false, true,  false, false, ComboBoxModel.class, sIfaceModel, sc.html( "source<br>interface" ));
            addTableColumn( tableColumnModel,  6,  C6_MW, false, true,  false, false, ComboBoxModel.class, cIfaceModel, sc.html( "destination<br>interface" ));
            addTableColumn( tableColumnModel,  7,  C7_MW, true,  true,  false, false, String.class, "1.2.3.4", sc.html("source<br>address") );
            addTableColumn( tableColumnModel,  8,  C8_MW, true,  true,  false, false, String.class, "1.2.3.4", sc.html("destination<br>address") );
            addTableColumn( tableColumnModel,  9,  C9_MW, true,  true,  false, false, String.class, "any", sc.html("source<br>port") );
            addTableColumn( tableColumnModel, 10, C10_MW, true,  true,  false, false, String.class, "2-5", sc.html("destination<br>port") );
            addTableColumn( tableColumnModel, 11, C11_MW, true,  true,  false, false, String.class, "1.2.3.4", sc.html("redirect to<br>new address") );
            addTableColumn( tableColumnModel, 12, C12_MW, true,  true,  false, false, String.class, "5", sc.html("redirect to<br>new port") );
            addTableColumn( tableColumnModel, 13, C13_MW, true,  true,  true,  false, String.class, sc.EMPTY_CATEGORY, sc.TITLE_CATEGORY);
            addTableColumn( tableColumnModel, 14, C14_MW, true,  true,  false, true,  String.class, sc.EMPTY_DESCRIPTION, sc.TITLE_DESCRIPTION);
            addTableColumn( tableColumnModel, 15, 10,     false, false, true,  false, RedirectRule.class, null, "");
            return tableColumnModel;
        }


        public void generateSettings(Object settings, Vector<Vector> tableVector, boolean validateOnly) throws Exception {
            List elemList = new ArrayList(tableVector.size());
            RedirectRule newElem = null;
            int rowIndex = 0;

            for( Vector rowVector : tableVector ){
                rowIndex++;
                newElem = (RedirectRule) rowVector.elementAt(15);
                newElem.setLive( (Boolean) rowVector.elementAt(2) );
                newElem.setLog( (Boolean) rowVector.elementAt(3) );
                newElem.setProtocol( ProtocolMatcherFactory.parse(((ComboBoxModel) rowVector.elementAt(4)).getSelectedItem().toString()) );
                newElem.setSrcIntf( (IntfDBMatcher) ((ComboBoxModel) rowVector.elementAt(5)).getSelectedItem());
                newElem.setDstIntf( (IntfDBMatcher) ((ComboBoxModel) rowVector.elementAt(6)).getSelectedItem());
                try{ newElem.setSrcAddress( IPMatcherFactory.parse((String) rowVector.elementAt(7)) ); }
                catch(Exception e){ throw new Exception("Invalid \"source address\" in row: " + rowIndex); }
                try{ newElem.setDstAddress( IPMatcherFactory.parse((String) rowVector.elementAt(8)) ); }
                catch(Exception e){ throw new Exception("Invalid \"destination address\" in row: " + rowIndex); }
                try{ newElem.setSrcPort( PortMatcherFactory.parse((String) rowVector.elementAt(9)) ); }
                catch(Exception e){ throw new Exception("Invalid \"source port\" in row: " + rowIndex); }
                try{ newElem.setDstPort( PortMatcherFactory.parse((String) rowVector.elementAt(10)) ); }
                catch(Exception e){ throw new Exception("Invalid \"destination port\" in row: " + rowIndex); }
                try{ newElem.setRedirectAddress((String) rowVector.elementAt(11)); }
                catch(Exception e){ throw new Exception("Invalid \"redirect address\" in row: " + rowIndex); }
                try{ newElem.setRedirectPort((String) rowVector.elementAt(12)); }
                catch(Exception e){ throw new Exception("Invalid \"redirect port\" in row: " + rowIndex); }
                newElem.setCategory( (String) rowVector.elementAt(13) );
                newElem.setDescription( (String) rowVector.elementAt(14) );
                newElem.setDstRedirect( true );  // For now, all redirects are destination redirects
                newElem.setLocalRedirect( false );

                elemList.add(newElem);
            }

            // SAVE SETTINGS ////////////
            if( !validateOnly ){
                RouterCommonSettings routerSettings = (RouterCommonSettings) settings;
                routerSettings.setGlobalRedirectList( elemList );
            }
        }


        public Vector<Vector> generateRows(Object settings) {
            IntfMatcherFactory imf = IntfMatcherFactory.getInstance();
            IntfEnum intfEnum = Util.getIntfManager().getIntfEnum();
            imf.updateEnumeration(intfEnum);

            RouterCommonSettings routerSettings = (RouterCommonSettings) settings;
            List<RedirectRule> redirectList = (List<RedirectRule>) routerSettings.getGlobalRedirectList();
            Vector<Vector> allRows = new Vector<Vector>(redirectList.size());
            Vector tempRow = null;
            int rowIndex = 0;

            for( RedirectRule redirectRule : redirectList ){
                rowIndex++;
                tempRow = new Vector(15);
                tempRow.add( super.ROW_SAVED );
                tempRow.add( rowIndex );
                tempRow.add( redirectRule.isLive() );
                tempRow.add( redirectRule.getLog() );
                tempRow.add( super.generateComboBoxModel( ProtocolMatcherFactory.getProtocolEnumeration(), redirectRule.getProtocol().toString() ) );

                UtComboBoxModel interfaceModel = super.generateComboBoxModel( imf.getEnumeration(), redirectRule.getSrcIntf());
                interfaceModel.insertElementAt(new UtComboBoxRenderer.Separator(), 1);
                interfaceModel.insertElementAt(new UtComboBoxRenderer.Separator(), interfaceModel.getSize() - 2);
                tempRow.add(interfaceModel);
                interfaceModel = super.generateComboBoxModel( imf.getEnumeration(), redirectRule.getDstIntf());
                interfaceModel.insertElementAt(new UtComboBoxRenderer.Separator(), 1);
                interfaceModel.insertElementAt(new UtComboBoxRenderer.Separator(), interfaceModel.getSize() - 2);
                tempRow.add(interfaceModel);

                tempRow.add( redirectRule.getSrcAddress().toString() );
                tempRow.add( redirectRule.getDstAddress().toString() );
                tempRow.add( redirectRule.getSrcPort().toString() );
                tempRow.add( redirectRule.getDstPort().toString() );
                tempRow.add( redirectRule.getRedirectAddressString().toString() );
                tempRow.add( redirectRule.getRedirectPortString() );
                tempRow.add( redirectRule.getCategory() );
                tempRow.add( redirectRule.getDescription() );
                tempRow.add( redirectRule );
                allRows.add( tempRow );
            }

            return allRows;
        }

    }

}
