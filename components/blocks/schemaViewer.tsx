"use client";

import { LabSlug } from "@/lib/labs/lab-config";
import { useState } from "react";

export interface SchemaColumn {
  name: string;
  type: string;
  constraints?: string;
}

export interface TableSchema {
  name: string;
  description: string;
  rowCount: string | number;
  columns: SchemaColumn[];
}

export interface Relationship {
  from: string;
  to: string;
  type: string;
  description: string;
}

const sqlTables: TableSchema[] = [
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

const sqlRelationships: Relationship[] = [
  {
    from: "employees",
    to: "departments",
    type: "many-to-one",
    description: "Each employee works in one department",
  },
  {
    from: "employees",
    to: "employees",
    type: "self-reference",
    description: "Each employee may report to a manager",
  },
  {
    from: "products",
    to: "categories",
    type: "many-to-one",
    description: "Each product belongs to one category",
  },
  {
    from: "products",
    to: "suppliers",
    type: "many-to-one",
    description: "Each product is supplied by one supplier",
  },
  {
    from: "orders",
    to: "users",
    type: "many-to-one",
    description: "Each order is placed by one user",
  },
  {
    from: "orders",
    to: "products",
    type: "many-to-one",
    description: "Each order contains one product",
  },
  {
    from: "reviews",
    to: "products",
    type: "many-to-one",
    description: "Each review is for one product",
  },
  {
    from: "reviews",
    to: "users",
    type: "many-to-one",
    description: "Each review is written by one user",
  },
];

export const mongoTables: TableSchema[] = [
  {
    name: "categories",
    description: "Product categories and their parent categories",
    rowCount: 9,
    columns: [
      { name: "_id", type: "ObjectId", constraints: "PRIMARY KEY" },
      { name: "id", type: "Number", constraints: "UNIQUE, REQUIRED" },
      { name: "name", type: "String", constraints: "UNIQUE, REQUIRED" },
      { name: "parent_id", type: "Number" },
      { name: "description", type: "String" },
    ],
  },
  {
    name: "customers",
    description: "Customer information and referral details",
    rowCount: 21,
    columns: [
      { name: "_id", type: "ObjectId", constraints: "PRIMARY KEY" },
      { name: "id", type: "Number", constraints: "UNIQUE, REQUIRED" },
      { name: "first_name", type: "String", constraints: "REQUIRED" },
      { name: "last_name", type: "String", constraints: "REQUIRED" },
      { name: "email", type: "String", constraints: "UNIQUE" },
      { name: "city", type: "String" },
      { name: "country", type: "String", constraints: "REQUIRED" },
      { name: "signup_date", type: "String", constraints: "REQUIRED" },
      { name: "referred_by", type: "Number" },
    ],
  },
  {
    name: "departments",
    description: "Company departments and their regional budgets",
    rowCount: 9,
    columns: [
      { name: "_id", type: "ObjectId", constraints: "PRIMARY KEY" },
      { name: "id", type: "Number", constraints: "UNIQUE, REQUIRED" },
      { name: "name", type: "String", constraints: "UNIQUE, REQUIRED" },
      { name: "region_id", type: "Number" },
      {
        name: "budget_cents",
        type: "Number",
        constraints: "MIN: 0, DEFAULT: 0",
      },
    ],
  },
  {
    name: "employees",
    description: "Employees, department assignments and manager hierarchy",
    rowCount: 28,
    columns: [
      { name: "_id", type: "ObjectId", constraints: "PRIMARY KEY" },
      { name: "id", type: "Number", constraints: "UNIQUE, REQUIRED" },
      { name: "first_name", type: "String", constraints: "REQUIRED" },
      { name: "last_name", type: "String", constraints: "REQUIRED" },
      { name: "email", type: "String", constraints: "UNIQUE" },
      { name: "department_id", type: "Number" },
      { name: "manager_id", type: "Number" },
      { name: "job_title", type: "String", constraints: "REQUIRED" },
      { name: "salary_cents", type: "Number", constraints: "MIN: 0, REQUIRED" },
      {
        name: "commission_cents",
        type: "Number",
        constraints: "DEFAULT: null",
      },
      { name: "hire_date", type: "String", constraints: "REQUIRED" },
      { name: "birth_date", type: "String" },
      {
        name: "employment_status",
        type: "String",
        constraints: "Active | On Leave | Terminated",
      },
    ],
  },
  {
    name: "orders",
    description: "Customer orders and shipping information",
    rowCount: 25,
    columns: [
      { name: "_id", type: "ObjectId", constraints: "PRIMARY KEY" },
      { name: "id", type: "Number", constraints: "UNIQUE, REQUIRED" },
      { name: "customer_id", type: "Number", constraints: "REQUIRED" },
      { name: "employee_id", type: "Number" },
      { name: "order_date", type: "String", constraints: "REQUIRED" },
      { name: "shipped_date", type: "String" },
      {
        name: "status",
        type: "String",
        constraints: "Pending | Processing | Shipped | Delivered | Cancelled",
      },
      { name: "ship_city", type: "String" },
      { name: "ship_country", type: "String" },
      { name: "notes", type: "String" },
    ],
  },
  {
    name: "order_items",
    description: "Products, quantities and pricing within each order",
    rowCount: 43,
    columns: [
      { name: "_id", type: "ObjectId", constraints: "PRIMARY KEY" },
      { name: "id", type: "Number", constraints: "UNIQUE, REQUIRED" },
      { name: "order_id", type: "Number", constraints: "REQUIRED" },
      { name: "product_id", type: "Number", constraints: "REQUIRED" },
      { name: "quantity", type: "Number", constraints: "MIN: 1, REQUIRED" },
      {
        name: "unit_price_cents",
        type: "Number",
        constraints: "MIN: 0, REQUIRED",
      },
      {
        name: "discount_percent",
        type: "Number",
        constraints: "MIN: 0, MAX: 100",
      },
    ],
  },
  {
    name: "products",
    description: "Product catalog, pricing and inventory",
    rowCount: 20,
    columns: [
      { name: "_id", type: "ObjectId", constraints: "PRIMARY KEY" },
      { name: "id", type: "Number", constraints: "UNIQUE, REQUIRED" },
      { name: "product_name", type: "String", constraints: "REQUIRED" },
      { name: "category_id", type: "Number" },
      {
        name: "unit_price_cents",
        type: "Number",
        constraints: "MIN: 0, REQUIRED",
      },
      { name: "stock_quantity", type: "Number", constraints: "MIN: 0" },
      { name: "discontinued", type: "Number", constraints: "0 | 1" },
      { name: "created_date", type: "String", constraints: "REQUIRED" },
    ],
  },
  {
    name: "regions",
    description: "Business regions",
    rowCount: 4,
    columns: [
      { name: "_id", type: "ObjectId", constraints: "PRIMARY KEY" },
      { name: "id", type: "Number", constraints: "UNIQUE, REQUIRED" },
      { name: "region_name", type: "String", constraints: "UNIQUE, REQUIRED" },
    ],
  },
];

export const mongoRelationships: Relationship[] = [
  {
    from: "categories",
    to: "categories",
    type: "self-reference",
    description: "A category may have a parent category through parent_id",
  },
  {
    from: "departments",
    to: "regions",
    type: "reference",
    description: "Departments are associated with regions through region_id",
  },
  {
    from: "employees",
    to: "departments",
    type: "reference",
    description: "Employees are assigned to departments through department_id",
  },
  {
    from: "employees",
    to: "employees",
    type: "self-reference",
    description: "Employees may report to another employee through manager_id",
  },
  {
    from: "orders",
    to: "customers",
    type: "reference",
    description: "Orders belong to customers through customer_id",
  },
  {
    from: "orders",
    to: "employees",
    type: "reference",
    description: "Orders may be associated with employees through employee_id",
  },
  {
    from: "order_items",
    to: "orders",
    type: "reference",
    description: "Order items belong to orders through order_id",
  },
  {
    from: "order_items",
    to: "products",
    type: "reference",
    description: "Order items reference products through product_id",
  },
  {
    from: "products",
    to: "categories",
    type: "reference",
    description: "Products may belong to categories through category_id",
  },
];

interface SchemaViewerProps {
  slug: LabSlug | string;
}

export default function SchemaViewer({ slug }: SchemaViewerProps) {
  const [expandedTables, setExpandedTables] = useState<string[]>([]);

  const isMongoDB = slug === "mongodb";

  const tables = isMongoDB ? mongoTables : sqlTables;
  const relationships = isMongoDB ? mongoRelationships : sqlRelationships;

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableName)
        ? prev.filter((t) => t !== tableName)
        : [...prev, tableName],
    );
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
      <div className="border-b border-border bg-muted/40 px-5 py-4">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Database Schema
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Explore{" "}
          {isMongoDB ? "collections and documents" : "tables and columns"}
        </p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {isMongoDB ? "Collections" : "Tables"}
          </h4>

          <div className="grid grid-cols-1 gap-2.5">
            {tables.map((table) => {
              const isExpanded = expandedTables.includes(table.name);

              return (
                <div
                  key={table.name}
                  className="overflow-hidden rounded-lg border border-border bg-background"
                >
                  <button
                    type="button"
                    onClick={() => toggleTable(table.name)}
                    className="flex w-full items-center justify-between p-3.5 text-left hover:bg-muted/30"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm font-medium">
                          {table.name}
                        </span>

                        <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                          {table.rowCount} {isMongoDB ? "documents" : "rows"}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {table.description}
                      </p>
                    </div>

                    <span
                      className={`text-xs text-muted-foreground transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="space-y-2 border-t border-border bg-muted/25 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {isMongoDB ? "Document Fields" : "Columns"}
                      </p>

                      {table.columns.map((col) => (
                        <div
                          key={col.name}
                          className="flex items-center justify-between gap-2 rounded border border-border/60 bg-background px-2 py-1.5 text-xs"
                        >
                          <span className="font-mono">{col.name}</span>

                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {col.type}
                            </span>

                            {col.constraints && (
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                {col.constraints}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Relationships
          </h4>

          {relationships.map((rel, index) => (
            <div
              key={index}
              className="space-y-1 rounded-lg border border-border bg-background p-3 text-xs"
            >
              <div className="flex items-center gap-2 font-mono">
                <span className="font-semibold">{rel.from}</span>
                <span className="font-bold text-primary">→</span>
                <span className="font-semibold">{rel.to}</span>

                <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px]">
                  {rel.type}
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground">
                {rel.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
