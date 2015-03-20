(function() {
	var jFNA = jQuery.sheet.bitcoin = {
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
				
			if (oldHash == hash && oldDataType == dataType && oldConf == conf && oldVal != null) {
				return oldVal;
			} else if (hash != retrieving) {
				var url = chain_data + blockchain.current + '/addresses/' + hash;
				
				rtd.setData('hash', obj.jS.i, loc.row, loc.col, hash);
				rtd.setData('dataType', obj.jS.i, loc.row, loc.col, dataType);
				rtd.setData('conf', obj.jS.i, loc.row, loc.col, conf);
				
				var expr = 'data[0].' + (conf ? 'total.' : 'confirmed.') + dataType + ' * 0.00000001';
				
				jFNA.external.getData(url, obj, loc, hash, 'address', expr);
				
				return retrieving;
			} else {
				return retrieving;
			}
		},
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
				
			if (oldHash == hash && oldDataType == dataType && oldVal != null) {
				return oldVal;
			} else if (hash != retrieving) {
				var url = chain_data + blockchain.current + '/transactions/' + hash;
				
				rtd.setData('hash', obj.jS.i, loc.row, loc.col, hash);
				rtd.setData('dataType', obj.jS.i, loc.row, loc.col, dataType);
				
				var expr = 'data.' + dataType + (dataType == 'confirmations' ? '' : ' * 0.00000001');
				
				jFNA.external.getData(url, obj, loc, hash, 'transaction', expr);
				
				return retrieving;
			} else {
				return retrieving;
			}
		},
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
				
			if (oldHash == hash && oldDataType == dataType && oldVal != null) {
				return oldVal;
			} else if (hash != retrieving) {
				var url = chain_data + blockchain.current + '/transactions/' + hash + '/op-return';
				
				rtd.setData('hash', obj.jS.i, loc.row, loc.col, hash);
				rtd.setData('dataType', obj.jS.i, loc.row, loc.col, dataType);
				
				var expr = 'data.' + dataType;
				
				jFNA.external.getData(url, obj, loc, hash, 'transaction', expr);
				
				return retrieving;
			} else {
				return retrieving;
			}
		},
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
				
			if (oldHash == hash && oldDataType == dataType && oldNum == num && oldVal != null) {
				return oldVal;
			} else if (hash != retrieving) {
				var url = chain_data + blockchain.current + '/addresses/' + hash + '/' + dataType;
				
				rtd.setData('hash', obj.jS.i, loc.row, loc.col, hash);
				rtd.setData('dataType', obj.jS.i, loc.row, loc.col, dataType);
				rtd.setData('num', obj.jS.i, loc.row, loc.col, num);
				
				var expr = 'data[' + (num - 1) + '].' + (dataType == 'transactions' ? 'hash' : 'transaction_hash');
				
				jFNA.external.getData(url, obj, loc, hash, 'address', expr);
				
				return retrieving;
			} else {
				return retrieving;
			}
		},
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
        getData: function(url, obj, loc, hash, type, expr) {
			$.ajax({
				url: url,
				data: {'api-key-id': api_key_id},
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