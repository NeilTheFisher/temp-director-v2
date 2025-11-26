import cluster from "node:cluster";
import { availableParallelism } from "node:os";

const MAX_CPU = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < MAX_CPU; i++) {
    const worker = cluster.fork();
    console.log("Worker created", worker.id);
  }
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  void import("./server");
}

function kill() {
  if (!cluster.workers) return;
  for (const fork of Object.values(cluster.workers)) {
    fork?.kill();
  }
}

process.on("SIGINT", kill);
process.on("exit", kill);
