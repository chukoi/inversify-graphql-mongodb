import "reflect-metadata";
import { Container, ContainerModule, interfaces } from "inversify";

import { MovieDal } from "../dal/MovieDal";

import { DatabaseService } from "../services/DatabaseService";
import { ApiServerService } from "../services/ApiServerService";

import { getConfig } from "./config";
import {
  booleanConfigVars,
  numberConfigVars,
  stringConfigVars
} from "./configVars";
import { MovieServer } from "../MovieServer";
import { MovieEndpoint } from "../endpoints/movies";
import { MovieService } from "../services/MovieService";

export const core = new ContainerModule((bind: interfaces.Bind) => {
  bind("MovieServer").to(MovieServer);
  bind("config").toConstantValue(
    getConfig(stringConfigVars, numberConfigVars, booleanConfigVars)
  );
});

export const coreDal = new ContainerModule((bind: interfaces.Bind) => {
  bind("MovieDal").to(MovieDal);
});

export const endpointControllers = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind("MovieEndpoint").to(MovieEndpoint);
  }
);

export const coreServices = new ContainerModule((bind: interfaces.Bind) => {
  // singletons
  bind("DatabaseService")
    .to(DatabaseService)
    .inSingletonScope();
  bind("ApiServerService")
    .to(ApiServerService)
    .inSingletonScope();
  bind("MovieService").to(MovieService);
});

export function createContainer(): Container {
  const container = new Container();
  container.load(core, coreDal, endpointControllers, coreServices);
  return container;
}
