import * as cp from "child_process";

export default function Exec(
  command: string,
  options = { log: false, cwd: process.cwd() }
): Promise<{ stdout: string; stderr: string }> {
  if (options.log) console.log(command);

  return new Promise((done, failed) => {
    cp.exec(command, { ...options }, (err, stdout, stderr) => {
      if (err) {
        process.stdout.write(stdout);
        process.stderr.write(stderr);
        failed(err);
        return;
      }

      done({ stdout, stderr });
    });
  });
}
