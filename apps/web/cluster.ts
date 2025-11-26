import { spawn } from "bun";

const cpus = Number(process.env.MAX_WORKERS) || navigator.hardwareConcurrency; // Number of CPU cores
const buns = Array.from({ length: cpus }) as Bun.Subprocess[];

for (let i = 0; i < cpus; i++) {
  buns[i] = spawn({
    cmd: ["bun", "./server.ts"],
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  });
}

function kill() {
  for (const bun of buns) {
    bun.kill();
  }
}

process.on("SIGINT", kill);
process.on("exit", kill);
