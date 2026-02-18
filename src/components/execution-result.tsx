import type { ExecutionResult } from "@/types/recommendations";

interface Props {
  result: ExecutionResult;
}

export function ExecutionResultPanel({ result }: Props) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        result.success
          ? "border-emerald-500/30 bg-emerald-500/10"
          : "border-red-500/30 bg-red-500/10"
      }`}
    >
      <p
        className={`text-sm font-medium ${
          result.success ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
        }`}
      >
        {result.success ? "Execution Successful" : "Execution Failed"}
      </p>
      {result.error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-mono">{result.error}</p>
      )}
      {result.data && (
        <details className="mt-2">
          <summary className="text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)]">
            View response data
          </summary>
          <pre className="mt-2 text-xs font-mono bg-gray-900 text-gray-100 rounded p-3 overflow-auto max-h-64 border border-[var(--border-primary)]">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
