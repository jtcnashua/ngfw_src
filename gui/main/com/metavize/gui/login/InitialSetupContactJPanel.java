/*
 * Copyright (c) 2004, 2005 Metavize Inc.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * Metavize Inc. ("Confidential Information").  You shall
 * not disclose such Confidential Information.
 *
 * $Id$
 */

package com.metavize.gui.login;

import com.metavize.mvvm.security.*;
import com.metavize.gui.widgets.wizard.*;
import com.metavize.gui.util.Util;
import javax.swing.SwingUtilities;
import java.awt.Color;

public class InitialSetupContactJPanel extends MWizardPageJPanel {

    private static final String EXCEPTION_COMPANY_MISSING = "You must fill out the company name.";
    private static final String EXCEPTION_FIRST_NAME_MISSING = "You must fill out your first name.";
    private static final String EXCEPTION_LAST_NAME_MISSING = "You must fill out your last name.";
    private static final String EXCEPTION_EMAIL_MISSING = "You must fill out your email address.";
    private static final String EXCEPTION_COMPUTER_COUNT_MISSING = "You must fill out the number of computers protected by EdgeGuard.";

    public InitialSetupContactJPanel() {
        initComponents();
    }

    public void initialFocus(){
	companyJTextField.requestFocus();
    }
	
    String company;
    String firstName;
    String lastName;
    String address1;
    String address2;
    String city;
    String state;
    String zipcode;
    String phone;
    String email;
    String countString;
    int count;
    Exception exception;
    
    public void doSave(Object settings, boolean validateOnly) throws Exception {

	SwingUtilities.invokeAndWait( new Runnable(){ public void run() {
            companyJTextField.setBackground( Color.WHITE );
            firstNameJTextField.setBackground( Color.WHITE );
            lastNameJTextField.setBackground( Color.WHITE );
            emailJTextField.setBackground( Color.WHITE );
            countJTextField.setBackground( Color.WHITE );
            
            company = companyJTextField.getText().trim();
            firstName = firstNameJTextField.getText().trim();
            lastName = lastNameJTextField.getText().trim();
	    address1 = address1JTextField.getText().trim();
	    address2 = address2JTextField.getText().trim();
	    city = cityJTextField.getText().trim();
	    state = stateJTextField.getText().trim();
	    zipcode = zipcodeJTextField.getText().trim();
	    phone = phoneJTextField.getText().trim();        
	    email = emailJTextField.getText().trim();
	    countString = countJTextField.getText().trim();

	    exception = null;
            
	    if(company.length() == 0){
		companyJTextField.setBackground( Util.INVALID_BACKGROUND_COLOR );
		exception = new Exception(EXCEPTION_COMPANY_MISSING);
		return;
	    }
        	
	    if(firstName.length() == 0){
		firstNameJTextField.setBackground( Util.INVALID_BACKGROUND_COLOR );
		exception = new Exception(EXCEPTION_FIRST_NAME_MISSING);
		return;
	    }
       	
	    if(lastName.length() == 0){
		lastNameJTextField.setBackground( Util.INVALID_BACKGROUND_COLOR );
		exception = new Exception(EXCEPTION_LAST_NAME_MISSING);
		return;
	    }

	    if(email.length() == 0){
		emailJTextField.setBackground( Util.INVALID_BACKGROUND_COLOR );
		exception = new Exception(EXCEPTION_EMAIL_MISSING);
		return;
	    }

	    try{
		if(countString.length() == 0)
		    throw new Exception();
		count = Integer.parseInt(countString);
		if( count < 0 )
		    throw new Exception();
	    }
	    catch(Exception e){
		countJTextField.setBackground( Util.INVALID_BACKGROUND_COLOR );
		exception = new Exception(EXCEPTION_COMPUTER_COUNT_MISSING);
		return;
	    }
	}});

        if( exception != null)
            throw exception;
	        
        if( !validateOnly ){
	    try{
		InitialSetupWizard.getInfiniteProgressJComponent().startLater("Saving Contact Information...");
		RegistrationInfo registrationInfo = new RegistrationInfo(company, firstName, lastName, email, count);
		registrationInfo.setAddress1(address1);
		registrationInfo.setAddress2(address2);
		registrationInfo.setCity(city);
		registrationInfo.setState(state);
		registrationInfo.setZipcode(zipcode);
		registrationInfo.setPhone(phone);
		Util.getAdminManager().setRegistrationInfo(registrationInfo);
		InitialSetupWizard.getInfiniteProgressJComponent().stopLater(1500l);
	    }
	    catch(Exception e){
		InitialSetupWizard.getInfiniteProgressJComponent().stopLater(-1l);
		Util.handleExceptionNoRestart("Error sending data", e);
		throw new Exception("A network communication error occurred.  Please retry.");
	    }
	}
    }
    

        private void initComponents() {//GEN-BEGIN:initComponents
                java.awt.GridBagConstraints gridBagConstraints;

                jLabel2 = new javax.swing.JLabel();
                jLabel16 = new javax.swing.JLabel();
                jPanel1 = new javax.swing.JPanel();
                jLabel17 = new javax.swing.JLabel();
                companyJTextField = new javax.swing.JTextField();
                jLabel18 = new javax.swing.JLabel();
                firstNameJTextField = new javax.swing.JTextField();
                jLabel19 = new javax.swing.JLabel();
                lastNameJTextField = new javax.swing.JTextField();
                jLabel20 = new javax.swing.JLabel();
                address1JTextField = new javax.swing.JTextField();
                jLabel21 = new javax.swing.JLabel();
                address2JTextField = new javax.swing.JTextField();
                jLabel22 = new javax.swing.JLabel();
                cityJTextField = new javax.swing.JTextField();
                jLabel23 = new javax.swing.JLabel();
                stateJTextField = new javax.swing.JTextField();
                jLabel24 = new javax.swing.JLabel();
                zipcodeJTextField = new javax.swing.JTextField();
                jLabel25 = new javax.swing.JLabel();
                phoneJTextField = new javax.swing.JTextField();
                jLabel26 = new javax.swing.JLabel();
                emailJTextField = new javax.swing.JTextField();
                jLabel27 = new javax.swing.JLabel();
                jLabel28 = new javax.swing.JLabel();
                jLabel29 = new javax.swing.JLabel();
                jLabel30 = new javax.swing.JLabel();
                countJTextField = new javax.swing.JTextField();
                jLabel31 = new javax.swing.JLabel();
                jLabel3 = new javax.swing.JLabel();

                setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

                setOpaque(false);
                jLabel2.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel2.setText("<html>Please take a moment to register yourself as the operator of the EdgeGuard.  <b>This information is required.</b></html>");
                add(jLabel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 30, 400, -1));

                jLabel16.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel16.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
                jLabel16.setText("<html>Number of computers<br>protected by EdgeGuard:</html>");
                add(jLabel16, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 290, -1, -1));

                jPanel1.setLayout(new java.awt.GridBagLayout());

                jPanel1.setOpaque(false);
                jLabel17.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel17.setText("Company Name:");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 0;
                gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
                jPanel1.add(jLabel17, gridBagConstraints);

                companyJTextField.setColumns(15);
                companyJTextField.setMinimumSize(new java.awt.Dimension(170, 19));
                companyJTextField.setPreferredSize(new java.awt.Dimension(170, 19));
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 1;
                jPanel1.add(companyJTextField, gridBagConstraints);

                jLabel18.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel18.setText("First Name:");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 0;
                gridBagConstraints.gridy = 1;
                gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
                jPanel1.add(jLabel18, gridBagConstraints);

                firstNameJTextField.setColumns(15);
                firstNameJTextField.setMinimumSize(new java.awt.Dimension(170, 19));
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 1;
                jPanel1.add(firstNameJTextField, gridBagConstraints);

                jLabel19.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel19.setText("Last Name:");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 0;
                gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
                jPanel1.add(jLabel19, gridBagConstraints);

                lastNameJTextField.setColumns(15);
                lastNameJTextField.setMinimumSize(new java.awt.Dimension(170, 19));
                lastNameJTextField.setPreferredSize(new java.awt.Dimension(170, 19));
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 1;
                jPanel1.add(lastNameJTextField, gridBagConstraints);

                jLabel20.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel20.setText("Address 1:");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 0;
                gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
                jPanel1.add(jLabel20, gridBagConstraints);

                address1JTextField.setColumns(15);
                address1JTextField.setMinimumSize(new java.awt.Dimension(170, 19));
                address1JTextField.setPreferredSize(new java.awt.Dimension(170, 19));
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 1;
                jPanel1.add(address1JTextField, gridBagConstraints);

                jLabel21.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel21.setText("Address 2:");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 0;
                gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
                jPanel1.add(jLabel21, gridBagConstraints);

                address2JTextField.setColumns(15);
                address2JTextField.setMinimumSize(new java.awt.Dimension(170, 19));
                address2JTextField.setPreferredSize(new java.awt.Dimension(170, 19));
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 1;
                jPanel1.add(address2JTextField, gridBagConstraints);

                jLabel22.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel22.setText("City :");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 0;
                gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
                jPanel1.add(jLabel22, gridBagConstraints);

                cityJTextField.setColumns(15);
                cityJTextField.setMinimumSize(new java.awt.Dimension(170, 19));
                cityJTextField.setPreferredSize(new java.awt.Dimension(170, 19));
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 1;
                jPanel1.add(cityJTextField, gridBagConstraints);

                jLabel23.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel23.setText("State:");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 0;
                gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
                jPanel1.add(jLabel23, gridBagConstraints);

                stateJTextField.setColumns(15);
                stateJTextField.setMinimumSize(new java.awt.Dimension(170, 19));
                stateJTextField.setPreferredSize(new java.awt.Dimension(170, 19));
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 1;
                jPanel1.add(stateJTextField, gridBagConstraints);

                jLabel24.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel24.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
                jLabel24.setText("Zipcode:");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 0;
                gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
                jPanel1.add(jLabel24, gridBagConstraints);

                zipcodeJTextField.setColumns(15);
                zipcodeJTextField.setMinimumSize(new java.awt.Dimension(170, 19));
                zipcodeJTextField.setPreferredSize(new java.awt.Dimension(170, 19));
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 1;
                jPanel1.add(zipcodeJTextField, gridBagConstraints);

                jLabel25.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel25.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
                jLabel25.setText("Phone #:");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 0;
                gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
                jPanel1.add(jLabel25, gridBagConstraints);

                phoneJTextField.setColumns(15);
                phoneJTextField.setMinimumSize(new java.awt.Dimension(170, 19));
                phoneJTextField.setPreferredSize(new java.awt.Dimension(170, 19));
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 1;
                jPanel1.add(phoneJTextField, gridBagConstraints);

                jLabel26.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel26.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
                jLabel26.setText("Email:");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 0;
                gridBagConstraints.anchor = java.awt.GridBagConstraints.EAST;
                jPanel1.add(jLabel26, gridBagConstraints);

                emailJTextField.setColumns(15);
                emailJTextField.setMinimumSize(new java.awt.Dimension(170, 19));
                emailJTextField.setPreferredSize(new java.awt.Dimension(170, 19));
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 1;
                jPanel1.add(emailJTextField, gridBagConstraints);

                jLabel27.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel27.setText("(required)");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 2;
                gridBagConstraints.gridy = 0;
                gridBagConstraints.insets = new java.awt.Insets(0, 5, 0, 0);
                jPanel1.add(jLabel27, gridBagConstraints);

                jLabel28.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel28.setText("(required)");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 2;
                gridBagConstraints.gridy = 1;
                gridBagConstraints.insets = new java.awt.Insets(0, 5, 0, 0);
                jPanel1.add(jLabel28, gridBagConstraints);

                jLabel29.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel29.setText("(required)");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 2;
                gridBagConstraints.gridy = 2;
                gridBagConstraints.insets = new java.awt.Insets(0, 5, 0, 0);
                jPanel1.add(jLabel29, gridBagConstraints);

                jLabel30.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel30.setText("(required)");
                gridBagConstraints = new java.awt.GridBagConstraints();
                gridBagConstraints.gridx = 2;
                gridBagConstraints.gridy = 9;
                gridBagConstraints.insets = new java.awt.Insets(0, 5, 0, 0);
                jPanel1.add(jLabel30, gridBagConstraints);

                add(jPanel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 70, 350, 210));

                countJTextField.setColumns(15);
                add(countJTextField, new org.netbeans.lib.awtextra.AbsoluteConstraints(188, 302, 90, -1));

                jLabel31.setFont(new java.awt.Font("Dialog", 0, 12));
                jLabel31.setText("(required)");
                add(jLabel31, new org.netbeans.lib.awtextra.AbsoluteConstraints(283, 304, -1, -1));

                jLabel3.setIcon(new javax.swing.ImageIcon(getClass().getResource("/com/metavize/gui/login/ProductShot.png")));
                jLabel3.setEnabled(false);
                add(jLabel3, new org.netbeans.lib.awtextra.AbsoluteConstraints(-130, 230, -1, -1));

        }//GEN-END:initComponents
    
    
        // Variables declaration - do not modify//GEN-BEGIN:variables
        private javax.swing.JTextField address1JTextField;
        private javax.swing.JTextField address2JTextField;
        private javax.swing.JTextField cityJTextField;
        private javax.swing.JTextField companyJTextField;
        private javax.swing.JTextField countJTextField;
        private javax.swing.JTextField emailJTextField;
        private javax.swing.JTextField firstNameJTextField;
        private javax.swing.JLabel jLabel16;
        private javax.swing.JLabel jLabel17;
        private javax.swing.JLabel jLabel18;
        private javax.swing.JLabel jLabel19;
        private javax.swing.JLabel jLabel2;
        private javax.swing.JLabel jLabel20;
        private javax.swing.JLabel jLabel21;
        private javax.swing.JLabel jLabel22;
        private javax.swing.JLabel jLabel23;
        private javax.swing.JLabel jLabel24;
        private javax.swing.JLabel jLabel25;
        private javax.swing.JLabel jLabel26;
        private javax.swing.JLabel jLabel27;
        private javax.swing.JLabel jLabel28;
        private javax.swing.JLabel jLabel29;
        private javax.swing.JLabel jLabel3;
        private javax.swing.JLabel jLabel30;
        private javax.swing.JLabel jLabel31;
        private javax.swing.JPanel jPanel1;
        private javax.swing.JTextField lastNameJTextField;
        private javax.swing.JTextField phoneJTextField;
        private javax.swing.JTextField stateJTextField;
        private javax.swing.JTextField zipcodeJTextField;
        // End of variables declaration//GEN-END:variables
    
}
