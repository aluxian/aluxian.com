// declare module Hey {
//   export const match: (url: URL) => boolean;
//   export const fetch: ExportedHandlerFetchHandler<AluxianCfEnvBear>;
// }

interface AvaCtx {
  miniflare: import("miniflare").Miniflare;
  bundle: import("esbuild").BuildResult;
}
