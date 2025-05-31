import { Check, X } from "lucide-react"
import { passwordCriteria } from "@/schemas/registerSchema"

interface PasswordStrengthMeterProps {
  password: string
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null

  const getPasswordStrength = () => {
    return passwordCriteria.filter((c) => c.test(password)).length
  }

  const passwordStrength = getPasswordStrength()
  const strengthPercentage = (passwordStrength / passwordCriteria.length) * 100

  return (
    <div className="mt-2 space-y-2">
      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full ${
            passwordStrength <= 1 ? "bg-red-500" : passwordStrength <= 3 ? "bg-yellow-500" : "bg-green-500"
          }`}
          style={{ width: `${strengthPercentage}%` }}
        />
      </div>
      <ul className="space-y-1 text-xs">
        {passwordCriteria.map((criterion) => (
          <li key={criterion.id} className="flex items-center">
            {criterion.test(password) ? (
              <Check className="mr-2 h-3 w-3 text-green-500" />
            ) : (
              <X className="mr-2 h-3 w-3 text-red-500" />
            )}
            <span className={criterion.test(password) ? "text-green-700" : "text-gray-500"}>{criterion.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
