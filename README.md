# Fun Responses API

Small Express API for random fun text and character images.

## Environment Variables

- `API_BASE_URL`: Public base URL for this API (used in discovery responses)
- `CDN_BASE_URL`: Remote CDN base URL where JSON assets are hosted
- `PORT`: Server port, defaults to 3000
- `UPSTREAM_TIMEOUT_MS`: Axios timeout for upstream requests in milliseconds, defaults to 5000

## Local Development

```bash
bun install
bun run dev
```

## Build and Run

```bash
bun run build
bun run start
```
