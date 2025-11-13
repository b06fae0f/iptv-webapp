function HtmlComponent(component) {
	this.html = {};
	this.root = this.createHtmlRec(component);
}

HtmlComponent.prototype.getHtml = function() {
	return this.html;
};

HtmlComponent.prototype.getRoot = function() {
	return this.root;
};

HtmlComponent.prototype.setAttributesRec = function(el, attr) {
	if (typeof attr === 'object' && attr !== null)
		for (_ in attr)
			if (typeof attr[_] !== 'object')
				el[_] = attr[_];
			else
				this.setAttributesRec(el[_], attr[_]);
};

HtmlComponent.prototype.createHtmlRec = function(component) {
	if (typeof component !== 'object' || Array.isArray(component) || !component.type)
		return null;
		
	if (component.remove)
		return null;
	
	let element = component.namespace ?
		document.createElementNS(component.namespace, component.type) : 
		document.createElement(component.type);
	
	if (component.actions && Array.isArray(component.actions))
		for (_ of component.actions)
			if (typeof _ === 'object' && _ !== null && !Array.isArray(_))
				if (_.fn && typeof _.fn === 'string' && _.args && Array.isArray(_.args))
					element[_.fn].apply(element, _.args);
	
	if (component.attributes)
		this.setAttributesRec(element, component.attributes);
	
	if (component.children && Array.isArray(component.children))
		for (_ of component.children) {
			let c = this.createHtmlRec(_);
			if (c) element.appendChild(c);
		}
	
	if (component.name && typeof component.name === 'string')
		this.html[component.name] = element;
	
	return element;
};

function M3UParser() {}

M3UParser.strtoprop = function(str) {
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

M3UParser.parse = function(str) {
	var lines = str.trim().split('\n');
	
	if (lines[0].trim() !== '#EXTM3U') {
		throw new Error('Invalid M3U header.');
	}
	
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
						properties = this.strtoprop(propstr);
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

function AlertBox(message) {
	HtmlComponent.call(this, {
		name: 'alert',
		type: 'div',
		attributes: {
			className: 'alert',
			ontransitionend: (e) => {
				if (e.target.classList.contains('show'))
					setTimeout(() => e.target.classList.remove('show'), AlertBox.visible_duration);
				else
					e.target.remove();
			}
		},
		children: [
			{
				type: 'span',
				attributes: { innerText: message }
			},
			{
				type: 'a',
				attributes: {
					className: 'alert-close',
					href: 'javascript:void(0)',
					innerHTML: '&times;',
					onclick: () => this.root.classList.remove('show')
				}
			}
		]
	});
}

AlertBox.prototype = Object.create(HtmlComponent.prototype);
AlertBox.prototype.constructor = AlertBox;

AlertBox.prototype.show = function() {
	setTimeout(() => this.root.classList.add('show'), 16.666);
};

Object.defineProperty(AlertBox, 'visible_duration', { value: 5000 });

function IptvPlaylistItem(id, data, player, observer) {
	HtmlComponent.call(this, {
		name: 'item',
		type: 'li',
		children: [
			{
				name: 'link',
				type: 'a',
				attributes: {
					title: data.title,
					href: 'javascript:void(0)',
					onclick: (e) => {
						if (e.pointerId === -1)
							return;
						this.play();
						this.player.main.videoFirstUnmute();
					},
					onmouseover: (e) => this.focus()
				},
				children: [
					{
						type: 'span',
						attributes: { 
							className: 'chnum' ,
							innerText: id + 1
						}
					},
					{
						type: 'span',
						attributes: { 
							className: 'chname' ,
							innerText: data.title
						}
					},
					{
						type: 'span',
						attributes: { className: 'logo' },
						children: [
							{
								name: 'logo',
								type: 'img',
								remove: !data.logo,
								attributes: {
									width: 60,
									height: 60,
									loading: 'lazy',
									dataset: { src: data.logo },
									alt: data.tid + '_logo',
									title: data.title,
									className: 'hidden',
									onerror: (e) => e.target.remove()
								}
							}
						]
					}
				]
			}
		]
	});
	this.id = id;
	this.data = data;
	this.player = player;
	this.prev = null;
	this.next = null;
	this.setImageObserver(observer);
}

IptvPlaylistItem.prototype = Object.create(HtmlComponent.prototype);
IptvPlaylistItem.prototype.constructor = IptvPlaylistItem;

IptvPlaylistItem.prototype.setImageObserver = function(observer) {
	if (this.html.logo && observer)
		observer.observe(this.html.logo);
};

IptvPlaylistItem.prototype.remove = function() {
	this.root.remove();
};

IptvPlaylistItem.prototype.focus = function() {
	this.player.focusedItem?.html.link.classList.remove('focus');
	this.player.focusedItem = this;
	this.html.link.classList.add('focus');
	this.html.link.focus();
};

IptvPlaylistItem.prototype.play = function() {
	this.player.currentItem?.html.link.classList.remove('active');
	this.player.currentItem = this;
	this.player.play(this);
	this.html.link.classList.add('active');
	this.focus();
};

function IptvPlaylist(player) {
	HtmlComponent.call(this, {
		name: 'playlist',
		type: 'div',
		attributes: { className: 'iptv-playlist' },
		children: [
			{
				name: 'header',
				type: 'div',
				attributes: { className: 'iptv-playlist-header' },
				children: [
					{
						name: 'togglePlaylistBtn',
						type: 'button',
						attributes: { 
							onclick: e => this.toggle(),
							className: 'iptv-playlist-toggle', 
							type: 'button' 
						},
						children: [
							{
								type: 'svg',
								namespace: 'http://www.w3.org/2000/svg',
								attributes: { width: 16, height: 16 },
								actions: [
									{ fn: 'setAttributeNS', args: [null, 'viewBox', '0 0 24 24'] },
									{ fn: 'setAttribute', args: ['width', 16] },
									{ fn: 'setAttribute', args: ['height', 16] },
									{ fn: 'setAttribute', args: ['fill', 'currentColor'] },
								],
								children: [
									{
										type: 'path',
										namespace: 'http://www.w3.org/2000/svg',
										actions: [ 
											{ 
												fn: 'setAttribute', 
												args: ['d', 'M22 12.999V20a1 1 0 0 1-1 1h-8v-8.001h9zm-11 0V21H3a1 1 0 0 1-1-1v-7.001h9zM11 3v7.999H2V4a1 1 0 0 1 1-1h8zm10 0a1 1 0 0 1 1 1v6.999h-9V3h8z']
											}
										]
									}
								]
							}
						]
					},
					{
						type: 'span',
						attributes: { innerText: 'Playlist' }
					},
					{
						name: 'count',
						type: 'span',
						attributes: { innerText: '(0)' }
					}
				]
			},
			{
				name: 'emptyMessage',
				type: 'div',
				attributes: { 
					innerHTML: 'No Items Found.', 
					className: 'iptv-playlist-empty-message',
					style: { display: 'none' }
				}
			},
			{
				name: 'list',
				type: 'ul',
				attributes: { className: 'iptv-playlist-list' }
			}
		]
	});

	this.items = [];
	this.player = player;
	this.itemsHead = null;
	this.listObserver = null;
	
	this.root.addEventListener('mousedown', e => this._swipeSidebarFunc('mousemove', 'mouseup')(e));
	this.root.addEventListener('touchstart', e => this._swipeSidebarFunc('touchmove', 'touchend')(e));
	this.player.root.addEventListener('mousedown', e => this._swipeMainFunc('mousemove', 'mouseup')(e));
	this.player.root.addEventListener('touchstart', e => this._swipeMainFunc('touchmove', 'touchend')(e));
}

IptvPlaylist.prototype = Object.create(HtmlComponent.prototype);
IptvPlaylist.prototype.constructor = IptvPlaylist;

IptvPlaylist.prototype.setItems = function(items) {
	this.itemsHead = null;
	while (this.items.length)
		this.items.shift()?.remove();
		
	this.html.count.innerText = `(${items.length})`;
	
	if (this.listObserver && typeof this.listObserver.disconnect === 'function') {
		this.listObserver.disconnect();
	}
	
	let listObserverOptions = {
		root: null,
		rootMargin: '0px',
		threshold: 0.5
	};
	
	this.listObserver = new IntersectionObserver(function(entries, observer) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.onload = function(e) {
					e.target.classList.remove('hidden');	
				};
				entry.target.src = entry.target.dataset.src;
				observer.unobserve(entry.target);
			}
		});
	}, listObserverOptions);
	
	let prev = null;
	if (items.length) {
		items.forEach((d, i) => { 
			let item = new IptvPlaylistItem(i, d, this.player, this.listObserver);
			this.html.list.appendChild(item.getRoot());
			this.items.push(item);
			if (!prev)
				this.itemsHead = item;
			else
				prev.next = item;
			item.prev = prev;
			prev = item;
		});
		prev.next = this.itemsHead;
		this.itemsHead.prev = prev;
	}
	
	this.html.emptyMessage.style.display = items.length ? 'none' : 'block';
};

IptvPlaylist.prototype.getItem = function(id) {
	return this.items[id];
};

IptvPlaylist.prototype.isOpen = function() {
	return this.root.classList.contains('open');
};

IptvPlaylist.prototype.open = function() {
	document.body.classList.add('playlist-open');
	this.root.classList.add('open');
};

IptvPlaylist.prototype.close = function() {
	document.body.classList.remove('playlist-open');
	this.root.classList.remove('open');
};

IptvPlaylist.prototype.toggle = function() {
	document.body.classList.toggle('playlist-open');
	if (this.root.classList.toggle('open'))
		this.player.currentItem?.focus();
};

IptvPlaylist.prototype._getTouchEvent = function(e) {
	return e.changedTouches ? e.changedTouches[0] : e;
};

IptvPlaylist.prototype._swipeMainFunc = function(move, end) {
	return (e) => {
		if (!this.player.isSmallscreen())
			return;
		
		let t = this._getTouchEvent(e);
		if (t.clientX > 16)
			return;
		
		let _handlemove = (e) => {
			let t = this._getTouchEvent(e);
			if (t.clientX > window.innerWidth)
				return;
			let x = t.clientX - window.innerWidth;
			this.root.style.transitionDuration = '0ms';
			this.root.style.transform = 'translate3d(' + x + 'px, 0, 0)';
		};
		
		let _handleup = (e) => {
			let t = this._getTouchEvent(e);
			let open = t.clientX / window.innerWidth >= 0.3;
			this.root.style.transitionDuration = '200ms';
			this.root.style.transform = null;
			this.root.classList.toggle('open', open);
			document.body.classList.toggle('playlist-open', open);
			document.removeEventListener(move, _handlemove);
			document.removeEventListener(end, _handleup);	
		};
		
		document.addEventListener(move, _handlemove);
		document.addEventListener(end, _handleup);
	};
};

IptvPlaylist.prototype._swipeSidebarFunc = function(move, end) {
	return (e) => {
		if (!this.player.isSmallscreen())
			return;
		
		let t = this._getTouchEvent(e);
		let x = 0;
		let initX = t.clientX;
		let unlocked = false;
		const unlockline = window.innerWidth / 4;
		
		let _handlemove = (e) => {
			let t = this._getTouchEvent(e);
			x = t.clientX - initX;
			unlocked = x < -unlockline;
			if (x > 0 || !unlocked)
				return;
			this.root.style.transitionDuration = '0ms';
			this.root.style.transform = 'translate3d(' + x + 'px, 0, 0)';
		};
		
		let _handleup = (e) => {
			let open = x / window.innerWidth > -0.3;
			this.root.style.transitionDuration = '200ms';
			this.root.style.transform = null;
			this.root.classList.toggle('open', open);
			document.body.classList.toggle('playlist-open', open);
			document.removeEventListener(move, _handlemove);
			document.removeEventListener(end, _handleup);	
		};
		
		document.addEventListener(move, _handlemove);
		document.addEventListener(end, _handleup);
	};
};

function IptvMain(player) {
	HtmlComponent.call(this, {
		name: 'main',
		type: 'div',
		attributes: { className: 'iptv-main muted'},
		children: [
			{
				name: 'controlsLayer',
				type: 'div',
				attributes: { 
					onmousemove: e => this.onControlsLayerHover(e),
					className: 'iptv-controls-layer' 
				},
				children: [
					{
						name: 'header',
						type: 'div',
						attributes: { className: 'iptv-header' },
						children: [
							{
								name: 'headerLeft',
								type: 'div',
								attributes: { className: 'iptv-header-left' },
								children: [
									{
										name: 'togglePlaylistBtn',
										type: 'button',
										attributes: { 
											onclick: e => this.player.playlist.toggle(e),
											className: 'iptv-control-btn toggle-list-btn', 
											type: 'button' 
										},
										children: [
											{
												type: 'svg',
												namespace: 'http://www.w3.org/2000/svg',
												actions: [
													{ fn: 'setAttributeNS', args: [null, 'viewBox', '0 0 24 24'] },
													{ fn: 'setAttribute', args: ['fill', 'currentColor'] }
												],
												children: [
													{
														type: 'path',
														namespace: 'http://www.w3.org/2000/svg',
														actions: [{ fn: 'setAttribute', args: ['d', 'M22 12.999V20a1 1 0 0 1-1 1h-8v-8.001h9zm-11 0V21H3a1 1 0 0 1-1-1v-7.001h9zM11 3v7.999H2V4a1 1 0 0 1 1-1h8zm10 0a1 1 0 0 1 1 1v6.999h-9V3h8z'] }]
													}
												]
											}
										]
									},
									{
										name: 'title',
										type: 'h1',
										attributes: { className: 'iptv-title' }
									}
								]
							},
							{
								name: 'headerRight',
								type: 'div',
								attributes: { className: 'iptv-header-right' },
								children: [
									{
										name: 'muteBtn',
										type: 'button',
										attributes: { 
											onclick: e => this.toggleMute(e),
											className: 'iptv-control-btn mute-btn', 
											type: 'button' 
										},
										children: [
											{
												type: 'svg',
												namespace: 'http://www.w3.org/2000/svg',
												actions: [
													{ fn: 'setAttributeNS', args: [null, 'viewBox', '0 0 24 24'] },
													{ fn: 'setAttribute', args: ['fill', 'currentColor'] }
												],
												children: [
													{
														type: 'path',
														namespace: 'http://www.w3.org/2000/svg',
														actions: [{ fn: 'setAttribute', args: ['d', 'M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0 0 21 12a8.982 8.982 0 0 0-3.304-6.968l1.42-1.42A10.976 10.976 0 0 1 23 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0 0 16 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.991 5.991 0 0 1 18 12c0 1.842-.83 3.49-2.137 4.591z'] }]
													}
												]
											},
											{
												type: 'svg',
												namespace: 'http://www.w3.org/2000/svg',
												actions: [
													{ fn: 'setAttributeNS', args: [null, 'viewBox', '0 0 24 24'] },
													{ fn: 'setAttribute', args: ['fill', 'currentColor'] }
												],
												children: [
													{
														type: 'path',
														namespace: 'http://www.w3.org/2000/svg',
														actions: [{ fn: 'setAttribute', args: ['d', 'M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm14.525-4l3.536 3.536-1.414 1.414L19 13.414l-3.536 3.536-1.414-1.414L17.586 12 14.05 8.464l1.414-1.414L19 10.586l3.536-3.536 1.414 1.414L20.414 12z'] }]
													}
												]
											}
										]
									},
									{
										name: 'fullscreenBtn',
										type: 'button',
										attributes: { 
											onclick: e => this.player.toggleFullscreen(e),
											className: 'iptv-control-btn fs-btn', 
											type: 'button' 
										},
										children: [
											{
												type: 'svg',
												namespace: 'http://www.w3.org/2000/svg',
												actions: [
													{ fn: 'setAttributeNS', args: [null, 'viewBox', '0 0 24 24'] },
													{ fn: 'setAttribute', args: ['fill', 'currentColor'] }
												],
												children: [
													{
														type: 'path',
														namespace: 'http://www.w3.org/2000/svg',
														actions: [{ fn: 'setAttribute', args: ['d', 'M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z'] }]
													}
												]
											},
											{
												type: 'svg',
												namespace: 'http://www.w3.org/2000/svg',
												actions: [
													{ fn: 'setAttributeNS', args: [null, 'viewBox', '0 0 24 24'] },
													{ fn: 'setAttribute', args: ['fill', 'currentColor'] }
												],
												children: [
													{
														type: 'path',
														namespace: 'http://www.w3.org/2000/svg',
														actions: [{ fn: 'setAttribute', args: ['d', 'M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z'] }]
													}
												]
											}
										]
									},
								]
							}
						]
					},
					{
						name: 'selectItem',
						type: 'div',
						attributes: { className: 'iptv-select-item' }
					}
				]
			},
			{
				name: 'videoContainer',
				type: 'div',
				attributes: { className: 'iptv-video-container' },
				children: [
					{
						name: 'video16x9',
						type: 'div',
						attributes: { className: 'video16x9' },
						children: [
							{
								name: 'video',
								type: 'video',
								attributes: { 
									onvolumechange: e => this.volumeChange(e),
									muted: true 
								},
								actions: [
									{ fn: 'setAttribute', args: ['preload', 'auto'] },
									{ fn: 'setAttribute', args: ['nocontrols', ''] }
								]
							}
						]
					}
				]
			}
		]
	});
	this.player = player;
	this.videoUnmuted = false;
	this.openControlsHandle = null;
	this.shakaPlayer = new shaka.Player();
	this.shakaPlayer.attach(this.html.video);
	this.shakaPlayer.addEventListener('loading', function() { console.log('Loading stream...'); });
	this.shakaPlayer.addEventListener('loaded', function() { console.log('Stream is loaded!'); });
};

IptvMain.prototype = Object.create(HtmlComponent.prototype);
IptvMain.prototype.constructor = IptvMain;

IptvMain.prototype.volumeChange = function(e) {
	this.root.classList.toggle('muted', this.html.video.muted);
};

IptvMain.prototype.toggleMute = function(e) {
	this.html.video.muted = !this.html.video.muted;
};

IptvMain.prototype.videoFirstUnmute = function() {
	if (this.videoUnmuted)
		return;
	this.root.classList.remove('muted');
	this.html.video.muted = false;
	this.videoUnmuted = true;
};

IptvMain.prototype.openControls = function() {
	this.html.controlsLayer.classList.add('open');
	
	if (null !== this.openControlsHandle)
		clearTimeout(this.openControlsHandle);
	
	this.openControlsHandle = setTimeout(e => {
		this.html.controlsLayer.classList.remove('open');
		this.openControlsHandle = null;
	}, IptvPlayer.open_cntrl_time);
};

IptvMain.prototype.onControlsLayerHover = function(e) {
	if (!this.player.isFullscreen())
		return;
	this.openControls();
};

IptvMain.prototype.showSelectItem = function(str='') {
	this.html.selectItem.innerText = str;
	this.html.selectItem.style.display = 'block';
};

IptvMain.prototype.hideSelectItem = function() {
	this.html.selectItem.innerText = '';
	this.html.selectItem.style.display = 'none';
};

IptvMain.prototype.play = async function(item) {
	try {
		this.html.title.innerText = item.data.title;
		this.html.video.setAttribute('poster', item.data.logo);
		this.shakaPlayer.configure(item.data.config || {});
		await this.shakaPlayer.load(item.data.src);
		this.html.video.play();
		this.player.playlist.close();
	} catch (error) {
		switch (error.code) {
			case shaka.util.Error.Code.BAD_HTTP_STATUS:
				this.player.alert('Error: Bad or unavailable URL.');		
				break;
			case shaka.util.Error.Code.HTTP_ERROR:
				this.player.alert('Error: Unable to play stream due to server error or CORS policy.');
				break;
			case shaka.util.Error.Code.TIMEOUT:
				this.player.alert('Error: Server took a long time to respond.');
				break;
			default:
				this.player.alert(`Error: ${error.message}`);
				console.error(error);
				break;
		}
	}
};

function IptvPlayer() {
	HtmlComponent.call(this, {
		name: 'player',
		type: 'div',
		attributes: { 
			className: 'iptv-player',
			style: { height: '100%' }
		},
	});
	this.focused = true;
	this.selectItem = '';
	this.selectItemHandle = null;
	this.currentItem = null;
	this.focusedItem = null;
	this.main = new IptvMain(this);
	this.playlist = new IptvPlaylist(this);
	this.root.appendChild(this.main.getRoot());
	this.root.appendChild(this.playlist.getRoot());
	this.prepareIndexedDB();
	document.addEventListener('keydown', e => this.onKeydown(e));
	document.addEventListener('fullscreenchange', e => this.onFullscreenChange(e));
}

IptvPlayer.prototype = Object.create(HtmlComponent.prototype);
IptvPlayer.prototype.constructor = IptvPlayer;

IptvPlayer.prototype.onFullscreenChange = function(e) {	
	if (document.fullscreenElement !== null && document.fullscreenElement !== this.root) {
		document.exitFullscreen();
		return;
	}
	
	if (this.root.classList.toggle('fs', document.fullscreen)) {
		this.playlist.root.style.display = 'none';
		setTimeout(() => {
			this.playlist.root.style = '';
		}, 200);
	}
};

IptvPlayer.prototype.toggleFullscreen = function(e) {
	if (!document.fullscreen)
		this.root.requestFullscreen() 
	else
		document.exitFullscreen();
};

IptvPlayer.prototype.isSmallscreen = function() {
	return window.innerWidth <= 768;
};

IptvPlayer.prototype.isFullscreen = function() {
	return this.root.classList.contains('fs');
};

IptvPlayer.prototype.play = function(item) {
	this.main.play(item);
	localStorage.setItem('LastActiveItem', item.id);
};

IptvPlayer.prototype.setUpdateInteval = function(updateInterval) {
	localStorage.setItem('PlaylistUpdateInterval', updateInterval);
	return this;
};

IptvPlayer.prototype.isPlaylistUpdateNeeded = function() {
	if (!localStorage.getItem('PlaylistURL'))
		return false;
	
	let updateInterval = parseInt(localStorage.getItem('PlaylistUpdateInterval'));
	let lastUpdateTime = new Date(localStorage.getItem('PlaylistLastUpdateTime'));
	
	if (!updateInterval)
		return false;
		
	if (lastUpdateTime) {
		let nextUpdateTime = lastUpdateTime;
		nextUpdateTime.setDate(lastUpdateTime.getDate() + updateInterval);
		return (new Date()) >= nextUpdateTime;
	}
	
	return true; 
};

IptvPlayer.prototype.loadPlaylistFromText = function(text) {
	const items = M3UParser.parse(text);
	this.playlist.setItems(items);
	this.playlist.getItem(0).play();
	this.storePlaylist(items);
};

IptvPlayer.prototype.loadFile = async function(file, callback) {
	try {
		if (!file)
			throw new Error("Empty playlist file was provided.");
		
		const result = await file.text();
		this.loadPlaylistFromText(result);
		localStorage.removeItem('PlaylistURL');
		
		if (typeof callback === 'function')
			callback();
		
	} catch (error) {
		this.alert(error.message);
	}
};

IptvPlayer.prototype.loadURL = async function(url, callback) {
	try {
		if (url == '')
			throw new Error("Empty playlist URL.");
			
		const response = await fetch(url);
		
		if (!response.ok)
			throw new Error(`Error ${response.status}: ${response.statusText}.`);
		
		const result = await response.text();
		this.loadPlaylistFromText(result);
		localStorage.setItem('PlaylistURL', url);
		
		if (typeof callback === 'function')
			callback();
			
	} catch (error) {
		this.alert(error.message);
	}
};

IptvPlayer.prototype.storePlaylist = function(items) {
	if (!indexedDB)
		return;
	
	const request = indexedDB.open('iptv-player', 1);
	
	request.onerror = (e) => {
		console.error(`Database error: ${e.target.error?.message}`);
	};
	
	request.onsuccess = (e) => {
		const db = e.target.result;
		
		const transaction = db.transaction('playlist', 'readwrite');
		const objectStore = transaction.objectStore('playlist');
		const objectStoreRequest = objectStore.clear();
		
		objectStoreRequest.onsuccess = (e) => {
			items.forEach(i => objectStore.put(i));
		};
			
		transaction.oncomplete = () => {
			localStorage.setItem('PlaylistLastUpdateTime', new Date());
			db.close();
		};
	};
};

IptvPlayer.prototype.prepareIndexedDB = function() {
	if (!indexedDB)
		return;
	
	const request = indexedDB.open('iptv-player', 1);
	
	request.onerror = (e) => {
		console.error(`Database error: ${e.target.error?.message}`);
	};
	
	request.onsuccess = (e) => {
		const db = e.target.result;

		if (this.isPlaylistUpdateNeeded()) {
			db.close();
			const url = localStorage.getItem('PlaylistURL');
			this.fetchPlaylist(url);
		} else {
			const transaction = db.transaction('playlist', 'readonly');
			const objectStore = transaction.objectStore('playlist');
			const objectStoreRequest = objectStore.getAll();

			objectStoreRequest.onsuccess = (e) => {
				this.playlist.setItems(e.target.result);
				this.playlist.getItem(localStorage.getItem('LastActiveItem') || 0)?.play();
			};
				
			transaction.oncomplete = () => {
				db.close();
			};
		}
	};
	
	request.onupgradeneeded = (e) => {
		const db = e.target.result;
		
		if (db.objectStoreNames.contains('playlist'))
			return;
			
		const objectStore = db.createObjectStore('playlist', { autoIncrement: true });
		
		objectStore.createIndex('tid', 'tid', { unique: false });
		objectStore.createIndex('title', 'title', { unique: false });
		objectStore.createIndex('logo', 'logo', { unique: false });
		objectStore.createIndex('group', 'group', { unique: false });
		objectStore.createIndex('src', 'src', { unique: false });
		objectStore.createIndex('config', 'config', { unique: false });
	};
};

IptvPlayer.prototype.onKeydown = function(e) {
	if (!this.focused)
		return;
	
	switch (e.key) {
		case 'ArrowUp':
			if (this.isFullscreen() && !this.playlist.isOpen()) {
				this.currentItem?.next.play();
				this.main.openControls();
			} else {
				this.focusedItem?.prev.focus();
			}
			break;
		case 'ArrowDown':
			if (this.isFullscreen() && !this.playlist.isOpen()) {
				this.currentItem?.prev.play();
				this.main.openControls();
			} else {
				this.focusedItem?.next.focus();
			}
			break;
		case 'ArrowRight':
			if (this.isFullscreen() && !this.playlist.isOpen()) {
				this.playlist.open();
				this.currentItem?.focus();
			}
			break;
		case 'ArrowLeft':
			if (this.isFullscreen()) {
				this.playlist.close();
			}
			break;
		case 'Enter':
			if ((!this.isFullscreen() || this.playlist.isOpen()) && this.focusedItem.id !== this.currentItem.id) {
				this.focusedItem?.play();
				this.main.videoFirstUnmute();
			}
			break;
		case 'f':
		case 'F':
			this.toggleFullscreen();
			break;
		case 'm':
		case 'M':
			this.main.toggleMute();
			break;
		case '0':
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			if (this.selectItem.length === 0 && e.key === '0')
				break;
			
			if (this.selectItem.length < IptvPlayer.max_item_digits)
				this.selectItem += e.key;
			else
				break;
			
			this.playlist.getItem(this.selectItem - 1)?.focus();
			this.main.showSelectItem(this.selectItem.padStart(IptvPlayer.max_item_digits, '0'));
			
			if (this.selectItemHandle)
				clearTimeout(this.selectItemHandle);
			
			this.selectItemHandle = setTimeout(() => {
				this.playlist.getItem(this.selectItem - 1)?.play();
				this.main.videoFirstUnmute();
				this.main.hideSelectItem();
				this.selectItemHandle = null;
				this.selectItem = '';
			}, 2000);
			break;
		default:
			//console.log(e.key);
			break;
	}
};

IptvPlayer.prototype.alert = function(message) {
	const alert = new AlertBox(message);
	this.root.appendChild(alert.root);
	alert.show();
};

Object.defineProperty(IptvPlayer, 'max_item_digits', { value: 5 });
Object.defineProperty(IptvPlayer, 'open_cntrl_time', { value: 3000 });
Object.defineProperty(IptvPlayer, 'version', { value: '0.1.0 Beta' });
