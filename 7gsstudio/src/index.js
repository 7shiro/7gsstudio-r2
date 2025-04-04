/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    // 先頭のスラッシュを削除
    path = path.replace(/^\/+/, "");

    // ルートやディレクトリっぽいアクセスは index.html にマッピング
    if (path === "" || path.endsWith("/")) {
      path += "index.html";
    } else if (!path.includes(".")) {
      path += "/index.html";
    }

    const object = await env.BUCKET.get(path);

    if (!object) {
      return new Response("Not Found", { status: 404 });
    }

    return new Response(object.body, {
      headers: {
        "content-type": object.httpMetadata?.contentType || "application/octet-stream"
      }
    });
  }
}
