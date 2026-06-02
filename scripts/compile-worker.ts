import { runCompileWorker } from "../src/server/compile/worker";

const once = process.argv.includes("--once");

runCompileWorker({ once }).catch((error) => {
  console.error(error);
  process.exit(1);
});
