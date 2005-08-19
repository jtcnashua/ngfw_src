package com.metavize.tran.ids.options;

import java.util.regex.*;
import java.nio.ByteBuffer;

import com.metavize.tran.ids.IDSRuleSignature;
import com.metavize.mvvm.tran.ParseException;
import com.metavize.mvvm.tapi.event.*;

public class OffsetOption extends IDSOption {

	public OffsetOption(IDSRuleSignature signature, String params) throws ParseException {
		super(signature, params);
		ContentOption option = (ContentOption) signature.getOption("ContentOption",this);
		if(option == null) 
				return;	
		
		int offset = 0;
		try {
			offset = Integer.parseInt(params);
		} catch (Exception e) { 
			throw new ParseException("Not a valid Offset argument: " + params);
		}
		option.setOffset(offset);	
	}

	public boolean runnable() {
		return false;
	}

	public boolean run() {
		return false;
	}
}
