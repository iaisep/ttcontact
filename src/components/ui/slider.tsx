
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { useApiContext } from "@/context/ApiContext"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ExtendedSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  agentId?: string;       // Optional agent ID for auto-updating
  fieldName?: string;     // Field name to update (e.g., "responsiveness")
  debounceMs?: number;    // Debounce delay in milliseconds
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  ExtendedSliderProps
>(({ className, onMouseEnter, onMouseLeave, agentId, fieldName, debounceMs = 500, ...props }, ref) => {
  const { fetchWithAuth } = useApiContext();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleValueChange = React.useCallback((values: number[]) => {
    // Call the original onValueChange if it exists
    props.onValueChange?.(values);

    // If agent ID and field name are provided, update the agent
    if (agentId && fieldName) {
      // Clear any existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set a new timer for the API call
      debounceTimerRef.current = setTimeout(async () => {
        setIsUpdating(true);
        try {
          const payload = { [fieldName]: values[0] };
          console.log(`Updating agent ${agentId} with payload:`, payload);
          
          await fetchWithAuth(`/update-agent/${agentId}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
          });
          
          console.log(`Agent ${agentId} updated successfully`);
        } catch (error) {
          console.error(`Failed to update agent ${agentId}:`, error);
          toast.error(`Failed to update agent setting: ${fieldName}`);
        } finally {
          setIsUpdating(false);
          debounceTimerRef.current = null;
        }
      }, debounceMs);
    }
  }, [agentId, fieldName, fetchWithAuth, props.onValueChange, debounceMs]);

  React.useEffect(() => {
    // Clean up the timer when the component unmounts
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onValueChange={handleValueChange}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className={cn(
        "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        isUpdating && "opacity-50"
      )} />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
