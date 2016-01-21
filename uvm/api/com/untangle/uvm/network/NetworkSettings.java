/**
 * $Id$
 */
package com.untangle.uvm.network;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;
import java.net.InetAddress;

import org.json.JSONObject;
import org.json.JSONString;

import com.untangle.uvm.network.PortForwardRule;
import com.untangle.uvm.network.NatRule;
import com.untangle.uvm.network.BypassRule;
import com.untangle.uvm.network.StaticRoute;

/**
 * Network settings.
 */
@SuppressWarnings("serial")
public class NetworkSettings implements Serializable, JSONString
{
    private Integer version;

    private List<InterfaceSettings> interfaces = null;
    private List<DeviceSettings> devices = null;
    private List<PortForwardRule> portForwardRules = null;
    private List<NatRule> natRules = null;
    private List<BypassRule> bypassRules = null;
    private List<FilterRule> inputFilterRules = null;
    private List<FilterRule> forwardFilterRules = null;
    private List<StaticRoute> staticRoutes = null;
    private List<DhcpStaticEntry> staticDhcpEntries = null;
    
    private String hostName;
    private String domainName;

    private boolean dynamicDnsServiceEnabled = false;
    private String  dynamicDnsServiceName = null;
    private String  dynamicDnsServiceUsername = null;
    private String  dynamicDnsServicePassword = null;
    private String  dynamicDnsServiceHostnames = null;

    private boolean enableSipNatHelper = false;
    private boolean sendIcmpRedirects = true;
    private boolean blockInvalidPackets = true;
    private boolean blockReplayPackets = false;
    private boolean strictArpMode = true;
    private boolean stpEnabled = false;
    private boolean dhcpAuthoritative = true;
    private boolean blockDuringRestarts = false;
    private boolean logBypassedSessions = true;
    private boolean logLocalSessions = false;
    private boolean logBlockedSessions = false;

    private int httpPort  = 80;
    private int httpsPort = 443;
    
    private QosSettings qosSettings;
    private DnsSettings dnsSettings;

    private String dnsmasqOptions;
    
    public NetworkSettings() { }

    public Integer getVersion() { return this.version; }
    public void setVersion( Integer newValue ) { this.version = newValue ; }

    public List<InterfaceSettings> getInterfaces() { return this.interfaces; }
    public void setInterfaces( List<InterfaceSettings> newValue ) { this.interfaces = newValue; }

    public List<DeviceSettings> getDevices() { return this.devices; }
    public void setDevices( List<DeviceSettings> newValue ) { this.devices = newValue; }
    
    public List<PortForwardRule> getPortForwardRules() { return this.portForwardRules; }
    public void setPortForwardRules( List<PortForwardRule> newValue ) { this.portForwardRules = newValue; }

    public List<NatRule> getNatRules() { return this.natRules; }
    public void setNatRules( List<NatRule> newValue ) { this.natRules = newValue; }

    public List<BypassRule> getBypassRules() { return this.bypassRules; }
    public void setBypassRules( List<BypassRule> newValue ) { this.bypassRules = newValue; }

    public List<FilterRule> getInputFilterRules() { return this.inputFilterRules; }
    public void setInputFilterRules( List<FilterRule> newValue ) { this.inputFilterRules = newValue; }

    public List<FilterRule> getForwardFilterRules() { return this.forwardFilterRules; }
    public void setForwardFilterRules( List<FilterRule> newValue ) { this.forwardFilterRules = newValue; }
    
    public List<StaticRoute> getStaticRoutes() { return this.staticRoutes; }
    public void setStaticRoutes( List<StaticRoute> newValue ) { this.staticRoutes = newValue; }

    public List<DhcpStaticEntry> getStaticDhcpEntries() { return this.staticDhcpEntries; }
    public void setStaticDhcpEntries( List<DhcpStaticEntry> newValue ) { this.staticDhcpEntries = newValue; }
    
    public String getHostName() { return this.hostName; }
    public void setHostName( String newValue ) { this.hostName = newValue; }

    public String getDomainName() { return this.domainName; }
    public void setDomainName( String newValue ) { this.domainName = newValue; }

    public boolean getDynamicDnsServiceEnabled() { return this.dynamicDnsServiceEnabled; }
    public void setDynamicDnsServiceEnabled( boolean newValue ) { this.dynamicDnsServiceEnabled = newValue; }

    public String getDynamicDnsServiceName() { return this.dynamicDnsServiceName; }
    public void setDynamicDnsServiceName( String newValue ) { this.dynamicDnsServiceName = newValue; }

    public String getDynamicDnsServiceUsername() { return this.dynamicDnsServiceUsername; }
    public void setDynamicDnsServiceUsername( String newValue ) { this.dynamicDnsServiceUsername = newValue; }

    public String getDynamicDnsServicePassword() { return this.dynamicDnsServicePassword; }
    public void setDynamicDnsServicePassword( String newValue ) { this.dynamicDnsServicePassword = newValue; }
    
    public String getDynamicDnsServiceHostnames() { return this.dynamicDnsServiceHostnames; }
    public void setDynamicDnsServiceHostnames( String newValue ) { this.dynamicDnsServiceHostnames = newValue; }
    
    public int getHttpsPort() { return this.httpsPort; }
    public void setHttpsPort( int newValue ) { this.httpsPort = newValue ; }

    public int getHttpPort() { return this.httpPort; }
    public void setHttpPort( int newValue ) { this.httpPort = newValue ; }
    
    public boolean getEnableSipNatHelper() { return this.enableSipNatHelper; }
    public void setEnableSipNatHelper( boolean newValue ) { this.enableSipNatHelper = newValue; }

    public boolean getSendIcmpRedirects() { return this.sendIcmpRedirects; }
    public void setSendIcmpRedirects( boolean newValue ) { this.sendIcmpRedirects = newValue; }

    public boolean getBlockInvalidPackets() { return this.blockInvalidPackets; }
    public void setBlockInvalidPackets( boolean newValue ) { this.blockInvalidPackets = newValue; }

    public boolean getBlockReplayPackets() { return this.blockReplayPackets; }
    public void setBlockReplayPackets( boolean newValue ) { this.blockReplayPackets = newValue; }
    
    public boolean getStrictArpMode() { return this.strictArpMode; }
    public void setStrictArpMode( boolean newValue ) { this.strictArpMode = newValue; }
    
    public boolean getStpEnabled() { return this.stpEnabled; }
    public void setStpEnabled( boolean newValue ) { this.stpEnabled = newValue; }
    
    public boolean getDhcpAuthoritative() { return this.dhcpAuthoritative; }
    public void setDhcpAuthoritative( boolean newValue ) { this.dhcpAuthoritative = newValue; }

    public boolean getBlockDuringRestarts() { return this.blockDuringRestarts; }
    public void setBlockDuringRestarts( boolean newValue ) { this.blockDuringRestarts = newValue; }

    public boolean getLogBypassedSessions() { return this.logBypassedSessions; }
    public void setLogBypassedSessions( boolean newValue ) { this.logBypassedSessions = newValue; }

    public boolean getLogLocalSessions() { return this.logLocalSessions; }
    public void setLogLocalSessions( boolean newValue ) { this.logLocalSessions = newValue; }
    
    public boolean getLogBlockedSessions() { return this.logBlockedSessions; }
    public void setLogBlockedSessions( boolean newValue ) { this.logBlockedSessions = newValue; }
    
    public QosSettings getQosSettings() { return this.qosSettings; }
    public void setQosSettings( QosSettings newValue ) { this.qosSettings = newValue; }

    public DnsSettings getDnsSettings() { return this.dnsSettings; }
    public void setDnsSettings( DnsSettings newValue ) { this.dnsSettings = newValue; }

    public String getDnsmasqOptions() { return this.dnsmasqOptions; }
    public void setDnsmasqOptions( String newValue ) { this.dnsmasqOptions = newValue; }
    
    public String toJSONString()
    {
        JSONObject jO = new JSONObject(this);
        return jO.toString();
    }
}
