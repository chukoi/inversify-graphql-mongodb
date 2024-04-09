import { inject, injectable } from "inversify";
import { Knex, knex } from "knex";

import { IConfig } from "../IoC/config";

export interface IDatabaseService {
  connect(): void;

  getConnection(): Knex;

  migrate(): Promise<void>;

  seed(): Promise<void>;
}

// @ts-ignore
@injectable()
export class DatabaseService implements IDatabaseService {
  private db: Knex | null = null;

  constructor(@inject("config") private _config: IConfig) {}

  public connect() {
    this.db = knex({
      client: "pg",
      connection: this._config.databaseUrl,
    });
  }

  public getConnection(): Knex {
    // no current database connection
    if (this.db === null) {
      throw new Error("db has not connected yet");
    }

    // return database connection
    return this.db;
  }

  public async migrate() {
    // no current database connection
    if (this.db === null) {
      throw new Error("db has not connected yet");
    }

    // migrate schema
    await this.db.migrate.latest();
  }

  public async seed() {
    // no current database connection
    if (this.db === null) {
      throw new Error("db has not connected yet");
    }

    // seed data
    await this.db.seed.run();
  }
}
