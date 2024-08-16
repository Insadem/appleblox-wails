import { getMode } from "./utils";

import hotkeys from "hotkeys-js";
import { OsService } from "$services/osservice";

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
			OsService.ExecCommand(`osascript -e 'tell application "System Events" to set frontmost of every process whose unix id is ${window.NL_PID} to true'`);
		} else {
			// Better way of focusing the app
			OsService.ExecCommand(`open -a "AppleBlox"`);
		}
	} catch (err) {
		console.error(err);
	}
}

export async function setWindowVisibility(state: boolean) {
	try {
		await OsService.ExecCommand(`osascript -e 'tell application "System Events" to set visible of every process whose unix id is ${window.NL_PID} to ${state}'`)
	} catch (err) {
		console.error(err);
	}
}