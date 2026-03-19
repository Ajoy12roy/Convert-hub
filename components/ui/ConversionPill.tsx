import { MoveRight } from 'lucide-react';

interface ConversionPillProps {
  from: string;
  to: string;
}

export default function ConversionPill({ from, to }: ConversionPillProps) {
  return (
    <button className="flex items-center space-x-3 bg-white border border-gray-100 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-200 transition-all group">
      <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">{from}</span>
      <MoveRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
      <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">{to}</span>
    </button>
  );
}