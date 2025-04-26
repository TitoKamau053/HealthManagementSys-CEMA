import { Program } from '../types';
import { ClipboardCheck, Trash2 } from 'lucide-react';

interface ProgramCardProps {
  program: Program;
  onClick?: () => void;
  isSelected?: boolean;
  onDelete?: (programId: string) => void;
}

const ProgramCard = ({ program, onClick, isSelected = false, onDelete }: ProgramCardProps) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(program.id);
    }
  };

  return (
    <div 
      className={`card p-5 cursor-pointer transition duration-200 ${
        isSelected 
          ? 'border-2 border-primary-500 dark:border-primary-400 ring-2 ring-primary-500/30 dark:ring-primary-400/30' 
          : 'hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`flex-shrink-0 mr-4 h-10 w-10 rounded-full flex items-center justify-center ${
            isSelected 
              ? 'bg-primary-100 dark:bg-primary-900' 
              : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <ClipboardCheck className={`h-5 w-5 ${
              isSelected 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {program.name}
            </h3>
            {program.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {program.description}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleDeleteClick}
          title="Delete program"
          className="text-red-600 hover:text-red-800 focus:outline-none"
          aria-label={`Delete program ${program.name}`}
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProgramCard;
