import { Container, inject, injectable } from "inversify";
import * as cors from "cors";
import * as debugFactory from "debug";
import { getRouteInfo, InversifyExpressServer } from "inversify-express-utils";
import * as prettyjson from "prettyjson";
import * as ratelimiter from "express-rate-limit";

import { IConfig } from "../IoC/config";
import { ValidationError } from "../types/errorTypes";
import { Express, NextFunction } from "express";
import { Request, Response } from "express-serve-static-core";

const express = require("express");

const debug = debugFactory("server:ApiServerService");

export interface IApiServerService {
  startServer(container: Container): Promise<void>;
}

// @ts-ignore
@injectable()
export class ApiServerService implements IApiServerService {
  constructor(@inject("config") private _config: IConfig) {}

  public async startServer(container: Container): Promise<void> {
    debug("Starting server");

    const { port, show500 } = this._config;

    const serverPort = port;
    let routeInfo: any = null;

    // create server
    const server = new InversifyExpressServer(container);
    server.setConfig((app: Express) => {
      // the client’s IP address is understood as the left-most entry in the X-Forwarded-* header.
      app.set("trust proxy", 1);

      app.use(
        // @ts-ignore
        ratelimiter({
          windowMs: 1000 * 60 * 2, // 2 minutes
          max: 1000, // limit each IP to 100 requests per windowMs
        })
      );

      app.use(
        cors({
          origin: true,
        })
      );

      // add body parser
      app.use(
        express.urlencoded({
          extended: true,
        })
      );
      app.use(express.json({ limit: "5mb" }));

      // provide a visual export of all available routes in the system
      app.get("/route-info", (req: Request, res: Response) => {
        const prettyStr = prettyjson.render(
          { routes: routeInfo },
          { noColor: true }
        );
        res.end(prettyStr);
      });
    });

    server.setErrorConfig((app: Express) => {
      // error handler
      // note: express requires all 4 vars to treat this as an error handler, don't remove 'next'
      app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ValidationError) {
          res.status(400).send({
            error: `Validation error: ${err.message}`,
          });
          return;
        }

        console.error(err.stack);

        if (show500) {
          res.status(500).send({
            error: err.message,
            stack: err.stack,
          });
          return;
        }

        res.status(500).send({ error: "Internal server error" });
      });

      // 404 handler
      app.use((req: Request, res: Response) => {
        res.status(404).send({ error: "Endpoint not found" });
      });
    });

    // build express server
    server.build().listen(serverPort);

    // store routeInfo so it can be shown on the /route-info route
    routeInfo = getRouteInfo(container);

    debug("Server listening on port", serverPort);
  }
}
