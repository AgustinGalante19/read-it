export interface DatePickerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (range: DateRange) => void;
  defaultValue?: DateRange;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
