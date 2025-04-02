
import { useToast as useHooksToast, toast as hooksToast } from "@/hooks/use-toast";

// This file re-exports the toast functionality from hooks
export const useToast = useHooksToast;
export const toast = hooksToast;
