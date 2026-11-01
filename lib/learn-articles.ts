export type LearnCategory = "SQL Notes" | "Database Guides" | "MongoDB Guides" | "Comparisons" | "Practice";

export interface LearnArticleSummary {
  slug: string;
  title: string;
  description: string;
  summary: string;
  category: LearnCategory;
  related: string[];
}

export const learnArticles: LearnArticleSummary[] = [
  {
    slug: "mongodb-basics-for-beginners",
    title: "MongoDB Basics for Beginners: Documents and Collections",
    description: "Learn how MongoDB databases, collections, BSON documents, and the document model work with beginner-friendly examples.",
    summary: "Understand MongoDB’s document model, collections, BSON, and when a document database can fit an application.",
    category: "MongoDB Guides",
    related: ["mongodb-crud-operations", "mongodb-data-modeling-basics", "sql-vs-nosql"],
  },
  {
    slug: "mongodb-crud-operations",
    title: "MongoDB CRUD Operations Explained with Examples",
    description: "Learn to create, read, update, and delete MongoDB documents using insertOne, find, updateOne, and deleteOne.",
    summary: "Practice the four everyday MongoDB operations with consistent student collection examples.",
    category: "MongoDB Guides",
    related: ["mongodb-basics-for-beginners", "mongodb-aggregation-pipeline", "mongodb-data-modeling-basics"],
  },
  {
    slug: "mongodb-data-modeling-basics",
    title: "MongoDB Data Modeling Basics: Embed or Reference?",
    description: "Learn how to model MongoDB documents around access patterns and decide when to embed related data or use references.",
    summary: "Choose document shapes around the data your application reads and writes together.",
    category: "MongoDB Guides",
    related: ["mongodb-basics-for-beginners", "mongodb-vs-mysql", "mongodb-vs-postgresql"],
  },
  {
    slug: "mongodb-aggregation-pipeline",
    title: "MongoDB Aggregation Pipeline Explained",
    description: "Understand MongoDB aggregation stages such as $match, $group, and $sort with a beginner-friendly example.",
    summary: "Filter, group, and sort documents by passing results through aggregation stages.",
    category: "MongoDB Guides",
    related: ["mongodb-crud-operations", "mongodb-basics-for-beginners", "mongodb-vs-mysql"],
  },
  {
    slug: "sql-basics-for-beginners",
    title: "SQL Basics for Beginners",
    description: "Learn what SQL is and how SELECT, WHERE, ORDER BY, and GROUP BY work with clear beginner-friendly examples.",
    summary: "Start reading and writing queries with SELECT, filters, sorting, and simple summaries.",
    category: "SQL Notes",
    related: ["sql-commands-ddl-dml-dcl-tcl", "sql-joins-explained", "sql-practice-questions-beginners"],
  },
  {
    slug: "sql-commands-ddl-dml-dcl-tcl",
    title: "SQL Commands: DDL, DML, DCL, and TCL",
    description: "Understand the common SQL command groups—DDL, DML, DCL, and TCL—with examples and notes about dialect differences.",
    summary: "Understand the command groups used to define, change, secure, and manage transactions in a database.",
    category: "SQL Notes",
    related: ["sql-basics-for-beginners", "sql-joins-explained", "sql-practice-questions-beginners"],
  },
  {
    slug: "sql-joins-explained",
    title: "SQL Joins Explained with Examples",
    description: "Learn INNER JOIN and LEFT JOIN with small table examples, readable SQL, and guidance on NULL results.",
    summary: "Combine related rows from two tables and learn when INNER JOIN or LEFT JOIN fits.",
    category: "SQL Notes",
    related: ["sql-basics-for-beginners", "primary-key-vs-foreign-key", "sql-practice-questions-beginners"],
  },
  {
    slug: "primary-key-vs-foreign-key",
    title: "Primary Key vs Foreign Key",
    description: "Learn how primary keys identify rows and foreign keys connect tables, with practical SQL examples.",
    summary: "See how keys support row identity and relationships between tables.",
    category: "SQL Notes",
    related: ["sql-joins-explained", "database-normalization-explained", "sql-basics-for-beginners"],
  },
  {
    slug: "database-normalization-explained",
    title: "Database Normalization Explained",
    description: "Understand normalization, update anomalies, and the goals of first, second, and third normal form.",
    summary: "Use a simple order example to understand why relational data is split into related tables.",
    category: "SQL Notes",
    related: ["primary-key-vs-foreign-key", "dbms-vs-rdbms", "sql-joins-explained"],
  },
  {
    slug: "dbms-vs-rdbms",
    title: "DBMS vs RDBMS",
    description: "Compare database management systems and relational database systems, and understand the relationship between the terms.",
    summary: "Learn the broad meaning of DBMS and what makes a relational database system different.",
    category: "Database Guides",
    related: ["database-comparison-guide", "database-normalization-explained", "sql-vs-nosql"],
  },
  {
    slug: "database-comparison-guide",
    title: "How to Choose a Database: A Beginner’s Comparison Guide",
    description: "Compare database models by data shape, relationships, consistency needs, query patterns, and operational constraints.",
    summary: "A practical checklist for comparing databases without relying on blanket performance claims.",
    category: "Database Guides",
    related: ["sql-vs-nosql", "mysql-vs-postgresql", "mongodb-vs-mysql"],
  },
  {
    slug: "sql-vs-nosql",
    title: "SQL vs NoSQL: What Is the Difference?",
    description: "Understand relational databases and the broad NoSQL category, including data models, query approaches, and trade-offs.",
    summary: "First separate the SQL language from database models, then compare relational and non-relational systems.",
    category: "Comparisons",
    related: ["database-comparison-guide", "dbms-vs-rdbms", "mongodb-vs-mysql"],
  },
  {
    slug: "mysql-vs-postgresql",
    title: "MySQL vs PostgreSQL: How to Compare Them",
    description: "Compare MySQL and PostgreSQL by compatibility, data types, extensions, operations, and application requirements.",
    summary: "A balanced checklist for choosing between two widely used relational database systems.",
    category: "Comparisons",
    related: ["database-comparison-guide", "sql-vs-nosql", "sql-basics-for-beginners"],
  },
  {
    slug: "mongodb-vs-mysql",
    title: "MongoDB vs MySQL: Document or Relational Model?",
    description: "Compare MongoDB documents with MySQL relational tables, including schema choices, relationships, transactions, and use cases.",
    summary: "Choose a model by looking at how your application reads, writes, and relates its data.",
    category: "Comparisons",
    related: ["database-comparison-guide", "sql-vs-nosql", "primary-key-vs-foreign-key"],
  },
  {
    slug: "mongodb-vs-postgresql",
    title: "MongoDB vs PostgreSQL: Documents or Relational Data?",
    description: "Compare MongoDB and PostgreSQL by data model, query approach, relationships, transactions, JSON support, and operational needs.",
    summary: "Compare a document database with a relational system that also supports JSON data types.",
    category: "Comparisons",
    related: ["mongodb-data-modeling-basics", "mongodb-vs-mysql", "database-comparison-guide"],
  },
  {
    slug: "sql-practice-questions-beginners",
    title: "SQL Practice Questions for Beginners",
    description: "Practice SQL SELECT, WHERE, ORDER BY, GROUP BY, and NULL checks with beginner questions and worked answers.",
    summary: "Try short query exercises, reveal worked solutions, then continue practicing in the SQL lab.",
    category: "Practice",
    related: ["sql-basics-for-beginners", "sql-joins-explained", "sql-commands-ddl-dml-dcl-tcl"],
  },
];

export function getLearnArticle(slug: string) {
  return learnArticles.find((article) => article.slug === slug);
}
