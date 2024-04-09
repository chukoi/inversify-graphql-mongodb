import { createContainer } from "./IoC/container";
import { MovieServer } from "./MovieServer";
import { setContainer } from "./IoC/sharedContainer";

const container = createContainer();
setContainer(container); // set global app container

const server = container.get<MovieServer>("MovieServer");

server.start().catch(console.error);
