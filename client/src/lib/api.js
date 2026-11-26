export const UNAUTHORIZED_EVENT = 'api:unauthorized';

export async function api(path, { body, ...options } = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    body: body && JSON.stringify(body),
  });

  if (response.status === 401) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));

  if (!response.ok) {
    const { error } = await response.json().catch(() => ({}));
    throw new Error(error ?? response.statusText);
  }

  return response.status === 204 ? null : response.json();
}
