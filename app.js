var starttime = performance.now();

const iptv = new IPTVPlayer();
document.getElementById('main').appendChild(iptv.getPlayer());

let dialogs = document.querySelectorAll('dialog');
for (var i = 0; i < dialogs.length; ++i) {
	dialogs[i].addEventListener('toggle', function(e) {
		iptv._focused = !e.target.open;
	});
}

var dialogCloseButtons = document.getElementsByClassName('dialog-close');
for (var i = 0; i < dialogCloseButtons.length; ++i) {
	dialogCloseButtons[i].addEventListener('click', function(e) {
		var target = document.querySelector(e.target.dataset.target);
		if (target && target.tagName === 'DIALOG') {
			target.close();
		}
	});
}

function DBStorePlaylist() {
	var DBOpenRequest = window.indexedDB.open('iptv-player', 1);

	DBOpenRequest.onsuccess = function(e) {
		db = e.target.result;
		var transaction = db.transaction('playlist', 'readwrite');
		var objectStore = transaction.objectStore('playlist');
		var objectStoreRequest = objectStore.clear();
	
		objectStoreRequest.onsuccess = function(e) {
			for (var i = 0; i < iptv.items.length; ++i) {
				objectStore.put(iptv.items[i]);
			}
		};
		
		transaction.oncomplete = function() {
			db.close();
		};
	}
	
	DBOpenRequest.onerror = function(e) {
		console.error('Failed to open database, Error: ', e.target.errorCode);
	};
}

document.settingsForm.addEventListener('submit', function(e) {
	e.preventDefault();
	//console.log(e);
	switch (e.submitter.name) {
		case 'loadUrl':
			var url = e.target['url'].value.trim();
			var upd = parseInt(e.target['update'].value);
			if (url == '') {
				console.error('Playlist\'s URL is empty.');
			} else if (upd < 0 || upd > 4) {
				console.error('Invalid update time.');
			} else {
				m3uutils.load(url, function(result, error) {
					if (!error) {
						console.log('fetching new playlist.');
						iptv.setItems(result);
						iptv.setItem();
						DBStorePlaylist();				
						localStorage.setItem('PlaylistURL', url);
						localStorage.setItem('PlaylistUpdateInterval', upd);
						localStorage.setItem('PlaylistLastUpdateTime', (new Date()).toUTCString());
						document.getElementById('settings').close();
					} else {
						iptv._AlertBox(result.message);
					}
				});
			}
			break;
		case 'uploadFile':
			console.log('uploading file');
			var file = e.target['file'].files[0];
			
			if (file) {
				var fr = new FileReader();
				fr.onload = function(e) {
					iptv.setItems(m3uutils.parse(e.target.result));
					iptv.setItem();
					DBStorePlaylist();
					localStorage.removeItem('PlaylistURL');
					localStorage.removeItem('PlaylistUpdateInterval');
					localStorage.removeItem('PlaylistLastUpdateTime');
					document.getElementById('settings').close();
				};
				fr.readAsText(file);
			}
			break;
	}
});

if (!localStorage.getItem('FirstTimeRun')) {
	localStorage.setItem('FirstTimeRun', 1);
	document.getElementById('settings').showModal();
}

var db;

if (window.indexedDB) {
	var DBOpenRequest = window.indexedDB.open('iptv-player', 1);
	
	DBOpenRequest.onupgradeneeded = function(e) {
		var db = e.target.result;
		
		if (!db.objectStoreNames.contains('playlist')) {
			var objectStore = db.createObjectStore('playlist', { keyPath: 'id' });
			
			objectStore.createIndex('tid', 'tid', { unique: false });
			objectStore.createIndex('title', 'title', { unique: false });
			objectStore.createIndex('logo', 'logo', { unique: false });
			objectStore.createIndex('group', 'group', { unique: false });
			objectStore.createIndex('src', 'src', { unique: false });
			objectStore.createIndex('config', 'config', { unique: false });
		}
	};
	
	DBOpenRequest.onsuccess = function(e) {
		db = e.target.result;
		
		var currentTime = new Date();
		var playlistUrl = localStorage.getItem('PlaylistURL');
		var playlistUpdateInterval = parseInt(localStorage.getItem('PlaylistUpdateInterval')) || 0;
		var playlistLastUpdateTime = new Date(localStorage.getItem('PlaylistLastUpdateTime'));
		
		document.settingsForm.url.value = playlistUrl;
		document.settingsForm.update.options[playlistUpdateInterval].setAttribute('selected', true);
		
		var playlistUpdate = (function() {
			if (!playlistUpdateInterval || !playlistUrl || playlistUrl.length === 0 || isNaN(playlistLastUpdateTime.valueOf())) {	
				return false;
			}
			
			var playlistNextUpdateTime = playlistLastUpdateTime;
			switch (playlistUpdateInterval) {
				case 1:
					playlistNextUpdateTime.setDate(playlistLastUpdateTime.getDate() + 1);
					break;
				case 2:
					playlistNextUpdateTime.setDate(playlistLastUpdateTime.getDate() + 7);
					break;
				case 3:
					playlistNextUpdateTime.setMonth(playlistLastUpdateTime.getMonth() + 1);
					break;
				case 4:
					playlistNextUpdateTime.setFullYear(playlistLastUpdateTime.getFullYear() + 1);
					break;
				default:
					return false;
					break;
			}
			
			if (currentTime >= playlistNextUpdateTime) {
				return true;
			}
			
			return false;
		})();
		
		if (playlistUpdate) {
			m3uutils.load(playlistUrl, function(result, error) {
				if (!error) {
					console.log('updating database playlist.');
					iptv.setItems(result);
					iptv.setItem(localStorage.getItem('CurrentItem'));
					
					var transaction = db.transaction('playlist', 'readwrite');
					var objectStore = transaction.objectStore('playlist');
					var objectStoreRequest = objectStore.clear();
					
					objectStoreRequest.onsuccess = function(e) {
						for (var i = 0; i < iptv.items.length; ++i) {
							objectStore.put(iptv.items[i]);
						}
					};
					
					transaction.oncomplete = function() {
						db.close();
					};
					
					localStorage.setItem('PlaylistLastUpdateTime', currentTime.toUTCString());
				} else {
					iptv._AlertBox(result.message);
				}
			});
		} else {
			console.log('fetching playlist from database.');
			var transaction = db.transaction('playlist', 'readonly');
			var objectStore = transaction.objectStore('playlist');
			var objectStoreRequest = objectStore.getAll();

			objectStoreRequest.onsuccess = function(e) {
				iptv.setItems(e.target.result);
				iptv.setItem(localStorage.getItem('CurrentItem'));
			};
				
			transaction.oncomplete = function() {
				db.close();
			};
		}
	};
	
	DBOpenRequest.onerror = function(e) {
		console.error('Failed to open database, Error: ', e.target.errorCode);
	};
}

console.log('app.js took %f ms to complete.', (performance.now() - starttime).toFixed(3));