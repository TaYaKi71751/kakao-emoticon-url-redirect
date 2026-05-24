# Kakao Emoticon URL Redirect

Next.js API server that extracts the URL for emoticon.kakao.com URL.

## Deploy to Vercel
```bash
vercel --prod
```

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, or call the API directly:

```bash
curl "http://localhost:3000/api/redirect?url=https://emoticon.kakao.com/items/vegjCQnPCyXHj6d0PnJ76txWLCk="
curl "http://localhost:3000/api/redirect?id=vegjCQnPCyXHj6d0PnJ76txWLCk="
```

Request by emoticon item:

```bash
curl "http://localhost:3000/api/redirect?id=vegjCQnPCyXHj6d0PnJ76txWLCk="
```

Request by emoticon URL:

```bash
curl "http://localhost:3000/api/redirect?url=https://emoticon.kakao.com/items/vegjCQnPCyXHj6d0PnJ76txWLCk="
```

## Plain Node.js server

This repo also includes a dependency-free Node.js server:

```bash
npm run dev:node
```

Call it directly:

```bash
curl "http://localhost:3000/api/redirect?url=https://emoticon.kakao.com/items/vegjCQnPCyXHj6d0PnJ76txWLCk="
curl "http://localhost:3000/api/redirect?id=vegjCQnPCyXHj6d0PnJ76txWLCk="
```

Example response:

```json
{
  "url": "https://e.kakao.com/t/shaky-flying-squirrel-needs-a-hug"
}
```

## Vercel

Deploy this repo to Vercel as a normal Next.js project. The Next.js route is serverless-compatible and uses Node's `https.request`:

```text
/api/redirect?url=https://emoticon.kakao.com/items/vegjCQnPCyXHj6d0PnJ76txWLCk=
/api/redirect?id=vegjCQnPCyXHj6d0PnJ76txWLCk=
```

Example deployed URL:

```text
https://kakao-emoticon-url-redirect.vercel.app/api/redirect?id=vegjCQnPCyXHj6d0PnJ76txWLCk=
```

The endpoint caches successful lookups at the Vercel edge for one day.
