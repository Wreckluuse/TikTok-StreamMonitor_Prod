const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.fb0f6931.js","app":"_app/immutable/entry/app.b483eb4c.js","imports":["_app/immutable/entry/start.fb0f6931.js","_app/immutable/chunks/index.8da47950.js","_app/immutable/chunks/singletons.8742d60f.js","_app/immutable/chunks/index.35bb0f36.js","_app/immutable/entry/app.b483eb4c.js","_app/immutable/chunks/index.8da47950.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./chunks/0-5b6839f0.js'),
			() => import('./chunks/1-86a5ee2a.js'),
			() => import('./chunks/2-0d1ade1c.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};

const prerendered = new Set([]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
