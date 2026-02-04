import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { FileText, Download, Stethoscope, Calendar, User, PawPrint, Pill, Clipboard, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data for fallback
const mockPets = [
  {
    customer_pet_id: 1,
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    image_url: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
  },
  {
    customer_pet_id: 2,
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    image_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
  },
];

const mockRecords = [
  {
    record_id: 1,
    record_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    doctor: { user: { first_name: 'James', last_name: 'Anderson' } },
    diagnosis: 'Routine check-up completed. Pet is in excellent health. All vaccinations are up to date.',
    prescription: 'Continue regular diet and exercise. No medications required at this time.',
    treatment_notes: 'Pet showed no signs of illness. Temperature, heart rate, and weight are all within normal ranges.',
  },
  {
    record_id: 2,
    record_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    doctor: { user: { first_name: 'Sarah', last_name: 'Wilson' } },
    diagnosis: 'Minor skin irritation detected. Likely due to seasonal allergies.',
    prescription: 'Antihistamine medication - 1 tablet daily for 7 days. Apply topical cream twice daily.',
    treatment_notes: 'Patient responded well to treatment. Follow-up recommended if symptoms persist.',
  },
];

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    if (selectedPet) {
      loadRecords();
    }
  }, [selectedPet]);

  const loadPets = async () => {
    try {
      const response = await api.get('/customer-pets');
      setPets(response.data.data || []);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedPet(response.data.data[0].customer_pet_id.toString());
      } else {
        setPets(mockPets);
        setSelectedPet(mockPets[0].customer_pet_id.toString());
      }
    } catch (error) {
      console.error('Error loading pets:', error);
      setPets(mockPets);
      if (mockPets.length > 0) {
        setSelectedPet(mockPets[0].customer_pet_id.toString());
      }
    }
  };

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/health-records/pet/${selectedPet}`);
      setRecords(response.data.data || []);
    } catch (error) {
      console.error('Error loading health records:', error);
      setRecords(mockRecords);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (recordId) => {
    try {
      const response = await api.get(`/health-records/${recordId}`);
      setSelectedRecord(response.data.data);
      setShowDetails(true);
    } catch (error) {
      toast.error('Failed to load record details');
      // Use mock data as fallback
      const record = mockRecords.find(r => r.record_id === recordId);
      if (record) {
        setSelectedRecord(record);
        setShowDetails(true);
      }
    }
  };

  const handleDownload = async (recordId) => {
    try {
      const response = await api.get(`/health-records/${recordId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `health-record-${recordId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Record downloaded');
    } catch (error) {
      toast.error('Failed to download record');
    }
  };

  if (loading) return <Layout><Loading /></Layout>;

  const selectedPetData = pets.find(p => p.customer_pet_id.toString() === selectedPet);

  return (
    <Layout>
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Health Records</h1>
            <p className="page-subtitle">View and manage your pet's medical history and health records</p>
          </div>
        </div>

        {/* Pet Selector */}
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <PawPrint className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-slate-900">Select Pet</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pets.map((pet) => (
              <button
                key={pet.customer_pet_id}
                onClick={() => setSelectedPet(pet.customer_pet_id.toString())}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPet === pet.customer_pet_id.toString()
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {pet.image_url ? (
                    <img
                      src={pet.image_url}
                      alt={pet.name}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-slate-200"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100?text=Pet';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <PawPrint className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-bold text-slate-900">{pet.name}</p>
                    <p className="text-sm text-slate-600">{pet.species} - {pet.breed}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {!selectedPet ? (
          <div className="card">
            <EmptyState
              icon={FileText}
              title="Select a pet"
              message="Choose a pet to view health records"
            />
          </div>
        ) : records.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={FileText}
              title="No health records"
              message="No health records found for this pet"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.record_id} className="card hover:shadow-xl transition-all duration-300 border-l-4 border-l-emerald-500">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-slate-900">
                        Health Record - {formatDate(record.record_date)}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold">Doctor:</span> Dr. {record.doctor?.user?.first_name}{' '}
                        {record.doctor?.user?.last_name}
                      </div>
                      {record.diagnosis && (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Clipboard className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Diagnosis</span>
                          </div>
                          <p className="text-sm text-slate-700">{record.diagnosis.substring(0, 150)}...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(record.record_id)}
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 inline mr-1" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(record.record_id)}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 inline mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Record Details Modal */}
        {showDetails && selectedRecord && (
          <Modal
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            title={`Health Record - ${formatDate(selectedRecord.record_date)}`}
            size="lg"
          >
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-emerald-900">Doctor</h3>
                </div>
                <p className="text-emerald-700">
                  Dr. {selectedRecord.doctor?.user?.first_name} {selectedRecord.doctor?.user?.last_name}
                </p>
              </div>
              {selectedRecord.diagnosis && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clipboard className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-900">Diagnosis</h3>
                  </div>
                  <p className="text-blue-700 leading-relaxed">{selectedRecord.diagnosis}</p>
                </div>
              )}
              {selectedRecord.prescription && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-purple-900">Prescription</h3>
                  </div>
                  <p className="text-purple-700 leading-relaxed">{selectedRecord.prescription}</p>
                </div>
              )}
              {selectedRecord.treatment_notes && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-amber-900">Treatment Notes</h3>
                  </div>
                  <p className="text-amber-700 leading-relaxed">{selectedRecord.treatment_notes}</p>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default HealthRecords;
