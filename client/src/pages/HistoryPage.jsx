import { Button, Card, SearchField, Skeleton, Spinner, buttonVariants } from '@heroui/react';
import { FileText, SearchX } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import TranscriptionCard from '../components/TranscriptionCard.jsx';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import { useTranscriptions } from '../hooks/useTranscriptions.js';

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const query = useDebouncedValue(search.trim(), 300);
  const { items, total, loading, loadingMore, error, hasMore, loadMore, update, remove } = useTranscriptions(query);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">History</h1>
          <p className="mt-1 text-muted">{loading ? 'Loading…' : `${total} ${query ? 'found' : 'saved'}`}</p>
        </div>

        <SearchField aria-label="Search transcriptions" value={search} onChange={setSearch} className="w-full sm:w-72">
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search transcriptions" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </header>

      {error && <p className="text-danger">{error}</p>}
      {loading && <LoadingCards />}
      {!loading && !error && items.length === 0 && <EmptyState isSearching={Boolean(query)} />}

      <ul className="flex flex-col gap-4">
        {items.map((transcription) => (
          <li key={transcription.id}>
            <TranscriptionCard transcription={transcription} onUpdate={update} onDelete={remove} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <Button variant="secondary" className="self-center" isPending={loadingMore} onPress={loadMore}>
          {loadingMore && <Spinner color="current" size="sm" />}
          Load more
        </Button>
      )}
    </div>
  );
}

function LoadingCards() {
  return Array.from({ length: 3 }, (_, index) => (
    <Card key={index} className="gap-4">
      <Skeleton className="h-4 w-2/5 rounded-lg" />
      <Skeleton className="h-3 w-1/4 rounded-lg" />
      <Skeleton className="h-3 w-full rounded-lg" />
      <Skeleton className="h-3 w-4/5 rounded-lg" />
    </Card>
  ));
}

function EmptyState({ isSearching }) {
  const Icon = isSearching ? SearchX : FileText;

  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border px-6 py-16 text-center motion-safe:animate-fade-up">
      <span className="grid size-12 place-items-center rounded-2xl bg-default">
        <Icon className="size-6 text-muted" />
      </span>
      <p className="font-medium">{isSearching ? 'No matches found' : 'No transcriptions yet'}</p>
      <p className="text-sm text-muted">
        {isSearching ? 'Try a different word or phrase.' : 'Your recordings will show up here.'}
      </p>
      {!isSearching && (
        <Link to="/" className={buttonVariants({ size: 'sm' })}>
          Start recording
        </Link>
      )}
    </div>
  );
}
