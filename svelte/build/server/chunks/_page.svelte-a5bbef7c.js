import { c as create_ssr_component, v as validate_component } from './index2-2332c716.js';
import ioClient from 'socket.io-client';
import { d as derived, w as writable } from './index-68383f89.js';

const PORT = process.env.PORT || 3e3;
const ENDPOINT = "http://localhost:" + PORT;
const socket = ioClient(ENDPOINT);
const io = socket;
const ContentGrid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="h-full ml-1 mr-1 w-full grid grid-cols-12 grid-rows-4 gap-2 mt-2">${slots.default ? slots.default({}) : ``}</div>`;
});
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="btm-nav h-1/8 w-full grid grid-cols-5 gap-1 mx-auto bg-neutral shadow">${slots.default ? slots.default({}) : ``}</div>`;
});
const modColor = writable("#ff00bb");
const subColor = writable("#9aff67");
const defaultColor = writable("#d3d3d3");
const keyPressed = writable({
  ArrowLeft: 0,
  ArrowUp: 0,
  ArrowRight: 0,
  ArrowDown: 0
});
derived(keyPressed, ($keyPressed) => {
  return {
    ...$keyPressed,
    ArrowV: $keyPressed.ArrowUp + $keyPressed.ArrowDown,
    ArrowH: $keyPressed.ArrowLeft + $keyPressed.ArrowRight,
    ArrowVH: $keyPressed.ArrowUp + $keyPressed.ArrowDown + $keyPressed.ArrowLeft + $keyPressed.ArrowRight
  };
});
const giftInfo = writable(true);
const subInfo = writable(true);
const followInfo = writable(true);
const shareInfo = writable(true);
const username = writable("");
const displayName = writable("");
const followingCount = writable("");
const bio = writable("");
const followCount = writable(0);
const viewCount = writable(0);
const loggedIn = writable(false);
const css = {
  code: "body.svelte-191d5yw{position:fixed;margin:0;top:0;left:0;height:100vh;width:100vw}.openChat.svelte-191d5yw{height:50px;width:50px;z-index:2}.login.svelte-191d5yw{height:50px;width:50px;z-index:2}.timerButton.svelte-191d5yw{height:50px;width:50px;z-index:2}.events.svelte-191d5yw{height:50px;width:50px;z-index:2}.settingsButton.svelte-191d5yw{height:50px;width:50px;z-index:2}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let chatMessages = [];
  let chatElement;
  let evtMessages = [];
  let evtElement;
  let streamer_data = {};
  io.on("connected", (data) => {
    if (data) {
      const payload = JSON.parse(data);
      const streamerInfo = payload.roomInfo.owner;
      streamer_data = streamerInfo;
      loggedIn.update((prop) => true);
      displayName.update((prop) => streamer_data.nickname);
      username.update((prop) => streamer_data.display_id);
      followCount.update((prop) => streamer_data.follow_info.follower_count);
      followingCount.update((prop) => streamer_data.follow_info.following_count);
      bio.update((prop) => streamer_data.bio_description);
    }
  });
  io.on("connectionUnsuccessful", () => {
    loggedIn.update((prop) => false);
  });
  io.on("updateInfo", (data) => {
    const payload = JSON.parse(data);
    viewCount.update((n) => payload.viewers);
    loggedIn.update((p) => true);
    if (uname == "") {
      username.update((u) => payload.streamer.user_name);
      displayName.update((d) => payload.streamer.display_name);
      followCount.update((f) => payload.streamer.followers);
      followingCount.update((f) => payload.streamer.following);
    }
  });
  io.on("chatMessage", (data) => {
    const payload = JSON.parse(data);
    chatMessages = [...chatMessages, payload];
  });
  io.on("evtMessage", (data) => {
    const payload = JSON.parse(data);
    evtMessages = [...evtMessages, payload];
  });
  io.on("dcSuccess", () => {
    loggedIn.update((prop) => false);
    chatMessages = [];
    evtMessages = [];
  });
  io.on("initialState", (data) => {
    JSON.parse(data);
  });
  let uname = "";
  username.subscribe((value) => {
    uname = value;
  });
  displayName.subscribe((value) => {
  });
  viewCount.subscribe((value) => {
  });
  followCount.subscribe((value) => {
  });
  followingCount.subscribe((value) => {
  });
  bio.subscribe((value) => {
  });
  loggedIn.subscribe((value) => {
  });
  giftInfo.subscribe((value) => {
  });
  subInfo.subscribe((value) => {
  });
  followInfo.subscribe((value) => {
  });
  shareInfo.subscribe((value) => {
  });
  defaultColor.subscribe((value) => {
  });
  modColor.subscribe((value) => {
  });
  subColor.subscribe((value) => {
  });
  const scrollToBottom = async (node) => {
    node.scroll({
      top: node.scrollHeight,
      behavior: "smooth"
    });
  };
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      if (chatMessages.length > 0 && chatElement) {
        scrollToBottom(chatElement);
      }
    }
    {
      if (evtMessages.length > 0 && evtElement) {
        scrollToBottom(evtElement);
      }
    }
    $$rendered = `<head><script src="https://kit.fontawesome.com/cda086cfbf.js" crossorigin="anonymous"><\/script></head>

${$$result.head += `<!-- HEAD_svelte-1sj6g74_START -->${$$result.title = `<title>Live Monitor</title>`, ""}<!-- HEAD_svelte-1sj6g74_END -->`, ""}

<body class="bg-base-100 svelte-191d5yw">${``}
	${validate_component(Nav, "Nav").$$render($$result, {}, {}, {
      default: () => {
        return `
		<button class="bg-neutral pt-2 pb=2 hover:shadow-inner-2xl hover:active w-full h-full"><i class="fa-solid text-zinc-100 fa-tower-broadcast login hover:text-accent hover:drop-shadow-xl transition transform hover:-translate-y-1 svelte-191d5yw"></i></button>
		
		<button class="bg-neutral pt-2 pb=2 hover:shadow-inner-2xl hover:active w-full h-full"><i class="openChat text-primary fa-solid fa-message hover:text-accent hover:drop-shadow-xl transition transform hover:-translate-y-1 svelte-191d5yw"></i></button>
		
		<button class="bg-neutral pt-2 pb=2 hover:shadow-inner-2xl hover:active w-full h-full"><i class="fa-regular text-secondary fa-bell events hover:text-accent hover:drop-shadow-xl transition transform hover:-translate-y-1 svelte-191d5yw"></i></button>
		<button class="bg-neutral pt-2 pb=2 hover:shadow-inner-2xl w-full h-full hover:active"><i class="fa-solid text-yellow-400 fa-stopwatch timerButton hover:text-accent hover:drop-shadow-xl transition transform hover:-translate-y-1 svelte-191d5yw"></i></button>
		
		<button class="bg-neutral pt-2 pb=2 hover:shadow-inner-2xl hover:active w-full h-full"><i class="fa-regular text-gray-300 fa-solid fa-gear settingsButton hover:text-accent hover:drop-shadow-xl transition transform hover:-translate-y-1 svelte-191d5yw"></i></button>`;
      }
    })}
	${``}
	<div class="h-[90%] w-7/8 ml-4 mr-4">${validate_component(ContentGrid, "ContentGrid").$$render($$result, {}, {}, {
      default: () => {
        return `${``}
			${``}`;
      }
    })}</div>
</body>`;
  } while (!$$settled);
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-a5bbef7c.js.map
