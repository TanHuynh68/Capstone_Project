/**
 * v0 by Vercel.
 * @see https://v0.dev/t/wtbEA3INZI8
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"

export default function PaymentFailed() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-8 px-4 md:px-6">
      <div className="bg-background rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center justify-center gap-4">
          <CircleIcon className="text-red-500 w-12 h-12" />
          <h1 className="text-2xl font-bold">Payment Failed</h1>
          <p className="text-muted-foreground">
            There was an issue processing your payment. Please try again or contact support for assistance.
          </p>
        </div>
        {/* <Separator className="my-6" /> */}
        {/* <div className="grid gap-4">
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <p className="text-muted-foreground">Order #</p>
            <p>12345</p>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <p className="text-muted-foreground">Total</p>
            <p>$99.99</p>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <p className="text-muted-foreground">Payment Method</p>
            <p>Visa ending in 1234</p>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-2">
            <p className="text-muted-foreground">Delivery</p>
            <p>Standard Shipping</p>
          </div>
        </div> */}
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

function CircleIcon(props: any) {
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
    </svg>
  )
}