/**
 * v0 by Vercel.
 * @see https://v0.dev/t/IcZyb9fQCyd
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Separator } from "@/components/ui/separator"
import { formatCurrencyVND } from "@/components/utils";
import { Link } from "react-router-dom"

export default function PaymentSuccess() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const depositMoney = urlParams.get('depositMoney');
  const vnp_TransactionNo = urlParams.get('vnp_TransactionNo');
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-8 px-4 md:px-6">
      <div className="bg-background rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center justify-center gap-4">
          <CircleCheckIcon className="text-green-500 w-12 h-12" />
          <h1 className="text-2xl font-bold">Payment Successful</h1>
          <p className="text-muted-foreground">Thank you for your purchase! Your order is being processed.</p>
        </div>
        <Separator className="my-6" />
        <div className="grid gap-4">
          {
            vnp_TransactionNo ? <div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                <p className="text-muted-foreground">Transaction No #</p>
                <p>{vnp_TransactionNo}</p>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                <p className="text-muted-foreground">Total</p>
                <p>{formatCurrencyVND(parseInt(depositMoney + '') || 0)}</p>
              </div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                <p className="text-muted-foreground">Payment Method</p>
                <p>VNPay</p>
              </div>
            </div> :
            <div>
               <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                <p className="text-muted-foreground">Payment Method</p>
                <p>PayOs</p>
              </div>
            </div>
          }
        </div>
        <Separator className="my-6" />
        <div className="flex justify-center">
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

function CircleCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}