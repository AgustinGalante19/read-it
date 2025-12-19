import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CircleAlert, Tablet } from "lucide-react"

export function EreaderWarning() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CircleAlert size={16} />
        </TooltipTrigger>
        <TooltipContent>
          <p className="flex items-center gap-1"><CircleAlert size={12} /> This statistic only works <br /> if you have an e-reader and the read-it plugin on it.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
