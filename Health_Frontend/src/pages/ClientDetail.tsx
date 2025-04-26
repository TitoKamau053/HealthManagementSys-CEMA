import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Calendar, User, ClipboardList, UserPlus, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { Client, Program } from '../types';
import { getClient, getPrograms, removeEnrolledProgram } from '../services/api';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [enrolledPrograms, setEnrolledPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);
  
  const fetchData = async (clientId: string) => {
    try {
      setIsLoading(true);
      const [clientData, programsData] = await Promise.all([
        getClient(clientId),
        getPrograms()
      ]);
      setClient(clientData);
      
      // Map enrolled program IDs to program objects with names
      if (clientData.enrolled_programs && clientData.enrolled_programs.length > 0) {
        const enrolled = clientData.enrolled_programs.map(ep => {
          const program = programsData.find(p => p.id === ep.id);
          return program ? program : { id: ep.id, name: 'Unknown Program', description: '' };
        });
        setEnrolledPrograms(enrolled);
      } else {
        setEnrolledPrograms([]);
      }
    } catch (err) {
      console.error('Error fetching client or programs:', err);
      setError('Failed to load client details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    try {
      if (!client) return;
      await removeEnrolledProgram(client.id, programId);
      // Refresh client data after unenroll to keep data consistent
      await fetchData(client.id);
    } catch (error) {
      console.error('Failed to delete enrolled program:', error);
      setError('Failed to delete enrolled program. Please try again.');
    }
  };
  
  if (isLoading) return <LoadingSpinner />;
  
  if (!client) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Client not found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The client you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/clients" className="btn btn-primary">
          Back to Clients
        </Link>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title={`${client.first_name} ${client.last_name}`}
        description="Client Profile"
        action={
          <Link 
            to={`/enroll/${client.id}`} 
            className="btn btn-primary inline-flex items-center"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Enroll in Program
          </Link>
        }
      />
      
      {error && (
        <AlertMessage 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
        />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {client.first_name} {client.last_name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">Client ID: {client.id.substring(0, 8)}...</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{client.email}</p>
                </div>
              </div>
              
              {client.age && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                    <p className="font-medium text-gray-900 dark:text-white">{client.age} years</p>
                  </div>
                </div>
              )}
              
              {client.gender && (
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                    <p className="font-medium text-gray-900 dark:text-white">{client.gender}</p>
                  </div>
                </div>
              )}
              
              {/* Placeholder for other potential fields */}
            </div>
          </div>
        </div>
        
        {/* Enrolled Programs */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Enrolled Programs
              </h3>
              <Link 
                to={`/enroll/${client.id}`} 
                className="btn btn-outline inline-flex items-center text-sm"
              >
                <UserPlus className="mr-1 h-4 w-4" />
                Enroll
              </Link>
            </div>
            
            {enrolledPrograms && enrolledPrograms.length > 0 ? (
              <div className="space-y-4">
                {enrolledPrograms.map((program: Program) => (
                  <div 
                    key={program.id} 
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                        {program.name}
                      </h4>
                      {program.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {program.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteProgram(program.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Delete ${program.name}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                  Not enrolled in any programs
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  This client is not currently enrolled in any health programs.
                </p>
                <Link 
                  to={`/enroll/${client.id}`} 
                  className="btn btn-primary inline-flex items-center"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Enroll in Program
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
