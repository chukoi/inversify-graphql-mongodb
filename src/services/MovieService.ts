import { Movie } from "../models/Movie";
import { inject, injectable } from "inversify";
import { IMovieDal } from "../dal/MovieDal";

export interface IMovieService {
  retrieveMovies(): Promise<Movie[]>;
}

// @ts-ignore
@injectable()
export class MovieService implements IMovieService {
  constructor(@inject("MovieDal") private _movieDal: IMovieDal) {}

  public async retrieveMovies(): Promise<Movie[]> {
    const movies = await this._movieDal.retrieveMovies();
    return movies;
  }
}
