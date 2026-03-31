const steps = ["已提交", "待接收", "AI整理中", "待审核", "待上架", "已上架"];

export function ProgressPage({ currentStatus }: { currentStatus: string }) {
  return (
    <ol>
      {steps.map((step) => (
        <li key={step} data-active={step === currentStatus}>
          {step}
        </li>
      ))}
    </ol>
  );
}
