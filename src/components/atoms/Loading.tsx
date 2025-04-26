
import * as React from "react"

import { Progress } from "@/components/ui/progress"

export function Loading() {
    const [progress, setProgress] = React.useState(13)

    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md text-center space-y-4">
                    <div>Loading ...</div>
                    <div>
                        <Progress value={progress} className="w-[60%] mx-auto" />
                    </div>
                </div>
            </div>

        </>
    )
}
