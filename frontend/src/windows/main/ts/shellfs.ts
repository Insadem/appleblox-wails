import { OSService } from "$services/osservice";

class shellFS {
	/**
	 * Creates the folder at the specified path.
	 * @param path - The path where the folder should be created.
	 */
	public static async createDirectory(path: string): Promise<void> {
		try {
			const cmd = await OSService.ExecCommand(`mkdir -p "${path}"`, null);
			if (cmd.stdErr.length > 2) {
				throw new Error(cmd.stdErr)
			}
		} catch (err) {
			console.error("Couldn't create directory");
			console.error(err);
		}
	}

	/**
	 * Removes the file or folder at the specified path.
	 * @param path - The path of the file or folder to remove.
	 */
	public static async remove(path: string): Promise<void> {
		try {
			const cmd = await OSService.ExecCommand(`rm -rf "${path}"`, null);
			if (cmd.stdErr.length > 2) {
				throw new Error(cmd.stdErr)
			}
		} catch (err) {
			console.error("Couldn't remove the file or folder");
			console.error(err);
		}
	}

	/**
	 * Writes the file at the specified path with the given content.
	 * @param path - The path where the file should be written.
	 * @param content - The content to write to the file.
	 */
	public static async writeFile(path: string, content: string): Promise<void> {
		try {
			const escapedContent = content.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
			const cmd = await OSService.ExecCommand(`echo "${escapedContent}" > "${path}"`, null);
			if (cmd.stdErr.length > 2) {
				throw new Error(cmd.stdErr)
			}
		} catch (err) {
			console.error("Couldn't write to the file");
			console.error(err);
		}
	}

	/**
	 * Copy the file/folder at the specified path.
	 * @param source - The path where the source is.
	 * @param dest - Where to copy.
	 */
	public static async copy(source: string, dest: string, recursive = false): Promise<void> {
		try {
			const cmd = await OSService.ExecCommand(`cp ${recursive ? '-r ' : ''} "${source}" "${dest}"`, null);
			if (cmd.stdErr.length > 2) {
				throw new Error(cmd.stdErr)
			}
		} catch (err) {
			console.error("Couldn't copy");
			console.error(err);
		}
	}

	/**
	 * Move the file/folder at the specified path.
	 * @param source - The path where the source is.
	 * @param dest - Where to move.
	 */
	public static async move(source: string, dest: string): Promise<void> {
		try {
			const cmd = `mv "${source}" "${dest}"`;
			await OSService.ExecCommand(cmd, null);
		} catch (err) {
			console.error("Couldn't move");
			console.error(err);
		}
	}

	/**
	 * Merge the file/folder at the specified path.
	 * @param source - The path where the source is.
	 * @param dest - Where to merge.
	 */
	public static async merge(source: string, dest: string): Promise<void> {
		try {
			const cmd = `rsync -a "${source}" "${dest}"`;
			await OSService.ExecCommand(cmd, null);
		} catch (err) {
			console.error("Couldn't merge");
			console.error(err);
		}
	}
}

export default shellFS;
