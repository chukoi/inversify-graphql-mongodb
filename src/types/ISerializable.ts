export interface ISerializable {
  serialize(): { [key: string]: any };
  // public static unserialize(obj: any): any {}
}

export interface ISerializableClass<T> {
  unserialize: (val: any) => T;
}
