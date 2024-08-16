import { getMode } from "./utils";

import hotkeys from "hotkeys-js";
import { OSService } from "$services/osservice";

// Shortcuts like copy, paste, quit, etc... (they are unimplemented by default in NeuJS)
hotkeys("ctrl+c,cmd+c", (e) => {
	e.preventDefault();
	document.execCommand("copy");
});

hotkeys("ctrl+v,cmd+v", (e) => {
	e.preventDefault();
	document.execCommand("paste");
});

hotkeys("ctrl+x,cmd+x", (e) => {
	e.preventDefault();
	document.execCommand("copy");
	document.execCommand("cut");
});

hotkeys("ctrl+z,cmd+z", (e) => {
	e.preventDefault();
	document.execCommand("undo");
});

// hotkeys("cmd+q,cmd+w", (e) => {
// 	e.preventDefault();
// 	app.exit();
// });

export async function focusWindow() {
	try {
		if (getMode() === "dev") {
			// So the app can be focused in dev environnement
			OSService.ExecCommand(`osascript -e 'tell application "System Events" to set frontmost of every process whose unix id is ${window.NL_PID} to true'`, null);
		} else {
			// Better way of focusing the app
			OSService.ExecCommand(`open -a "AppleBlox"`, null);
		}
	} catch (err) {
		console.error(err);
	}
}

export async function setWindowVisibility(state: boolean) {
	try {
		await OSService.ExecCommand(`osascript -e 'tell application "System Events" to set visible of every process whose unix id is ${window.NL_PID} to ${state}'`, null)
	} catch (err) {
		console.error(err);
	}
}