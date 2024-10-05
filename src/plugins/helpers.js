export function appUrl(endpoint) {
  return [import.meta.env.VITE_APP_URL, endpoint].map(function (i) {
    return i.replace(/(^\/|\/$)/, "");
  }).join("/");
}
