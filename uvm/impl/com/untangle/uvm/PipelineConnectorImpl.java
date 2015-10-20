/**
* $Id$
 */
package com.untangle.uvm;

import java.util.Set;
import java.util.List;
import java.util.LinkedList;
import java.util.concurrent.ConcurrentHashMap;
import org.apache.log4j.Logger;

import com.untangle.uvm.node.Node;
import com.untangle.uvm.node.NodeProperties;
import com.untangle.uvm.vnet.PipelineConnector;
import com.untangle.uvm.vnet.NodeSession;
import com.untangle.uvm.vnet.NodeTCPSession;
import com.untangle.uvm.vnet.NodeUDPSession;
import com.untangle.uvm.vnet.Fitting;
import com.untangle.uvm.vnet.Subscription;
import com.untangle.uvm.vnet.Affinity;
import com.untangle.uvm.vnet.NodeSession;
import com.untangle.uvm.vnet.SessionEventHandler;
import com.untangle.uvm.node.Node;

/**
 * PipelineConnectorImpl is the implementation of a single PipelineConnector.
 * Status and control of a pipe happen here.
 * Events are handled in Dispatcher instead.
 */
public class PipelineConnectorImpl implements PipelineConnector
{
    /**
     * Active Sessions for this agent
     */
    private Set<NodeSession> activeSessions = java.util.Collections.newSetFromMap(new ConcurrentHashMap<NodeSession,Boolean>());

    private boolean enabled = true;

    private final Dispatcher dispatcher;
    private final String name;
    private final Node node;
    private final Subscription subscription;
    private final SessionEventHandler listener;
    private final Fitting inputFitting;
    private final Fitting outputFitting;
    private final Affinity affinity;
    private final Integer affinityStrength;

    /**
     * A nemesis is another pipelineConnector that this connector must not be adjacent to.
     * If it is, both this one and the nemesis will be removed from the pipeline.
     * This is used for casings where if the pipline looks like http-client-side -> http-server-side with nothing
     * in the middle, they will both be removed from the pipeline
     */
    private final String nemesis; 
    
    
    protected static final Logger logger = Logger.getLogger( PipelineConnectorImpl.class );
    
    public PipelineConnectorImpl( String name, Node node, Subscription subscription, SessionEventHandler listener, Fitting inputFitting, Fitting outputFitting, Affinity affinity, Integer affinityStrength )
    {
        this( name, node, subscription, listener, inputFitting, outputFitting, affinity, affinityStrength, null );
    }

    public PipelineConnectorImpl( String name, Node node, Subscription subscription, SessionEventHandler listener, Fitting inputFitting, Fitting outputFitting, Affinity affinity, Integer affinityStrength, String nemesis )
    {
        this.name = name;
        this.node = node;
        this.subscription = subscription;
        this.listener = listener;
        this.inputFitting = inputFitting;
        this.outputFitting = outputFitting;
        this.affinity = affinity;
        this.affinityStrength = affinityStrength;
        this.nemesis = nemesis;
        
        dispatcher = new Dispatcher(this);
        if (listener != null)
            dispatcher.setSessionEventHandler( listener );
    }
    
    public boolean isEnabled()
    {
        return enabled;
    }

    public void setEnabled(boolean enabled)
    {
        this.enabled = enabled;
    }

    public String getName() { return this.name; }
    public String getNemesis() { return this.nemesis; }
    public Node getNode() { return this.node; }
    public Node node() { return this.node; }
    public Affinity getAffinity() { return this.affinity; }
    public Integer getAffinityStrength() { return this.affinityStrength; }
    public Dispatcher getDispatcher() { return dispatcher; }

    public Fitting getInputFitting()
    {
        return inputFitting;
    }

    public Fitting getOutputFitting()
    {
        return outputFitting;
    }

    public NodeProperties nodeProperties()
    {
        return node().getNodeProperties();
    }

    public long[] liveSessionIds()
    {
        if (dispatcher == null)
            return new long[0];
        return dispatcher.liveSessionIds();
    }

    public List<NodeSession> liveSessions()
    {
        if (dispatcher != null)
            return dispatcher.liveSessions();
        else
            return null;
    }
    
    /**
     * This is called by the Node (or NodeManager?) to disconnect
     * from a live PipelineConnector. Since it is live we must be sure to shut down the
     * Dispatcher nicely (in comparison to shutdown, below).
     *
     */
    public void destroy()
    {
        try {
            this.dispatcher.killAllSessions();
        } catch (Exception x) {
            logger.info("Exception destroying PipelineConnector", x);
        }

        /* Remove all of the active sessions */
        activeSessions.clear();
    }


    /**
     * Add a session to the map of active sessions.
     * @return True if the session was added, false if the agent is dead, or the session
     *   has already been added.
     */
    public boolean addSession( NodeSession session )
    {
        return activeSessions.add( session );
    }

    /**
     * Remove a session from the map of active sessions associated with this netcap agent.
     * @return True if the session was removed, false if the session was not in the list 
     *   of active session.
     */
    public boolean removeSession( NodeSession session )
    {
        return activeSessions.remove( session );
    }

    public boolean matches( com.untangle.uvm.node.SessionTuple tuple )
    {
        if ( !enabled ) {
            return false;
        }
        
        if ( subscription != null && ! subscription.matches( tuple ) ) {
            return false;
        }

        return true;
    }
    
    public String toString()
    {
        return this.name;
    }
}
