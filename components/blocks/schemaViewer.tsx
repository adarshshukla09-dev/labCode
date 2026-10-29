"use client";

import { useState } from "react";

interface TableSchema {
  name: string;
  description: string;
  rowCount: string;
  columns?: { name: string; type: string; constraints?: string }[];
}

interface Relationship {
  from: string;
  to: string;
  type: string;
  description: string;
}

const tables: TableSchema[] = [
  {
    name: "users",
    description: "Stores information about users/customers",
    rowCount: "15 rows",
    columns: [
      { name: "id", type: "INTEGER", constraints: "PRIMARY KEY" },
      { name: "name", type: "VARCHAR(100)" },
      { name: "email", type: "VARCHAR(100)", constraints: "UNIQUE" },
      { name: "status", type: "VARCHAR(20)" },
    ],
  },
  {
    name: "departments",
    description: "Company departments for organizing employees",
    rowCount: "5 rows",
    columns: [
      { name: "id", type: "INTEGER", constraints: "PRIMARY KEY" },
      { name: "name", type: "VARCHAR(100)" },
    ],
  },
  {
    name: "employees",
    description: "Company employees with manager hierarchy",
    rowCount: "10 rows",
    columns: [
      { name: "id", type: "INTEGER", constraints: "PRIMARY KEY" },
      { name: "name", type: "VARCHAR(100)" },
      { name: "department_id", type: "INTEGER", constraints: "FOREIGN KEY" },
      { name: "manager_id", type: "INTEGER", constraints: "FOREIGN KEY" },
    ],
  },
  {
    name: "categories",
    description: "Product categories for organizing products",
    rowCount: "6 rows",
    columns: [
      { name: "id", type: "INTEGER", constraints: "PRIMARY KEY" },
      { name: "name", type: "VARCHAR(100)" },
    ],
  },
  {
    name: "suppliers",
    description: "Product suppliers and vendors",
    rowCount: "5 rows",
    columns: [
      { name: "id", type: "INTEGER", constraints: "PRIMARY KEY" },
      { name: "supplier_name", type: "VARCHAR(100)" },
    ],
  },
  {
    name: "products",
    description: "Product catalog with pricing and inventory",
    rowCount: "20 rows",
    columns: [
      { name: "id", type: "INTEGER", constraints: "PRIMARY KEY" },
      { name: "title", type: "VARCHAR(150)" },
      { name: "category_id", type: "INTEGER", constraints: "FOREIGN KEY" },
      { name: "supplier_id", type: "INTEGER", constraints: "FOREIGN KEY" },
      { name: "price", type: "DECIMAL(10,2)" },
    ],
  },
  {
    name: "orders",
    description: "Customer orders linking users and products",
    rowCount: "25 rows",
    columns: [
      { name: "id", type: "INTEGER", constraints: "PRIMARY KEY" },
      { name: "user_id", type: "INTEGER", constraints: "FOREIGN KEY" },
      { name: "product_id", type: "INTEGER", constraints: "FOREIGN KEY" },
      { name: "order_date", type: "DATE" },
    ],
  },
  {
    name: "reviews",
    description: "Product reviews from customers",
    rowCount: "12 rows",
    columns: [
      { name: "id", type: "INTEGER", constraints: "PRIMARY KEY" },
      { name: "product_id", type: "INTEGER", constraints: "FOREIGN KEY" },
      { name: "user_id", type: "INTEGER", constraints: "FOREIGN KEY" },
      { name: "rating", type: "INTEGER" },
    ],
  },
];

const relationships: Relationship[] = [
  { from: "employees", to: "departments", type: "many-to-one", description: "Each employee works in one department" },
  { from: "employees", to: "employees", type: "self-reference", description: "Each employee may report to a manager" },
  { from: "products", to: "categories", type: "many-to-one", description: "Each product belongs to one category" },
  { from: "products", to: "suppliers", type: "many-to-one", description: "Each product is supplied by one supplier" },
  { from: "orders", to: "users", type: "many-to-one", description: "Each order is placed by one user" },
  { from: "orders", to: "products", type: "many-to-one", description: "Each order contains one product" },
  { from: "reviews", to: "products", type: "many-to-one", description: "Each review is for one product" },
  { from: "reviews", to: "users", type: "many-to-one", description: "Each review is written by one user" },
];

export default function SchemaViewer() {
  const [expandedTables, setExpandedTables] = useState<string[]>([]);

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableName)
        ? prev.filter((t) => t !== tableName)
        : [...prev, tableName]
    );
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-card text-card-foreground border border-border rounded-xl">
      {/* Header */}
      <div className="border-b border-border px-5 py-4 bg-muted/40">
        <h3 className="font-heading font-semibold text-base text-foreground">Database Schema</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Explore the tables and their structure</p>
      </div>

      {/* Content scroll area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Tables List */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Tables</h4>
          
          <div className="grid grid-cols-1 gap-2.5">
            {tables.map((table) => {
              const isExpanded = expandedTables.includes(table.name);

              return (
                <div
                  key={table.name}
                  className="rounded-lg border border-border bg-background transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleTable(table.name)}
                    className="flex w-full items-center justify-between p-3.5 text-left transition-colors hover:bg-muted/30"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-medium text-sm text-foreground">
                          {table.name}
                        </span>
                        <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {table.rowCount}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{table.description}</p>
                    </div>

                    <span
                      className={`text-muted-foreground transition-transform duration-200 text-xs ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {/* Expandable Columns Structure */}
                  {isExpanded && table.columns && (
                    <div className="border-t border-border bg-muted/20 p-3 space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Columns
                      </p>
                      <div className="space-y-1">
                        {table.columns.map((col) => (
                          <div
                            key={col.name}
                            className="flex items-center justify-between text-xs py-1 px-2 rounded bg-background border border-border/60"
                          >
                            <span className="font-mono text-foreground">{col.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-muted-foreground text-[11px]">{col.type}</span>
                              {col.constraints && (
                                <span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-medium">
                                  {col.constraints}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Relationships Section */}
        <div className="space-y-3 pt-2 border-t border-border">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Table Relationships
          </h4>

          <div className="grid grid-cols-1 gap-2">
            {relationships.map((rel, index) => (
              <div
                key={index}
                className="flex flex-col gap-1 rounded-lg border border-border bg-background p-3 text-xs"
              >
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-semibold text-foreground">{rel.from}</span>
                  <span className="text-primary font-bold">→</span>
                  <span className="font-semibold text-foreground">{rel.to}</span>
                  <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-sans">
                    {rel.type}
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px]">{rel.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}