import { OsService } from '$services/osservice';
import { libraryPath } from './libraries';

/**
 * Options for configuring the Discord Rich Presence
 */
export interface RPCOptions {
	/** Your application's client id (Required) */
	clientId: string;
	/** The details string for the presence (Optional) */
	details?: string;
	/** The state string for the presence (Optional) */
	state?: string;
	/** The name of the large image to display (Optional) */
	largeImage?: string;
	/** The text shown when hovering over the large image (Optional) */
	largeImageText?: string;
	/** The name of the small image to display (Optional) */
	smallImage?: string;
	/** The text shown when hovering over the small image (Optional) */
	smallImageText?: string;
	/** The URL for the first button (Optional) */
	buttonUrl1?: string;
	/** The text displayed on the first button (Optional) */
	buttonText1?: string;
	/** The URL for the second button (Optional) */
	buttonUrl2?: string;
	/** The text displayed on the second button (Optional) */
	buttonText2?: string;
	/** The Unix timestamp for when the activity started (Optional) */
	startTime?: number;
	/** The Unix timestamp for when the activity will end (Optional) */
	endTime?: number;
	/** The current and maximum party size, as a tuple [current, max] (Optional) */
	partySize?: [number, number];
	/** The ID of the party (Optional, must be used with partySize) */
	partyId?: string;
	/** The ID of the match (Optional, cannot be used with buttons) */
	matchId?: string;
	/** The join ID of the match (Optional, must be used with matchId) */
	joinId?: string;
	/** The spectate ID of the match (Optional, must be used with matchId) */
	spectateId?: string;
	/** Whether to enable time counting from the current time (Optional) */
	enableTime?: boolean;
	/** Whether to enable AFK RPC or not (Optional) */
	afk?: boolean;
	/** How many minutes should pass before the AFK RPC is started (Optional, default: 5) */
	afkAfter?: number;
	/** How often to check whether the user is idle, in seconds (Optional, default: 20) */
	afkUpdate?: number;
	/** Exit after a given time in seconds (Optional, default: -1 means don't exit) */
	exitAfter?: number;
	/** Whether to disable colors in the output (Optional) */
	disableColor?: boolean;
}

export class DiscordRPC {
	private static binaryPath: string = `${libraryPath('discordrpc')}`;
	private static process: any | null = null;
	private static instances: Set<DiscordRPC> = new Set();
	private static currentOptions: RPCOptions | null = null;

	constructor() {
		DiscordRPC.instances.add(this);
	}

	private async isRunning() {
		return (await OsService.ExecCommand(`pgrep -f "discordrpc_ablox"`)).stdOut.split('\n').length > 2;
	}

	/**
	 * Starts the Discord RPC process if it's not already running
	 * @param options - The RPC options
	 * @returns A promise that resolves when the process is started
	 */
	async start(options: RPCOptions): Promise<void> {
		const rpcOptions = {
			...options,
			state: options.state || '',
		};

		if (await this.isRunning()) {
			console.log('RPC already running. Updating options.');
			await this.update(options);
			return;
		}

		const args = DiscordRPC.buildArgs(rpcOptions);

		// Kill any existing discordrpc processes
		await OsService.ExecCommand(`pkill -f "discordrpc_ablox"`);

		const cmd = `${DiscordRPC.binaryPath} ${args.join(' ')}`;
		console.log('Starting RPC with: ' + cmd);
		DiscordRPC.process = await os.spawnProcess(cmd);
		DiscordRPC.currentOptions = options;
	}

	/**
	 * Stops the Discord RPC process
	 * @returns A promise that resolves when the process is stopped
	 */
	async stop(): Promise<void> {
		if (await this.isRunning()) {
			await OsService.ExecCommand(`pkill -f "discordrpc_ablox"`);
			DiscordRPC.process = null;
			DiscordRPC.currentOptions = null;
		}
	}

	/**
	 * Updates the Discord RPC with new options
	 * @param options - The new RPC options
	 * @returns A promise that resolves when the update is complete
	 */
	async update(options: Partial<RPCOptions>): Promise<void> {
		await this.stop();
		await this.start({ ...DiscordRPC.currentOptions, ...options } as RPCOptions);
	}

	/**
	 * Sets the activity details
	 * @param details - The new details string
	 * @returns A promise that resolves when the update is complete
	 */
	async setDetails(details: string): Promise<void> {
		await this.update({ details });
	}

	/**
	 * Sets the activity state
	 * @param state - The new state string
	 * @returns A promise that resolves when the update is complete
	 */
	async setState(state: string): Promise<void> {
		await this.update({ state });
	}

	/**
	 * Sets the large image and its text
	 * @param imageName - The name of the large image
	 * @param imageText - The text for the large image
	 * @returns A promise that resolves when the update is complete
	 */
	async setLargeImage(imageName: string, imageText?: string): Promise<void> {
		await this.update({ largeImage: imageName, largeImageText: imageText });
	}

	/**
	 * Sets the small image and its text
	 * @param imageName - The name of the small image
	 * @param imageText - The text for the small image
	 * @returns A promise that resolves when the update is complete
	 */
	async setSmallImage(imageName: string, imageText?: string): Promise<void> {
		await this.update({ smallImage: imageName, smallImageText: imageText });
	}

	/**
	 * Sets the buttons for the RPC
	 * @param buttons - An array of button objects with url and text properties
	 * @returns A promise that resolves when the update is complete
	 */
	async setButtons(buttons: Array<{ url: string; text: string }>): Promise<void> {
		const updateOptions: Partial<RPCOptions> = {};
		if (buttons[0]) {
			updateOptions.buttonUrl1 = buttons[0].url;
			updateOptions.buttonText1 = buttons[0].text;
		}
		if (buttons[1]) {
			updateOptions.buttonUrl2 = buttons[1].url;
			updateOptions.buttonText2 = buttons[1].text;
		}
		await this.update(updateOptions);
	}

	/**
	 * Sets the party information
	 * @param size - The current and maximum party size
	 * @param id - The party ID
	 * @returns A promise that resolves when the update is complete
	 */
	async setParty(size: [number, number], id?: string): Promise<void> {
		await this.update({ partySize: size, partyId: id });
	}

	/**
	 * Sets the match information
	 * @param matchId - The match ID
	 * @param joinId - The join ID
	 * @param spectateId - The spectate ID
	 * @returns A promise that resolves when the update is complete
	 */
	async setMatch(matchId: string, joinId?: string, spectateId?: string): Promise<void> {
		await this.update({ matchId, joinId, spectateId });
	}

	/**
	 * Cleans up resources when the instance is no longer needed
	 */
	destroy(): void {
		DiscordRPC.instances.delete(this);
		if (DiscordRPC.instances.size === 0) {
			this.stop().catch(console.error);
		}
	}

	private static buildArgs(options: RPCOptions): string[] {
		const args: string[] = [];

		if (options.clientId) args.push(`-c ${options.clientId}`);
		if (options.details) args.push(`-d "${options.details}"`);
		if (options.state) args.push(`-s "${options.state}"`);
		if (options.largeImage) args.push(`-N ${options.largeImage}`);
		if (options.largeImageText) args.push(`-I "${options.largeImageText}"`);
		if (options.smallImage) args.push(`-n ${options.smallImage}`);
		if (options.smallImageText) args.push(`-i "${options.smallImageText}"`);
		if (options.buttonUrl1) args.push(`-U ${options.buttonUrl1}`);
		if (options.buttonText1) args.push(`-B "${options.buttonText1}"`);
		if (options.buttonUrl2) args.push(`-u ${options.buttonUrl2}`);
		if (options.buttonText2) args.push(`-b "${options.buttonText2}"`);
		if (options.startTime) args.push(`-S ${options.startTime}`);
		if (options.endTime) args.push(`-E ${options.endTime}`);
		if (options.partySize) args.push(`-P ${options.partySize[0]},${options.partySize[1]}`);
		if (options.partyId) args.push(`-p ${options.partyId}`);
		if (options.matchId) args.push(`-m ${options.matchId}`);
		if (options.joinId) args.push(`-j ${options.joinId}`);
		if (options.spectateId) args.push(`-y ${options.spectateId}`);
		if (options.enableTime) args.push('-t');
		if (options.afk) args.push('-a');
		if (options.afkAfter) args.push(`-f ${options.afkAfter}`);
		if (options.afkUpdate) args.push(`-k ${options.afkUpdate}`);
		if (options.exitAfter) args.push(`-e ${options.exitAfter}`);
		if (options.disableColor) args.push('-C');

		return args;
	}
}

let discordRPC: DiscordRPC | null = null;
const presets: { [key: string]: RPCOptions } = {
	inRobloxApp: {
		clientId: '1257650541677383721',
		details: 'Currently browsing the menus',
		state: 'In the launcher',
		largeImage: 'roblox',
		largeImageText: 'Roblox',
		enableTime: true,
	},
};

export class RPCController {
	public static preset(preset: string) {
		if (presets[preset]) {
			this.set(presets[preset])
		}
	}

	public static async set(options: RPCOptions) {
		if (discordRPC) {
			discordRPC.stop();
		} else {
			await OsService.ExecCommand(`pkill -f "discordrpc_ablox"`);
		}
		discordRPC = new DiscordRPC();
		await discordRPC.start(options);
	}

	public static async stop() {
		if (discordRPC) {
			discordRPC.destroy();
		}
		await OsService.ExecCommand(`pkill -f "discordrpc_ablox"`);
	}
}
