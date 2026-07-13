import { createServerFn } from "@tanstack/react-start";

let globalRevision = 0;

export const getSyncRevision = createServerFn({ method: "GET" }).handler(async () => {
  return globalRevision;
});

export function triggerSync() {
  globalRevision++;
}
