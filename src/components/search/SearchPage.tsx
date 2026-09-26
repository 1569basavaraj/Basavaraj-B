import React, { useMemo, useState } from 'react';
import { useStore } from '../../services/store';
import { Play, Search, Tag, X } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const {
    tracks,
    artists,
    albums,
    playlists,
    genres,
    playTrack,
    setActiveView,
    setSelectedPlaylistId,
    setSelectedArtistId,
    setSelectedAlbumId,
  } = useStore();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tracks' | 'artists' | 'albums' | 'playlists'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Kavya Rao',
    'South Bass',
    'Synthwave Highway',
    'Raga Resonance',
  ]);

  const trendingTags = ['#SouthBass', '#LoFiBeats', '#MidnightCyber', '#EDMDrops', '#KannadaFusion', '#Neon1984'];

  const handleSearchCommit = (val: string) => {
    if (!val.trim()) return;
    if (!recentSearches.includes(val)) {
      setRecentSearches((prev) => [val, ...prev].slice(0, 8));
    }
  };

  // Advanced search query parser & search engine
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { tracks: [], artists: [], albums: [], playlists: [] };

    let targetGenre: string | null = null;
    let targetArtist: string | null = null;
    let targetYear: number | null = null;
    let cleanQuery = q;

    // Check advanced query parameters like genre: or artist: or year:
    const genreMatch = q.match(/genre:([a-z0-9_-]+)/i);
    if (genreMatch) {
      targetGenre = genreMatch[1].toLowerCase();
      cleanQuery = cleanQuery.replace(genreMatch[0], '').trim();
    }
    const artistMatch = q.match(/artist:([a-z0-9_-]+)/i);
    if (artistMatch) {
      targetArtist = artistMatch[1].toLowerCase();
      cleanQuery = cleanQuery.replace(artistMatch[0], '').trim();
    }
    const yearMatch = q.match(/year:([0-9]{4})/);
    if (yearMatch) {
      targetYear = parseInt(yearMatch[1], 10);
      cleanQuery = cleanQuery.replace(yearMatch[0], '').trim();
    }

    const filteredTracks = tracks.filter((t) => {
      if (targetGenre && !t.genre.toLowerCase().includes(targetGenre)) return false;
      if (targetArtist && !t.artistName.toLowerCase().includes(targetArtist)) return false;
      if (targetYear && t.releaseYear !== targetYear) return false;
      if (!cleanQuery) return true;

      return (
        t.title.toLowerCase().includes(cleanQuery) ||
        t.artistName.toLowerCase().includes(cleanQuery) ||
        t.genre.toLowerCase().includes(cleanQuery) ||
        (t.albumTitle && t.albumTitle.toLowerCase().includes(cleanQuery)) ||
        (t.lyrics && t.lyrics.some((l) => l.text.toLowerCase().includes(cleanQuery)))
      );
    });

    const filteredArtists = artists.filter((a) => {
      if (targetGenre && !a.genres.some((g) => g.toLowerCase().includes(targetGenre!))) return false;
      if (!cleanQuery) return true;
      return a.name.toLowerCase().includes(cleanQuery) || a.bio.toLowerCase().includes(cleanQuery);
    });

    const filteredAlbums = albums.filter((alb) => {
      if (targetGenre && !alb.genre.toLowerCase().includes(targetGenre)) return false;
      if (targetArtist && !alb.artistName.toLowerCase().includes(targetArtist)) return false;
      if (!cleanQuery) return true;
      return alb.title.toLowerCase().includes(cleanQuery) || alb.artistName.toLowerCase().includes(cleanQuery);
    });

    const filteredPlaylists = playlists.filter((p) => {
      if (!cleanQuery) return true;
      return p.title.toLowerCase().includes(cleanQuery) || p.description.toLowerCase().includes(cleanQuery);
    });

    return {
      tracks: filteredTracks,
      artists: filteredArtists,
      albums: filteredAlbums,
      playlists: filteredPlaylists,
    };
  }, [query, tracks, artists, albums, playlists]);

  const hasQuery = query.trim().length > 0;
  const totalResults =
    searchResults.tracks.length +
    searchResults.artists.length +
    searchResults.albums.length +
    searchResults.playlists.length;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search songs, artists, albums, lyrics or type genre:edm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchCommit(query);
            }}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.08] border border-white/[0.1] focus:border-violet-500 text-sm text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Category Tabs (Buttons) */}
        {hasQuery && (
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
            {(['all', 'tracks', 'artists', 'albums', 'playlists'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  filterType === cat
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* When no query entered: Show Recent Searches & Trending & Genres Grid */}
      {!hasQuery ? (
        <div className="space-y-9">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Recent Searches
                </h3>
                <button
                  onClick={() => setRecentSearches([])}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Clear history
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(item)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-xs text-slate-300 transition-colors flex items-center gap-1.5"
                  >
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Tags */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag.replace('#', ''))}
                  className="px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/20 text-xs font-semibold text-violet-300 hover:bg-violet-900/40 transition-colors flex items-center gap-1"
                >
                  <Tag className="w-3 h-3 text-cyan-400" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Browse All Genres Grid */}
          <div>
            <h2 className="text-xl font-bold font-display text-white mb-4">
              Browse All Genres & Moods
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {genres.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setQuery(`genre:${g.slug}`)}
                  className="relative h-28 rounded-2xl p-4 overflow-hidden cursor-pointer group shadow-lg transition-transform hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${g.accentColor} 0%, ${g.secondaryColor} 100%)`,
                  }}
                >
                  <span className="text-sm sm:text-base font-extrabold font-display text-white block">
                    {g.name}
                  </span>
                  <p className="text-[11px] text-white/80 line-clamp-2 mt-1">
                    {g.description}
                  </p>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/10 rounded-full blur-sm transform group-hover:scale-125 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Results Section */
        <div className="space-y-8">
          {totalResults === 0 ? (
            <div className="py-20 text-center space-y-2">
              <h3 className="text-lg font-bold font-display text-white">
                No results found for "{query}"
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Check spelling or try searching for artist names like "Kavya", genres like "South Bass", or keywords in lyrics.
              </p>
            </div>
          ) : (
            <>
              {/* Songs Section */}
              {(filterType === 'all' || filterType === 'tracks') &&
                searchResults.tracks.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-lg font-bold font-display text-white">
                      Songs ({searchResults.tracks.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {searchResults.tracks.slice(0, 8).map((track) => (
                        <div
                          key={track.id}
                          onClick={() => playTrack(track, searchResults.tracks)}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-colors cursor-pointer group"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md">
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Play className="w-4 h-4 fill-white text-white" />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white truncate">
                              {track.title}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {track.artistName} · {track.genre}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              {/* Artists Section */}
              {(filterType === 'all' || filterType === 'artists') &&
                searchResults.artists.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-lg font-bold font-display text-white">
                      Artists ({searchResults.artists.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {searchResults.artists.map((art) => (
                        <div
                          key={art.id}
                          onClick={() => {
                            setSelectedArtistId(art.id);
                            setActiveView('artist');
                          }}
                          className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-colors text-center cursor-pointer group"
                        >
                          <img
                            src={art.avatarUrl}
                            alt={art.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-full object-cover mx-auto mb-2 ring-1 ring-white/10"
                          />
                          <p className="text-xs font-bold text-white truncate">
                            {art.name}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {art.genres[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              {/* Albums Section */}
              {(filterType === 'all' || filterType === 'albums') &&
                searchResults.albums.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-lg font-bold font-display text-white">
                      Albums ({searchResults.albums.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {searchResults.albums.map((alb) => (
                        <div
                          key={alb.id}
                          onClick={() => {
                            setSelectedAlbumId(alb.id);
                            setActiveView('album');
                          }}
                          className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-colors cursor-pointer group"
                        >
                          <img
                            src={alb.coverUrl}
                            alt={alb.title}
                            referrerPolicy="no-referrer"
                            className="aspect-square w-full rounded-xl object-cover mb-2"
                          />
                          <p className="text-xs font-bold text-white truncate">
                            {alb.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {alb.artistName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              {/* Playlists Section */}
              {(filterType === 'all' || filterType === 'playlists') &&
                searchResults.playlists.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-lg font-bold font-display text-white">
                      Playlists ({searchResults.playlists.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {searchResults.playlists.map((pl) => (
                        <div
                          key={pl.id}
                          onClick={() => {
                            setSelectedPlaylistId(pl.id);
                            setActiveView('playlist');
                          }}
                          className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-colors cursor-pointer group"
                        >
                          <img
                            src={pl.coverUrl}
                            alt={pl.title}
                            referrerPolicy="no-referrer"
                            className="aspect-square w-full rounded-xl object-cover mb-2"
                          />
                          <p className="text-xs font-bold text-white truncate">
                            {pl.title}
                          </p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">
                            {pl.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
