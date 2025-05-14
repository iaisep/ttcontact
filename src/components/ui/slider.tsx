
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
  valueTransform?: (value: number) => number; // Optional function to transform value before sending to server
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  ExtendedSliderProps
>(({ className, onMouseEnter, onMouseLeave, agentId, fieldName, debounceMs = 500, valueTransform, ...props }, ref) => {
  const { fetchWithAuth } = useApiContext();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [pendingValue, setPendingValue] = React.useState<number[]>(props.defaultValue || [0]);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Clean up function for the debounce timer
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle local value change without triggering API calls immediately
  const handleValueChange = React.useCallback((values: number[]) => {
    setPendingValue(values);
    
    // Always call the original onValueChange with the current values
    props.onValueChange?.(values);
    
    // Only setup debounce if not dragging (for keyboard navigation or programmatic changes)
    if (!isDragging && agentId && fieldName) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        updateServerValue(values);
      }, debounceMs);
    }
  }, [isDragging, agentId, fieldName, props.onValueChange, debounceMs]);

  // Function to update server value
  const updateServerValue = React.useCallback(async (values: number[]) => {
    if (!agentId || !fieldName) return;
    
    setIsUpdating(true);
    try {
      // Apply value transformation if provided
      const value = values[0];
      const transformedValue = valueTransform ? valueTransform(value) : value;
      
      const payload = { [fieldName]: transformedValue };
      console.log(`Updating agent ${agentId} field ${fieldName} with value: ${value} -> transformed to: ${transformedValue}`);
      
      await fetchWithAuth(`/update-agent/${agentId}`, {
        method: 'PATCH',
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
  }, [agentId, fieldName, fetchWithAuth, valueTransform]);

  // When user starts dragging
  const handleDragStart = React.useCallback(() => {
    setIsDragging(true);
    // Clear any pending update
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  // When user stops dragging
  const handleDragEnd = React.useCallback(() => {
    setIsDragging(false);
    
    // Now update the server with the final value
    if (agentId && fieldName) {
      updateServerValue(pendingValue);
    }
  }, [agentId, fieldName, pendingValue, updateServerValue]);

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
      onPointerDown={handleDragStart}
      onPointerUp={handleDragEnd}
      value={pendingValue}
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
