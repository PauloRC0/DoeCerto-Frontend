import { LucideIcon } from "lucide-react";

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  iconColor?: string;
}

export function InputGroup({ icon: Icon, iconColor = "text-purple-400", ...props }: InputGroupProps) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl focus-within:ring-2 focus-within:ring-purple-100 transition-all border border-transparent focus-within:border-purple-100">
      <Icon size={22} className={iconColor} />
      <input 
        {...props}
        className="bg-transparent outline-none w-full text-lg font-medium text-gray-700 placeholder:text-gray-400" 
      />
    </div>
  );
}