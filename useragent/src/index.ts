import { runChromiumScenes } from "@shirabe/cli";
import { createReportCenter } from "@shirabe/plugin";
import path from "path";
import fs from "fs";
import arg from "arg";
import { UseragentPlugin } from "./plugin";

import type { RunnerConfig } from "@shirabe/cli";

const PACKAGE_NAME = "@shirabe/useragent";
const VERSION = "v0.0.1";
const HELP_MESSAGE = `
Usage: ${PACKAGE_NAME} [options...] <JSON file>

Options:
  -h, --help     print ${PACKAGE_NAME} command line options
  -v, --version  print version
  --verbose      verbose logs

JSON file format:
{
  "urls": [
    "https://...",
    :
  ]
}
`.trim();

type Config = Pick<RunnerConfig, "options" | "urls">;

function loadConfig(filepath: string): Config {
  const content = fs.readFileSync(path.resolve(filepath));
  return JSON.parse(content.toString("utf8")) as Config;
}

async function main(): Promise<void> {
  const args = arg(
    {
      "--help": Boolean,
      "--version": Boolean,
      "--verbose": Boolean,

      "-h": "--help",
      "-v": "--version",
    },
    { permissive: false, argv: process.argv.slice(2) }
  );

  if (args["--help"] === true) {
    console.warn(HELP_MESSAGE);
    process.exit(0);
  }

  if (args["--version"] === true) {
    console.warn(VERSION);
    process.exit(0);
  }

  const filepath = args._[0] ?? "";
  if (filepath === "") {
    console.warn(`Usage: ${PACKAGE_NAME} [options...] <JSON file>`);
    console.warn("<JSON file> is required.");
    process.exit(1);
  }

  const config = loadConfig(filepath);
  const reportCenter = createReportCenter();
  if (args["--verbose"] === true) {
    reportCenter.on("report", console.warn);
  }

  await runChromiumScenes(reportCenter, {
    ...config,
    plugins: [new UseragentPlugin()],
  });

  console.log(JSON.stringify(reportCenter.getReports(), undefined, 2));
  process.exit(0);
}

main().catch(console.error);
