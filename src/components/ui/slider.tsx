
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
  valueTransform?: (value: number) => number; // Transform value before sending to API
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  ExtendedSliderProps
>(({ className, onMouseEnter, onMouseLeave, agentId, fieldName, debounceMs = 500, valueTransform, ...props }, ref) => {
  const { fetchWithAuth } = useApiContext();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [pendingValue, setPendingValue] = React.useState<number[]>(props.defaultValue || props.value || [0]);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const initialDragValueRef = React.useRef<number[]>([]);
  
  // Clean up function for the debounce timer
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle value change when component receives new values from parent
  React.useEffect(() => {
    if (props.value && JSON.stringify(props.value) !== JSON.stringify(pendingValue)) {
      setPendingValue(props.value);
    }
  }, [props.value]);

  // Function to update server value - only called when dragging is complete
  const updateServerValue = React.useCallback(async (values: number[]) => {
    if (!agentId || !fieldName) return;
    if (isUpdating) return; // Prevent multiple simultaneous updates
    
    setIsUpdating(true);
    try {
      // Apply value transformation if provided (e.g., converting seconds to milliseconds)
      let valueToSend = values[0];
      if (valueTransform) {
        valueToSend = valueTransform(valueToSend);
      }
      
      const payload = { [fieldName]: valueToSend };
      console.log(`Updating agent ${agentId} with payload:`, payload);
      
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
    }
  }, [agentId, fieldName, fetchWithAuth, valueTransform, isUpdating]);

  // Handle local value change without API calls during drag
  const handleValueChange = React.useCallback((values: number[]) => {
    // Update local state regardless of drag state
    setPendingValue(values);
    
    // Always call the original onValueChange with the current values
    props.onValueChange?.(values);
    
    // Only setup debounce if NOT dragging AND we have agent/field info
    // This handles programmatic changes or keyboard navigation
    if (!isDragging && agentId && fieldName) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        updateServerValue(values);
      }, debounceMs);
    }
  }, [isDragging, agentId, fieldName, props.onValueChange, debounceMs, updateServerValue]);

  // When user starts dragging
  const handleDragStart = React.useCallback(() => {
    setIsDragging(true);
    initialDragValueRef.current = pendingValue;
    
    // Clear any pending update timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, [pendingValue]);

  // When user stops dragging
  const handleDragEnd = React.useCallback(() => {
    if (!isDragging) return; // Safety check
    
    setIsDragging(false);
    
    // Only send API update if value actually changed during drag
    if (agentId && fieldName && 
        JSON.stringify(initialDragValueRef.current) !== JSON.stringify(pendingValue)) {
      updateServerValue(pendingValue);
    }
  }, [agentId, fieldName, pendingValue, isDragging, updateServerValue]);

  // Touch event handlers for mobile
  const handleTouchStart = React.useCallback(() => {
    handleDragStart();
  }, [handleDragStart]);
  
  const handleTouchEnd = React.useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      onValueChange={handleValueChange}
      value={pendingValue}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onPointerDown={handleDragStart}
      onPointerUp={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      // If pointer leaves the slider and comes back, treat as new drag
      onPointerLeave={handleDragEnd}
      // If pointer is canceled (like when browser shows a context menu)
      onPointerCancel={handleDragEnd}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        className={cn(
          "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          isUpdating && "opacity-50"
        )} 
      />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
