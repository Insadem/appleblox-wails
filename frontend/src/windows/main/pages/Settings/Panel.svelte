<script lang="ts" type="module">
	import type { SettingsPanel } from '@/types/settings';
	import path from 'path-browserify';
	import shellFS from '../../ts/shellfs';
	import { toast } from 'svelte-sonner';

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Trash2, Upload } from 'lucide-svelte';

	import { createEventDispatcher } from 'svelte';
	import LoadingSpinner from '../../util/LoadingSpinner.svelte';
	import { loadSettings } from '../../ts/settings';
	import FfButtonsCustom from './FFButtonsCustom.svelte';
	import { haveSameKeys } from '../../ts/utils';
	import ModsUi from './ModsUI.svelte';
	import { cn } from '$lib/utils.js';
	import { Dialogs } from '@wailsio/runtime';

	export let panel: SettingsPanel;

	const dispatch = createEventDispatcher<{
		settingsChanged: Object;
		buttonClicked: string;
		switchClicked: { id: string; state: boolean };
		fileAdded: { id: string; filePath: string };
		fileRemoved: { id: string; filePath: string };
	}>();

	let settingsLoaded = false;
	let sections: any = {};
	for (const section of panel.sections || []) {
		sections[section.id] = {};
		for (const inter of section.interactables || []) {
			// sections[section.id][inter.id] = undefined;
			switch (inter.options.type) {
				case 'boolean':
					sections[section.id][inter.id] = inter.options.state;
					break;
				case 'string':
				case 'dropdown':
					sections[section.id][inter.id] = inter.options.default;
					break;
				case 'number':
					sections[section.id][inter.id] = [inter.options.default];
					break;
				case 'file':
					sections[section.id][inter.id] = null;
			}
		}
	}
	loadSettings(panel.id)
		.then((s) => {
			if (s) {
				if (!haveSameKeys(sections, s)) {
					dispatch('settingsChanged', sections);
					return;
				}
				sections = s;
			}
			settingsLoaded = true;
		})
		.catch(async (err) => {
			settingsLoaded = true;
			console.error(err);
		});

	$: {
		if (settingsLoaded) {
			dispatch('settingsChanged', sections);
		}
	}
</script>

{#if settingsLoaded}
	<div class="font-mono grid grid-cols-1 h-full text-start m-5">
		<div class="bg-[#d7d7d7] dark:bg-gray-900 grayscale p-4 rounded-md">
			<p class="text-3xl font-bold text-black dark:text-white">{panel.name}</p>
			<p class="text-[13px] text-neutral-700 dark:text-neutral-300">{@html panel.description}</p>
		</div>
		{#each panel.sections || [] as section (section.id)}
			<div class="mt-5">
				<p class="text-xl font-bold text-red-600 dark:text-red-400">{section.name}</p>
				<p class="text-[13px] text-black dark:text-neutral-50">{section.description}</p>
				{#each section.interactables || [] as inter}
					{#if inter.options.type !== 'button' && inter.options.type !== 'ff_buttons_custom'}
						<Separator class="my-3 bg-gray-300 opacity-25" el={undefined} decorative={true} />
					{/if}
					<div class={`flex items-center ${inter.toggle ? (sections[section.id][inter.toggle] ? '' : 'grayscale cursor-not-allowed opacity-60 select-one pointer-events-none') : ''}`}>
						{#if inter.options.type !== 'button' && inter.options.type !== 'ff_buttons_custom' && !inter.hideTitle}
							<div class={inter.options.type === 'number' ? 'w-[500px]' : ''}>
								<p class="font-semibold text-[#1f1717] dark:text-red-100">{inter.label}</p>
								<p class="text-[13px] text-neutral-700 dark:text-neutral-200">{@html inter.description}</p>
							</div>
						{/if}
						{#if inter.options.type == 'button'}
							<div class="pt-2">
								<Tooltip.Root>
									<Tooltip.Trigger>
										<Button
											variant={inter.options.style || 'default'}
											on:click={() => {
												dispatch('buttonClicked', inter.id);
											}}
										>
											{#if inter.options.icon?.component}
												<svelte:component this={inter.options.icon.component} class={cn(inter.options.icon.props, 'h-5 w-5 mr-2')} />
											{:else if inter.options.icon?.src}
												<img src={inter.options.icon?.src} alt="Panel Icon" class={cn(inter.options.icon.props, 'h-5 w-5 mr-2')} />
											{/if}
											{inter.label}</Button
										>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>{inter.description}</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</div>
						{:else if inter.options.type == 'ff_buttons_custom'}
							<FfButtonsCustom />
						{:else if inter.options.type == 'mods_ui'}
							<ModsUi />
						{:else if inter.options.type === 'boolean'}
							<Switch
								class="ml-auto mr-4"
								bind:checked={sections[section.id][inter.id]}
								on:click={() => {
									dispatch('switchClicked', { id: inter.id, state: !sections[section.id][inter.id] });
								}}
							/>
						{:else if inter.options.type === 'string'}
							<Input
								class="dark:bg-neutral-900 bg-neutral-300 text-center border-none w-[250px] ml-auto mr-4 font-sans"
								bind:value={sections[section.id][inter.id]}
								placeholder={inter.options.default}
							/>
						{:else if inter.options.type === 'file'}
							<Button
								class="ml-auto mr-4 bg-background border w-64 text-foreground data-[hasfile=true]:bg-red-500 data-[hasfile=true]:border-neutral-800 data-[hasfile=true]:border-2"
								variant="ghost"
								data-hasfile={sections[section.id][inter.id] ? true : false}
								on:click={async () => {
									try {
										// Remove file
										if (inter.options.type !== 'file') return;
										if (sections[section.id][inter.id]) {
											dispatch('fileRemoved', { id: inter.id, filePath: sections[section.id][inter.id] });
											sections[section.id][inter.id] = null;
											return;
										}

										// Chose file
										// let options = { multiSelections: false, filters: [{ name: 'Font files', extensions: inter.options.accept }] };
										// if (inter.options.default) {
										// 	// @ts-expect-error
										// 	options.defaultPath = inter.options.default;
										// }

										// TODO: test if works
										const entries = await Dialogs.OpenFile({
											Message: 'Choose your font file',
											AllowsMultipleSelection: false,
											Filters: [
												{
													DisplayName: 'Font files',
													Pattern: inter.options.accept.join(';'),
												},
											],
										});
										// const entries = await os.showOpenDialog('Choose your font file', options);
										if (entries.length < 1) return;
										dispatch('fileAdded', { id: inter.id, filePath: entries[0] });
										sections[section.id][inter.id] = entries[0];
									} catch (err) {
										toast.error('An error occured');
										console.error(err);
									}
								}}
							>
								{#if sections[section.id][inter.id]}
									<Trash2 class="w-5 h-5 mr-2" />
									<p class="inline-block align-middle overflow-hidden whitespace-nowrap overflow-ellipsis [direction:rtl] w-full">{path.basename(sections[section.id][inter.id])}</p>
								{:else}
									<Upload class="w-5 h-5 mr-2" />
									Choose file
								{/if}
							</Button>
						{:else if inter.options.type === 'dropdown'}
							<Select.Root items={inter.options.list} bind:selected={sections[section.id][inter.id]}>
								<Select.Trigger class="w-[180px] dark:bg-neutral-900 bg-neutral-300 ml-auto mr-4 border-none">
									<Select.Value class="text-black dark:text-white" placeholder={inter.options.default.label} />
								</Select.Trigger>
								<Select.Content class="dark:bg-gray-900 bg-neutral-200 grayscale border-none dark:text-white text-black">
									<Select.Group>
										{#each inter.options.list || [] as item}
											<Select.Item value={item} label={item.label}>{item.label}</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
								<Select.Input name="favoriteFruit" />
							</Select.Root>
						{:else if inter.options.type === 'number'}
							<div class="flex flex-grow justify-end">
								<Slider step={inter.options.step} max={inter.options.max} min={inter.options.min} bind:value={sections[section.id][inter.id]} class="max-w-[50%]" />
								<Input
									class="max-w-[20%] text-center dark:bg-gray-900 bg-neutral-300 border-none grayscale ml-5 mr-4"
									bind:value={sections[section.id][inter.id][0]}
									placeholder={inter.options.default.toString()}
								/>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
{:else}
	<div class="flex h-[100vh] w-full opacity-30 grayscale items-center justify-center">
		<LoadingSpinner />
	</div>
{/if}
