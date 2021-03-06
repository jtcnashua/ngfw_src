/**
 * $Id$
 */
package com.untangle.app.http;

import java.sql.Timestamp;
import java.net.URI;
import java.net.URISyntaxException;

import com.untangle.uvm.logging.LogEvent;
import com.untangle.uvm.app.SessionEvent;
import com.untangle.uvm.util.I18nUtil;

/**
 * Log event for a request.
 *
 */
@SuppressWarnings("serial")
public class HttpRequestEvent extends LogEvent
{
    private Long requestId;
    private HttpMethod method;
    private URI requestUri;
    private SessionEvent sessionEvent;
    private String host;
    private String domain;
    private String referer;
    private long contentLength;

    public HttpRequestEvent() { }

    public HttpRequestEvent( RequestLine requestLine, String host, String referer, long contentLength )
    {
        this.host = host;
        this.domain = getDomainForHost( host );
        this.contentLength = contentLength;
        this.requestId = requestLine.getRequestId();
        this.timeStamp = requestLine.getTimeStamp();
        this.method = requestLine.getMethod();
        this.requestUri = requestLine.getRequestUri();
        this.sessionEvent = requestLine.getSessionEvent();
        this.referer = referer;
    }

    /**
     * The host, as specified by the request header.
     */
    public String getHost() { return host; }
    public void setHost( String newValue )
    {
        this.host = newValue;
        this.domain = getDomainForHost( host );
    }

    /**
     * The host, as specified by the request header.
     */
    public String getDomain() { return domain; }
    public void setDomain( String newValue ) { this.domain = newValue; }
    
    /**
     * Content length, as counted by the parser.
     */
    public long getContentLength() { return contentLength; }
    public void setContentLength( long newValue ) { this.contentLength = newValue; }

    /**
     * Get the requestId
     */
    public Long getRequestId() { return this.requestId; }
    public void setRequestId(  Long newValue  ) { this.requestId = newValue; }
    
    /**
     * Request method.
     */
    public HttpMethod getMethod() { return method; }
    public void setMethod( HttpMethod newValue ) { this.method = newValue; }

    /**
     * Request URI.
     */
    public URI getRequestUri() { return requestUri; }
    public void setRequestUri( URI newValue ) { this.requestUri = newValue; }

    /**
     * The referer, as specified in the header.
     */
    public String getReferer() { return referer; }
    public void setReferer( String newValue ) { this.referer = newValue; }

    /**
     * The Session event for this request
     */
    public SessionEvent getSessionEvent() { return sessionEvent; }
    public void setSessionEvent( SessionEvent newValue ) { this.sessionEvent = newValue; }
    
    @Override
    public void compileStatements( java.sql.Connection conn, java.util.Map<String,java.sql.PreparedStatement> statementCache ) throws Exception
    {
        String sql = "INSERT INTO " + schemaPrefix() + "http_events" + getPartitionTablePostfix() + " " +
            "(time_stamp, " +
            "session_id, client_intf, server_intf, " +
            "c_client_addr, c_client_port, c_server_addr, c_server_port, " + 
            "s_client_addr, s_client_port, s_server_addr, s_server_port, " + 
            "policy_id, username, " + 
            "request_id, method, uri, " + 
            "host, domain, referer, c2s_content_length, " + 
            "hostname) " + 
            "values " +
            "( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";

        java.sql.PreparedStatement pstmt = getStatementFromCache( sql, statementCache, conn );        

        int i=0;
        pstmt.setTimestamp(++i, getTimeStamp());
        pstmt.setLong(++i, getSessionEvent().getSessionId());
        pstmt.setInt(++i, getSessionEvent().getClientIntf());
        pstmt.setInt(++i, getSessionEvent().getServerIntf());
        pstmt.setObject(++i, getSessionEvent().getCClientAddr().getHostAddress(), java.sql.Types.OTHER);
        pstmt.setInt(++i, getSessionEvent().getCClientPort());
        pstmt.setObject(++i, getSessionEvent().getCServerAddr().getHostAddress(), java.sql.Types.OTHER);
        pstmt.setInt(++i, getSessionEvent().getCServerPort());
        pstmt.setObject(++i, getSessionEvent().getSClientAddr().getHostAddress(), java.sql.Types.OTHER);
        pstmt.setInt(++i, getSessionEvent().getSClientPort());
        pstmt.setObject(++i, getSessionEvent().getSServerAddr().getHostAddress(), java.sql.Types.OTHER);
        pstmt.setInt(++i, getSessionEvent().getSServerPort());
        pstmt.setLong(++i, getSessionEvent().getPolicyId());
        pstmt.setString(++i, getSessionEvent().getUsername());
        pstmt.setLong(++i, getRequestId());
        pstmt.setString(++i, Character.toString(getMethod().getKey()));
        pstmt.setString(++i, getRequestUri().toString());
        pstmt.setString(++i, getHost());
        pstmt.setString(++i, getDomain());
        pstmt.setString(++i, getReferer());
        pstmt.setLong(++i, getContentLength());
        pstmt.setString(++i, getSessionEvent().getHostname());

        pstmt.addBatch();
        return;
    }

    public String toString()
    {
        return "HttpRequestEvent: " + toSummaryString();
    }

    @Override
    public String toSummaryString()
    {
        String summary = sessionEvent.getCClientAddr().getHostAddress() + " " + I18nUtil.marktr("requested") +
            " (" + getMethod().toString() + ") " + 
            ( sessionEvent.getSServerPort() == 443 ? "https" : "http" ) + "://" +
            getHost() + getRequestUri();
        return summary;
    }


    // translates a host to a "domain"
    // foo.bar.yahoo.com -> yahoo.com
    // foor.bar.co.uk -> bar.co.uk
    private String getDomainForHost( String host )
    {
        if ( host == null )
            return null;
        
        String[] parts = host.split("\\.");
        int len = parts.length;
        
        if (parts.length <= 2) {
            return host;
        }
        
        String lastPart = parts[len-1];

        try {
            /*
             * If the last part is an int, its probably an IP
             * Just return the whole IP.
             */
            int parseInt = Integer.parseInt( lastPart );
            return host;
        } catch ( Exception e ) {}
        
        // https://wiki.mozilla.org/TLD_List
        switch ( lastPart ) {
        case "ao":
        case "ar":
        case "arpa":
        case "au":
        case "bd":
        case "bn":
        case "br":
        case "co":
        case "cr":
        case "cy":
        case "do":
        case "eg":
        case "et":
        case "fj":
        case "fk":
        case "gh":
        case "gn":
        case "gu":
        case "id":
        case "il":
        case "jm":
        case "ke":
        case "kh":
        case "kw":
        case "kz":
        case "lb":
        case "lc":
        case "lr":
        case "ls":
        case "ml":
        case "mm":
        case "mv":
        case "mw":
        case "mx":
        case "my":
        case "ng":
        case "ni":
        case "np":
        case "nz":
        case "om":
        case "pa":
        case "pe":
        case "pg":
        case "pw":
        case "py":
        case "qa":
        case "sa":
        case "sb":
        case "sv":
        case "sy":
        case "th":
        case "tn":
        case "tz":
        case "uk":
        case "uy":
        case "va":
        case "ve":
        case "ye":
        case "yu":
        case "za":
        case "zm":
        case "zw":
        if ( parts.length > 2 )
            return parts[len-3] + "." + parts[len-2] + "." + parts[len-1];
        else
            return host;
        
        default:
            return parts[len-2] + "." + parts[len-1];
        }
    }
    
}
