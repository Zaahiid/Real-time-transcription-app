import { useEffect, useState } from 'react';

import { api } from '../lib/api.js';

const PAGE_SIZE = 20;

export function useTranscriptions(search) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchPage({ search, offset: 0, signal: controller.signal })
      .then((page) => {
        setItems(page.items);
        setTotal(page.total);
        setError(null);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [search]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const page = await fetchPage({ search, offset: items.length });
      setItems((current) => [...current, ...page.items]);
      setTotal(page.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  async function update(id, changes) {
    const updated = await api(`/transcriptions/${id}`, { method: 'PATCH', body: changes });
    setItems((current) => current.map((item) => (item.id === id ? updated : item)));
  }

  async function remove(id) {
    await api(`/transcriptions/${id}`, { method: 'DELETE' });
    setItems((current) => current.filter((item) => item.id !== id));
    setTotal((count) => count - 1);
  }

  return {
    items,
    total,
    loading,
    loadingMore,
    error,
    hasMore: items.length < total,
    loadMore,
    update,
    remove,
  };
}

function fetchPage({ search, offset, signal }) {
  const params = new URLSearchParams({ limit: PAGE_SIZE, offset });
  if (search) params.set('search', search);
  return api(`/transcriptions?${params}`, { signal });
}
