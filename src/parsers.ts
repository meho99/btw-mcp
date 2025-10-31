import { PrismaCrudQuery } from "./types";

export const parseCrudQuery = (query: PrismaCrudQuery): URLSearchParams =>
  new URLSearchParams({
    crudQuery: JSON.stringify(query),
  });
