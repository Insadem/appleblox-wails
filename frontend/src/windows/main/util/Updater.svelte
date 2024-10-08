<script lang="ts">
	import { version } from '../../../../package.json';
	import { loadSettings, saveSettings } from '../ts/settings';
	import { compareVersions, curlGet } from '../ts/utils';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import SvelteMarkdown from 'svelte-markdown';
	import Link from './Link.svelte';
	import { Browser } from '@wailsio/runtime';
	import { OSService } from '$services/osservice';

	let showUpdatePopup = false;
	let updateVersion = version;
	let body = '';

	async function checkForUpdate() {
		const releases = await curlGet('https://api.github.com/repos/OrigamingWasTaken/appleblox/releases').catch(console.error);
		if (releases.message) return;
		for (const re of releases) {
			if (compareVersions(re.tag_name, updateVersion) > 0) {
				updateVersion = re.tag_name;
				body = re.body;
				console.log(body.replace);
			}
		}
		if (updateVersion === version) return;
		const compare = compareVersions(updateVersion, version);
		if (compare > 0) {
			console.log(`A release is available: ${updateVersion}`);
			const settings = await loadSettings('updating');
			if (settings) {
				// Last asked date is newer than 7 days
				const timeDiff = Math.round((Date.now() - settings.date) / (1000 * 3600 * 24));
				console.log(timeDiff);
				if (timeDiff <= 7) return;
				showUpdatePopup = true;
			} else {
				showUpdatePopup = true;
			}
		}
	}
	checkForUpdate();

	async function getArch() {
		return (await OSService.Arm()) ? 'arm64' : 'x64';
	}
</script>

<AlertDialog.Root bind:open={showUpdatePopup}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>A new release is available (v{updateVersion})</AlertDialog.Title>
			<AlertDialog.Description>
				<SvelteMarkdown source={body.replace(/(\n\s*\n)+/g, '<br><br>')} options={{ gfm: true, breaks: true }} renderers={{ link: Link }} />
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<Button
				variant="secondary"
				on:click={() => {
					saveSettings('updating', { date: Date.now() });
					showUpdatePopup = false;
				}}>Do not ask again</Button
			>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				on:click={() => {
					Browser.OpenURL(`https://github.com/OrigamingWasTaken/appleblox/releases/download/${updateVersion}/AppleBlox-${updateVersion}_${getArch()}.dmg`);
				}}>Install</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
