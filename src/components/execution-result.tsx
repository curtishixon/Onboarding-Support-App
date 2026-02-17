import type { ExecutionResult } from "@/types/recommendations";

interface Props {
  result: ExecutionResult;
}

export function ExecutionResultPanel({ result }: Props) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        result.success
          ? "border-green-200 bg-green-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      <p
        className={`text-sm font-medium ${
          result.success ? "text-green-800" : "text-red-800"
        }`}
      >
        {result.success ? "Execution Successful" : "Execution Failed"}
      </p>
      {result.error && (
        <p className="mt-2 text-sm text-red-700 font-mono">{result.error}</p>
      )}
      {result.data && (
        <details className="mt-2">
          <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
            View response data
          </summary>
          <pre className="mt-2 text-xs font-mono bg-white rounded p-3 overflow-auto max-h-64 border">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
