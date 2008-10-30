/*
 * $HeadURL$
 * Copyright (c) 2003-2007 Untangle, Inc.
 *
 * This library is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2,
 * as published by the Free Software Foundation.
 *
 * This library is distributed in the hope that it will be useful, but
 * AS-IS and WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE, TITLE, or
 * NONINFRINGEMENT.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Linking this library statically or dynamically with other modules is
 * making a combined work based on this library.  Thus, the terms and
 * conditions of the GNU General Public License cover the whole combination.
 *
 * As a special exception, the copyright holders of this library give you
 * permission to link this library with independent modules to produce an
 * executable, regardless of the license terms of these independent modules,
 * and to copy and distribute the resulting executable under terms of your
 * choice, provided that you also meet, for each linked independent module,
 * the terms and conditions of the license of that module.  An independent
 * module is a module which is not derived from or based on this library.
 * If you modify this library, you may extend this exception to your version
 * of the library, but you are not obligated to do so.  If you do not wish
 * to do so, delete this exception statement from your version.
 */

package com.untangle.node.virus;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.untangle.node.http.RequestLine;
import com.untangle.uvm.node.PipelineEndpoints;
import org.hibernate.annotations.Columns;
import org.hibernate.annotations.Type;

/**
 * Log for HTTP Virus events.
 *
 * @author <a href="mailto:amread@untangle.com">Aaron Read</a>
 * @version 1.0
 */
@Entity
    @org.hibernate.annotations.Entity(mutable=false)
    @Table(name="n_virus_evt_http", schema="events")
    public class VirusHttpEvent extends VirusEvent
    {
        private RequestLine requestLine;
        private VirusScannerResult result;
        private String vendorName;

        // constructors -------------------------------------------------------

        public VirusHttpEvent() { }

        public VirusHttpEvent(RequestLine requestLine, VirusScannerResult result,
                              String vendorName)
        {
            this.requestLine = requestLine;
            this.result = result;
            this.vendorName = vendorName;
        }

        // VirusEvent methods -------------------------------------------------

        @Transient
            public String getType()
        {
            return "HTTP";
        }

        @Transient
            public String getLocation()
        {
            return null == requestLine ? "" : requestLine.getUrl().toString();
        }

        @Transient
            public boolean isInfected()
        {
            return !result.isClean();
        }

        @Transient
            public int getActionType()
        {
            if (true == result.isClean()) {
                return PASSED;
            } else if (true == result.isVirusCleaned()) {
                return CLEANED;
            } else {
                return BLOCKED;
            }
        }

        @Transient
            public String getActionName()
        {
            switch(getActionType())
                {
                case PASSED:
                    return "clean";
                case CLEANED:
                    return "cleaned";
                default:
                case BLOCKED:
                    return "blocked";
                }
        }

        @Transient
            public String getVirusName()
        {
            String n = result.getVirusName();

            return null == n ? "" : n;
        }

        @Transient
            public PipelineEndpoints getPipelineEndpoints()
        {
            return null == requestLine ? null : requestLine.getPipelineEndpoints();
        }

        // accessors ----------------------------------------------------------

        /**
         * Corresponding request line.
         *
         * @return the request line.
         */
        @ManyToOne(cascade=CascadeType.ALL, fetch=FetchType.EAGER)
            @JoinColumn(name="request_line")
            public RequestLine getRequestLine()
        {
            return requestLine;
        }

        public void setRequestLine(RequestLine requestLine)
        {
            this.requestLine = requestLine;
        }

        /**
         * Virus scan result.
         *
         * @return the scan result.
         */
        @Columns(columns = {
                @Column(name="clean"),
                @Column(name="virus_name"),
                @Column(name="virus_cleaned")
            })
            @Type(type="com.untangle.node.virus.VirusScannerResultUserType")
            public VirusScannerResult getResult()
        {
            return result;
        }

        public void setResult(VirusScannerResult result)
        {
            this.result = result;
        }

        /**
         * Virus vendor.
         *
         * @return the vendor
         */
        @Column(name="vendor_name")
            public String getVendorName()
        {
            return vendorName;
        }

        public void setVendorName(String vendorName)
        {
            this.vendorName = vendorName;
        }
    }
