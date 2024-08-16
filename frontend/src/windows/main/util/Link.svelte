<script>
	import { Browser } from '@wailsio/runtime';

	export let href = '';
	export let title = undefined;
</script>

<a
	href="_blank"
	on:click={(e) => {
		e.preventDefault();
		Browser.OpenURL(href);
	}}
	{title}><slot></slot></a
>
