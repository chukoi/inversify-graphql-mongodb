import { IsString, validate } from "class-validator";
import { ISerializable } from "../types/ISerializable";
import { cloneModelObject } from "../util/cloneModelObject";
import { ValidationError } from "../types/errorTypes";

export interface ISerializedPerson {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
}

export class Person implements ISerializable {
  @IsString() public id: string;

  @IsString() public firstName: string;

  @IsString() public lastName: string;

  @IsString() public year: number;

  @IsString() public profileImage: string;

  public get fullName(): string {
    return this.firstName + " " + this.lastName;
  }

  public static unserialize(data: ISerializedPerson): Person {
    const newPerson = new this();

    newPerson.id = data.id;
    newPerson.firstName = data.firstName;
    newPerson.lastName = data.lastName;
    newPerson.profileImage = data.profileImage;
    return newPerson;
  }

  public filterSensitiveData() {
    const clone = cloneModelObject(this);
    return clone;
  }

  public serialize(): ISerializedPerson {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      profileImage: this.profileImage,
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
