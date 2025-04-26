import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ClipboardList, Users, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ClientCard from '../components/ClientCard';
import ProgramCard from '../components/ProgramCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Client, Program } from '../types';
import { getClients, getPrograms } from '../services/api';
import AlertMessage from '../components/AlertMessage';

const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [clientsData, programsData] = await Promise.all([
          getClients(),
          getPrograms()
        ]);
        setClients(clientsData);
        setPrograms(programsData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Dashboard" 
        description="Welcome to Health Information System"
      />
      
      {error && (
        <AlertMessage 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
        />
      )}
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-5">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Clients</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {clients.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 rounded-md bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div className="ml-5">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Health Programs
              </h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {programs.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-5 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 rounded-md bg-accent-100 dark:bg-accent-900 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div className="ml-5 flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
              <div className="mt-3 flex gap-2">
                <Link to="/register" className="btn btn-primary text-sm">
                  Add Client
                </Link>
                <Link to="/programs" className="btn btn-outline text-sm">
                  Create Program
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent clients */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Clients</h2>
          <Link 
            to="/clients" 
            className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {clients.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No clients found. Add your first client to get started.</p>
            <Link to="/register" className="mt-4 inline-flex btn btn-primary">
              Add Client
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {clients.slice(0, 6).map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>
      
      {/* Health Programs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Health Programs</h2>
          <Link 
            to="/programs" 
            className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {programs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No health programs found. Create your first program to get started.</p>
            <Link to="/programs" className="mt-4 inline-flex btn btn-primary">
              Create Program
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {programs.slice(0, 6).map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;