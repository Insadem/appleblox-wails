import { OSService } from '$services/osservice';
import { libraryPath } from '../libraries';

const window_manager = libraryPath('window_manager');

export class RobloxWindow {
	private readonly windowId: number = 1;

	/**
	 * Move the Roblox window smoothly
	 * @param x The target x-coordinate
	 * @param y The target y-coordinate
	 */
	public static async move(x: number | string, y: number | string) {
		OSService.ExecCommand(`${window_manager} move "Roblox" ${x} ${y}`, null);
		console.log(`Moved Roblox window to "${x},${y}"`);
	}
	/**
	 * Resize the Roblox window smoothly
	 * @param width The target width
	 * @param height The target height
	 */
	public static async resize(width: number | string, height: number | string) {
		OSService.ExecCommand(`${window_manager} resize "Roblox" ${width} ${height}`, null);
		console.log(`Resized Roblox window to "${width},${height}"`);
	}

	public static async isFullscreen(): Promise<boolean> {
		const getInfoCmd = await OSService.ExecCommand(`osascript -e 'tell application "System Events"
            tell application "Roblox" to activate
            try
                tell process "Roblox"
                    set isFullscreen to value of attribute "AXFullScreen" of front window
                end tell
                return isFullscreen
            on error
                return "true"
            end try
        end tell'
        `, null);
		return getInfoCmd.stdOut.trim() === 'true';
	}

	/**
	 * Set the fullscreen mode for the Roblox window
	 * @param fullscreen If true, activates fullscreen mode; if false, deactivates it
	 */
	public static async setFullscreen(fullscreen: boolean): Promise<void> {
		if ((await this.isFullscreen()) === fullscreen) return;
		await OSService.ExecCommand(
			`osascript -e 'tell application "Roblox" to activate' -e 'delay 0.5' -e 'tell application "System Events" to tell process "Roblox" to keystroke "f" using {command down}'`, null
		);
	}

	/** Maximizes the roblox window on the desktop */
	public static async maximize() {
		this.move(0, 0);
		const screenSize = (await computer.getDisplays())[0].resolution;
		this.resize(screenSize.width, screenSize.height - 100);
	}

	/** Sets the desktop resolution */
	public static async setDesktopRes(width: number | string, height: number | string, duration = 1) {
		OSService.ExecCommand(`${libraryPath('window_manager')} setres ${width} ${height} ${duration} 1`, { background: true });
	}
}
