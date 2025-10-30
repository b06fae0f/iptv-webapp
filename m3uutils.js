function m3uutils() {}

Object.defineProperty(m3uutils, 'ErrorCode', {
	value: {
		OK: 200,
		NOT_FOUND: 404,
		ACCESS_DENIED: 403
	}
});

Object.freeze(m3uutils.ErrorCode);

Object.defineProperty(m3uutils, 'ErrorMessage', {
	value: {
		200: "Success",
		403: "You don't have permission to access this file.",
		404: "M3U file not found."
	}
});

Object.freeze(m3uutils.ErrorMessage);

m3uutils.strtoprop = function(str) {
	var properties = {};
	var j = 0;
	var iskey = true;
	var inquote = false;
	var key = '';
	var value = '';
	while (j < str.length) {
		var c = str[j];
		if (c == '=' && !inquote && iskey) {
			iskey = false;
		} else if (c == ' ' && !inquote) {
			if (iskey) {
				if (key.length) {
					properties[key] = 1;
				}
			} else {
				properties[key] = value;
			}
			key = '';
			value = '';
			iskey = true;
		} else if (c == '"') {
			inquote = !inquote;
		} else {
			if (iskey) {
				key += c;
			} else {
				value += c;
			}
		}
		j++;
	}
	if (iskey) {
		if (key.length) {
			properties[key] = 1;
		}
	} else {
		properties[key] = value;
	}
	
	return properties;
};

m3uutils.parse = function(str) {
	var lines = str.trim().split('\n');
	
	if (lines[0].trim() !== '#EXTM3U') {
		throw new Error('Invalid M3U header.');
	}
	
	var id = 1;
	var title = '';
	var runtime = '';
	var properties = {};
	var config = {};
	var license_type = '';
	var entries = [];
	var forceSSL = location.protocol === 'https:';
	
	for (var i = 1; i < lines.length; ++i) {
		var line = lines[i].trim();
		if (line.length === 0) 
			continue;
		if (line.charAt(0) === '#') {
			var endp = line.indexOf(':');
			if (endp === -1)
				continue;
			var directive = line.slice(0, endp);
			var input = line.slice(endp + 1);
			switch (directive) {
				case '#EXTINF':
					var titlep = input.lastIndexOf(',');
					if (titlep !== -1) {
						title = input.slice(titlep + 1);
						var info = input.slice(0, titlep);
					} else {
						title = '';
						var info = input;
					}
					var runtimep = info.indexOf(' ');
					if (runtimep !== -1) {
						runtime = parseInt(info.slice(0, runtimep));
						var propstr = info.slice(runtimep + 1);
						properties = m3uutils.strtoprop(propstr);
					} else {
						runtime = parseInt(info);
					}						
					break;
				case '#KODIPROP':
					var propp = input.indexOf('=');
					if (propp === -1) 
						break;
					var prop = input.slice(0, propp);
					var data = input.slice(propp + 1);
					switch (prop) {
						case 'inputstream.adaptive.license_type':
							license_type = data;
							break;
						case 'inputstream.adaptive.license_key':
							if (!license_type) 
								break;
							if (data.indexOf('http') === 0) {
								var key = data.split('|');
								var url = key.shift();
								config.drm = config.drm || {};
								config.drm.servers = config.drm.servers || {};
								config.drm.servers[license_type] = url;
								if (key.length) {
									config.drm.advanced = config.drm.advanced || {};
									config.drm.advanced[license_type] = config.drm.advanced[license_type] || {};
									config.drm.advanced[license_type].headers = {};
									for (var j = 0; j < key.length; ++j) {
										var h = key[j].split('=');
										config.drm.advanced[license_type].headers[h[0]] = h[1] || ''; 
									}
								}
							} else if (data.indexOf(':') !== -1 && license_type === 'org.w3.clearkey') {
								var key = data.split(':');
								config.drm = config.drm || {};
								config.drm.clearKeys = config.drm.clearKeys || {};
								config.drm.clearKeys[key[0]] = key[1] || '';
							}
							break;
					}
					break;
			}
		} else {
			var src = line;
			if (forceSSL) {
				src = src.replace(/^http:/, 'https:');
			}
			
			var entry = {
				id: id++,
				tid: properties['tvg-id'] || '',
				title: title,
				logo: properties['tvg-logo'] || '',
				group: (properties['group-title'] || '').split(';'),
				src: encodeURI(src),
				config: config
			};
			
			title = '';
			runtime = '';
			properties = {};
			config = {};
			license_type = '';
			entries.push(entry);
		}
	}
	
	return entries;
};

m3uutils.load = function(location, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState == XMLHttpRequest.DONE) {
			if (this.status == m3uutils.ErrorCode.OK) {
				callback(m3uutils.parse(this.responseText), false);
			} else if (m3uutils.ErrorMessage[this.status]) {
				callback({ code: this.status, message: m3uutils.ErrorMessage[this.status] }, true); 
			} else {
				console.error('Loading M3U file returned %d status code.', this.status);
			}
		}
	};
	xhr.open('GET', location, true);
	xhr.send();
};