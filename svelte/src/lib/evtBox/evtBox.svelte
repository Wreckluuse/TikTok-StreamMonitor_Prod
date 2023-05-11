<script>
	import { giftInfo, subInfo, followInfo, shareInfo } from '../eventStores';
	import { evtposX, evtposY, evtHeight, evtWidth } from '../gridStores';
	import { fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';

	let settingsOpen = false;
	let localFilters = {
		gifts: false,
		subs: false,
		follows: false,
		shares: false
	};
	let layout = {
		x: 0,
		y: 0,
		h: 0,
		w: 0
	};

	giftInfo.subscribe((value) => {
		localFilters.gifts = value;
	});
	subInfo.subscribe((value) => {
		localFilters.subs = value;
	});
	followInfo.subscribe((value) => {
		localFilters.follows = value;
	});
	shareInfo.subscribe((value) => {
		localFilters.shares = value;
	});
	evtposX.subscribe((value) => {
		layout.x = value;
	});

	evtposY.subscribe((value) => {
		layout.y = value;
	});

	evtHeight.subscribe((value) => {
		layout.h = value;
	});

	evtWidth.subscribe((value) => {
		layout.w = value;
	});

	function toggleSettings() {
		settingsOpen = !settingsOpen;
	}

	function updateFilters() {
		giftInfo.update((visible) => (visible = localFilters.gifts));
		subInfo.update((visible) => (visible = localFilters.subs));
		followInfo.update((visible) => (visible = localFilters.follows));
		shareInfo.update((visible) => (visible = localFilters.shares));
	}
</script>

<div
	transition:fly={{y: 25, duration: 300, easing: quintInOut}}
	style:grid-column-start={layout.x}
	style:grid-column-end={layout.w}
	style:grid-row-start={layout.y}
	style:grid-row-end={layout.h}
	class="bg-neutral shadow scroll-auto rounded-md h-full w-full"
>
	{#if settingsOpen}
		<!-- svelte-ignore missing-declaration -->
		<div
			class="inline grid grid-cols-5 grid-gap-1 z-10 w-full h-[4%] bg-neutral shadow text-sm rounded-t-md"

			transition:fly={{opacity: 1, duration: 10, y: -10 }}

		>
			<div class="text-accent-content w-full mt-1">
				<input
					class="toggle toggle-sm toggle-primary"
					type="checkbox"
					bind:checked={localFilters.gifts}
				/> Gifts
			</div>
			<div class="text-accent-content w-full mt-1">
				<input
					class="toggle toggle-sm toggle-primary"
					type="checkbox"
					bind:checked={localFilters.subs}
				/> Subs
			</div>
			<div class="text-accent-content w-full mt-1">
				<input
					class="toggle toggle-sm toggle-primary"
					type="checkbox"
					bind:checked={localFilters.follows}
				/> Follows
			</div>
			<div class="text-accent-content w-full mt-1">
				<input
					class="toggle toggle-sm text-sm toggle-primary"
					type="checkbox"
					bind:checked={localFilters.shares}
				/> Shares
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div on:click={updateFilters} class="btn btn-primary border-zinc-100 btn-xs mt-1 mr-1">Update Filters</div>
		</div>
	{/if}
	<div class="inline h-[4%] flex flex-cols w-full rounded-t-md bg-neutral">
		<div
			class="  bg-accent pr-5 place-items-left text-2xl text-zinc-100 w-full z-5 shadow rounded-tl-md"
		>
			Events
		</div>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="inline w-fit rounded-tr-md float-right bg-accent" on:click={toggleSettings}>
			<i
				class=" text-xl z-6 mr-2 mt-1 fa-solid fa-filter text-zinc-100 hover:text-gray-500 hover:drop-shadow-xl transition transform hover:-translate-y-1"
			/>
		</div>
	</div>

	<slot class="shadow-inner scroll-auto overflow-y-scroll overflow-x-hidden text-secondary-content" />
</div>
