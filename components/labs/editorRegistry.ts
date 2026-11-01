import type { ComponentType } from "react";
import type { LabSlug } from "@/lib/labs/lab-config";
import type { QueryResult } from "@/components/labs/testCase";
import CodeEditor from "@/components/labs/codeEditor";
import MongoEditor from "@/components/labs/editors/MongoEditor";
import SqlResults from "@/components/labs/results/SqlResults";
import MongoResults from "@/components/labs/results/MongoResults";

type EditorProps = {
  initialQuery: string;
  onRunQuery?: (query: string) => void | Promise<void>;
  isRunning?: boolean;
};
type ResultsProps = { queryResult?: QueryResult | null; isRunning?: boolean };
export const editorRegistry: Record<
  LabSlug,
  { Editor: ComponentType<EditorProps>; Results: ComponentType<ResultsProps> }
> = {
  sql: { Editor: CodeEditor, Results: SqlResults },
  mongodb: { Editor: MongoEditor, Results: MongoResults },
};
