import PolicyTemplate from "@/components/templates/policy/PolicyTemplate";
import BenefitService from "@/services/BenefitService";
import { useEffect, useState } from "react";

const PolicyPage = () => {
  const { getBenefits } = BenefitService();
  const [data, setData] = useState<PolicyCategory[]>([]);
  const [groupedPolicyRules, setGroupedPolicyRules] = useState(null);

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    const response = await getBenefits({
      title: "",
      page: 1,
      size: 30,
    });
    setData(response.responseRequestModel.responseList.items);
    const groupPolicy =  response.responseRequestModel.responseList.items.reduce(
        (acc: any, rule: any) => {
          if (!acc[rule.benefitType]) {
            acc[rule.benefitType] = [];
          }
          acc[rule.benefitType].push(rule);
          return acc;
        },
        {} as Record<string, PolicyRule[]>
      );
      setGroupedPolicyRules(groupPolicy)
  };

  return (
    <PolicyTemplate
      policyRules={data}
      groupedPolicyRules={groupedPolicyRules || null}
    />
  );
};
export default PolicyPage;
