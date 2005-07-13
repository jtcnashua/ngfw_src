/*
 * 
 *
 * Created on March 25, 2004, 6:11 PM
 */

package com.metavize.tran.protofilter.gui;

import com.metavize.gui.transform.*;
import com.metavize.gui.pipeline.MPipelineJPanel;
import com.metavize.tran.protofilter.*;
import com.metavize.gui.widgets.editTable.*;
import com.metavize.gui.util.*;

import java.awt.*;
import javax.swing.*;
import javax.swing.table.*;
import java.util.Vector;
import javax.swing.event.*;

public class MTransformControlsJPanel extends com.metavize.gui.transform.MTransformControlsJPanel{
    
    private static final String NAME_BLOCK_LIST = "Protocol Block List";
    private static final String NAME_LOG = "Event Log";
    
    public MTransformControlsJPanel(MTransformJPanel mTransformJPanel) {
        super(mTransformJPanel);
    }

    protected void generateGui(){
	// BLOCK LIST /////
	ProtoConfigJPanel protoConfigJPanel = new ProtoConfigJPanel();
        this.mTabbedPane.addTab(NAME_BLOCK_LIST, null, protoConfigJPanel);
	super.savableMap.put(NAME_BLOCK_LIST, protoConfigJPanel);
	super.refreshableMap.put(NAME_BLOCK_LIST, protoConfigJPanel);

        // EVENT LOG ///////
        LogJPanel logJPanel = new LogJPanel(mTransformJPanel.getTransformContext().transform());
        this.mTabbedPane.addTab(NAME_LOG, null, logJPanel);
    }
    
}


