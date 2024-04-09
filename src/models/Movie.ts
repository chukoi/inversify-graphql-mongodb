import { ISerializedPerson, Person } from "./Person";
import { ISerializable } from "../types/ISerializable";
import { cloneModelObject } from "../util/cloneModelObject";
import { ValidationError } from "../types/errorTypes";
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  validate,
} from "class-validator";

export interface ISerializedMovie {
  id: string;
  title: string;
  description: string;
  year: number;
  director: ISerializedPerson;
  cast: ISerializedPerson[];
}

export class Movie implements ISerializable {
  @IsString() public id: string;

  @IsString() public title: string;

  @IsString() public description: string;

  @IsNumber() public year: number;

  @ValidateNested() public director: Person;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  public cast: Person[];

  public static unserialize(data: ISerializedMovie): Movie {
    const newMovie = new this();

    newMovie.id = data.id;
    newMovie.title = data.title;
    newMovie.description = data.description;
    newMovie.year = data.year;
    newMovie.director = Person.unserialize(data.director);
    newMovie.cast = data.cast.map((c) => Person.unserialize(c));
    return newMovie;
  }

  public filterSensitiveData() {
    const clone = cloneModelObject(this);
    return clone;
  }

  public serialize(): ISerializedMovie {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      year: this.year,
      director: this.director.serialize(),
      cast: this.cast.map((c) => c.serialize()),
    };
  }

  public async validate(): Promise<boolean> {
    const validated = await validate(this);
    if (validated.length > 0) {
      throw new ValidationError(validated);
    }

    return true;
  }
}
