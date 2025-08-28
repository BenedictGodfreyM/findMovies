export interface Torrent{
  name: string;
  size: string;
  seeders: string;
  leechers: string;
  category: string;
  hash: string;
  magnet: string;
  torrent: string;
  url: string;
  date: string;
  downloads: string;
  poster: string;
}

export interface Torrents{
  data: Array<Torrent>;
  time: number;
  total: number;
}
