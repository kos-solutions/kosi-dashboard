import React from 'react';
import { LucideIcon } from 'lucide-react';

// Definim tipurile de date pe care le acceptă acest card
interface StatusCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  color: string;
}

export default function StatusCard({ icon: Icon, title, value, color }: StatusCardProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 md:gap-4 transition-all hover:shadow-md h-full">
      {/* Iconița cu fundal colorat */}
      <div className={`p-2.5 md:p-3 rounded-xl ${color} bg-opacity-10 shrink-0`}>
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${color} text-white shadow-sm`}>
             <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </div>
      
      {/* Textul */}
      <div className="min-w-0">
        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider truncate">
          {title}
        </p>
        <h3 className="text-lg md:text-xl font-extrabold text-slate-800 leading-tight">
          {value}
        </h3>
      </div>
    </div>
  );
};