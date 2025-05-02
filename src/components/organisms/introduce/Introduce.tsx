import First from "@/components/molecules/introduce/First"
import Fourth from "@/components/molecules/introduce/Fourth"
import Second from "@/components/molecules/introduce/Second"
import Third from "@/components/molecules/introduce/Third"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {  useState } from "react"

const Introduce = () => {
    const [component, setComponent] = useState(1)

    const handleChangeComponent = (number: number) => {
        setComponent(number)
    }
    return (
       <div className="mx-20">
         <div className="container mx-auto mt-10">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-11">
                    {
                        component === 1 && <First />
                    }
                    {
                        component === 2 && <Second />
                    }
                    {
                        component === 3 && <Third />

                    }
                    {
                        component === 4 && <Fourth />
                    }
                </div>
                <div className="col-span-1 flex items-center">
                    <RadioGroup defaultValue="1">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem onClick={() => handleChangeComponent(1)} value={'1'} id="r1" />
                            <Label htmlFor="r1"></Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem onClick={() => handleChangeComponent(2)} value="2" id="r2" />
                            <Label htmlFor="r2"></Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem onClick={() => handleChangeComponent(3)} value="3" id="r3" />
                            <Label htmlFor="r3"></Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem onClick={() => handleChangeComponent(4)} value="4" id="r4" />
                            <Label htmlFor="r4"></Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
        </div>
       </div>
    )
}

export default Introduce