import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserPlus, Search, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ClientCard from '../components/ClientCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { Client } from '../types';
import { getClients, searchClients } from '../services/api';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get('search') || '';
  
  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
    
    fetchClients();
  }, [initialSearchTerm]);
  
  useEffect(() => {
    if (searchTerm) {
      performSearch();
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);
  
  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const data = await getClients();
      setClients(data);
      setFilteredClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const performSearch = async () => {
    try {
      if (searchTerm.trim() === '') {
        setFilteredClients(clients);
        return;
      }
      
      setIsLoading(true);
      const results = await searchClients(searchTerm);
      setFilteredClients(results);
    } catch (err) {
      console.error('Error searching clients:', err);
      setError('Failed to search clients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredClients(clients);
  };
  
  if (isLoading && clients.length === 0) return <LoadingSpinner />;
  
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Clients" 
        description="Manage and view all registered clients"
        action={
          <Link to="/register" className="btn btn-primary inline-flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Register Client
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
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 pr-10"
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                title="Clear search"
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Results */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-10">
          {searchTerm ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No clients found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No clients match your search criteria.
              </p>
              <button 
                onClick={clearSearch}
                className="btn btn-outline inline-flex items-center"
              >
                Clear Search
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No clients registered</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Get started by registering your first client.
              </p>
              <Link 
                to="/register" 
                className="btn btn-primary inline-flex items-center"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Register Client
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;