import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScoreDisplay from "@/components/atoms/policy/ScoreDisplay";
import CompensationDisplay from "@/components/atoms/policy/CompensationDisplay";
import { Calendar, Hash } from "lucide-react";

interface PolicyTableProps {
  benefitType: string;
  rules: any;
}

const getBenefitTypeColor = (type: string) => {
  switch (type) {
    case "General":
      return "bg-gray-100 text-gray-800";
    case "Delivery":
      return "bg-blue-100 text-blue-800";
    case "OrderAndProgress":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getBenefitTypeName = (type: string) => {
  switch (type) {
    case "General":
      return "Chính sách chung";
    case "Delivery":
      return "Chính sách giao hàng";
    case "OrderAndProgress":
      return "Chính sách đơn hàng và tiến độ";
    default:
      return type;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function PolicyTable({ benefitType, rules }: PolicyTableProps) {
  return (
    <Card className="mb-8 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="text-xl font-bold text-center text-primary flex items-center justify-center gap-2">
          <Hash className="h-5 w-5" />
          {getBenefitTypeName(benefitType)}
          <Badge
            variant="secondary"
            className={getBenefitTypeColor(benefitType)}
          >
            {rules.length} quy tắc
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[50px] font-semibold text-center">
                  #
                </TableHead>
                <TableHead className="w-[350px] font-semibold">
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
                <TableHead className="w-[100px] font-semibold text-center">
                  Phiên bản
                </TableHead>
                <TableHead className="w-[150px] font-semibold text-center">
                  Ngày tạo
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule: any, index: any) => (
                <TableRow key={rule.benefitID} className="hover:bg-muted/30">
                  <TableCell className="text-center font-medium text-gray-500">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="max-w-[330px]">
                      <p className="text-sm leading-relaxed">
                        {rule.title.trim()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <ScoreDisplay score={rule.customerScoreChange} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ScoreDisplay score={rule.designerScoreChange} />
                  </TableCell>
                  <TableCell className="text-center">
                    <CompensationDisplay
                      amount={rule.customerCompensationRate}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <CompensationDisplay
                      amount={rule.designerCompensationRate}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">
                      v{rule.version}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span className="font-mono">
                        {formatDate(rule.createdAt)}
                      </span>
                    </div>
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
