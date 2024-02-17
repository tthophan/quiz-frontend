import React, { ReactNode } from "react";

interface ProgressProps {
  title: ReactNode;
  totalStep: number;
  step: number;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({
  title,
  totalStep,
  step,
  className,
}) => {
  return (
    <div className={className + " space-y-3 flex-1"}>
      <div className="flex items-center">
        <div className="font-medium text-sm mr-auto flex items-center">
          {title}
        </div>
        <span className="px-2 py-1 rounded-lg bg-red-50 text-red-500 text-xs">
          {step}/ {totalStep}
        </span>
      </div>
      <div className="overflow-hidden bg-blue-50 h-1.5 rounded-full w-full">
        <span
          className="h-full bg-blue-500 w-full block rounded-full"
          style={{ width: (100 / totalStep) * step + "%" }}
        ></span>
      </div>
    </div>
  );
};

export default Progress;
