import { IIPCService } from "../../src/services/IPCService";
import {EventEmitter} from "../../src/util/EventEmitter";

export class MockIPCService implements IIPCService {
  public broadcast: EventEmitter;

  constructor() {
    this.broadcast = new EventEmitter();
  }

  public async init(): Promise<void> {}
}
