<script>
	import { quintInOut } from 'svelte/easing';
	import { modColor, subColor, defaultColor } from '../chatStores';
	import { chatposX, chatposY, chatHeight, chatWidth } from '../gridStores';
	import { fly } from 'svelte/transition';
	import ColorPicker from 'svelte-awesome-color-picker';
	let settingsOpen = false;
	let layout = {
		x: 1,
		y: 1,
		h: 2,
		w: 11
	};

	let modHex = "#f00bb";
	let subHex = "#9aff67";
	let defaultHex = "#d3d3d3";

	chatposX.subscribe((value) => {
		layout.x = value;
	});

	chatposY.subscribe((value) => {
		layout.y = value;
	});

	chatHeight.subscribe((value) => {
		layout.h = value;
	});

	chatWidth.subscribe((value) => {
		layout.w = value;
	});

	modColor.subscribe((value) => {
		modHex = value;
	});

	subColor.subscribe((value) => {
		subHex = value;
	});

	defaultColor.subscribe((value) => {
		defaultHex = value;
	});

	function toggleSettings() {
		settingsOpen = !settingsOpen;
	}

	function updateColors() {
		modColor.update((color) => (color = modHex));
		subColor.update((color) => (color = subHex));
		defaultColor.update((color) => (color = defaultHex));
	}
</script>

<div transition:fly={{y: 25, duration: 300, easing: quintInOut}}
	style:grid-column-start={layout.x}
	style:grid-column-end={layout.w}
	style:grid-row-start={layout.y}
	style:grid-row-end={layout.h}
	class="bg-neutral overflow-x-hidden scrollbar-thin scrollbar-rounded-lg scrollbar-thumb-primary scrollbar-track-secondary  rounded-md h-full w-full shadow"
>
	{#if settingsOpen}
		<div
			class="inline grid grid-cols-4 grid-gap-1 z-10 w-full h-[4%] rounded-t-md bg-neutral shadow text-sm"
			transition:fly={{ opacity: 1, duration: 10, y: -10 }}
		>
			<div class="w-full"><div class="w-fit rounded-md text-neutral bg-zinc-100 mt-2 ring ring-1 ring-primary"><ColorPicker isDark={true} label={"Moderator"} bind:hex={modHex} /></div></div>
			<div class="w-full"><div class="w-fit rounded-md text-neutral bg-zinc-100 mt-2 ring ring-1 ring-primary"><ColorPicker isDark={true} label={"Subscriber"} bind:hex={subHex}/></div></div>
			<div class="w-full"><div class="w-fit rounded-md text-neutral bg-zinc-100 mt-2 ring ring-1 ring-primary"><ColorPicker isDark={true} label={"Default"} bind:hex={defaultHex} /></div></div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div on:click={updateColors} class="btn btn-primary border-zinc-100 btn-xs mt-1 mr-1">Update Colors</div>

		</div>
	{/if}
	<div class="bg-neutral inline h-[4%] flex flex-cols w-full ">
		<div
			class="inline bg-accent ml-1 pr-5 place-items-left text-2xl rounded-tl-md text-zinc-100 w-full z-5 shadow"
		>
			 Chat
		</div>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="inline w-fit rounded-tr-md float-right bg-accent" on:click={toggleSettings}>
			<i
				class=" text-xl z-6 mr-2 mt-1 fa-solid fa-palette text-zinc-100 hover:text-gray-500 hover:drop-shadow-xl transition transform hover:-translate-y-1"
			/>
		</div>
	</div>
	<slot class="shadow-inner scroll-auto overflow-y-scroll overflow-x-hidden text-base-content" />
</div>
<style>

</style>
