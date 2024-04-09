import { injectable } from "inversify";

// import { IDatabaseService } from "../services/DatabaseService";
import { Movie } from "../models/Movie";
import { Person } from "../models/Person";

export interface IMovieDal {
  retrieveMovies(): Promise<Movie[]>;
}

// @ts-ignore
@injectable()
export class MovieDal implements IMovieDal {
  // private readonly _tableName: string;

  constructor() { // @inject("DatabaseService") private _databaseService: IDatabaseService
    // this._tableName = "movies";
  }

  public dbRowToMovie(row: any): Movie {
    const newMovie = new Movie();
    newMovie.id = row.id;
    newMovie.title = row.title;
    newMovie.description = row.description;
    newMovie.year = row.year;
    newMovie.director = Person.unserialize(row.director);
    newMovie.cast = row.cast.map((c: any) => Person.unserialize(c.cast));
    return newMovie;
  }

  public async retrieveMovies(): Promise<Movie[]> {
    // const rows = await this._getDailyTasksQuery(locationId, date);
    const rows: Movie[] = [];

    return rows.map((row: any) => this.dbRowToMovie(row));
  }
}
