import { cpSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const source = resolve("../web/out");
const target = resolve("./dist/web");

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
