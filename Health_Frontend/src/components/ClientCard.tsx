import { Link } from 'react-router-dom';
import { Client } from '../types';
import { User, ArrowRight } from 'lucide-react';

interface ClientCardProps {
  client: Client;
}

const ClientCard = ({ client }: ClientCardProps) => {
  return (
    <div className="card p-5 hover:shadow-lg transition duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {client.first_name} {client.last_name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
            <div className="mt-1 flex items-center">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {client.enrolled_programs?.length || 0} Programs Enrolled
              </span>
            </div>
          </div>
        </div>
        <Link
          to={`/clients/${client.id}`}
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          View
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      {client.enrolled_programs && client.enrolled_programs.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Enrolled Programs
          </h4>
          <div className="flex flex-wrap gap-2">
            {client.enrolled_programs.slice(0, 3).map((program) => (
              <span 
                key={program.id}
                className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:text-primary-300"
              >
                {program.name}
              </span>
            ))}
            {client.enrolled_programs.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-300">
                +{client.enrolled_programs.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientCard;