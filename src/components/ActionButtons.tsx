'use client';

interface ActionButtonsProps {
  onRunAuto: () => void;
  onNextStep: () => void;
  onClearObstacles: () => void;
  onReset: () => void;
}

export function ActionButtons({
  onRunAuto,
  onNextStep,
  onClearObstacles,
  onReset,
}: ActionButtonsProps) {
  return (
    <div className="buttons">
      <button onClick={onRunAuto}>Run auto</button>
      <button onClick={onNextStep}>Next step</button>
      <button onClick={onClearObstacles}>Clear obstacles</button>
      <button onClick={onReset}>Reset (random)</button>
    </div>
  );
}
