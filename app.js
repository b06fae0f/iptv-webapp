let starttime = performance.now();

const iptv = new IptvPlayer();
document.getElementById('main').appendChild(iptv.getRoot());

if (!localStorage.getItem('FirstTimeRun')) {
	localStorage.setItem('FirstTimeRun', 1);
	document.getElementById('settings').showModal();
}

document.querySelectorAll('dialog').forEach(d => {
	d.addEventListener('toggle', e => iptv.focused = !e.target.open);
	d.getElementsByClassName('dialog-close')[0]?.addEventListener('click', e => d.close());
});

document.settingsForm.addEventListener('submit', (e) => {
	e.preventDefault();
	switch (e.submitter.name) {
		case 'loadUrl':
			const url = e.target['url'].value.trim();
			const upd = parseInt(e.target['update']?.value) || 0;
			
			iptv.setUpdateInteval(upd).loadURL(url, () => {
				document.getElementById('settings').close();
			});
			
			break;
			
		case 'uploadFile':
			const file = e.target['file'].files[0];
			
			iptv.loadFile(file, () => {
				document.getElementById('settings').close();
			});
			
			break;
	}
});

console.log('app.js took %f ms to complete.', (performance.now() - starttime).toFixed(3));

