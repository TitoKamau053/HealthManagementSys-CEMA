import { useState, useEffect } from 'react';
import { Plus, Search, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ProgramCard from '../components/ProgramCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { Program, ProgramCreate } from '../types';
import { getPrograms, createProgram } from '../services/api';
import { deleteProgram } from '../services/api';


const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ProgramCreate>({ name: '', description: '' });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
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

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      const data = await getPrograms();
      setPrograms(data);
      setFilteredPrograms(data);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setErrorMsg('Failed to load programs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Program name is required');
      return;
    }

    try {
      setIsLoading(true);
      const newProgram = await createProgram(formData);
      setPrograms([...programs, newProgram]);
      setFilteredPrograms([...filteredPrograms, newProgram]);
      setSuccessMsg('Program created successfully!');
      setFormData({ name: '', description: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating program:', err);
      setErrorMsg('Failed to create program. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    if (!window.confirm('Are you sure you want to delete this program?')) {
      return;
    }
    try {
      setIsLoading(true);
      await deleteProgram(programId);
      const updatedPrograms = programs.filter(p => p.id !== programId);
      setPrograms(updatedPrograms);
      setFilteredPrograms(updatedPrograms);
      setSuccessMsg('Program deleted successfully!');
    } catch (err) {
      console.error('Error deleting program:', err);
      setErrorMsg('Failed to delete program. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (isLoading && programs.length === 0) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Health Programs"
        description="Create and manage health programs"
        action={
          !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Program
            </button>
          )
        }
      />

      {/* Search */}
      <div className="mb-6 mt-4">
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input pl-10 pr-10"
            placeholder="Search programs..."
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

      {errorMsg && (
        <AlertMessage
          type="error"
          message={errorMsg}
          onClose={() => setErrorMsg(null)}
        />
      )}

      {successMsg && (
        <AlertMessage
          type="success"
          message={successMsg}
          onClose={() => setSuccessMsg(null)}
        />
      )}

      {showForm && (
        <div className="card p-6 mb-6 animate-slide-in">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Program</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Program Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter program name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter program description"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: '', description: '' });
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Program
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredPrograms.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No programs found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm ? 'No programs match your search criteria.' : 'Get started by creating your first health program.'}
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Program
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => (
  <ProgramCard key={program.id} program={program} onDelete={handleDeleteProgram} />
))}

        </div>
      )}
    </div>
  );
};

export default Programs;
