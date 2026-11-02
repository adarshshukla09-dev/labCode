// import { db } from "@/db/drizzle";
// import { sql } from "drizzle-orm";

import { mysqlDb } from "@/db/labs/sqllite";
import { evaluateSql } from "./evaluate";
import { questions } from "@/db/drizzle/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { insertMaster } from "./insertToSql";

// async function testDatabase() {
//   try {
//     // 1. Verify which PostgreSQL database you're connected to.
//     const identity = await db.execute(sql`
//       SELECT
//         current_database() AS database,
//         inet_server_addr() AS server_ip,
//         inet_server_port() AS server_port,
//         version() AS postgres_version
//     `);

//     console.log("\nDatabase identity:");
//     console.log(identity);

//     // 2. Measure five database round trips.
//     console.log("\nDatabase latency:");

//     for (let i = 1; i <= 5; i++) {
//       const start = performance.now();

//       await db.execute(sql`SELECT 1`);

//       console.log(`Request ${i}: ${(performance.now() - start).toFixed(2)} ms`);
//     }
//   } catch (error) {
//     console.error("Database test failed:", error);
//   } finally {
//     await db.$client.end();
//   }
// }

// testDatabase();
async function test() {
  try {
    const [question] = await db
      .select({
        solutionQuery: questions.solutionQuery,
        expectedOutput: questions.expectedOutput,
        points: questions.points,
      })
      .from(questions)
      .where(eq(questions.id, 1))
      .limit(1);

    if (!question) {
      throw new Error("Question with ID 1 not found");
    }

    if (!question.solutionQuery) {
      throw new Error("Question solution query is missing");
    }

    if (!question.expectedOutput) {
      throw new Error("Question expected output is missing");
    }

    const result = await evaluateSql("SELECT * FROM employees", {
      solution_query: question.solutionQuery,
      expected_output: question.expectedOutput,
      points: question.points,
    });

    console.log("Evaluation result:", result);
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await db.$client.end();
  }
}

test();
