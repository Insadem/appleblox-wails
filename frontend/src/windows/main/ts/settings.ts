import { pathExists } from "./utils";
import path from "path-browserify";
import { FSPathService } from "$services/fspathservice";
import { FSService } from "$services/fsservice";

export async function dataPath(): Promise<string> {
    return path.join(await FSPathService.DataDir(), "AppleBlox", "config");
}

/** Saves the data provided to the Application Support folder */
let saveQueue: { [key: string]: string } = {};
let hasInterval = false;
if (!hasInterval) {
    hasInterval = true;
    setInterval(() => {
        for (const [path, data] of Object.entries(saveQueue)) {
            FSService.WriteFile(path, data).catch(console.error);
            delete saveQueue[path];
        }
    }, 1000);
}

// Keeps track of the debounces
const lastSaveTime = new Map<string, number>();
/** Saves the settings of a panel by its ID. Can only save a panel once every 100ms */
export async function saveSettings(panelId: string, data: Object): Promise<void> {
    const now = Date.now();
    const lastSave = lastSaveTime.get(panelId);

    // ignore save requests if they don't wait 100ms
    if (lastSave && (now - lastSave) < 100) {
        return;
    }

    // update the last save time
    lastSaveTime.set(panelId, now);

    try {
        const savePath = await dataPath();
        if (!(await pathExists(savePath))) {
            await FSService.CreateDirectory(savePath);
        }
        try {
            const filepath = `${savePath}/${panelId}.json`;
            if (await pathExists(filepath)) {
                await FSService.Remove(filepath);
            }
            saveQueue[`${savePath}/${panelId}.json`] = JSON.stringify(data);
        } catch (err) {
            console.error(err);
        }
    } catch (err) {
        throw err;
    }
}

/** Loads the data from the specified panelID */
export async function loadSettings(panelId: string): Promise<{ [key: string]: any } | undefined> {
    try {
        const filepath = `${await dataPath()}/${panelId}.json`;
        if (!(await pathExists(filepath))) {
            return undefined;
        }
        return JSON.parse(await FSService.ReadFile(filepath));
    } catch (err) {
        console.error(err);
    }
}