# aluxian.com

This is v4 built on Cloudflare Workers with a special API for publishing blog posts from Bear via Siri Shortcuts.

## Development

### Env vars (DEV)

```sh
AUTH_SECRET=test123
```

### Env vars (PROD)

```sh
echo 'value' | npx wrangler --experimental-json-config secret put KEY
```
