import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLenders } from '../context/LenderContext';
import { useAuth } from '../context/AuthContext';
import LenderForm from '../components/LenderForm';
import { 
  Handshake, Phone, Mail, Globe, Percent, Banknote, Clock, Calendar, 
  Edit, Trash2, ArrowLeft, Check, X, Users, Calendar as CalendarIcon,
  Timer, Briefcase, Shield, AlertTriangle, FileText, Upload, Plus, Star
} from 'lucide-react';

const LenderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLenderById, deleteLender, addCriteriaSheet, deleteCriteriaSheet } = useLenders();
  const { isAdmin, isAuthenticated, toggleFavourite, isFavourite } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddCriteriaSheet, setShowAddCriteriaSheet] = useState(false);
  const [criteriaSheetName, setCriteriaSheetName] = useState('');
  const [criteriaSheetFile, setCriteriaSheetFile] = useState<File | null>(null);
  
  const lender = getLenderById(id || '');
  const isFavourited = lender ? isFavourite(lender.id) : false;
  
  if (!lender) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lender Not Found</h2>
        <p className="text-gray-600 mb-6">The lender you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/search"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteLender(lender.id);
    navigate('/search');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCriteriaSheetFile(e.target.files[0]);
    }
  };

  const handleAddCriteriaSheet = () => {
    if (criteriaSheetFile && criteriaSheetName.trim()) {
      addCriteriaSheet(lender.id, criteriaSheetName, criteriaSheetFile);
      setCriteriaSheetName('');
      setCriteriaSheetFile(null);
      setShowAddCriteriaSheet(false);
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LenderForm 
          lender={lender} 
          onSubmit={() => setIsEditing(false)} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          to="/search" 
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Search
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {lender.logo ? (
                <img 
                  src={lender.logo} 
                  alt={`${lender.name} logo`} 
                  className="w-16 h-16 object-contain mr-4 rounded-md"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center mr-4">
                  <Handshake className="text-blue-600" size={32} />
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-900">{lender.name}</h1>
            </div>
            <div className="flex space-x-2">
              {isAuthenticated && (
                <button
                  onClick={() => toggleFavourite(lender.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Star 
                    className={`mr-1.5 h-4 w-4 ${isFavourited ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
                  />
                  {isFavourited ? 'Favourited' : 'Add to Favourites'}
                </button>
              )}
              {isAdmin && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="mr-1.5 h-4 w-4 text-gray-500" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="mr-1.5 h-4 w-4 text-red-500" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Globe className="mt-1 mr-3 h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <a 
                      href={lender.websiteLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-base text-blue-600 hover:text-blue-800"
                    >
                      {lender.websiteLink}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="mt-1 mr-3 h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <a href={`tel:${lender.phone}`} className="text-base text-blue-600 hover:text-blue-800">
                      {lender.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="mt-1 mr-3 h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <a href={`mailto:${lender.email}`} className="text-base text-blue-600 hover:text-blue-800">
                      {lender.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CalendarIcon className="mt-1 mr-3 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Added On</p>
                    <p className="text-base text-gray-900">{new Date(lender.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Loan Parameters</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Percent className="mt-1 mr-3 h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Interest Rate Range</p>
                    <p className="text-base text-gray-900">{lender.minRate}% - {lender.maxRate}%</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Banknote className="mt-1 mr-3 h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Loan Amount Range</p>
                    <p className="text-base text-gray-900">£{lender.minLoan.toLocaleString()} - £{lender.maxLoan.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="mt-1 mr-3 h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Term Range</p>
                    <p className="text-base text-gray-900">{lender.minTerm} - {lender.maxTerm} years</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="mt-1 mr-3 h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Age Requirements</p>
                    <p className="text-base text-gray-900">{lender.minAge} - {lender.maxAge} years</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Timer className="mt-1 mr-3 h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Processing Time</p>
                    <p className="text-base text-gray-900">{lender.minLoanProcessingTime} - {lender.maxLoanProcessingTime} days</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Timer className="mt-1 mr-3 h-5 w-5 text-pink-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Decision Time</p>
                    <p className="text-base text-gray-900">{lender.minDecisionTime} - {lender.maxDecisionTime} days</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Briefcase className="mt-1 mr-3 h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Min Trading Period</p>
                    <p className="text-base text-gray-900">{lender.minTradingPeriod} months</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Percent className="mt-1 mr-3 h-5 w-5 text-teal-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Max Loan-To-Value</p>
                    <p className="text-base text-gray-900">{lender.maxLoanToValue}%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <Shield className="mt-1 mr-3 h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Personal Guarantee</p>
                    <p className="text-base text-gray-900 flex items-center">
                      {lender.personalGuarantee ? (
                        <><Check size={18} className="text-green-500 mr-1" /> Required</>
                      ) : (
                        <><X size={18} className="text-red-500 mr-1" /> Not Required</>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertTriangle className="mt-1 mr-3 h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Early Repayment Charges</p>
                    <p className="text-base text-gray-900 flex items-center">
                      {lender.earlyRepaymentCharges ? (
                        <><Check size={18} className="text-green-500 mr-1" /> Applicable</>
                      ) : (
                        <><X size={18} className="text-red-500 mr-1" /> Not Applicable</>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="mt-1 mr-3 h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Interest Treatment</p>
                    <p className="text-base text-gray-900">{lender.interestTreatment}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Covered Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {lender.coveredLocation.map((location, index) => (
                    <span 
                      key={index} 
                      className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Loan Types</h3>
                <div className="flex flex-wrap gap-2">
                  {lender.loanTypes.map((type, index) => (
                    <span 
                      key={index} 
                      className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Criteria Sheets</h3>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowAddCriteriaSheet(true)}
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Sheet
                    </button>
                  )}
                </div>
                
                {lender.criteriaSheets.length > 0 ? (
                  <ul className="space-y-2">
                    {lender.criteriaSheets.map((sheet) => (
                      <li key={sheet.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <div className="flex items-center">
                          <FileText size={16} className="text-blue-500 mr-2" />
                          <span className="text-sm">{sheet.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a 
                            href={sheet.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </a>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => deleteCriteriaSheet(lender.id, sheet.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No criteria sheets available</p>
                )}
                
                {showAddCriteriaSheet && (
                  <div className="mt-3 p-3 border border-gray-200 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Criteria Sheet</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Sheet Name</label>
                        <input
                          type="text"
                          value={criteriaSheetName}
                          onChange={(e) => setCriteriaSheetName(e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                          placeholder="e.g., Product Guide"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">PDF File</label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddCriteriaSheet(false);
                            setCriteriaSheetName('');
                            setCriteriaSheetFile(null);
                          }}
                          className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddCriteriaSheet}
                          disabled={!criteriaSheetName.trim() || !criteriaSheetFile}
                          className="px-2 py-1 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {lender.additionalInfo && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h3>
                   <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-800 whitespace-pre-line">{lender.additionalInfo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Delete Lender</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete {lender.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LenderDetail;