type StatusVariant = 'success' | 'error' | 'info' | 'warning';

type StatusMessageProps = {
  variant: StatusVariant;
  title?: string;
  message: string;
};

const variantStyles: Record<StatusVariant, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
};

export function StatusMessage({ variant, title, message }: StatusMessageProps) {
  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant]}`}>
      {title && <p className="mb-1 font-medium">{title}</p>}
      <p className="text-sm">{message}</p>
    </div>
  );
}
