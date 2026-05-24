export default function Home() {
  return (
    <main className="shell">
      <section className="panel">
        <p className="eyebrow">Next.js API</p>
        <h1>Kakao Emoticon URL Redirect</h1>
        <form className="lookup" action="/api/redirect" method="get">
          <label htmlFor="url">Emoticon URL or emoticon ID</label>
          <div className="row">
            <input
              id="url"
              name="url"
              placeholder="https://emoticon.kakao.com/items/vegjCQnPCyXHj6d0PnJ76txWLCk="
              required
            />
            <button type="submit">Get URL</button>
          </div>
        </form>
        <div className="examples">
          <code>/api/redirect?url=https://emoticon.kakao.com/items/vegjCQnPCyXHj6d0PnJ76txWLCk=</code>
          <code>/api/redirect?id=vegjCQnPCyXHj6d0PnJ76txWLCk=</code>
        </div>
      </section>
    </main>
  );
}
