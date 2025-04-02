import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnResult = await database.query("SHOW max_connections;");
  const databaseMaxConnValue = databaseMaxConnResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;

  const databaseActiveConnResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseActiveConnValue = databaseActiveConnResult.rows[0].count;

  console.log(databaseActiveConnValue);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnValue),
        opened_connections: databaseActiveConnValue,
      },
    },
  });
}

export default status;
