import {
  BaseHttpController,
  controller,
  httpGet
} from "inversify-express-utils";
import { inject } from "inversify";

import { IMovieService } from "../services/MovieService";

@controller("/movies")
export class MovieEndpoint extends BaseHttpController {
  constructor(@inject("MovieService") private _movieService: IMovieService) {
    super();
  }

  @httpGet("")
  public async getMovies() {
    const movies = await this._movieService.retrieveMovies();

    return this.ok({ movies });
  }
}
