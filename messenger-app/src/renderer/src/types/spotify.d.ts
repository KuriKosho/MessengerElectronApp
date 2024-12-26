export type ExternalUrls = {
  spotify: string
}
export type Followers = {
  href: string | null
  total: number
}
export type AddedBy = {
  external_urls: ExternalUrls
  followers: Followers
  href: string
  id: string
  type: string
  uri: string
}
export type Restrictions = {
  reason: string
}
export type Artist = {
  external_urls: ExternalUrls
  followers: Followers
  genres: string[]
  href: string
  id: string
  images: Image[]
  name: string
  popularity: number
  type: string
  uri: string
}
export type Image = {
  height: number | null
  url: string
  width: number | null
}
export type Album = {
  album_type: string
  total_tracks: number
  available_markets: string[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  restrictions: Restrictions
  type: string
  uri: string
  artists: Artist[]
}
export type ExternalIds = {
  isrc: string
  ean: string
  upc: string
}
export type Owner = {
  display_name: string
  external_urls: ExternalUrls
  followers: Followers
  href: string
  id: string
  type: string
  uri: string
}
export type Track = {
  album: Album
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIds
  external_urls: ExternalUrls
  href: string
  id: string
  is_playable: boolean
  linked_from: Record<string, unknown>
  restrictions: Restrictions
  name: string
  popularity: number
  preview_url: string | null
  track_number: number
  type: string
  uri: string
  is_local: boolean
}
export type PlaylistItem = {
  added_at: string
  added_by: AddedBy
  is_local: boolean
  track: Track
}
export type PlaylistTracks = {
  href: string
  total: number
}

export type Playlist = {
  collaborative: boolean
  description: string
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  owner: Owner
  primary_color: string | null
  public: boolean
  snapshot_id: string
  tracks: PlaylistTracks
  type: string
  uri: string
}
export type SpotifyAPIResult<T> = {
  data: T | null
  loading: boolean
  error: string | null
}
export type PlaylistTracksResponse = {
  items: { track: Track }[]
}
export type ArtistsResponse = {
  artists: Artist[]
}
export type PlaylistsResponse = {
  playlists: Playlist[]
}
export type AlbumsResponse = {
  items: Album[]
}
