/**
 * $Id$
 */
package com.untangle.uvm;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.untangle.jnetcap.NetcapSession;
import com.untangle.jnetcap.NetcapTCPSession;
import com.untangle.jnetcap.NetcapUDPSession;
import com.untangle.uvm.node.SessionEvent;
import com.untangle.uvm.node.SessionTuple;

/**
 * This stores the global system-wide state for a given session
 */
public class SessionGlobalState
{
    private final Logger logger = Logger.getLogger(getClass());

    protected final NetcapSession netcapSession;

    protected final long id;
    protected final short protocol;
    protected final long creationTime;
    
    protected final SideListener clientSideListener;
    protected final SideListener serverSideListener;

    protected final NetcapHook netcapHook;

    protected String user; 
    protected SessionEvent sessionEvent = null;
    protected SessionTuple sessionTuple = null;
    protected long endTime = 0;
    protected long lastUpdateBytes = 0;
    
    /**
     * This is the global list of attachments for this session
     * It is used by various parts of the platform and apps to store metadata about the session
     */
    protected HashMap<String,Object> stringAttachments;

    /**
     * Stores a list of the original agents/pipelinespecs processing this session
     * Note: Even if a node/agent releases a session it will still be in this list
     * This is used for resetting sessions with killMatchingSessions so we can only reset
     * sessions that were originally processed by the node calling killMatchingSessions
     */
    private List<PipelineConnectorImpl> originalAgents;
    
    SessionGlobalState( NetcapSession netcapSession, SideListener clientSideListener, SideListener serverSideListener, NetcapHook netcapHook )
    {
        this.netcapHook = netcapHook;
        this.netcapSession = netcapSession;

        id = netcapSession.id();
        creationTime = System.currentTimeMillis();
        protocol = netcapSession.getProtocol();
        user = null;

        this.clientSideListener = clientSideListener;
        this.serverSideListener = serverSideListener;

        this.stringAttachments = new HashMap<String,Object>();
    }

    public long id()
    {
        return id;
    }
    
    public short getProtocol()
    {
        return protocol;
    }

    public long getCreationTime()
    {
        return this.creationTime;
    }

    public long getEndTime() { return this.endTime; }
    public void setEndTime( long newValue ) { this.endTime = newValue; }

    public long getLastUpdateBytes() { return this.lastUpdateBytes; }
    public void setLastUpdateBytes( long newValue ) { this.lastUpdateBytes = newValue; }
    
    public String user() { return this.user; }
    public void setUser( String newValue ) { this.user = newValue; }

    public SessionEvent getSessionEvent() { return this.sessionEvent; }
    public void setSessionEvent( SessionEvent newValue ) { this.sessionEvent = newValue; }

    public SessionTuple getSessionTuple() { return this.sessionTuple; }
    public void setSessionTuple( SessionTuple newValue ) { this.sessionTuple = newValue; }
    
    public NetcapSession netcapSession()
    {
        return netcapSession;
    }

    /**
     * Retrieve the netcap TCP Session.  If this is not a TCP session, this will throw an exception.
     */
    public NetcapTCPSession netcapTCPSession()
    {
        return (NetcapTCPSession)netcapSession;
    }

    /**
     * Retrieve the netcap UDP Session.  If this is not a UDP session, this will throw an exception.
     */
    public NetcapUDPSession netcapUDPSession()
    {
        return (NetcapUDPSession)netcapSession;
    }

    public SideListener clientSideListener()
    {
        return clientSideListener;
    }

    public SideListener serverSideListener()
    {
        return serverSideListener;
    }

    public List<PipelineConnectorImpl> getPipelineConnectors()
    {
        return originalAgents;
    }

    public String getPipelineDescription()
    {
        if ( originalAgents == null )
            return "null";

        String pipelineDescription = "";
        boolean first = true;
        for ( PipelineConnectorImpl connector: originalAgents ) {
            pipelineDescription += (first ? "" : "," ) + connector.getName();
            first = false;
        }

        return pipelineDescription;
    }
    
    public void setPipelineConnectorImpls( List<PipelineConnectorImpl> agents )
    {
        this.originalAgents = agents;
    }

    public NetcapHook netcapHook()
    {
        return netcapHook;
    }

    public Object attach(String key, Object attachment)
    {
        logger.debug("globalAttach( " + key + " , " + attachment + " )");
        return this.stringAttachments.put(key,attachment);
    }

    public Object attachment(String key)
    {
        return this.stringAttachments.get(key);
    }

    public Map<String,Object> getAttachments()
    {
        return this.stringAttachments;
    }

    public String toString()
    {
        return (sessionEvent == null ? "null" : sessionEvent.toString());
    }
}
