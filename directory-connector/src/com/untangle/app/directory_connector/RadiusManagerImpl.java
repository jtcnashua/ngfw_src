/**
 * $Id: FacebookAuthenticator.java,v 1.00 2017/03/03 19:30:10 dmorris Exp $
 * 
 * Copyright (c) 2003-2017 Untangle, Inc.
 *
 *
 * This software is the confidential and proprietary information of
 * Untangle, Inc. ("Confidential Information"). You shall
 * not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Untangle.
 */
package com.untangle.app.directory_connector;

import java.util.List;
import java.util.LinkedList;
import java.util.Collections;

import org.apache.log4j.Logger;

/**
 * RadiusManagerImpl provides the API implementation of all RADIUS related functionality
 */
public class RadiusManagerImpl
{
    private final Logger logger = Logger.getLogger(getClass());

    /**
     * This is just a copy of the current settings being used
     */
    private RadiusSettings currentSettings;

    /**
     * The node that owns this manager
     */
    private DirectoryConnectorApp node;

    /**
     * The LDAP adapter
     */
    private RadiusLdapAdapter radiusAdapter;

    public RadiusManagerImpl( RadiusSettings settings, DirectoryConnectorApp node )
    {
        this.node = node;
        setSettings(settings);
    }

    public void setSettings( RadiusSettings settings )
    {
        this.currentSettings = settings;

        radiusAdapter = new RadiusLdapAdapter(settings);
    }
    
    public String getRadiusStatusForSettings( DirectoryConnectorSettings newSettings, String username, String password )
    {
        boolean success = false;

        if (newSettings == null || newSettings.getRadiusSettings() == null) {
            return "Invalid settings (null)";
        }

        RadiusSettings testSettings = newSettings.getRadiusSettings();
        
        try {
            logger.info("Testing Radius settings for (" + 
                        "server='" + testSettings.getServer() + "', " + 
                        "port='" + testSettings.getAuthPort() + "', " + 
                        "shared_secret='" + testSettings.getSharedSecret() + "', " + 
                        "username='" + (username == null ? "null" : username) + "', " + 
                        "password='" + (password == null ? "null" : "******") + ")");

            RadiusLdapAdapter temp_radiusAdapter = new RadiusLdapAdapter(testSettings);

            if ( username == null || username.isEmpty() || password == null || password.isEmpty() )
                return "No username/password specified.";
            
            if ((username != null) && !username.isEmpty() && (password != null) && !password.isEmpty()) {
                success = temp_radiusAdapter.authenticate(username, password);
            }
            
        } catch (Exception e) {
            logger.warn("Radius Test Failure", e);
            String statusStr = "Radius authentication failed: <br/><br/>"+ e.getMessage();
            return statusStr.replaceAll("\\p{Cntrl}", "");  //remove non-printable chars
        }

        if (success)
            return "RADIUS authentication successful!";
        else
            return "RADIUS authentication failure.";
    }

    public boolean authenticate( String username, String pwd )
    {
        if (username == null || username.equals("") || pwd == null || pwd.equals("")) 
            return false;
        if ( this.radiusAdapter == null ) 
            return false;
        if (!this.currentSettings.isEnabled())
            return false;
        
        return radiusAdapter.authenticate(username, pwd);
    }
    
}