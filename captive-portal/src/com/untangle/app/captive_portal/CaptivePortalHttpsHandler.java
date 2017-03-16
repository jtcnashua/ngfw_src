/**
 * $Id$
 */

package com.untangle.app.captive_portal;

import java.nio.ByteBuffer;
import java.net.InetAddress;

import com.untangle.uvm.vnet.TCPNewSessionRequest;
import com.untangle.uvm.vnet.AbstractEventHandler;
import com.untangle.uvm.vnet.TCPNewSessionRequest;
import com.untangle.uvm.vnet.AppSession;
import com.untangle.uvm.vnet.AppTCPSession;
import com.untangle.uvm.UvmContextFactory;
import org.apache.log4j.Logger;

public class CaptivePortalHttpsHandler extends AbstractEventHandler
{
    private final Logger logger = Logger.getLogger(getClass());
    private final CaptivePortalApp captureNode;

    public CaptivePortalHttpsHandler(CaptivePortalApp node)
    {
        super(node);
        this.captureNode = node;
    }

    @Override
    public void handleTCPNewSessionRequest( TCPNewSessionRequest sessreq )
    {
        // look for our special attachment
        InetAddress special = (InetAddress) sessreq.globalAttachment(AppSession.KEY_CAPTIVE_PORTAL_REDIRECT);

        // if attachment not found we just release the session
        if (special == null) {
            sessreq.release();
            return;
        }

        logger.debug("Doing HTTPS-->HTTP redirect for " + special.getHostAddress().toString());

        // first we remove the attachment
        sessreq.globalAttach(AppSession.KEY_CAPTIVE_PORTAL_REDIRECT, null);

        CaptivePortalSSLEngine engine = new CaptivePortalSSLEngine(node.getAppSettings().getId().toString(),captureNode);
        sessreq.globalAttach(AppSession.KEY_CAPTIVE_PORTAL_SSL_ENGINE, engine);
    }

    @Override
    public void handleTCPClientChunk( AppTCPSession session, ByteBuffer data )
    {
        // get the SSL engine attached to the session
        CaptivePortalSSLEngine engine = (CaptivePortalSSLEngine) session.globalAttachment(AppSession.KEY_CAPTIVE_PORTAL_SSL_ENGINE);
        engine.handleClientData( session, data );
    }
}