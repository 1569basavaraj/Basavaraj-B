import React from 'react';
import { useStore } from '../../services/store';
import { formatCompactNumber, formatTime } from '../../utils/formatters';
import { BadgeCheck, Heart, Play, Share2, UserCheck, UserPlus } from 'lucide-react';

export const ArtistDetailView: React.FC = () => {
  const {
    selectedArtistId,
    artists,
    tracks,
    albums,
    playTrack,
    currentTrack,
    isPlaying,
    followedArtistIds,
    toggleFollowArtist,
    likedTrackIds,
    toggleLikeTrack,
    setSelectedAlbumId,
    setSelectedArtistId,
    setActiveView,
    openShareModal,
  } = useStore();

  const artist = artists.find((a) => a.id === selectedArtistId) || artists[0];
  const isFollowed = followedArtistIds.includes(artist.id);

  // Artist's tracks and albums
  const artistTracks = tracks.filter((t) => t.artistId === artist.id || t.artistName === artist.name);
  const artistAlbums = albums.filter((alb) => alb.artistId === artist.id || alb.artistName === artist.name);
  const otherArtists = artists.filter((a) => a.id !== artist.id).slice(0, 4);

  return (
    <div className="space-y-8 pb-24">
      {/* Hero Banner with Artist Portrait */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-gradient-to-b from-violet-950/60 to-[#0a0c14] flex items-end p-6 sm:p-10">
        <img
          src={artist.avatarUrl}
          alt={artist.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c14] via-[#0a0c14]/60 to-transparent" />

        <div className="relative z-10 space-y-3 max-w-4xl">
          <div className="flex items-center gap-2">
            {artist.isVerified && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-bold text-cyan-300">
                <BadgeCheck className="w-3.5 h-3.5 fill-cyan-400 text-slate-950" />
                <span>Verified Artist</span>
              </span>
            )}
            <span className="text-xs text-slate-400 font-mono-tabular">
              {formatCompactNumber(artist.monthlyListeners)} monthly listeners
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-display text-white tracking-tight">
            {artist.name}
          </h1>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {artist.genres.map((g, i) => (
              <span
                key={i}
                className="text-xs text-slate-300 bg-white/[0.08] px-2.5 py-1 rounded-full"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-9">
        {/* Play and Follow Actions Bar */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (artistTracks.length > 0) playTrack(artistTracks[0], artistTracks);
            }}
            className="w-13 h-13 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center text-white shadow-xl shadow-violet-900/40"
            title="Play Artist Top Tracks"
          >
            <Play className="w-6 h-6 fill-white translate-x-0.5" />
          </button>

          <button
            onClick={() => toggleFollowArtist(artist.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              isFollowed
                ? 'bg-white/[0.1] text-white border border-white/20'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md'
            }`}
          >
            {isFollowed ? (
              <>
                <UserCheck className="w-4 h-4 text-cyan-300" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Follow</span>
              </>
            )}
          </button>

          <button
            onClick={() =>
              openShareModal(
                artist.name,
                'Stream on BASSnBEATS',
                `https://bassnbeats.app/artist/${artist.id}`
              )
            }
            className="p-3 rounded-full hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
            title="Share Artist"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tracks Table */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-display text-white">
            Popular Releases
          </h2>

          <div className="space-y-1">
            {artistTracks.map((track, idx) => {
              const isPlayingThis = currentTrack?.id === track.id && isPlaying;
              const isLiked = likedTrackIds.includes(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, artistTracks)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer group ${
                    isPlayingThis
                      ? 'bg-violet-600/15 border-violet-500/30'
                      : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="w-6 text-center text-xs font-mono-tabular text-slate-500 group-hover:hidden">
                    {idx + 1}
                  </span>
                  <button className="w-6 hidden group-hover:flex items-center justify-center text-white">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </button>

                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover shadow-sm shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold truncate ${isPlayingThis ? 'text-violet-400' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {track.genre}
                    </p>
                  </div>

                  <span className="text-xs text-slate-500 font-mono-tabular shrink-0 hidden sm:inline">
                    {formatCompactNumber(track.plays)} plays
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikeTrack(track.id);
                    }}
                    className={`p-1.5 rounded-full hover:text-white ${
                      isLiked ? 'text-rose-500' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                  </button>

                  <span className="text-xs text-slate-400 font-mono-tabular w-12 text-right">
                    {formatTime(track.duration)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Discography / Albums */}
        {artistAlbums.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold font-display text-white">
              Discography & Albums
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {artistAlbums.map((alb) => (
                <div
                  key={alb.id}
                  onClick={() => {
                    setSelectedAlbumId(alb.id);
                    setActiveView('album');
                  }}
                  className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-all cursor-pointer group"
                >
                  <img
                    src={alb.coverUrl}
                    alt={alb.title}
                    referrerPolicy="no-referrer"
                    className="aspect-square w-full rounded-xl object-cover mb-2.5 shadow-md"
                  />
                  <h4 className="text-xs font-bold text-white truncate">
                    {alb.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {alb.releaseDate.split('-')[0]} · {alb.genre}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Biography & Social Links */}
        <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <h3 className="text-lg font-bold font-display text-white">
            About {artist.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {artist.bio}
          </p>
          {artist.socialLinks && (
            <div className="flex items-center gap-3 pt-2 text-xs text-violet-400 font-medium">
              {artist.socialLinks.twitter && (
                <span>Twitter: {artist.socialLinks.twitter}</span>
              )}
              {artist.socialLinks.instagram && (
                <span>Instagram: @{artist.socialLinks.instagram}</span>
              )}
            </div>
          )}
        </section>

        {/* Related Artists */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-display text-white">
            Fans Also Like
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {otherArtists.map((other) => (
              <div
                key={other.id}
                onClick={() => {
                  setSelectedArtistId(other.id);
                  setActiveView('artist');
                }}
                className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-all text-center cursor-pointer group"
              >
                <img
                  src={other.avatarUrl}
                  alt={other.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-2 ring-1 ring-white/10"
                />
                <h4 className="text-xs font-bold text-white truncate">
                  {other.name}
                </h4>
                <p className="text-[10px] text-slate-400 truncate">
                  {other.genres[0]}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
