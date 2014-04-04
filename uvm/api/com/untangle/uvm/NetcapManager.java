/*
 * $Id$
 */
package com.untangle.uvm;

import com.untangle.uvm.SessionMatcher;
import com.untangle.uvm.vnet.PipeSpec;

public interface NetcapManager
{    
    /** Get the number of sessions from the SessionTable */
    public int getSessionCount();

    /** Get the number of sessions from the SessionTable */
    public int getSessionCount( short protocol );

    /** See if a addr:port binding is already in use by an existing session */
    public boolean isTcpPortUsed( java.net.InetAddress addr, int port );
    
    /** Shutdown all of the sessions that match <code>matcher</code> */
    public void shutdownMatches( SessionMatcher matcher );
    public void shutdownMatches( SessionMatcher matcher, PipeSpec ps );
    
}
