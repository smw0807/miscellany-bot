//https://jongmin4943.tistory.com/entry/Nuxt3-proxy-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0feat-Spring-API-%EC%84%9C%EB%B2%84
export default defineEventHandler((event) => {
  if (!event.node.req.url?.startsWith('/api/')) return;

  const target = new URL(event.node.req.url, process.env.API_URL);
  return proxyRequest(event, target.toString(), {
    headers: {
      host: target.host,
      origin: target.origin,
    },
  });
});
