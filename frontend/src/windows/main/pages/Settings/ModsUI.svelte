<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import * as Alert from '$lib/components/ui/alert/index';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import ShrugIcon from '@/assets/panel/shrug.png';
	import RefreshIcon from '@/assets/panel/refresh.png';

	import Roblox from '../../ts/roblox';
	import path from 'path-browserify';
	import { toast } from 'svelte-sonner';
	import { OSService } from '$services/osservice';

	let mods: { filename: string; path: string; state: boolean }[] = [];
	Roblox.Mods.loadMods().then((m) => (mods = m));

	async function onSwitchClick(filePath: string) {
		try {
			const modIndex = mods.findIndex((m) => m.path === filePath);
			if (path.basename(filePath).endsWith('.disabled')) {
				await OSService.ExecCommand(`mv "${filePath}" "${filePath.replace(/\.disabled$/, '')}"`, null);
				if (modIndex >= 0) {
					mods[modIndex] = {
						...mods[modIndex],
						state: true,
						path: filePath.replace(/\.disabled$/, ''),
					};
				}
			} else {
				await OSService.ExecCommand(`mv "${filePath}" "${filePath}.disabled"`, null);
				if (modIndex >= 0) {
					mods[modIndex] = {
						...mods[modIndex],
						state: false,
						path: `${filePath}.disabled`,
					};
				}
			}
		} catch (err) {
			toast.error('An error occured while enabling/disabling mod: ' + err);
			console.error(err);
		}
	}
</script>

<Card.Root class="w-full">
	<Card.Header>
		<div class="flex">
			<div>
				<Card.Title class="text-rose-700">Mods Manager</Card.Title>
				<Card.Description>Enable or disable certain mods. They are loaded in alphabetical order (1,2,3,a,b,c)</Card.Description>
			</div>

			<Button
				class="ml-auto mb-3 w-10 p-0"
				variant="outline"
				on:click={() => {
					Roblox.Mods.loadMods().then((m) => (mods = m));
				}}
			>
				<img src={RefreshIcon} alt="Refresh icon" class="towhite-always w-[50%]" />
			</Button>
		</div>

		{#if mods.length > 0}
			{#each mods as mod (mod.filename)}
				<Separator class="my-3" />
				<div class="flex items-center">
					<div>
						<p class="font-semibold text-[#1f1717] dark:text-red-100">{mod.filename}</p>
						<p class="text-[13px] text-neutral-700 dark:text-neutral-200">{mod.path}</p>
					</div>
					<Switch
						checked={mod.state}
						class="ml-auto mr-4"
						on:click={() => {
							onSwitchClick(mod.path);
						}}
					/>
				</div>
			{/each}
		{:else}
			<img src={ShrugIcon} alt="No mods found icnon" class="towhite w-16" />
			<Alert.Root>
				<Alert.Title>No mods found</Alert.Title>
				<Alert.Description>You haven't downloaded any mods.</Alert.Description>
			</Alert.Root>
		{/if}
	</Card.Header>
	<Card.Footer class="flex justify-between"></Card.Footer>
</Card.Root>
