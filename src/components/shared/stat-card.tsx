import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MetricCardData } from "@/types/domain";

export function StatCard({ metric }: { metric: MetricCardData }) {
  const Icon =
    metric.tone === "positive"
      ? ArrowUpRight
      : metric.tone === "warning"
        ? ArrowDownRight
        : Minus;

  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
        <CardTitle className="text-3xl">{metric.value}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span>{metric.delta}</span>
      </CardContent>
    </Card>
  );
}
