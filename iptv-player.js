function IPTVPlayer() {
	this.components = {};
	this.components.player = document.createElement('div');
	this.components.player.classList.add('iptv-player');
	this.components.player.style.height = '100%';
	this.components.iptvMain = this.components.player.appendChild(document.createElement('div'));
	this.components.iptvMain.classList.add('iptv-main');
	this.components.iptvControlsLayer = this.components.iptvMain.appendChild(document.createElement('div'));
	this.components.iptvControlsLayer.classList.add('iptv-controls-layer');
	this.components.iptvHeader = this.components.iptvControlsLayer.appendChild(document.createElement('div'));
	this.components.iptvHeader.classList.add('iptv-header');
	this.components.iptvHeaderLeft = this.components.iptvHeader.appendChild(document.createElement('div'));
	this.components.iptvHeaderLeft.classList.add('iptv-header-left');
	this.components.iptvTogglePlaylistBtn1 = this.components.iptvHeaderLeft.appendChild(document.createElement('button'));
	this.components.iptvTogglePlaylistBtn1.classList.add('iptv-control-btn');
	this.components.iptvTogglePlaylistBtn1.setAttribute('type', 'button');
	this.components.iptvTogglePlaylistBtn1.id = 'togglemenu_btn';
	{
		let svg = this.components.iptvTogglePlaylistBtn1.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
		let path = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		svg.setAttribute('fill', 'currentColor');
		path.setAttribute('d', 'M22 12.999V20a1 1 0 0 1-1 1h-8v-8.001h9zm-11 0V21H3a1 1 0 0 1-1-1v-7.001h9zM11 3v7.999H2V4a1 1 0 0 1 1-1h8zm10 0a1 1 0 0 1 1 1v6.999h-9V3h8z');
	}
	this.components.iptvTitle = this.components.iptvHeaderLeft.appendChild(document.createElement('h1'));
	this.components.iptvTitle.classList.add('iptv-title');
	this.components.iptvHeaderRight = this.components.iptvHeader.appendChild(document.createElement('div'));
	this.components.iptvHeaderRight.classList.add('iptv-header-right');
	this.components.iptvVolumeBtn = this.components.iptvHeaderRight.appendChild(document.createElement('button'));
	this.components.iptvVolumeBtn.classList.add('iptv-control-btn', 'muted');
	this.components.iptvVolumeBtn.setAttribute('type', 'button');
	this.components.iptvVolumeBtn.id = 'volume_btn';
	{
		let svg = this.components.iptvVolumeBtn.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
		let path = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		svg.setAttribute('fill', 'currentColor');
		svg.classList.add('volume-svg');
		path.setAttribute('d', 'M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0 0 21 12a8.982 8.982 0 0 0-3.304-6.968l1.42-1.42A10.976 10.976 0 0 1 23 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0 0 16 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.991 5.991 0 0 1 18 12c0 1.842-.83 3.49-2.137 4.591z');
		
		svg = this.components.iptvVolumeBtn.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
		path = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		svg.setAttribute('fill', 'currentColor');
		svg.classList.add('volume-mute-svg');
		path.setAttribute('d', 'M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm14.525-4l3.536 3.536-1.414 1.414L19 13.414l-3.536 3.536-1.414-1.414L17.586 12 14.05 8.464l1.414-1.414L19 10.586l3.536-3.536 1.414 1.414L20.414 12z');
	}
	this.components.iptvFullscreenBtn = this.components.iptvHeaderRight.appendChild(document.createElement('button'));
	this.components.iptvFullscreenBtn.classList.add('iptv-control-btn');
	this.components.iptvFullscreenBtn.setAttribute('type', 'button');
	this.components.iptvFullscreenBtn.id = 'fullscreen_btn';
	{
		let svg = this.components.iptvFullscreenBtn.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
		let path = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		svg.setAttribute('fill', 'currentColor');
		svg.classList.add('fullscreen-svg');
		path.setAttribute('d', 'M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z');
		
		svg = this.components.iptvFullscreenBtn.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
		path = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		svg.setAttribute('fill', 'currentColor');
		svg.classList.add('fullscreen-exit-svg');
		path.setAttribute('d', 'M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z');
	}
	this.components.iptvSelectItem = this.components.iptvControlsLayer.appendChild(document.createElement('div'));
	this.components.iptvSelectItem.classList.add('iptv-select-item');
	this.components.iptvVideoContainer = this.components.iptvMain.appendChild(document.createElement('div'));
	this.components.iptvVideoContainer.classList.add('iptv-video-container');
	this.components.iptvVideo16x9 = this.components.iptvVideoContainer.appendChild(document.createElement('div'));
	this.components.iptvVideo16x9.classList.add('video16x9');
	this.components.video = this.components.iptvVideo16x9.appendChild(document.createElement('video'));
	this.components.video.setAttribute('preload', 'auto');
	this.components.video.setAttribute('nocontrols', '');
	this.components.video.id = 'video';
	this.components.video.muted = true;
	this.components.iptvPlaylist = this.components.player.appendChild(document.createElement('nav'));
	this.components.iptvPlaylist.classList.add('iptv-playlist');
	this.components.iptvPlaylist.id = 'channels_menu';
	this.components.iptvPlaylistHeader = this.components.iptvPlaylist.appendChild(document.createElement('div'));
	this.components.iptvPlaylistHeader.classList.add('iptv-playlist-header');
	this.components.iptvTogglePlaylistBtn2 = this.components.iptvPlaylistHeader.appendChild(document.createElement('button'));
	this.components.iptvTogglePlaylistBtn2.classList.add('iptv-playlist-toggle');
	this.components.iptvTogglePlaylistBtn2.setAttribute('type', 'button');
	{
		let svg = this.components.iptvTogglePlaylistBtn2.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
		let path = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		svg.setAttribute('width', 16);
		svg.setAttribute('height', 16);
		svg.setAttribute('fill', 'currentColor');
		path.setAttribute('d', 'M22 12.999V20a1 1 0 0 1-1 1h-8v-8.001h9zm-11 0V21H3a1 1 0 0 1-1-1v-7.001h9zM11 3v7.999H2V4a1 1 0 0 1 1-1h8zm10 0a1 1 0 0 1 1 1v6.999h-9V3h8z');
	}
	this.components.iptvPlaylistHeaderText = this.components.iptvPlaylistHeader.appendChild(document.createElement('span'));
	this.components.iptvPlaylistHeaderText.innerText = 'Playlist ';
	this.components.iptvItemsCount = this.components.iptvPlaylistHeaderText.appendChild(document.createElement('span'));
	this.components.iptvItemsCount.id = 'channels_count';
	this.components.iptvItemsCount.innerText = '(0)';
	this.components.iptvPlaylistEmptyMessage = this.components.iptvPlaylist.appendChild(document.createElement('div'));
	this.components.iptvPlaylistEmptyMessage.innerHTML = 'No items found.';
	this.components.iptvPlaylistEmptyMessage.classList.add('iptv-playlist-empty-message');
	this.components.iptvPlaylistEmptyMessage.id = 'emptyMenuMsg';
	this.components.iptvPlaylistEmptyMessage.style.display = 'block';
	this.components.iptvPlaylistList = this.components.iptvPlaylist.appendChild(document.createElement('ul'));
	this.components.iptvPlaylistList.classList.add('iptv-playlist-list');
	this.components.iptvPlaylistList.id = 'channels_list';
	
	this.items = [];
	this.itemsList = [];
	this._currentItem = 0;
	this._highlightedItem = 0;
	this._playerloading = false;
	this._videoUnmuted = false;
	this._focused = true;
	this._selectItem = '';
	this._listObserver = null;
	this._openControlsHandle = null;
	this._selectItemHandle = null;
	
	this.shakaPlayer = new shaka.Player();
	this.shakaPlayer.attach(this.components.video);
	this.shakaPlayer.addEventListener('loading', function() { console.log('Loading stream...'); });
	this.shakaPlayer.addEventListener('loaded', function() { console.log('Stream is loaded!'); });
	
	document.addEventListener('keydown', this._onKeydownHandler.bind(this));
	document.addEventListener('fullscreenchange', this._onFullscreenChange.bind(this));
	this.components.iptvVolumeBtn.addEventListener('click', this._onVolumeBtnClick.bind(this));
	this.components.video.addEventListener('volumechange', this._onVideoVolumeChange.bind(this));
	this.components.iptvFullscreenBtn.addEventListener('click', this._toggleFullscreen.bind(this));
	this.components.iptvTogglePlaylistBtn1.addEventListener('click', this._toggleMenu.bind(this));
	this.components.iptvTogglePlaylistBtn2.addEventListener('click', this._toggleMenu.bind(this));
	this.components.iptvControlsLayer.addEventListener('mousemove', this._onControlsLayerHover.bind(this));
	this.components.iptvPlaylist.addEventListener('mousedown', this._swipeSidebarFunc('mousemove', 'mouseup').bind(this));
	this.components.iptvPlaylist.addEventListener('touchstart', this._swipeSidebarFunc('touchmove', 'touchend').bind(this));
	this.components.player.addEventListener('mousedown', this._swipeMainFunc('mousemove', 'mouseup').bind(this));
	this.components.player.addEventListener('touchstart', this._swipeMainFunc('touchmove', 'touchend').bind(this));
}

Object.defineProperty(IPTVPlayer, 'FLASH_CNTRL_TIME', { value: 2500, writable: false, configurable: false });
Object.defineProperty(IPTVPlayer, 'MAX_CHANNEL_DIGITS', { value: 5, writable: false, configurable: false });

IPTVPlayer.prototype._isSmallscreen = function() {
	return window.innerWidth <= 768;
};

IPTVPlayer.prototype._getTouchEvent = function(e) {
	return e.changedTouches ? e.changedTouches[0] : e;
};

IPTVPlayer.prototype._toggleFullscreen = function() {
	!document.fullscreen ? this.components.player.requestFullscreen() : document.exitFullscreen();	
};

IPTVPlayer.prototype._isFullscreen = function() {
	return this.components.player.classList.contains('fs');
};

IPTVPlayer.prototype._isMenuopen = function() {
	return this.components.player.classList.contains('menuopen');
};

IPTVPlayer.prototype._toggleMenu = function() {
	if (this.components.player.classList.toggle('menuopen')) {
		this.highlightItem(this._currentItem);
	}
};

IPTVPlayer.prototype._onVolumeBtnClick = function(e) {
	if (false === this.components.video.muted && this.components.video.volume == 0) {
		this.components.video.volume = 1;
	} else {
		this.components.video.muted = !this.components.video.muted;
	}
};

IPTVPlayer.prototype._onVideoVolumeChange = function(e) {
	this.components.iptvVolumeBtn.classList.toggle('muted', e.target.muted || e.target.volume == 0);
};

IPTVPlayer.prototype._onFullscreenChange = function(e) {
	if (![null, this.components.player].includes(document.fullscreenElement)) {
		document.exitFullscreen();
		return;
	}
	
	if (this.components.player.classList.toggle('fs', document.fullscreen)) {
		this.components.iptvPlaylist.style.display = 'none';
		setTimeout((function() {
			this.components.iptvPlaylist.removeAttribute('style');
		}).bind(this), 200);
	}
};

IPTVPlayer.prototype._flashControlsHeader = function() {
	this.components.iptvControlsLayer.classList.add('open');
	
	if (null !== this._openControlsHandle) {
		clearTimeout(this._openControlsHandle);
	}
	
	this._openControlsHandle = setTimeout((function(e) {
		this.components.iptvControlsLayer.classList.remove('open');
		this._openControlsHandle = null;
	}).bind(this), IPTVPlayer.FLASH_CNTRL_TIME);
};

IPTVPlayer.prototype._onControlsLayerHover = function(e) {
	if (!this._isFullscreen())
		return;
	this._flashControlsHeader();
};

IPTVPlayer.prototype._swipeMainFunc = function(move, end) {
	return (function(e) {
		if (!this._isSmallscreen())
			return;
		let t = this._getTouchEvent(e);
		if (t.clientX > 16)
			return;
		
		let _handlemove = (function(e) {
			let t = this._getTouchEvent(e);
			if (t.clientX > window.innerWidth)
				return;
			let x = t.clientX - window.innerWidth;
			this.components.iptvPlaylist.style.transitionDuration = '0ms';
			this.components.iptvPlaylist.style.transform = 'translate3d(' + x + 'px, 0, 0)';
		}).bind(this);
		
		let _handleup = (function(e) {
			let t = this._getTouchEvent(e);
			this.components.iptvPlaylist.style.transitionDuration = '200ms';
			this.components.iptvPlaylist.style.transform = null;
			this.components.player.classList.toggle('menuopen', t.clientX / window.innerWidth >= 0.3);
			document.removeEventListener(move, _handlemove);
			document.removeEventListener(end, _handleup);	
		}).bind(this);
		
		document.addEventListener(move, _handlemove);
		document.addEventListener(end, _handleup);
	}).bind(this);
};

IPTVPlayer.prototype._swipeSidebarFunc = function(move, end) {
	return (function(e) {
		if (!this._isSmallscreen())
			return;
		let t = this._getTouchEvent(e);
		let x = 0;
		let initX = t.clientX;
		let unlocked = false;
		const unlockline = window.innerWidth / 4;
		
		let _handlemove = (function(e) {
			let t = this._getTouchEvent(e);
			x = t.clientX - initX;
			unlocked = x < -unlockline;
			if (x > 0 || !unlocked)
				return;
			this.components.iptvPlaylist.style.transitionDuration = '0ms';
			this.components.iptvPlaylist.style.transform = 'translate3d(' + x + 'px, 0, 0)';
		}).bind(this);
		
		let _handleup = (function(e) {
			this.components.iptvPlaylist.style.transitionDuration = '200ms';
			this.components.iptvPlaylist.style.transform = null;
			this.components.player.classList.toggle('menuopen', x / window.innerWidth > -0.3);
			document.removeEventListener(move, _handlemove);
			document.removeEventListener(end, _handleup);	
		}).bind(this);
		
		document.addEventListener(move, _handlemove);
		document.addEventListener(end, _handleup);
	}).bind(this);
};

IPTVPlayer.prototype._AlertBox = function(msg) {
	let d = this.components.player.appendChild(document.createElement('div'));
	d.classList.add('alert');
	d.addEventListener('transitionend', function(e) {
		if (e.target.classList.contains('show')) {
			setTimeout(function() {
				e.target.classList.remove('show');
			}, 5000);
		} else {
			e.target.remove();
		}
	});
	
	let s = d.appendChild(document.createElement('span'));
	s.innerText = msg;
	
	let a = d.appendChild(document.createElement('a'));
	a.classList.add('alert-close');
	a.href = 'javascript:void(0)';
	a.innerHTML = '&times;';
	a.addEventListener('click', function() {
		d.classList.remove('show');
	});

	setTimeout(function() {
		d.classList.add('show');
	}, 16.666);
};

IPTVPlayer.prototype._onKeydownHandler = function(e) {
	if (!this._focused)
		return;
		
	switch (e.key) {
		case 'ArrowUp':
			if (this._isFullscreen() && !this._isMenuopen()) {
				this.setItem(this._currentItem + 1);
				this._flashControlsHeader();
			} else {
				this.highlightItem(this._highlightedItem - 1);
			}
			break;
		case 'ArrowDown':
			if (this._isFullscreen() && !this._isMenuopen()) {
				this.setItem(this._currentItem - 1);
				this._flashControlsHeader();
			} else {
				this.highlightItem(this._highlightedItem + 1);
			}
			break;
		case 'ArrowRight':
			if (this._isFullscreen() && !this._isMenuopen()) {
				this.components.player.classList.add('menuopen');
				this.highlightItem(this._currentItem);
			}
			break;
		case 'ArrowLeft':
			if (this._isFullscreen()) {
				this.components.player.classList.remove('menuopen');
			}
			break;
		case 'Enter':
			if ((!this._isFullscreen() || this._isMenuopen()) && this._highlightedItem !== this._currentItem) {
				this.setItem(this._highlightedItem);
			}
			break;
		case 'f':
		case 'F':
			this._toggleFullscreen();
			break;
		case 'm':
		case 'M':
			this.components.video.muted = !this.components.video.muted;
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
			if (this._selectItem.length === 0 && e.key === '0') {
				break;
			}
			
			if (this._selectItem.length < IPTVPlayer.MAX_CHANNEL_DIGITS){
				this._selectItem += e.key;
			}
			
			this.highlightItem(parseInt(this._selectItem) - 1, true);
			
			let numofzeros = Math.max(0, IPTVPlayer.MAX_CHANNEL_DIGITS - this._selectItem.length);
			let zeros = Array(numofzeros + 1).join('0');
			this.components.iptvSelectItem.innerText = zeros + this._selectItem;
			this.components.iptvSelectItem.style.display = 'block';
			
			if (this._selectItemHandle) {
				clearTimeout(this._selectItemHandle);
			}
			
			this._selectItemHandle = setTimeout((function() {
				this.setItem(parseInt(this._selectItem) - 1, true);
				this.components.iptvSelectItem.style.display = 'none';
				this.components.iptvSelectItem.innerText = '';
				this._selectItemHandle = null;
				this._selectItem = '';
			}).bind(this), 2000);
			break;
		default:
			//console.log(e.key);
			break;
	}
};

IPTVPlayer.prototype.highlightItem = function(id, ignore=false) {
	if (!this.items.length) {
		return;
	}
	
	id = parseInt(id) || 0;
	
	if (ignore && (id < 0 || id > this.items.length - 1)) {
		return;
	}
	
	if (id < 0) {
		id = this.items.length - 1;
	} else if (id > this.items.length - 1) {
		id = 0;
	}
	
	if (this.itemsList[this._highlightedItem]) {
		this.itemsList[this._highlightedItem].classList.remove('highlight');
	}
	
	this.itemsList[id].classList.add('highlight');
	this.itemsList[id].focus();
	this._highlightedItem = id;
};

IPTVPlayer.prototype.setItem = function(id, ignore=false) {
	if (!this.items.length) {
		return;
	}
	
	id = parseInt(id) || 0;
	
	if (ignore && (id < 0 || id > this.items.length - 1)) {
		return;
	}
	
	if (id < 0) {
		id = this.items.length - 1;
	} else if (id > this.items.length - 1) {
		id = 0;
	}
	
	this.components.iptvTitle.innerText = this.items[id].title;
	
	if (this.itemsList[this._currentItem]) {
		this.itemsList[this._currentItem].classList.remove('active');
	}
	
	this.itemsList[id].classList.add('active');
	this._currentItem = id;
	this.highlightItem(id);
	localStorage.setItem('CurrentItem', id);
	
	if (!this._playerloading) {
		this._playerloading = true;
		this.components.video.setAttribute('poster', this.items[id].logo);
		this.shakaPlayer.configure(this.items[id].config || {});
		this.shakaPlayer.load(this.items[id].src)
			.then((function() { 
				this.components.video.play();
				if (this._isSmallscreen()) {
					this.components.player.classList.remove('menuopen');
				}
			}).bind(this))
			.catch((function(error) { 
				switch (error.code) {
					case shaka.util.Error.Code.BAD_HTTP_STATUS:
						this._AlertBox('Error: Bad or unavailable URL.');		
						break;
					case shaka.util.Error.Code.HTTP_ERROR:
						this._AlertBox('Error: Unable to play stream due to server error or CORS policy.');
						break;
					case shaka.util.Error.Code.TIMEOUT:
						this._AlertBox('Error: Server took a long time to respond.');
						break;
					default:
						this._AlertBox('Error: ' + (error.message || error.code));
						console.error(error);
						break;
				}
				
			}).bind(this))
			.finally((function() { 
				this._playerloading = false; 
			}).bind(this));
	}
};

IPTVPlayer.prototype.setItems = function(items) {
	this.items = items;
	this.itemsList = [];
	
	while (this.components.iptvPlaylistList.lastChild) {
		this.components.iptvPlaylistList.lastChild.remove();
	}
	
	this.components.iptvItemsCount.innerText = '(' + this.items.length + ')';
	
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
	
	if (this.items.length) {
		this.components.iptvPlaylistEmptyMessage.style.display = 'none';
	
		for (let i = 0; i < this.items.length; ++i) {
			let li = this.components.iptvPlaylistList.appendChild(document.createElement('li'));
			let a = li.appendChild(document.createElement('a'));
			a.href = 'javascript:void(0);';
			a.title = this.items[i].title;
			a.dataset.id = i;
			a.addEventListener('click', this._onItemClick.bind(this));
			a.addEventListener('mouseover', this._onItemHover.bind(this));
			
			this.itemsList.push(a);
			
			let ch = a.appendChild(document.createElement('span'));
			ch.className = 'chnum';
			ch.innerText = i + 1;
			
			let ns = a.appendChild(document.createElement('span'));
			ns.className = 'chname';
			ns.innerText = this.items[i].title;
			
			let ls = a.appendChild(document.createElement('span'));
			ls.classList.add('logo');
			if (this.items[i].logo) {
				let img = ls.appendChild(document.createElement('img'));
				img.width = 60;
				img.height = 60;
				img.loading = 'lazy';
				img.dataset.src = this.items[i].logo;
				img.alt = this.items[i].tid + '_logo';
				img.title = this.items[i].title;
				img.onerror = function(e) { e.target.remove(); }
				img.classList.add('hidden');
				this.listObserver.observe(img);
			}
		}
	} else {
		this.components.iptvPlaylistEmptyMessage.style.display = 'block';
	}
};

IPTVPlayer.prototype._onItemHover = function(e) {
	this.highlightItem(e.target.dataset.id);
};

IPTVPlayer.prototype._onItemClick = function(e) {
	if (e.pointerId !== -1) {
		this.setItem(e.target.dataset.id);
	}
	if (!this._videoUnmuted && this.components.video.muted) {
		this.components.video.muted = false;
		this._videoUnmuted = true;
	}
};

IPTVPlayer.prototype.getPlayer = function() {
	return this.components.player;
};