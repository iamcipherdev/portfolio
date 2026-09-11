/**
 * Local development database (embedded PostgreSQL — no root required).
 * Data persists in <project>/pgdata.
 *
 *   node scripts/dev-db.mjs start    # initialise + start + ensure db
 */
import EmbeddedPostgres from "embedded-postgres";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "pgdata");
const PG_OPTIONS = {
  databaseDir: DATA_DIR,
  user: "cipher",
  password: "cipher",
  port: 5433,
  persistent: true,
  onError: (msg) => console.error("[pg]", msg),
};

async function main() {
  const firstRun = !fs.existsSync(path.join(DATA_DIR, "PG_VERSION"));
  const pg = new EmbeddedPostgres(PG_OPTIONS);

  if (firstRun) {
    console.log("[dev-db] initialising postgres data dir…");
    await pg.initialise();
  }

  console.log("[dev-db] starting postgres on port", PG_OPTIONS.port, "…");
  await pg.start();

  try {
    await pg.createDatabase("cipher");
    console.log("[dev-db] database 'cipher' created");
  } catch {
    console.log("[dev-db] database 'cipher' already exists");
  }

  console.log(`[dev-db] ready → postgresql://cipher:cipher@localhost:${PG_OPTIONS.port}/cipher`);
  /* keep process alive so the DB stays up */
  process.on("SIGINT", async () => {
    await pg.stop();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("[dev-db] failed:", err.message);
  process.exit(1);
});
