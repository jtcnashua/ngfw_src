/*

* Copyright (c) 2003-2007 Untangle, Inc.
* All rights reserved.
*
* This software is the confidential and proprietary information of
* Untangle, Inc. ("Confidential Information"). You shall
* not disclose such Confidential Information.
*
* $Id$
*/

package com.untangle.node.virus;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.Type;

/**
 * Virus control: Definition of virus control settings (either
 * direction)
 *
 * @author <a href="mailto:jdi@untangle.com">John Irwin</a>
 * @version 1.0
 */
@Entity
@Table(name="n_virus_imap_config", schema="settings")
public class VirusIMAPConfig extends VirusMailConfig implements Serializable
{
    private static final long serialVersionUID = 7520156745253589027L;


    /* settings */
    private VirusMessageAction zMsgAction = VirusMessageAction.REMOVE;

    // constructor ------------------------------------------------------------

    public VirusIMAPConfig() { }

    public VirusIMAPConfig(boolean bScan,
                           VirusMessageAction zMsgAction,
                           String zNotes,
                           String subjectTemplate,
                           String bodyTemplate)
    {
        super(bScan, zNotes, subjectTemplate, bodyTemplate);
        this.zMsgAction = zMsgAction;
    }

    /**
     * messageAction: a string specifying a response if a message
     * contains virus (defaults to CLEAN) one of CLEAN or PASS
     *
     * @return the action to take if a message is judged to be virus.
     */
    @Column(name="action", nullable=false)
    @Type(type="com.untangle.node.virus.VirusMessageActionUserType")
    public VirusMessageAction getMsgAction()
    {
        return zMsgAction;
    }

    public void setMsgAction(VirusMessageAction zMsgAction)
    {
        // Guard XXX
        this.zMsgAction = zMsgAction;
        return;
    }

    /* for GUI */
    @Transient
    public String[] getMsgActionEnumeration()
    {
        VirusMessageAction[] azMsgAction = VirusMessageAction.getValues();
        String[] azStr = new String[azMsgAction.length];

        for (int i = 0; i < azMsgAction.length; i++)
            azStr[i] = azMsgAction[i].toString();

        return azStr;
    }
}
