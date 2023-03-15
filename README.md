# aluxian.com

This is v4 built on Cloudflare Workers with a special API for publishing blog posts from Bear via Siri Shortcuts.

## Development

```sh
npm run dev
```

### Env vars (DEV)

See `.dev.vars`.

### Env vars (PROD)

```sh
echo 'value' | npx wrangler --experimental-json-config secret put KEY
```

### Deploy worker

```sh
npm run publish
```

### Testing

```sh
npm run test # ava
npm run lint # eslint
```

### Formatting

```sh
npm run format # prettier
```
