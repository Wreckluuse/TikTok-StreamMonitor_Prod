<script>
	import { modColor, subColor, defaultColor } from '../chatStores';
	export let chat_pfpUrl;
	export let chat_nickname;
	export let chat_roles;
	export let chat_messageContent;
	export let chat_timeStamp;
	// export let chat_badges;

	let mColor;
	let sColor;
	let dColor;

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
</script>

<tr class="h-[2%] text-base-content">
	<!-- <div class="grid grid-cols-auto float-left">
			{#each chat_badges as badge}
				<div>
					svelte-ignore a11y-missing-attribute
					<img height="20" width="20" class="rounded-xl inline" src={badge} />
				</div>
			{/each}
		</div>
     -->
	<td class="w-fit h-full">
		<img
			height="20"
			width="20"
			class="rounded-md inline float-left"
			src={chat_pfpUrl}
			alt={chat_nickname + "'s Profile Picture"}
		/>
        <div class="float-left ml-[2%] text-md w-fit inline" style:color={getViewerColor(chat_roles)}>
            {' ' + chat_nickname + ": "}
        </div>
        <div class="ml-[2%] h-full break-words inline text-justify text-neutral-content text-sm whitespace-normal">
            {chat_messageContent}
        </div>
	<!-- </td>
	<td class="text-md w-fit" style:color={getViewerColor(chat_roles)}>
		{' ' + chat_nickname + ': '}
	</td> -->
	<!-- <td class="break-words float-left text-left text-sm text-gray-700 whitespace-normal ">
		{chat_messageContent}
	</td> -->
	<td class="text-primary-content text-right w-[50%]">
		{chat_timeStamp}
	</td>
</tr>
