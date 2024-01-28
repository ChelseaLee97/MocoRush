import React from 'react';
import { Slider } from 'react95';
import { cn } from '~/lib/utils';

export interface AmountSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  max: number;
  value: number;
  onValueChange?: (value: number) => void;
}

export function AmountSlider({ max, value, onValueChange, className }: AmountSliderProps) {
  const [step, setStep] = React.useState(max > 0 ? Math.floor((value / max) * 100) : 0);
  React.useEffect(() => {
    if (onValueChange) {
      onValueChange(Math.floor((step / 100) * max));
    }
  }, [step, max, onValueChange]);
  return (
    <Slider
      min={0}
      max={100}
      value={step}
      onChange={(v) => setStep(v)}
      step={5}
      marks={[
        { value: 0, label: '0%' },
        { value: 25, label: '25%' },
        { value: 50, label: '50%' },
        { value: 75, label: '75%' },
        { value: 100, label: '100%' },
      ]}
      className={cn('', className)}
    />
  );
}
