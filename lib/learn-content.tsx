import type { ReactNode } from "react";
import Link from "next/link";
import { CodeExample } from "@/components/learn/code-example";

export interface LearnSection {
  id: string;
  title: string;
  content: ReactNode;
}

export interface LearnArticleContent {
  sections: LearnSection[];
  takeaways: string[];
}

const ComparisonTable = ({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: string[][];
}) => (
  <div className="my-6 overflow-x-auto rounded-xl border border-border">
    <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
      <caption className="sr-only">{caption}</caption>
      <thead className="bg-muted/60 text-foreground">
        <tr>{headers.map((header) => <th key={header} scope="col" className="border-b border-border px-4 py-3 font-semibold">{header}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row[0]}-${index}`} className="align-top odd:bg-background even:bg-muted/20">
            {row.map((cell, cellIndex) => cellIndex === 0
              ? <th key={cellIndex} scope="row" className="border-b border-border px-4 py-3 font-medium">{cell}</th>
              : <td key={cellIndex} className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Note = ({ children }: { children: ReactNode }) => (
  <aside className="my-6 rounded-r-lg border-l-4 border-primary bg-primary/5 px-4 py-3 text-sm leading-6 text-foreground">
    {children}
  </aside>
);

export const learnContent: Record<string, LearnArticleContent> = {
  "mongodb-basics-for-beginners": {
    takeaways: ["MongoDB stores BSON documents inside collections, which are grouped into databases.", "Documents can contain nested objects and arrays; documents in one collection can differ, unless validation rules constrain them.", "Plan document shape around access patterns instead of treating MongoDB as a table database with different syntax."],
    sections: [
      { id: "what-is-mongodb", title: "What is MongoDB?", content: <><p>MongoDB is a document-oriented database. Its basic stored record is a document made of field and value pairs. Documents are stored as BSON, a binary-encoded serialization format with additional types beyond JSON.</p><p>A MongoDB database contains collections, and a collection contains documents. This is a useful mental model for getting started: database → collection → document. It is similar only as an organizational analogy to schema → table → row; the models have different capabilities and design choices.</p><p>See the official <a href="https://www.mongodb.com/docs/manual/introduction/" rel="noreferrer">MongoDB introduction</a> and <a href="https://www.mongodb.com/docs/manual/core/document/" rel="noreferrer">document model documentation</a>.</p></> },
      { id: "document-example", title: "What does a document look like?", content: <><p>This student document has scalar fields, a nested object, and an array:</p><CodeExample label="A student document" language="javascript" code={`{
  _id: ObjectId("..."),
  name: "Rahul",
  course: "BCA",
  semester: 3,
  contact: { city: "Pune" },
  subjects: ["DBMS", "Programming"]
}`} /><p>MongoDB adds an <code>_id</code> value when a document is inserted without one. A BSON document can include types such as dates and object identifiers in addition to JSON-like strings, numbers, arrays, and nested objects.</p></> },
      { id: "collections", title: "Databases, collections, and schema flexibility", content: <><p>Collections group documents that are commonly queried together. Unlike a relational table, a collection does not require every document to have exactly the same fields. That flexibility is optional in practice: MongoDB supports schema validation rules when an application needs the database to reject documents outside a chosen structure.</p><p>Flexible schema does not mean “no design.” Inconsistent field names or types can make application code and queries harder to reason about. Keep field meanings consistent and add validation for important rules.</p></> },
      { id: "when-use", title: "When can a document model be useful?", content: <><p>Consider a document model when related data is often read together and a nested representation matches the way the application uses it. A product with a small set of specifications, for example, can store those specifications as a nested object. When records have many independently changing relationships or cross-entity queries, a relational model may be a better fit.</p><p>Read <Link href="/Learn/mongodb-data-modeling-basics">MongoDB data modeling basics</Link>, compare <Link href="/Learn/sql-vs-nosql">SQL and NoSQL</Link>, then practice in the <Link href="/lab/mongodb">MongoDB lab</Link>.</p><p>For a guided reference, start with MongoDB’s official <a href="https://www.mongodb.com/docs/manual/core/databases-and-collections/" rel="noreferrer">databases and collections guide</a>.</p></> },
    ],
  },
  "mongodb-crud-operations": {
    takeaways: ["CRUD means create, read, update, and delete documents.", "MongoDB write operations are atomic for one document; a multi-document workflow may need a transaction or a different design.", "Use precise filters for updates and deletes, and inspect matched or deleted counts."],
    sections: [
      { id: "collection", title: "Start with a students collection", content: <><p>The examples below use <code>mongosh</code> syntax and assume a collection named <code>students</code>. Each command targets that collection. MongoDB creates a collection as needed when you first write to it.</p><p>These are MongoDB Query API examples, not JavaScript driver code. The syntax is suitable for practice in the <Link href="/lab/mongodb">MongoDB interactive lab</Link>.</p></> },
      { id: "create-read", title: "Create and read documents", content: <><p><code>insertOne()</code> adds one document. <code>find()</code> returns documents that match the filter; an empty filter matches all documents.</p><CodeExample label="Insert one student" language="javascript" code={`db.students.insertOne({
  name: "Rahul",
  course: "BCA",
  semester: 3
});`} /><CodeExample label="Find BCA students" language="javascript" code={`db.students.find({
  course: "BCA"
  });`} /><p>To return only selected fields, pass a projection as the second argument: <code>db.students.find(&#123; course: &quot;BCA&quot; &#125;, &#123; name: 1, semester: 1, _id: 0 &#125;)</code>. In a projection, inclusion and exclusion generally cannot be mixed except for <code>_id</code>.</p></> },
      { id: "update", title: "Update a document safely", content: <><p><code>updateOne()</code> updates the first document matching its filter. The <code>$set</code> operator changes named fields while leaving other fields in place.</p><CodeExample label="Move Rahul to semester four" language="javascript" code={`db.students.updateOne(
  { name: "Rahul" },
  { $set: { semester: 4 } }
);`} /><p>Check the returned <code>matchedCount</code> and <code>modifiedCount</code> in application code. If names are not unique, filter by a stable identifier such as <code>_id</code> to avoid changing an unintended document.</p></> },
      { id: "delete", title: "Delete a document", content: <><p><code>deleteOne()</code> removes the first document matching its filter. A narrow filter is essential because an overly broad filter may remove the wrong record.</p><CodeExample label="Delete Rahul by name" language="javascript" code={`db.students.deleteOne({
  name: "Rahul"
});`} /><p>In production, prefer a stable unique filter and verify the returned <code>deletedCount</code>. MongoDB documents that single-document writes are atomic; multi-document operations have different considerations. Read the official <a href="https://www.mongodb.com/docs/manual/crud/" rel="noreferrer">CRUD guide</a> and <a href="https://www.mongodb.com/docs/manual/core/write-operations-atomicity/" rel="noreferrer">atomicity documentation</a>.</p></> },
      { id: "next", title: "What to learn next", content: <><p>Once the four operations feel familiar, learn how nested documents represent related data and how aggregation stages transform query results. Continue with <Link href="/Learn/mongodb-data-modeling-basics">embed versus reference</Link> and <Link href="/Learn/mongodb-aggregation-pipeline">aggregation pipelines</Link>.</p></> },
    ],
  },
  "mongodb-data-modeling-basics": {
    takeaways: ["MongoDB models should follow the application's read and write patterns.", "Embedding can make related data available in one document, but repeated embedded data can become stale or grow without bound.", "References suit independently managed or large related records, though retrieving them may require additional queries or aggregation."],
    sections: [
      { id: "start-access-patterns", title: "Start with the questions your application asks", content: <><p>Before choosing fields, list the common reads and writes: which screen loads the data, what it needs at once, how often related records change, and whether a child record can grow indefinitely. In MongoDB, data accessed together is often a candidate to store together, but that is a design principle rather than a command to embed every relationship.</p><p>MongoDB’s official <a href="https://www.mongodb.com/docs/manual/data-modeling/" rel="noreferrer">data modeling guide</a> recommends considering application access patterns and supports both embedded documents and references.</p></> },
      { id: "embed", title: "When embedding fits", content: <><p>Suppose an order page always displays a small, fixed set of shipping-address fields that belong to that order. Embedding a snapshot can make that page’s data available with the order:</p><CodeExample label="Order with an embedded shipping address" language="javascript" code={`{
  _id: ObjectId("..."),
  customerId: ObjectId("..."),
  status: "packed",
  shippingAddress: {
    city: "Pune",
    postalCode: "411001"
  }
}`} /><p>Embedding is less suitable for an unbounded array, such as every event ever recorded for a user. Large, frequently changing embedded records can create document growth and update coordination concerns. Store a limited recent subset or separate records when that better matches the access pattern.</p></> },
      { id: "reference", title: "When references fit", content: <><p>Use references when related data has an independent lifecycle, is shared by many parent records, or can grow large. For example, many orders may refer to one customer by identifier rather than copying the customer profile into every order.</p><CodeExample label="Order referencing a customer" language="javascript" code={`{
  _id: ObjectId("..."),
  customerId: ObjectId("..."),
  items: [{ sku: "DBMS-101", quantity: 1 }]
}`} /><p>A reference does not behave exactly like a relational foreign key by itself. Your application or query must resolve the related customer, and integrity rules may need to be enforced by application logic.</p></> },
      { id: "choose", title: "A practical decision checklist", content: <><ComparisonTable caption="MongoDB embedding and reference trade-offs" headers={["Question", "Embedding", "Referencing"]} rows={[["Are the values read together?", "Often useful when a parent and a small related value are returned together.", "Useful when related data is fetched independently or conditionally."],["Can the related set grow without a clear bound?", "Avoid an unbounded embedded array.", "Often easier to manage independently growing records."],["Is the data shared by many parents?", "Copies may need coordinated updates.", "One referenced record can be reused."],["Where is integrity enforced?", "Within the document and optional validation rules.", "Application logic or explicit query workflows often coordinate related records."]]}/><p>Prototype representative queries and update operations before committing to a model. Continue with <Link href="/Learn/mongodb-basics-for-beginners">MongoDB documents and collections</Link> or compare <Link href="/Learn/mongodb-vs-mysql">MongoDB and MySQL</Link>.</p></> },
    ],
  },
  "mongodb-aggregation-pipeline": {
    takeaways: ["An aggregation pipeline sends documents through an ordered sequence of stages.", "$match filters, $group calculates one result per group, and $sort orders the resulting documents.", "An aggregation usually returns results without changing source documents, unless a pipeline includes $merge or $out."],
    sections: [
      { id: "what-is-pipeline", title: "What is an aggregation pipeline?", content: <><p>An aggregation pipeline processes documents through stages. A stage may filter documents, reshape fields, split array values, group records, or sort results. Each stage passes its output to the next one.</p><p>The example below counts students by course. It is written for <code>mongosh</code> and assumes documents contain a <code>course</code> field.</p></> },
      { id: "example", title: "Count students by course", content: <><CodeExample label="Group and sort students" language="javascript" code={`db.students.aggregate([
  { $match: { semester: { $gte: 1 } } },
  {
    $group: {
      _id: "$course",
      studentCount: { $sum: 1 }
    }
  },
  { $sort: { studentCount: -1 } }
]);`} /><p><code>$match</code> keeps documents whose semester is at least one. <code>$group</code> creates one output document for each distinct course and uses <code>$sum: 1</code> to count each input document. <code>$sort</code> orders the groups by count, largest first.</p><p>For course documents with missing <code>course</code>, the group key may be <code>null</code>. Add a filter if those documents should be excluded.</p></> },
      { id: "common-stages", title: "Common stages and their purpose", content: <ComparisonTable caption="Common MongoDB aggregation pipeline stages" headers={["Stage", "Purpose", "Typical use"]} rows={[["$match", "Filter documents using query conditions.", "Limit processing to one course or date range."],["$project", "Include, exclude, or calculate output fields.", "Return only the fields needed by the next stage."],["$group", "Group documents by a key and calculate accumulators.", "Count students or total order amounts."],["$sort", "Order documents by one or more fields.", "Show highest counts first."],["$limit", "Keep only the first N documents.", "Return the top results after sorting."]]}/> },
      { id: "side-effects", title: "Does aggregation change stored data?", content: <><p>Most aggregation pipelines return computed results without modifying their source documents. The <code>$merge</code> and <code>$out</code> stages can write pipeline results to a collection, so review a pipeline before adding either stage.</p><p>Try the <Link href="/lab/mongodb">MongoDB practice lab</Link> and read MongoDB’s official <a href="https://www.mongodb.com/docs/manual/aggregation/" rel="noreferrer">aggregation operations guide</a>.</p></> },
    ],
  },
  "sql-basics-for-beginners": {
    takeaways: ["SQL is used to define, read, and change data in relational databases.", "A SELECT query names the columns and table before filtering or sorting rows.", "GROUP BY summarizes rows; WHERE filters rows before grouping."],
    sections: [
      {
        id: "what-is-sql",
        title: "What is SQL?",
        content: <><p>SQL (Structured Query Language) is a language used to work with relational databases. You can use it to define tables, add or update records, and ask questions about stored data. MySQL and PostgreSQL both support SQL, although exact syntax and features can vary by database.</p><p>A database stores organized data; a database management system (DBMS) is the software that stores, retrieves, and manages it. SQL is the way an application or person can express many of those operations.</p></>,
      },
      {
        id: "read-rows",
        title: "Read rows with SELECT",
        content: <><p>Start with the columns you want, then name the table after <code>FROM</code>. In the sample <code>employees</code> table, this query returns two columns for every row:</p><CodeExample label="Select two columns" code={`SELECT name, department\nFROM employees;`} /><p>Use <code>WHERE</code> to keep only rows that match a condition. Use <code>ORDER BY</code> to sort results. Add <code>DESC</code> for descending order.</p><CodeExample label="Filter and sort employees" code={`SELECT name, salary\nFROM employees\nWHERE department = 'Sales'\nORDER BY salary DESC;`} /><Note>SQL keywords are often written in uppercase for readability. Most database systems accept lowercase keywords too; consistent formatting matters more than capitalization.</Note></>,
      },
      {
        id: "summarize-data",
        title: "Summarize rows with GROUP BY",
        content: <><p>Aggregate functions such as <code>COUNT</code>, <code>AVG</code>, and <code>SUM</code> calculate a value across multiple rows. <code>GROUP BY</code> asks for one result per group.</p><CodeExample label="Count employees by department" code={`SELECT department, COUNT(*) AS employee_count\nFROM employees\nGROUP BY department\nORDER BY employee_count DESC;`} /><p>Every selected expression must either be part of the grouping or be aggregated. The exact rules can differ between database engines, so check the documentation for the system you use.</p></>,
      },
      {
        id: "next-steps",
        title: "A good order for learning SQL",
        content: <><ol className="list-decimal space-y-2 pl-6"><li>Read a table with <code>SELECT</code> and choose columns.</li><li>Filter and sort with <code>WHERE</code> and <code>ORDER BY</code>.</li><li>Summarize with aggregate functions and <code>GROUP BY</code>.</li><li>Connect related tables with joins, then practice changing data carefully.</li></ol><p>Continue with <Link href="/Learn/sql-commands-ddl-dml-dcl-tcl">SQL command groups</Link> or try the <Link href="/Learn/sql-practice-questions-beginners">beginner practice questions</Link>.</p></>,
      },
    ],
  },
  "dbms-vs-rdbms": {
    takeaways: ["DBMS is a broad term for software that manages databases.", "An RDBMS is a DBMS built around relational data and tables.", "The exact meaning of these labels can vary in introductory course material."],
    sections: [
      { id: "terms", title: "What do DBMS and RDBMS mean?", content: <><p>A database management system (DBMS) is software that lets people and applications create, read, update, and manage stored data. The term is broad: it can describe systems built around different data models.</p><p>A relational database management system (RDBMS) stores data in relations, commonly presented as tables of rows and columns. It supports relationships between tables and usually provides constraints and a query language such as SQL.</p><Note>An RDBMS is a kind of DBMS. In textbooks, “DBMS” is sometimes used more narrowly to mean a non-relational system, so check how your course defines the term.</Note></> },
      { id: "comparison", title: "The practical difference", content: <ComparisonTable caption="DBMS and RDBMS concepts" headers={["Question", "DBMS (broad term)", "RDBMS"]} rows={[["Data model", "May use different models, depending on the product.", "Relational model: data is organized into tables and related by values."],["Relationships", "Capabilities depend on the model and system.", "Relationships are commonly represented with keys and joins."],["Rules", "Validation and transaction features vary by product.", "Constraints can enforce rules such as uniqueness and references."],["Examples", "A broad category that includes relational and non-relational systems.", "MySQL and PostgreSQL are relational database systems."]]}/> },
      { id: "choose", title: "When is a relational system useful?", content: <><p>Relational tables are a strong fit when records have clear attributes and relationships, such as students and course enrollments or customers and orders. Keys and constraints help protect those relationships while multiple users update data.</p><p>Other data models can fit workloads where records vary in shape or are usually read as nested documents. This is not a simple “old versus new” choice; model the data and access patterns before choosing a product. See <Link href="/Learn/sql-vs-nosql">SQL vs NoSQL</Link> and the <Link href="/Learn/database-comparison-guide">database comparison guide</Link>.</p></> },
    ],
  },
  "sql-vs-nosql": {
    takeaways: ["SQL is a query language; NoSQL is a broad label for several non-relational database models.", "Relational and non-relational systems both have trade-offs around data shape, relationships, and operations.", "Choose based on the application’s data and queries, not a universal performance claim."],
    sections: [
      { id: "not-apples", title: "SQL and NoSQL are not the same kind of term", content: <><p>SQL names a language used with relational databases. NoSQL is an umbrella term commonly used for non-relational databases, including document, key-value, graph, and wide-column systems. Comparing them directly can be misleading: one is a language, while the other describes a broad group of data models.</p><p>Many relational databases use SQL. Non-relational products often have their own query APIs or languages. Some products also support SQL-like interfaces, so labels alone do not tell you everything about how data is queried.</p></> },
      { id: "tradeoffs", title: "Compare the data model and workload", content: <ComparisonTable caption="Relational and non-relational database considerations" headers={["Consideration", "Relational database", "Non-relational database"]} rows={[["Data shape", "Tables with defined columns and rows.", "Depends on the model; documents can hold nested fields."],["Relationships", "Foreign keys and joins are common tools.", "May use embedded data, references, graph edges, or other structures."],["Schema", "A table definition describes columns and types.", "Schema flexibility varies; some systems also support validation."],["Transactions", "Available in mainstream relational systems; behavior depends on the product.", "Capabilities vary by system and deployment. Some support multi-record transactions."],["Good first question", "Are entities and relationships central to the application?", "Do access patterns benefit from another model or data shape?"]]}/> },
      { id: "choose-model", title: "How to choose without guessing", content: <><ol className="list-decimal space-y-2 pl-6"><li>List the entities and relationships your app must preserve.</li><li>Write down the important reads and writes, including how much data each query needs.</li><li>Check transaction, consistency, backup, hosting, and team requirements.</li><li>Prototype representative queries and measure them on realistic data.</li></ol><p>A non-relational database is not automatically faster or easier to scale, and relational systems are not limited to small applications. See <Link href="/Learn/mongodb-vs-mysql">MongoDB vs MySQL</Link> and the <Link href="/Learn/database-comparison-guide">database comparison guide</Link> for more specific questions.</p></> },
    ],
  },
  "mysql-vs-postgresql": {
    takeaways: ["Both MySQL and PostgreSQL are mature relational database systems that support SQL.", "Differences depend on the version, configuration, managed service, and workload.", "Test compatibility and operations needs rather than choosing from a blanket ranking."],
    sections: [
      { id: "shared-ground", title: "What they have in common", content: <><p>MySQL and PostgreSQL both store relational data, support SQL queries, and provide transactions, indexes, constraints, and tools for production applications. Both are widely used. For a student learning SQL, the core ideas—tables, keys, filters, joins, and aggregates—transfer between them.</p><p>The syntax is not identical in every area. When moving an application, check the exact versions and SQL features it uses instead of assuming every query behaves the same.</p></> },
      { id: "differences", title: "A useful comparison checklist", content: <><ComparisonTable caption="MySQL and PostgreSQL comparison questions" headers={["Area", "MySQL", "PostgreSQL"]} rows={[["JSON", "MySQL provides a JSON data type. Check its functions and indexing against your query needs.", "PostgreSQL provides json and jsonb types with different storage and query behavior."],["SQL features", "Check the functions, constraints, indexes, and syntax available in the version you plan to run.", "Check the functions, constraints, indexes, and syntax available in the version you plan to run."],["Compatibility", "Check application drivers, hosting options, supported versions, and operational tooling.", "Check application drivers, extensions, hosting options, supported versions, and operational tooling."]]}/><p>These are comparison points, not a complete feature ranking. Validate the exact versions and workload before deciding.</p></> },
      { id: "decision", title: "Which one should a beginner choose?", content: <><p>If you are learning, choose the database required by your course, project, or workplace. The concepts matter more than memorizing brand-specific commands first. If you are selecting for an application, compare deployment support, required features, team familiarity, and representative workload tests.</p><p>Do not treat a feature table as a speed ranking. Query performance depends on schema design, indexes, configuration, hardware, and workload. Check the <a href="https://dev.mysql.com/doc/refman/8.4/en/" rel="noreferrer">MySQL Reference Manual</a>, its <a href="https://dev.mysql.com/doc/refman/8.4/en/json.html" rel="noreferrer">JSON type reference</a>, and the <a href="https://www.postgresql.org/docs/current/" rel="noreferrer">PostgreSQL documentation</a> including its <a href="https://www.postgresql.org/docs/current/datatype-json.html" rel="noreferrer">JSON types reference</a> for the versions you plan to use.</p></> },
    ],
  },
  "mongodb-vs-mysql": {
    takeaways: ["MongoDB stores BSON documents in collections; MySQL organizes relational data in tables.", "Both systems support indexes and transactions, but their data models and transaction behavior differ.", "MySQL's JSON support does not make it a document database, and MongoDB can enforce validation rules."],
    sections: [
      { id: "models", title: "Documents and relational tables", content: <><p>MongoDB stores records as BSON documents inside collections. Documents can contain nested values, and a collection does not require every document to have identical fields. MongoDB also supports schema validation when an application needs explicit rules.</p><p>MySQL organizes relational records into tables with defined columns. Related records are commonly connected with primary and foreign keys and queried with joins. MySQL also supports a JSON data type, but storing JSON in a relational table does not change the overall relational model.</p></> },
      { id: "tradeoffs", title: "Compare how the application uses its data", content: <ComparisonTable caption="MongoDB and MySQL data model comparison" headers={["Question", "MongoDB", "MySQL"]} rows={[["How is a record shaped?", "A document can contain nested fields and arrays.", "A row contains values for the table's columns; JSON values are also supported."],["How are relationships represented?", "Applications may embed data or store references, based on access patterns.", "Relationships are often modeled with keys and joined when queried."],["Can data be validated?", "Yes. Flexible document structure can be combined with schema validation.", "Column types and constraints enforce rules at the table level."],["Are transactions available?", "Yes, with deployment requirements for multi-document transactions.", "InnoDB supports transactions; check the selected engine and configuration."]]}/> },
      { id: "choose", title: "Which model fits?", content: <><p>Consider a document model when an object is commonly read and written as a whole and nested fields fit the application. Consider relational tables when entities have important relationships, cross-entity queries, and integrity rules that you want the database to enforce.</p><p>Both products support transactions, but their scope and deployment requirements differ. MongoDB multi-document transactions require a replica set or sharded cluster; they are not available on standalone deployments. MySQL transactions depend on the selected storage engine, with InnoDB commonly used for transactional tables. Check the official <a href="https://www.mongodb.com/docs/manual/data-modeling/" rel="noreferrer">MongoDB data modeling guide</a>, <a href="https://www.mongodb.com/docs/manual/core/transactions-operations/" rel="noreferrer">MongoDB transaction requirements</a>, and <a href="https://dev.mysql.com/doc/refman/8.4/en/innodb-storage-engine.html" rel="noreferrer">MySQL InnoDB documentation</a>. For SQL practice, continue with <Link href="/Learn/primary-key-vs-foreign-key">primary and foreign keys</Link> or the <Link href="/Learn/sql-joins-explained">SQL joins guide</Link>.</p></> },
    ],
  },
  "mongodb-vs-postgresql": {
    takeaways: ["MongoDB is document-oriented; PostgreSQL is relational and also provides JSON and JSONB types.", "PostgreSQL JSON support does not make its relational model identical to MongoDB's document model.", "Compare relationships, validation, query patterns, transactions, hosting, and team experience for the actual application."],
    sections: [
      { id: "model-difference", title: "A document database and a relational database", content: <><p>MongoDB stores BSON documents in collections and lets documents include nested objects and arrays. PostgreSQL stores relational data in tables, with keys and joins for relationships; it also supports JSON and JSONB values within that relational system.</p><p>JSON is a data format, not a database model. PostgreSQL’s JSON types are useful for semi-structured fields, while the surrounding database remains relational. MongoDB’s model makes the document the main unit of storage and query.</p></> },
      { id: "comparison", title: "Compare the things your application needs", content: <ComparisonTable caption="MongoDB and PostgreSQL comparison considerations" headers={["Area", "MongoDB", "PostgreSQL"]} rows={[["Primary data model", "BSON documents in collections; fields may be nested.", "Relational tables; JSON and JSONB types can store document-shaped values."],["Relationships", "Embed or reference data according to access patterns; aggregation can combine collections.", "Use keys and joins to represent and query relationships."],["Schema rules", "Flexible document shape, with optional schema validation.", "Table definitions and constraints enforce relational structure; JSON fields can handle variable shapes."],["Query interface", "MongoDB Query API for filters, updates, and aggregation pipelines.", "SQL for relational queries, plus JSON operators and functions."],["Best first test", "Can the documents match common reads and writes without unbounded growth?", "Do relationships, constraints, and SQL queries fit the application?"],["Transactions", "Supports transactions, with deployment and operation considerations.", "Supports transactions; verify isolation and behavior for the selected version and workload."]]}/> },
      { id: "jsonb", title: "How should I think about PostgreSQL JSONB?", content: <><p><code>jsonb</code> stores JSON data in a decomposed binary form that supports PostgreSQL JSON operators and indexing options. It is useful when an application has a relational core plus attributes whose shape varies. It does not remove the need to choose between relational columns and JSON fields, or make every query faster by default.</p><p>MongoDB and PostgreSQL both need thoughtful schema design. The difference is where the document or relational model sits at the center of the system. Check the official <a href="https://www.postgresql.org/docs/current/datatype-json.html" rel="noreferrer">PostgreSQL JSON documentation</a> and <a href="https://www.mongodb.com/docs/manual/data-modeling/" rel="noreferrer">MongoDB data modeling guide</a>.</p></> },
      { id: "choose", title: "Which should you choose?", content: <><p>Start by sketching the data, relationships, and queries the application must support. Prefer PostgreSQL when relational integrity and joins are central or the team already works comfortably with SQL. Consider MongoDB when the document shape naturally matches common application reads and the team wants to work directly with nested records.</p><p>Both can support varied application needs. Benchmark representative queries, test schema changes, and review deployment requirements before deciding. Continue with <Link href="/Learn/mongodb-data-modeling-basics">MongoDB data modeling</Link>, <Link href="/Learn/mysql-vs-postgresql">MySQL vs PostgreSQL</Link>, or the <Link href="/Learn/database-comparison-guide">database comparison guide</Link>.</p></> },
    ],
  },
  "database-comparison-guide": {
    takeaways: ["Compare database models before comparing brand names.", "Use real query patterns, integrity needs, and operational constraints to guide the choice.", "Benchmark a representative workload instead of relying on universal performance claims."],
    sections: [
      { id: "start-with-model", title: "Start with the data model", content: <><p>Write down the main entities in your application and how they relate. If the application has students, courses, and enrollments, the relationships are central and a relational model may be natural. If records have nested fields and are usually accessed together, a document model may be worth evaluating.</p><p>Then ask what rules must always hold. Examples include a unique student identifier, an enrollment that references an existing course, or a document that must contain a valid status.</p></> },
      { id: "checklist", title: "A five-part comparison checklist", content: <ComparisonTable caption="Questions for comparing database systems" headers={["Area", "Questions to answer"]} rows={[["Data shape", "Are records uniform? Are nested values or relationships central?"],["Queries", "Which reads and writes are most common? Which joins, filters, and aggregates are needed?"],["Correctness", "Which constraints and multi-record updates must remain consistent?"],["Operations", "What backup, recovery, hosting, upgrades, monitoring, and security controls are available?"],["Team and ecosystem", "Which drivers, frameworks, skills, and support options fit the project?"]]}/> },
      { id: "test", title: "Test the workload you actually have", content: <><p>Create a small prototype using representative data and the queries that matter. Measure response time, throughput, storage, and the effort needed to keep the system healthy. Results from one schema or machine do not establish that a product is universally faster.</p><p>For model-level comparisons, read <Link href="/Learn/sql-vs-nosql">SQL vs NoSQL</Link> and <Link href="/Learn/mongodb-vs-mysql">MongoDB vs MySQL</Link>. For two relational products, compare <Link href="/Learn/mysql-vs-postgresql">MySQL and PostgreSQL</Link> against the application’s requirements.</p></> },
    ],
  },
  "sql-commands-ddl-dml-dcl-tcl": {
    takeaways: ["DDL defines database objects; DML reads or changes data.", "DCL and TCL are common teaching categories, but exact support and syntax vary by product.", "Some courses classify SELECT as DQL, while others include it under DML."],
    sections: [
      { id: "ddl", title: "DDL: define database objects", content: <><p>Data Definition Language (DDL) is the common classroom label for statements that create or change structures such as tables. Typical examples are <code>CREATE</code>, <code>ALTER</code>, and <code>DROP</code>.</p><CodeExample label="Create a table" code={`CREATE TABLE departments (\n  department_id INTEGER PRIMARY KEY,\n  department_name VARCHAR(100) NOT NULL\n);`} /></> },
      { id: "dml", title: "DML: read and change rows", content: <><p>Data Manipulation Language (DML) is commonly used for statements that work with table data. <code>INSERT</code>, <code>UPDATE</code>, and <code>DELETE</code> change rows. <code>SELECT</code> reads rows; many courses group it as DML, while some call it Data Query Language (DQL).</p><CodeExample label="Add one row" code={`INSERT INTO departments (department_id, department_name)\nVALUES (10, 'Computer Science');`} /><p>Before running <code>UPDATE</code> or <code>DELETE</code>, check the condition in the <code>WHERE</code> clause so the statement targets the intended rows.</p></> },
      { id: "dcl-tcl", title: "DCL and TCL: permissions and transactions", content: <><p>Data Control Language (DCL) is often taught through permission statements such as <code>GRANT</code> and <code>REVOKE</code>. Transaction Control Language (TCL) commonly includes <code>COMMIT</code>, <code>ROLLBACK</code>, and savepoints.</p><p>Transaction syntax and which statements can be rolled back vary across database products and engines. Check the documentation for your database before relying on a statement’s transaction behavior.</p><CodeExample label="Transaction outline" code={`START TRANSACTION;\nUPDATE accounts SET balance = balance - 500 WHERE account_id = 1;\nUPDATE accounts SET balance = balance + 500 WHERE account_id = 2;\nCOMMIT;`} /></> },
      { id: "remember", title: "A quick way to remember the groups", content: <ComparisonTable caption="Common SQL command groupings" headers={["Group", "Purpose", "Examples"]} rows={[["DDL", "Define or change structures", "CREATE, ALTER, DROP"],["DML", "Read or change table data", "SELECT, INSERT, UPDATE, DELETE"],["DCL", "Manage access", "GRANT, REVOKE"],["TCL", "Manage transaction boundaries", "COMMIT, ROLLBACK, SAVEPOINT"]]}/> },
    ],
  },
  "sql-joins-explained": {
    takeaways: ["A join combines rows using a relationship between tables.", "INNER JOIN returns matching pairs; LEFT JOIN keeps every row from the left side.", "A join condition should match the intended key columns."],
    sections: [
      { id: "why-join", title: "Why join tables?", content: <><p>Relational data is often split across tables to avoid repeating the same facts. A <code>customers</code> table might store customer names while an <code>orders</code> table stores each purchase and the customer identifier. A join lets one query read related values together.</p><p>In the examples, <code>orders.customer_id</code> refers to <code>customers.customer_id</code>. The names are illustrative; use the actual table and column names from your database.</p></> },
      { id: "inner-left", title: "INNER JOIN and LEFT JOIN", content: <><p><code>INNER JOIN</code> returns only pairs that match the <code>ON</code> condition. <code>LEFT JOIN</code> returns every row from the left table and matching rows from the right; when there is no match, right-side columns are <code>NULL</code>.</p><CodeExample label="Orders with customer names" code={`SELECT customers.customer_name, orders.order_date\nFROM customers\nINNER JOIN orders\n  ON orders.customer_id = customers.customer_id;`} /><CodeExample label="Keep customers with no orders" code={`SELECT customers.customer_name, orders.order_date\nFROM customers\nLEFT JOIN orders\n  ON orders.customer_id = customers.customer_id;`} /></> },
      { id: "avoid-duplicates", title: "Check row counts and duplicates", content: <><p>If one customer has several orders, the customer name appears once per matching order. That is expected: joins produce matching row combinations, not automatically one row per customer.</p><p>Use an aggregate such as <code>COUNT(orders.order_id)</code> with a suitable <code>GROUP BY</code> when you want one summary row per customer. Avoid adding <code>DISTINCT</code> just to hide duplicates until you understand why the join created them.</p><p>Review <Link href="/Learn/primary-key-vs-foreign-key">primary and foreign keys</Link>, then try the <Link href="/Learn/sql-practice-questions-beginners">practice questions</Link>.</p></> },
    ],
  },
  "primary-key-vs-foreign-key": {
    takeaways: ["A primary key identifies a row within its table.", "A foreign key requires referenced values to exist in a related table, subject to the constraint definition.", "A foreign key can reference a unique candidate key, not only a column named id."],
    sections: [
      { id: "primary-key", title: "What is a primary key?", content: <p>A primary key is a column or group of columns that uniquely identifies each row in a table. Primary key values must be unique and cannot be <code>NULL</code>. A key can be a generated number, a stable natural value, or a combination of columns, depending on the data.</p> },
      { id: "foreign-key", title: "What is a foreign key?", content: <p>A foreign key is a constraint that links a column (or group of columns) in one table to a primary key or other unique key in another table. It prevents a row from referring to a parent value that does not exist, unless the constraint is configured or deferred in a way that changes when it is checked.</p> },
      { id: "example", title: "A department and employee example", content: <><CodeExample label="Define related tables" code={`CREATE TABLE departments (\n  department_id INTEGER PRIMARY KEY,\n  department_name VARCHAR(100) NOT NULL\n);\n\nCREATE TABLE employees (\n  employee_id INTEGER PRIMARY KEY,\n  employee_name VARCHAR(100) NOT NULL,\n  department_id INTEGER,\n  FOREIGN KEY (department_id)\n    REFERENCES departments (department_id)\n);`} /><p><code>departments.department_id</code> identifies each department. <code>employees.department_id</code> references it, so multiple employees can belong to one department. If the relationship is optional, the foreign key column may allow <code>NULL</code>; check the table definition and database behavior.</p><p>Keys also provide the join condition used in the <Link href="/Learn/sql-joins-explained">SQL joins guide</Link>.</p></> },
    ],
  },
  "database-normalization-explained": {
    takeaways: ["Normalization organizes relational data to reduce avoidable repetition and update anomalies.", "First, second, and third normal form address different kinds of structure and dependency.", "Normalization is a design tool; measure before denormalizing for a particular workload."],
    sections: [
      { id: "why-normalize", title: "Why normalize data?", content: <><p>Suppose an order table repeats a customer’s address on every order. If the address changes, several rows may need updating. If only some rows are changed, the database can contain contradictory values. This is an update anomaly caused by storing the same fact repeatedly.</p><p>Normalization is a set of design principles for placing facts in appropriate tables and connecting them with keys. It helps reduce certain forms of duplication, but it does not automatically make every query faster or every schema easier to use.</p></> },
      { id: "normal-forms", title: "A beginner view of the first three normal forms", content: <ComparisonTable caption="Beginner summary of database normal forms" headers={["Normal form", "Simplified idea", "Example question"]} rows={[["First normal form (1NF)", "Each field holds a single value for the chosen model, and rows can be identified.", "Did we put a comma-separated list of phone numbers in one cell?"],["Second normal form (2NF)", "A non-key attribute depends on the whole candidate key, not just part of a composite key.", "In a student-course table, does a student name depend only on student_id?"],["Third normal form (3NF)", "Non-key attributes depend on the key, the whole key, and nothing but the key (informally stated).", "Is a department name stored repeatedly on employee rows even though it depends on department_id?"]]}/> },
      { id: "split-tables", title: "Split repeated facts and connect them with keys", content: <><p>For the employee example, keep department facts in a <code>departments</code> table and store its identifier on the employee row. The department name is then maintained once, and a foreign key can protect the relationship.</p><p>Use <Link href="/Learn/primary-key-vs-foreign-key">primary and foreign keys</Link> to connect the tables, and <Link href="/Learn/sql-joins-explained">joins</Link> to retrieve related facts together. Denormalization can be useful for measured workloads, but it adds consistency work that should be deliberate.</p></> },
    ],
  },
  "sql-practice-questions-beginners": {
    takeaways: ["Start by identifying the output columns and source table.", "Use WHERE for row conditions and GROUP BY for summaries.", "Check NULL with IS NULL, not with = NULL."],
    sections: [
      { id: "schema", title: "Example table for these questions", content: <><p>Assume an <code>employees</code> table with <code>employee_id</code>, <code>employee_name</code>, <code>department</code>, <code>salary</code>, and an optional <code>manager_id</code>. The examples use common SQL syntax; type names and features can differ by database.</p><p>Try each question before opening its answer. The answers use only the columns listed above.</p></> },
      { id: "questions", title: "Four beginner SQL questions", content: <ol className="list-decimal space-y-3 pl-6"><li>Return the names of all employees in the Sales department.</li><li>Return employee names and salaries for employees earning at least 75,000, highest salary first.</li><li>Show the average salary for each department.</li><li>Find employees who do not have a manager recorded.</li></ol> },
      { id: "solutions", title: "Worked answers", content: <div className="space-y-4"><details className="rounded-lg border border-border p-4"><summary className="cursor-pointer font-semibold">Answer 1: filter one department</summary><CodeExample label="Sales employees" code={`SELECT employee_name\nFROM employees\nWHERE department = 'Sales';`} /></details><details className="rounded-lg border border-border p-4"><summary className="cursor-pointer font-semibold">Answer 2: filter and sort salaries</summary><CodeExample label="Employees earning at least 75,000" code={`SELECT employee_name, salary\nFROM employees\nWHERE salary >= 75000\nORDER BY salary DESC;`} /></details><details className="rounded-lg border border-border p-4"><summary className="cursor-pointer font-semibold">Answer 3: average by department</summary><CodeExample label="Average salary by department" code={`SELECT department, AVG(salary) AS average_salary\nFROM employees\nGROUP BY department;`} /></details><details className="rounded-lg border border-border p-4"><summary className="cursor-pointer font-semibold">Answer 4: find a missing manager</summary><CodeExample label="Employees without a manager" code={`SELECT employee_name\nFROM employees\nWHERE manager_id IS NULL;`} /></details><p><code>NULL</code> represents missing or unknown data, so compare it with <code>IS NULL</code> rather than <code>= NULL</code>. For more practice, open the <Link href="/lab/sql">interactive SQL lab</Link>.</p></div> },
    ],
  },
};
