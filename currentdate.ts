import { useState, useEffect } from "react";
import { format } from "date-fns";

type DateFormat = "full" | "dateOnly" | "timeOnly" | "dayMonth" | "dayOfWeek" | "custom";

interface UseCurrentDateProps {
  format?: DateFormat;
  customFormat?: string;
  refreshInterval?: number;
}

export function useCurrentDate({
  format: formatType = "full",
  customFormat,
  refreshInterval = 60000, // Default to refresh every minute
}: UseCurrentDateProps = {}) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Update time every X milliseconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Format the date based on the type
  const getFormattedDate = (): string => {
    switch (formatType) {
      case "full":
        return format(currentDate, "EEEE, MMMM d, yyyy, h:mm a");
      case "dateOnly":
        return format(currentDate, "MMMM d, yyyy");
      case "timeOnly":
        return format(currentDate, "h:mm a");
      case "dayMonth":
        return format(currentDate, "MMMM d");
      case "dayOfWeek":
        return format(currentDate, "EEEE");
      case "custom":
        return customFormat ? format(currentDate, customFormat) : format(currentDate, "PPpp");
      default:
        return format(currentDate, "PPpp");
    }
  };

  return {
    date: currentDate,
    formattedDate: getFormattedDate(),
  };
}
