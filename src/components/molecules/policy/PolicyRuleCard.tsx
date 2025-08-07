import { Card, CardContent } from "@/components/ui/card";
import ScoreDisplay from "@/components/atoms/policy/ScoreDisplay";
import CompensationDisplay from "@/components/atoms/policy/CompensationDisplay";

interface PolicyRuleCardProps {
  rule: PolicyRule;
}

export default function PolicyRuleCard({ rule }: PolicyRuleCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {rule.scenario}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {rule.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Điểm khách hàng
              </p>
              <ScoreDisplay score={rule.customerScore} />
            </div>

            <div className="text-center">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Điểm thiết kế
              </p>
              <ScoreDisplay score={rule.designerScore} />
            </div>

            <div className="text-center">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Bồi thường KH
              </p>
              <CompensationDisplay amount={rule.customerCompensation} />
            </div>

            <div className="text-center">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Bồi thường TK
              </p>
              <CompensationDisplay amount={rule.designCompensation} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
