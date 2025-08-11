import PolicyOverview from "@/components/organisms/policy/PolicyOverview";
import PolicyTable from "@/components/organisms/policy/PolicyTable";

interface PolicyTemplateProps{
  policyRules: any
  groupedPolicyRules: any
}
export default function PolicyTemplate({policyRules, groupedPolicyRules}: PolicyTemplateProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Hệ thống chính sách và quy định
        </h1>
        <p className="text-gray-600 text-center">
          Quản lý các quy tắc điểm số và bồi thường cho khách hàng và nhà thiết
          kế
        </p>
      </div>

      <PolicyOverview rules={policyRules} />

      <div className="space-y-8">
        {Object.entries(groupedPolicyRules).map(([benefitType, rules]) => (
          <PolicyTable
            key={benefitType}
            benefitType={benefitType}
            rules={rules}
          />
        ))}
      </div>
    </div>
  );
}
