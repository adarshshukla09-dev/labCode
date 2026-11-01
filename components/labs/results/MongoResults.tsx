"use client";

import QueryResultPanel, { type QueryResult } from "@/components/labs/testCase";
export default function MongoResults(props: {
  queryResult?: QueryResult | null;
  isRunning?: boolean;
}) {
  return <QueryResultPanel {...props} lab="mongodb" />;
}
