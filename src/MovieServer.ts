import { inject, injectable } from "inversify";
import * as debugFactory from "debug";
import { IApiServerService } from "./services/ApiServerService";
// import { IDatabaseService } from "./services/DatabaseService";
import { container } from "./IoC/sharedContainer";

const debug = debugFactory("movie:Server");

@injectable()
export class MovieServer {
  constructor(
    @inject("ApiServerService") private _apiServerService: IApiServerService
  ) // @inject("DatabaseService") private _databaseService: IDatabaseService
  {}

  public async start() {
    process.title = "movie-server";

    debug("Starting bootstrap");

    // connect to the database
    // this._databaseService.connect();

    // migrate latest data
    // await this._databaseService.migrate();

    // start the api service server
    await this._apiServerService.startServer(container);

    debug("Bootstrap complete");
  }
}
