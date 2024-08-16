import { OSService } from '$services/osservice'
import { FSPathService } from '$services/fspathservice'
import path from "path-browserify";

let robloxPath: null | string = null;

async function getMostRecentRoblox() {
	const knownPaths = ["/Applications/Roblox.app", path.join(await FSPathService.HomeDir(), "Applications/Roblox.app")];
	let mostRecentPath = "";
	let date = 0;
	for (const path of knownPaths) {
		const lastOpened = (await OSService.ExecCommand(`stat -f "%a" "${path}"`, null)).stdOut.trim();
		if (parseInt(lastOpened) === Math.max(date, parseInt(lastOpened))) {
			date = Math.max(date, parseInt(lastOpened));
			mostRecentPath = path;
		}
	}
	robloxPath = mostRecentPath;
}

getMostRecentRoblox();

export function getRobloxPath() {
	return robloxPath ? robloxPath : "/Applications/Roblox.app";
}