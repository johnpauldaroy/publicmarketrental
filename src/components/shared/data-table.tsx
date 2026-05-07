import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { TableColumn, TableRow } from "@/types/domain";

interface DataTableProps {
  columns: TableColumn[];
  rows: TableRow[];
  caption?: string;
}

const statusVariantMap: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  Active: "success",
  Approved: "success",
  Assigned: "success",
  Available: "success",
  Occupied: "success",
  Paid: "success",
  Ready: "success",
  Reserved: "warning",
  Pending: "warning",
  Partial: "warning",
  Unpaid: "warning",
  "Under Review": "warning",
  Expiring: "warning",
  "Needs Resubmission": "destructive",
  Rejected: "destructive",
  Overdue: "destructive",
  Open: "destructive",
};

export function DataTable({ columns, rows, caption }: DataTableProps) {
  return (
    <Card>
      <CardContent className="overflow-x-auto p-0">
        <table className="min-w-full divide-y divide-border/80 text-left text-sm">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead className="bg-muted/60 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th className="px-6 py-4 font-semibold" key={column.key} scope="col">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((row, rowIndex) => (
              <tr className="hover:bg-muted/30" key={`${rowIndex}-${row[columns[0].key]}`}>
                {columns.map((column) => (
                  <td className="px-6 py-4 text-foreground" key={column.key}>
                    {renderCell(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function renderCell(value: string) {
  const variant = statusVariantMap[value];

  if (variant) {
    return <Badge variant={variant}>{value}</Badge>;
  }

  return <span>{value}</span>;
}
