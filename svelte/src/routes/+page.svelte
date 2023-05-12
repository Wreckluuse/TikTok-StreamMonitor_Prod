<script>
	//Initializing websocket client
	import { io } from '$lib/webSocketConnection.js';
	import { onMount, afterUpdate, tick } from 'svelte';
	import ContentGrid from '../lib/contentGrid/contentGrid.svelte';
	import Nav from '../lib/nav/nav.svelte';
	import ChatBox from '../lib/chatBox/chatBox.svelte';
	import { modColor, subColor, defaultColor } from '../lib/chatStores';
	import { evtOpen, giftInfo, subInfo, followInfo, shareInfo } from '../lib/eventStores';
	import {
		username,
		displayName,
		bio,
		followCount,
		followingCount,
		viewCount,
		loggedIn
	} from '../lib/userStores';
	import EvtBox from '../lib/evtBox/evtBox.svelte';
	import ChatMessage from '../lib/chatMessage/chatMessage.svelte';
	import SettingsBox from '../lib/settingsBox/settingsBox.svelte';
	import { slide } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';

	let chatMessages = [];
	let chatElement;
	let evtMessages = [];
	let evtElement;

	let streamer_data = {};

	io.on('connected', (data) => {
		if (data) {
			const payload = JSON.parse(data);
			const streamerInfo = payload.roomInfo.owner;

			streamer_data = streamerInfo;

			loggedIn.update((prop) => (prop = true));
			displayName.update((prop) => (prop = streamer_data.nickname));
			username.update((prop) => (prop = streamer_data.display_id));
			followCount.update((prop) => (prop = streamer_data.follow_info.follower_count));
			followingCount.update((prop) => (prop = streamer_data.follow_info.following_count));
			bio.update((prop) => (prop = streamer_data.bio_description));
		}
	});

	io.on('connectionUnsuccessful', () => {
		loggedIn.update((prop) => (prop = false));
	});

	io.on('updateInfo', (data) => {
		const payload = JSON.parse(data);
		viewCount.update((n) => (n = payload.viewers));
		loggedIn.update((p) => (p = true));
		if (uname == '') {
			username.update((u) => (u = payload.streamer.user_name));
			displayName.update((d) => (d = payload.streamer.display_name));
			followCount.update((f) => (f = payload.streamer.followers));
			followingCount.update((f) => (f = payload.streamer.following));
		}
	});

	io.on('chatMessage', (data) => {
		const payload = JSON.parse(data);
		chatMessages = [...chatMessages, payload];
	});

	io.on('evtMessage', (data) => {
		const payload = JSON.parse(data);
		evtMessages = [...evtMessages, payload];
	});

	io.on('dcSuccess', () => {
		loggedIn.update((prop) => (prop = false));
		chatMessages = [];
		evtMessages = [];
	});

	io.on('initialState', (data) => {
		let payload = JSON.parse(data);
	});
	//functions for handling username and tiktok connection

	function tryLogin(name) {
		if (name == null || name == '') {
			alert('Oops! Something went wrong, please try again.');
		} else {
			username.update((prop) => (prop = name));
			io.emit('tryConnection', name);
		}
	}

	//Main Content

	let loggedInState;
	let cboxOpen = false;
	let eboxOpen = false;
	let settingsboxOpen = false;
	let mColor;
	let sColor;
	let dColor;
	let displayGifts;
	let displaySubs;
	let displayFollows;
	let displayShares;
	let showModal = false;
	let modalNickname = '';
	let modalPfp = '';
	let modalFollowCount = 0;
	let modalColor = '#9ca3af;';
	let modalBio = '';
	let modal_createDate = '0';
	let streamerTabOpen = false;
	let uname = '';
	let dispName = '';
	let viewers;
	let followers;
	let following;
	let streamerBio;
	let streamerPFP;
	let modalOpen = false;
	let tabState = {
		chat: true,
		event: false,
		timer: false,
	}
	let chatPos;
	let evtPos;
	let timerPos;

	username.subscribe((value) => {
		uname = value;
	});

	displayName.subscribe((value) => {
		dispName = value;
	});

	viewCount.subscribe((value) => {
		viewers = value;
	});

	followCount.subscribe((value) => {
		followers = value;
	});

	followingCount.subscribe((value) => {
		following = value;
	});

	bio.subscribe((value) => {
		streamerBio = value;
	});

	loggedIn.subscribe((value) => {
		loggedInState = value;
	});

	giftInfo.subscribe((value) => {
		displayGifts = value;
	});

	subInfo.subscribe((value) => {
		displaySubs = value;
	});

	followInfo.subscribe((value) => {
		displayFollows = value;
	});

	shareInfo.subscribe((value) => {
		displayShares = value;
	});

	defaultColor.subscribe((value) => {
		dColor = value;
	});

	modColor.subscribe((value) => {
		mColor = value;
	});

	subColor.subscribe((value) => {
		sColor = value;
	});

	function getViewerColor(roles) {
		let outColor;
		let outRole;

		for (let i = 0; i < roles.length; i++) {
			if (roles[i].value == true) {
				outRole = roles[i].role;
				break;
			}
		}

		switch (outRole) {
			case 'mod':
				outColor = mColor;
				break;
			case 'sub':
				outColor = sColor;
				break;
			case 'follower':
				outColor = dColor;
				break;
			default:
				outColor = dColor;
		}

		return outColor;
	}

	function openChat() {
		cboxOpen = !cboxOpen;
	}

	function openEvt() {
		eboxOpen = !eboxOpen;
	}

	function openCfg() {
		settingsboxOpen = !settingsboxOpen;
	}

	//function openModal(name, pfp, fCount, color, bio, createDate) {
	//	showModal = true;
	//	modalNickname = name;
	//	modalPfp = pfp;
	//	modalFollowCount = fCount;
	//	modalColor = color;
	//	modalBio = bio;
	//	modal_createDate = createDate;
	//}
	function openModal() {
		modalOpen = true;
	}

	function openStreamerTab() {
		streamerTabOpen = !streamerTabOpen;
	}

	function swapTabs(tabName) {
		switch(tabName) {
			case 'chat':
				tabState.chat = !tabState.chat;
				tabState.event = !tabState.chat;
				break;
			case 'event':
				tabState.event = !tabState.event;
				tabState.chat = !tabState.event;
				break;
		}
	}
	afterUpdate(() => {
		if (cboxOpen && chatMessages.length > 0) scrollToBottom(chatElement);
		if (eboxOpen && evtMessages.length > 0) scrollToBottom(evtElement);
	});

	const scrollToBottom = async (node) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};

	function isHighlighted(msgBool) {
		if (msgBool) return 'background-sky-500 rounded-sm text-zinc-600';
		else return '';
	}

	$: if (chatMessages.length > 0 && chatElement) {
		scrollToBottom(chatElement);
	}
	$: if (evtMessages.length > 0 && evtElement) {
		scrollToBottom(evtElement);
	}

	function disconnect() {
		io.emit('beginDC');
	}
	let chatLayout = {
		x: 1,
		y: 1,
		h: 2,
		w: 11
	};
	let evtLayout = {
		x: 7,
		y: 1,
		h: 5,
		w: 13
	}

	let settingsPositions = ['chat', 'evt'];
</script>

<head>
	<script src="https://kit.fontawesome.com/cda086cfbf.js" crossorigin="anonymous"></script>
</head>

<svelte:head>
	<title>Live Monitor</title>
</svelte:head>

<body class="bg-base-100">
	{#if streamerTabOpen}
		{#if loggedInState}
			<div
				transition:slide={{ x: -100, y: 0, opacity: 1, duration: 300, easing: quintInOut }}
				class="stats shadow bg-neutral fixed bottom-[90px] left-[20px] rounded-lg"
			>
				<div class="stat">
					<div class="stat-title text-neutral-content">
						<i class="fa-brands fa-tiktok" /> Connected
					</div>
					<div class="" />
					<div class="stat-value text-primary">{dispName}</div>
					<div class="stat-description">{'@' + uname}</div>
				</div>
				<div class="stat">
					<div class="stat-title text-neutral-content">
						<i class="fa-solid fa-user" /> Watching Now
					</div>
					<div class="stat-value text-accent">
						{viewers}
					</div>
				</div>
				<div class="stat">
					<div class="stat-title text-neutral-content">
						<i class="fa-solid fa-users-rectangle" /> Followers
					</div>
					<div class="stat-value text-secondary">{followers}</div>
					<!-- svelte-ignore a11y-missing-content -->
					<div
						class="stat-description rounded-md transition transfor hover:-translate-y-1 w-[80%] text-center mt-1 border border-2 border-secondary"
					>
						<a href={'https://www.tiktok.com/@' + uname + '/live'} target="_blank">Follow</a>
					</div>
				</div>
			</div>
		{:else}
			<div
				transition:slide={{ x: -100, y: 0, opacity: 1, duration: 300, easing: quintInOut }}
				class="w-[300px] h-[150px] bg-neutral shadow fixed text-center text-neutral-content bottom-[90px] left-[20px] rounded-lg"
			>
				<div
					class="ring-zinc-100 bg-base-100 rounded-sm ring-1 w-[70%] text-zinc-100 ml-auto mr-auto shadow"
				>
					Disconnected
				</div>
				<div
					class="rounded-xl w-[80%] ml-auto mr-auto text-sm text-neutral-content mt-10 bg-secondary shadow"
				>
					<input class="float-left" bind:value={uname} type="text" placeholder="Username" />
					<button
						class="w-fit h-fit px-[3px] rounded-md hover:drop-shadow-xl text-zinc-100 transition transform hover:-translate-y-1"
						on:click={tryLogin(uname)}>Connect</button
					>
				</div>
			</div>
		{/if}
	{/if}
	<Nav>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<button
			class="bg-neutral pt-2 pb=2 hover:shadow-inner-2xl hover:active w-full h-full"
			on:click={openStreamerTab}
		>
			<i
				class="fa-solid text-zinc-100 fa-tower-broadcast login hover:text-accent hover:drop-shadow-xl transition transform hover:-translate-y-1"
			/>
		</button>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<button
			class="bg-neutral pt-2 pb=2 hover:shadow-inner-2xl hover:active w-full h-full"
			on:click={openChat}
		>
			<i
				class="openChat text-primary fa-solid fa-message hover:text-accent hover:drop-shadow-xl transition transform hover:-translate-y-1"
			/>
		</button>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<button
			class="bg-neutral pt-2 pb=2 hover:shadow-inner-2xl hover:active w-full h-full"
			on:click={openEvt}
		>
			<i
				class="fa-regular text-secondary fa-bell events hover:text-accent hover:drop-shadow-xl transition transform hover:-translate-y-1"
			/>
		</button>
		<button class="bg-neutral pt-2 pb=2 hover:shadow-inner-2xl w-full h-full hover:active">
			<i
				class="fa-solid text-yellow-400 fa-stopwatch timerButton hover:text-accent hover:drop-shadow-xl transition transform hover:-translate-y-1"
			/>
		</button>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<button
			class="bg-neutral pt-2 pb=2 hover:shadow-inner-2xl hover:active w-full h-full"
		>
			<i
				class="fa-regular text-gray-300 fa-solid fa-gear settingsButton hover:text-accent hover:drop-shadow-xl transition transform hover:-translate-y-1"
			/>
		</button>
	</Nav>
	{#if settingsboxOpen}
	 <SettingsBox chatLayout={chatLayout} evtLayout={evtLayout} settingsPositions={settingsPositions}/>
		<!-- <div -->
			<!-- class="grid grid-rows-2 grid-cols-2 pt-2 right-[20px] bottom-[90px] h-[200px] fixed backdrop-blur-sm bg-neutral shadow-2xl rounded-md w-[20%] ring-sky-100 px-5 text-gray-700" -->
		<!-- > -->
			<!-- <ul class="row-start-1 row-end-3 col-start-1 col-end-1 menu divide-y bg-neutral text-neutral-content h-full w-[10%]"> -->
				<!-- svelte-ignore a11y-missing-attribute -->
				<!-- <li onclick={swapTabs('chat')} class=" border-neutral-content rounded-md"><a>Chat</a></li> -->
				<!-- svelte-ignore a11y-missing-attribute -->
				<!-- <li onclick={swapTabs('event')} class=" border-neutral-content rounded-md "><a>Events</a></li> -->
				<!-- svelte-ignore a11y-missing-attribute -->
				<!-- <li onclick={swapTabs('timer')} class=" border-neutral-content rounded-md "><a>Timer</a></li> -->
			<!-- </ul> -->
			<!-- {#if tabState.chat} -->
			<!-- <p class="row-start-1 row-end-1 w-full text-center">Chat</p> -->
			<!-- <div class="row-start-2 row-end-3  grid grid-cols-4 gap-2 rounded-lg px-5 shadow shadow-inner mt-2 w-[80%] h-[80%] float-right ml-[20%] bg-neutral text-neutral-content"> -->
				<!-- <label class="mt-1 " for="chatW">Width: </label> -->
				<!-- <input bind:value={chatLayout.w} class="mt-1 text-center rounded-xl h-fit" name="chatW" type="number" min="3" max="13"> -->
				<!-- <label class="mt-1 " for="chatH">Height: </label> -->
				<!-- <input bind:value={chatLayout.h} class="mt-1 text-center rounded-xl h-fit" name="chatH" type="number" min="2" max="6"> -->
				<!-- <label class="mt-1 " for="chatX">X: </label> -->
				<!-- <input bind:value={chatLayout.x} class="mt-1 text-center rounded-xl h-fit" name="chatX" type="number" min="1" max="7"> -->
				<!-- <label class="mt-1 " for="chatY">Y:</label> -->
				<!-- <input bind:value={chatLayout.y} class="mt-1 text-center rounded-xl h-fit" name="chatY" type="number" min="1" max="3"> -->
			<!-- </div> -->
			<!-- {/if} -->
			<!-- {#if tabState.event} -->
			<!-- <p class="row-start-1 row-end-1 w-full text-center">Events</p> -->
			<!-- <div class="row-start-2 row-end-3  grid grid-cols-4 gap-2 rounded-lg px-5 shadow shadow-inner mt-2 w-[80%] h-[80%] float-right ml-[20%] bg-neutral text-neutral-content"> -->
				<!-- <label class="mt-1 " for="evtW">Width: </label> -->
				<!-- <input bind:value={evtLayout.w} class="mt-1 text-center rounded-xl h-fit" name="evtW" type="number" min="3" max="13"> -->
				<!-- <label class="mt-1 " for="evtH">Height: </label> -->
				<!-- <input bind:value={evtLayout.h} class="mt-1 text-center rounded-xl h-fit" name="evtH" type="number" min="2" max="6"> -->
				<!-- <label class="mt-1 " for="evtX">X: </label> -->
				<!-- <input bind:value={evtLayout.x} class="mt-1 text-center rounded-xl h-fit" name="evtX" type="number" min="1" max="7"> -->
				<!-- <label class="mt-1 " for="evtY">Y:</label> -->
				<!-- <input bind:value={evtLayout.y} class="mt-1 text-center rounded-xl h-fit" name="evtY" type="number" min="1" max="3"> -->
			<!-- </div> -->
			<!-- {/if} -->
			<!-- {#if tabState.timer} -->
			<!-- <div></div> -->
			<!-- {/if} -->
		<!-- </div> -->
	{/if}
	<div class="h-[90%] w-7/8 ml-4 mr-4">
		<ContentGrid>
			{#if cboxOpen}
				<ChatBox bind:layout={chatLayout}>
					<div
						bind:this={chatElement}
						class="overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-rounded-lg scrollbar-thumb-gray-900 scrollbar-track-gray-100 ml-2 h-[90%] w-[98%] mt-2"
					>
						<table class="table-normal h-fit w-full">
							<!-- <ul
						class="list-outside h-[90%] w-[98%] mt-2 overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-rounded-lg scrollbar-thumb-gray-900 scrollbar-track-gray-100 ml-2"
						bind:this={chatElement}
					> -->
							{#each chatMessages as message}
								<ChatMessage
									on:click={openModal}
									chat_pfpUrl={message.profilePictureUrl}
									chat_nickname={message.nickname}
									chat_roles={message.roles}
									chat_messageContent={message.msgContent}
									chat_timeStamp={message.timeStamp}
									chat_badges={message.badges}
									chat_followers={message.followers}
									chat_following={message.following}
									chat_bio={message.bio}
								/>
							{/each}
						</table>
					</div>
					<!-- </ul> -->
				</ChatBox>
			{/if}
			{#if eboxOpen}
				<EvtBox bind:layout={evtLayout}>
					<ul
						class="divide-y divide-solid mt-2 h-[90%] w-[98%] text-base-content overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-rounded-lg scrollbar-thumb-gray-900 scrollbar-track-gray-100 ml-2"
						bind:this={evtElement}
					>
						{#each evtMessages as message, i}
							{#if message.type == 'gift' && displayGifts == true}
								<li class="grid grid-cols-7 mx-5% w-[95%] h-[7%] rounded-md">
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<div
										on:click={openModal(
											message.nickname,
											message.profilePictureUrl,
											message.followCount,
											getViewerColor(message.roles)
										)}
										style={'background-image: url(' + message.profilePictureUrl + ')'}
										class="w-[30%] h-[80%] mt-1 transition transform hover:-translate-y-[1px] shadow-2xl bg-cover bg-center col-start-1 col-end-3 rounded-lg bg-zinc-100 text-primary-content ml-2 grid grid-cols-3 grid-rows-"
									/>
									<div class="w-full col-start-3 col-end-7 text-left float-left">
										<p>
											{message.nickname + ' just gifted x' + message.giftCount}
											{message.giftType + "'s "}<img
												class="inline"
												src={message.icon}
												alt={message.giftType}
												height="25"
												width="25"
											/>
											{' (' + message.priceValue + ')'}
										</p>
									</div>
									<div class="col-start-7 col-end-7 text-right float-right mr-5">
										{message.timeStamp}
									</div>
								</li>
							{:else if message.type == 'subscribe' && displaySubs == true}
								<li class="grid grid-cols-7 mx-5% w-[95%] h-[6%] rounded-md">
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<div
										on:click={openModal(
											message.nickname,
											message.profilePictureUrl,
											message.followCount,
											message.color
										)}
										style={'background-image: url(' + message.profilePictureUrl + ')'}
										class="w-[30%] h-[80%] mt-1 transition transform hover:-translate-y-[1px] shadow-2xl bg-cover bg-center col-start-1 col-end-3 rounded-lg bg-zinc-100 text-primary-content ml-2 grid grid-cols-3 grid-rows-"
									/>
									<div class="w-full col-start-3 col-end-7 text-left float-left">
										<p>
											{message.nickname +
												' just subscribed! (x' +
												message.months +
												' month streak)'}
										</p>
									</div>
									<div class="col-start-7 col-end-7 text-right float-right mr-5">
										{message.timeStamp}
									</div>
								</li>
							{:else if message.type == 'follow' && displayFollows == true}
								<li class="grid grid-cols-7 mx-5% w-[95%] h-[6%] rounded-md">
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<div
										on:click={openModal(
											message.nickname,
											message.profilePictureUrl,
											message.followCount,
											message.color
										)}
										style={'background-image: url(' + message.profilePictureUrl + ')'}
										class="w-[30%] h-[80%] mt-1 transition transform hover:-translate-y-[1px] shadow-2xl bg-cover bg-center col-start-1 col-end-3 rounded-lg bg-zinc-100 text-primary-content ml-2 grid grid-cols-3 grid-rows-"
									/>
									<div class="w-full col-start-3 col-end-7 text-left float-left">
										<p>{message.nickname + ' just followed!'}</p>
									</div>
									<div class="col-start-7 col-end-7 text-right float-right mr-5">
										{message.timeStamp}
									</div>
								</li>
							{:else if message.type == 'share' && displayShares == true}
								<li class="grid grid-cols-7 mx-5% w-[95%] h-[6%] rounded-md">
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<div
										on:click={openModal(
											message.nickname,
											message.profilePictureUrl,
											message.followCount,
											message.color
										)}
										style={'background-image: url(' + message.profilePictureUrl + ')'}
										class="w-[30%] h-[80%] mt-1 transition transform hover:-translate-y-[1px] shadow-2xl bg-cover bg-center col-start-1 col-end-3 rounded-lg bg-zinc-100 text-primary-content ml-2 grid grid-cols-3 grid-rows-"
									/>
									<div class="w-full col-start-3 col-end-7 text-left float-left">
										<p>{message.nickname + ' just shared the stream!'}</p>
									</div>
									<div class="col-start-7 col-end-7 text-right float-right mr-5">
										{message.timeStamp}
									</div>
								</li>
							{/if}
						{/each}
					</ul>
				</EvtBox>
			{/if}
		</ContentGrid>
	</div>
</body>

<style>
	body {
		position: fixed;
		margin: 0;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		/*background: rgb(230, 252, 255);
		background: radial-gradient(
			circle,
			rgba(230, 252, 255, 1) 0%,
			rgba(46, 255, 253, 1) 5%,
			rgba(38, 38, 38, 1) 100%
		); */
	}
	.openChat {
		height: 50px;
		width: 50px;
		z-index: 2;
	}
	.login {
		height: 50px;
		width: 50px;
		z-index: 2;
	}

	.timerButton {
		height: 50px;
		width: 50px;
		z-index: 2;
	}

	.events {
		height: 50px;
		width: 50px;
		z-index: 2;
	}

	.settingsButton {
		height: 50px;
		width: 50px;
		z-index: 2;
	}
</style>
