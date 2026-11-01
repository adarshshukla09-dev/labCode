require("dotenv").config();

const { spawn } = require("node:child_process");
const path = require("node:path");

function getDatabaseName(uri) {
  const parsed = new URL(uri);
  const database = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));

  if (!database) {
    throw new Error("MongoDB connection string must include a database name");
  }

  return database;
}

function buildDatabaseUri(uri, databaseName) {
  const parsed = new URL(uri);
  parsed.pathname = `/${encodeURIComponent(databaseName)}`;
  return parsed.toString();
}

/**
 * Restore the immutable MongoDB master dump into a disposable attempt DB.
 *
 * Example:
 * await insertMongoMaster("attempt_abc123");
 */
exports.insertMongoMaster = async (targetDatabaseName) => {
  const masterUri = process.env.MONGO_DB_URL;

  if (!masterUri) {
    throw new Error("MONGO_DB_URL is not defined");
  }

  if (
    !targetDatabaseName ||
    !/^attempt_[a-f0-9]{32}$/i.test(targetDatabaseName)
  ) {
    throw new Error("A valid attempt database name is required");
  }

  const masterDatabaseName = getDatabaseName(masterUri);
  const targetUri = buildDatabaseUri(masterUri, targetDatabaseName);

  // mongodump --out ingestion/dumps creates ingestion/dumps/<masterDb>.
  const dumpPath = path.join(
    process.cwd(),
    "ingestion",
    "dumps",
    masterDatabaseName,
  );

  return new Promise((resolve, reject) => {
    const restore = spawn(
      "mongorestore",
      [
        `--uri=${targetUri}`,
        "--drop",
        `--nsFrom=${masterDatabaseName}.*`,
        `--nsTo=${targetDatabaseName}.*`,
        dumpPath,
      ],
      { env: process.env },
    );

    let stderr = "";
    let stdout = "";
    let settled = false;

    restore.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    restore.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    restore.on("error", (error) => {
      if (settled) return;
      settled = true;
      reject(new Error(`Could not start mongorestore: ${error.message}`));
    });

    restore.on("close", (code) => {
      if (settled) return;
      settled = true;

      if (code !== 0) {
        reject(
          new Error(
            `MongoDB restore failed with exit code ${code}:\n${stderr || stdout}`,
          ),
        );
        return;
      }

      console.log(`MongoDB database restored: ${targetDatabaseName}`);

      resolve({
        success: true,
        database: targetDatabaseName,
        message: "MongoDB attempt database initialized successfully",
      });
    });
  });
};
