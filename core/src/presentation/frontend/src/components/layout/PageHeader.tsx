interface PageHeaderProps {
  title: string;
  className?: string;
}

export function PageHeader({ title, className = '' }: PageHeaderProps) {
  return <h1 className={`text-gray-400 text-sm mb-4 ${className}`}>{title}</h1>;
}
