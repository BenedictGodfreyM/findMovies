
export interface OMDBMedia{
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<OMDBMediaRating>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  totalSeasons: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;

}

export interface OMDBMediaRating{
  Source: string;
  Value: string;
}
