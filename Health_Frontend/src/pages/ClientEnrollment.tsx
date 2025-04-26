import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Search, Check } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ProgramCard from '../components/ProgramCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { Client, Program } from '../types';
import { getClient, getPrograms, enrollClient } from '../services/api';

const ClientEnrollment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [client, setClient] = useState<Client | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);
  
  useEffect(() => {
    // Filter programs based on search term
    if (searchTerm.trim() === '') {
      setFilteredPrograms(programs);
    } else {
      const filtered = programs.filter(program => 
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (program.description && program.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPrograms(filtered);
    }
  }, [searchTerm, programs]);
  
  const fetchData = async (clientId: string) => {
    try {
      setIsLoading(true);
      const [clientData, programsData] = await Promise.all([
        getClient(clientId),
        getPrograms()
      ]);
      
      setClient(clientData);
      setPrograms(programsData);
      setFilteredPrograms(programsData);
      
      // Pre-select already enrolled programs
      if (clientData.enrolled_programs) {
        setSelectedPrograms(clientData.enrolled_programs.map(p => p.id));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleProgramSelection = (programId: string) => {
    setSelectedPrograms(prev => {
      if (prev.includes(programId)) {
        return prev.filter(id => id !== programId);
      } else {
        return [...prev, programId];
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      setError('Client ID is missing');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await enrollClient(id, selectedPrograms);
      setSuccess('Client successfully enrolled in selected programs!');
      
      // Redirect to client profile after a short delay
      setTimeout(() => {
        navigate(`/clients/${id}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error enrolling client:', err);
      setError('Failed to enroll client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) return <LoadingSpinner />;
  
  if (!client) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Client not found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The client you're trying to enroll doesn't exist or has been removed.
        </p>
        <button onClick={() => navigate('/clients')} className="btn btn-primary">
          Back to Clients
        </button>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title={`Enroll ${client.first_name} ${client.last_name}`}
        description="Select programs to enroll this client"
        action={
          <button 
            onClick={() => navigate(`/clients/${id}`)} 
            className="btn btn-outline inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Client
          </button>
        }
      />
      
      {error && (
        <AlertMessage 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
        />
      )}
      
      {success && (
        <AlertMessage 
          type="success" 
          message={success} 
          onClose={() => setSuccess(null)}
        />
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="card p-6 mb-6">
          {/* Search Programs */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="form-input pl-10"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Selected Programs Count */}
          <div className="mb-4 flex items-center">
            <Check className={`h-5 w-5 ${selectedPrograms.length > 0 ? 'text-primary-500' : 'text-gray-400'} mr-2`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedPrograms.length} program{selectedPrograms.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          {/* Programs List */}
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No programs match your search criteria.' : 'No programs available for enrollment.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPrograms.map((program) => (
                <ProgramCard 
                  key={program.id} 
                  program={program}
                  isSelected={selectedPrograms.includes(program.id)}
                  onClick={() => toggleProgramSelection(program.id)}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary inline-flex items-center"
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Enrolling...' : 'Save Enrollment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientEnrollment;