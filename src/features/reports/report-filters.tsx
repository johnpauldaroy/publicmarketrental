import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface ReportFiltersProps {
  values: {
    dateFrom: string;
    dateTo: string;
    section: string;
    paymentStatus: string;
  };
  sections: string[];
  onChange: (field: "dateFrom" | "dateTo" | "section" | "paymentStatus", value: string) => void;
  onGenerate: () => void;
}

export function ReportFilters({ values, sections, onChange, onGenerate }: ReportFiltersProps) {
  return (
    <Card className="print:hidden">
      <CardHeader>
        <CardTitle>Report filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date from</label>
            <Input onChange={(event) => onChange("dateFrom", event.target.value)} type="date" value={values.dateFrom} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date to</label>
            <Input onChange={(event) => onChange("dateTo", event.target.value)} type="date" value={values.dateTo} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Section</label>
            <Select onChange={(event) => onChange("section", event.target.value)} value={values.section}>
              <option>All sections</option>
              {sections.map((section) => (
                <option key={section}>{section}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Payment status</label>
            <Select onChange={(event) => onChange("paymentStatus", event.target.value)} value={values.paymentStatus}>
              <option>Any status</option>
              <option>Paid</option>
              <option>Partial</option>
              <option>Overdue</option>
            </Select>
          </div>
          <div className="flex items-end gap-3">
            <Button className="flex-1" onClick={onGenerate} type="button" variant="secondary">
              Generate report
            </Button>
            <Button onClick={() => window.print()} type="button" variant="outline">
              Print report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
