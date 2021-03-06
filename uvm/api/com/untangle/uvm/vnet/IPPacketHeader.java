/**
 * $Id$
 */
package com.untangle.uvm.vnet;

/**
 * This class just contains IP header low-level data from a UDP packet such as TTL, TOS and options.
 *
 */
public class IPPacketHeader
{
    protected byte ttl;
    protected byte tos;
    protected byte options[];
    
    public IPPacketHeader( byte ttl, byte tos, byte options[] )
    {
        this.ttl = ttl;
        this.tos = tos;
        this.options = options;
    }

    public byte ttl() 
    { 
        return ttl; 
    }
    
    public byte tos() 
    { 
        return tos;
    }

    public byte[] options()
    {
        return options;
    }

    public void ttl( byte value )
    {
        ttl = value;
    }

    public void tos( byte value )
    {
        tos = value;
    }

    public void options( byte[] value )
    {
        options = value;
    }
}
