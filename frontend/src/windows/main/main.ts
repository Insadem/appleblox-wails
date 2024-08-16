import './app.css';
import './ts/window';
import './ts/roblox/path';
import './ts/debugging';
import App from './App.svelte';
import { version } from '../../../package.json';
import { RPCController } from './ts/rpc';
import { loadSettings } from './ts/settings';
import { AbloxWatchdog } from './ts/watchdog';
import { Events } from "@wailsio/runtime";

// Initialize NeutralinoJS
// init();

// // When NeutralinoJS is ready:
// events.on('ready', async () => {

// });

setTimeout(async () => {
	console.log('\n');
	console.log('===========');
	console.log(`AppleBlox v${version}`);
	console.log(`Current Time: ${new Date().toLocaleString()}`);
	//console.log(`${(await os.execCommand('uname -a')).stdOut.trim()}`);
	console.log('===========');

	// /** Launch the process manager */

	// TODO: fix and uncomment
	// const watchdog = new AbloxWatchdog();
	// watchdog.start().catch(console.error);
}, 500);

Events.On('exit', async () => {
	await RPCController.stop();
});

const app = new App({
	// @ts-expect-error
	target: document.getElementById('app'),
});

export default app;
