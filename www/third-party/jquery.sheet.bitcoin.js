(function() {
	var jFNA = jQuery.sheet.bitcoin = {
		// Get data about a bitcoin address
		BTCADDR: function(addr, dataType, conf, obj) {
			if (typeof addr != 'string' || typeof dataType != 'string' || typeof conf != 'object' || typeof obj != 'object') {
				return invalid;
			}
			
			var td = obj.td;
			var loc = obj.jS.getTdLocation(td);
			var hash = Array.isArray(addr) ? addr[0] : addr;
			
			var oldVal = rtd.getValue(obj.jS.i, loc.row, loc.col);
			var oldHash = rtd.getData('hash', obj.jS.i, loc.row, loc.col);
			var oldDataType = rtd.getData('dataType', obj.jS.i, loc.row, loc.col);
			var oldConf = rtd.getData('conf', obj.jS.i, loc.row, loc.col) == 'true' ? true : false;
				
			// Check if value already received and that no changes have been made to the formula
			if (oldHash == hash && oldDataType == dataType && oldConf == conf && oldVal != null) {
				return oldVal;
			// Get data
			} else if (hash != retrieving) {
				var url = chain_data + blockchain.current + '/addresses/' + hash;
				
				// Fill the real-time data structure
				rtd.setData('hash', obj.jS.i, loc.row, loc.col, hash);
				rtd.setData('dataType', obj.jS.i, loc.row, loc.col, dataType);
				rtd.setData('conf', obj.jS.i, loc.row, loc.col, conf);
				
				// Build requested data element
				var expr = 'data[0].' + (conf ? 'total.' : 'confirmed.') + dataType + ' * 0.00000001';
				
				// Make ajax request
				jFNA.external.getData(url, obj, loc, hash, 'address', expr);
				
				return retrieving;
			} else {
				return retrieving;
			}
		},
		// Get data about a bitcoin transaction
		BTCTRN: function(trn, dataType, obj) {
			if (typeof trn != 'string' || typeof dataType != 'string' || typeof obj != 'object') {
				return invalid;
			}
			
			var td = obj.td;
			var loc = obj.jS.getTdLocation(td);
			var hash = Array.isArray(trn) ? trn[0] : trn;
			
			var oldVal = rtd.getValue(obj.jS.i, loc.row, loc.col);
			var oldHash = rtd.getData('hash', obj.jS.i, loc.row, loc.col);
			var oldDataType = rtd.getData('dataType', obj.jS.i, loc.row, loc.col);
				
			// Check if value already received and that no changes have been made to the formula
			if (oldHash == hash && oldDataType == dataType && oldVal != null) {
				return oldVal;
			// Get data
			} else if (hash != retrieving) {
				var url = chain_data + blockchain.current + '/transactions/' + hash;
				
				// Fill the real-time data structure
				rtd.setData('hash', obj.jS.i, loc.row, loc.col, hash);
				rtd.setData('dataType', obj.jS.i, loc.row, loc.col, dataType);
				
				// Build requested data element
				var expr = 'data.' + dataType + (dataType == 'confirmations' ? '' : ' * 0.00000001');
				
				// Make ajax request
				jFNA.external.getData(url, obj, loc, hash, 'transaction', expr);
				
				return retrieving;
			} else {
				return retrieving;
			}
		},
		// Get data about a OP-RETURN transaction
		BTCOPRET: function(trn, dataType, obj) {
			if (typeof trn != 'string' || typeof dataType != 'string' || typeof obj != 'object') {
				return invalid;
			}
			
			var td = obj.td;
			var loc = obj.jS.getTdLocation(td);
			var hash = Array.isArray(trn) ? trn[0] : trn;
			
			var oldVal = rtd.getValue(obj.jS.i, loc.row, loc.col);
			var oldHash = rtd.getData('hash', obj.jS.i, loc.row, loc.col);
			var oldDataType = rtd.getData('dataType', obj.jS.i, loc.row, loc.col);
				
			// Check if value already received and that no changes have been made to the formula
			if (oldHash == hash && oldDataType == dataType && oldVal != null) {
				return oldVal;
			// Get data
			} else if (hash != retrieving) {
				var url = chain_data + blockchain.current + '/transactions/' + hash + '/op-return';
				
				// Fill the real-time data structure
				rtd.setData('hash', obj.jS.i, loc.row, loc.col, hash);
				rtd.setData('dataType', obj.jS.i, loc.row, loc.col, dataType);
				
				// Build requested data element
				var expr = 'data.' + dataType;
				
				// Make ajax request
				jFNA.external.getData(url, obj, loc, hash, 'transaction', expr);
				
				return retrieving;
			} else {
				return retrieving;
			}
		},
		// Find a bitcoin transaction
		BTCFIND: function(addr, dataType, num, obj) {
			if (typeof addr != 'string' || typeof dataType != 'string' || typeof num != 'number' || typeof obj != 'object') {
				return invalid;
			}
			
			var td = obj.td;
			var loc = obj.jS.getTdLocation(td);
			var hash = Array.isArray(addr) ? addr[0] : addr;
			
			var oldVal = rtd.getValue(obj.jS.i, loc.row, loc.col);
			var oldHash = rtd.getData('hash', obj.jS.i, loc.row, loc.col);
			var oldDataType = rtd.getData('dataType', obj.jS.i, loc.row, loc.col);
			var oldNum = rtd.getData('num', obj.jS.i, loc.row, loc.col);
				
			// Check if value already received and that no changes have been made to the formula
			if (oldHash == hash && oldDataType == dataType && oldNum == num && oldVal != null) {
				return oldVal;
			// Get data
			} else if (hash != retrieving) {
				var url = chain_data + blockchain.current + '/addresses/' + hash + '/' + dataType;
				
				// Fill the real-time data structure
				rtd.setData('hash', obj.jS.i, loc.row, loc.col, hash);
				rtd.setData('dataType', obj.jS.i, loc.row, loc.col, dataType);
				rtd.setData('num', obj.jS.i, loc.row, loc.col, num);
				
				// Build requested data element
				var expr = 'data[' + (num - 1) + '].' + (dataType == 'transactions' ? 'hash' : 'transaction_hash');
				
				// Make ajax request
				jFNA.external.getData(url, obj, loc, hash, 'address', expr);
				
				return retrieving;
			} else {
				return retrieving;
			}
		},
		// Get a bitcoin price
		BTCPRICE(curr, obj) {
			var td = obj.td;
			var loc = obj.jS.getTdLocation(td);
			var hash = 'btcprice'
			
			var oldVal = rtd.getValue(obj.jS.i, loc.row, loc.col);
			var oldCurr = rtd.getData('dataType', obj.jS.i, loc.row, loc.col);
			// Check if value already received and that no changes have been made to the formula
			if (oldCurr == curr && oldVal != null) {
				return oldVal;
			// Get data
			} else if (hash != retrieving) {
				var url = 'https://blockchain.info/ticker?cors=true';
				
				// Fill the real-time data structure
				rtd.setData('hash', obj.jS.i, loc.row, loc.col, hash);
				rtd.setData('dataType', obj.jS.i, loc.row, loc.col, curr);
				
				// Build requested data element
				var expr = 'data.' + curr.toUpperCase() + '.last';
			
				// Make ajax request
				jFNA.external.getData(url, obj, loc, hash, 'price', expr);
				
				return retrieving;
			} else {
				return retrieving;
			}
		},
		// Decode a hex string
		HEX2A: function(hex) {
			var str = '';
			
			for (var i = 0; i < hex.length; i += 2) {
				str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
			}
			
			return str;
		},
    };

    /*
        external is used for no conflict with internal functions used by the calculations engine,
    */
    jFNA.external = jQuery.sheet.bitcoin.external = {
		// Get data from remote server using ajax
        getData: function(url, obj, loc, hash, type, expr) {
			$.ajax({
				url: url,
				data: {'api-key-id': type != 'price' ? api_key_id : null},
				type: 'GET',
				success: function(data) {
					var field;
					
					try {
						field = eval(expr);
					} catch (err) {
						field = invalid;
					}
					rtd.setValue(obj.jS.i, loc.row, loc.col, field);
					rtd.request(type, hash);
				},
				error: function () {
					rtd.setValue(obj.jS.i, loc.row, loc.col, invalid);
				}
			});				
       },
    };
})();