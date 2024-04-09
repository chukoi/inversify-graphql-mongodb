import { Container } from "inversify";

export let container: Container;

export function setContainer(newContainer: Container) {
  container = newContainer;
}
