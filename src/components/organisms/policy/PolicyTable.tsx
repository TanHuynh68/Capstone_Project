import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScoreDisplay from "@/components/atoms/policy/ScoreDisplay";
import CompensationDisplay from "@/components/atoms/policy/CompensationDisplay";

interface PolicyTableProps {
  category: PolicyCategory;
}

export default function PolicyTable({ category }: PolicyTableProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="text-xl font-bold text-center text-primary">
          {category.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 w-full">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[400px] font-semibold">
                  Tình huống
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Điểm KH
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Điểm NTK
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Bồi thường KH
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Bồi thường NTK
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {category.rules.map((rule) => (
                <TableRow key={rule.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{rule.scenario}</TableCell>
                  <TableCell className="text-center">
                    <ScoreDisplay score={rule.customerScore} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ScoreDisplay score={rule.designerScore} />
                  </TableCell>
                  <TableCell className="text-center">
                    <CompensationDisplay amount={rule.customerCompensation} />
                  </TableCell>
                  <TableCell className="text-center">
                    <CompensationDisplay amount={rule.designCompensation} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
