import React, { useState, useEffect, useRef } from 'react';
import { Lender, LoanType, CriteriaSheet } from '../types';
import { useLenders } from '../context/LenderContext';
import { X, Plus, Check, XCircle, Upload, FileText, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface LenderFormProps {
  lender?: Lender;
  onSubmit: () => void;
  onCancel: () => void;
}

const LenderForm: React.FC<LenderFormProps> = ({ lender, onSubmit, onCancel }) => {
  const { addLender, updateLender, allLoanTypes, allLocations, allInterestTreatments } = useLenders();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const criteriaSheetInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Omit<Lender, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    logo: '',
    logoFile: undefined,
    websiteLink: '',
    phone: '',
    email: '',
    minRate: 4.0,
    maxRate: 6.0,
    minLoan: 50000,
    maxLoan: 500000,
    minTerm: 5,
    maxTerm: 25,
    minAge: 21,
    maxAge: 75,
    minLoanProcessingTime: 3,
    maxLoanProcessingTime: 7,
    minDecisionTime: 1,
    maxDecisionTime: 3,
    minTradingPeriod: 12,
    maxLoanToValue: 75,
    personalGuarantee: false,
    earlyRepaymentCharges: false,
    interestTreatment: 'Monthly',
    coveredLocation: [],
    loanTypes: [],
    criteriaSheets: [],
    additionalInfo: ''
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [criteriaSheetName, setCriteriaSheetName] = useState('');

  useEffect(() => {
    if (lender) {
      const { id, createdAt, updatedAt, ...rest } = lender;
      setFormData(rest);
      if (lender.logo) {
        setLogoPreview(lender.logo);
      }
    }
  }, [lender]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert empty string to undefined to avoid NaN
    const parsedValue = value === '' ? 0 : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setFormData(prev => ({
          ...prev,
          logo: reader.result as string,
          logoFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCriteriaSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && criteriaSheetName.trim()) {
      const newSheet: CriteriaSheet = {
        id: uuidv4(),
        name: criteriaSheetName.trim(),
        file,
        url: URL.createObjectURL(file),
        uploadDate: new Date()
      };
      
      setFormData(prev => ({
        ...prev,
        criteriaSheets: [...prev.criteriaSheets, newSheet]
      }));
      
      setCriteriaSheetName('');
      if (criteriaSheetInputRef.current) {
        criteriaSheetInputRef.current.value = '';
      }
    }
  };

  const removeCriteriaSheet = (sheetId: string) => {
    setFormData(prev => ({
      ...prev,
      criteriaSheets: prev.criteriaSheets.filter(sheet => sheet.id !== sheetId)
    }));
  };

  const toggleLoanType = (type: LoanType) => {
    setFormData(prev => ({
      ...prev,
      loanTypes: prev.loanTypes.includes(type)
        ? prev.loanTypes.filter(t => t !== type)
        : [...prev.loanTypes, type]
    }));
  };

  const toggleLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      coveredLocation: prev.coveredLocation.includes(location)
        ? prev.coveredLocation.filter(l => l !== location)
        : [...prev.coveredLocation, location]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lender) {
      updateLender(lender.id, formData);
    } else {
      addLender(formData);
    }
    
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {lender ? 'Edit Lender' : 'Add New Lender'}
          </h2>
          <button 
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lender Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo
                </label>
                <div className="flex items-center space-x-4">
                  {logoPreview && (
                    <div className="relative w-16 h-16 border rounded-md overflow-hidden">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null);
                          setFormData(prev => ({
                            ...prev,
                            logo: '',
                            logoFile: undefined
                          }));
                          if (logoInputRef.current) {
                            logoInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={logoInputRef}
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload size={16} className="mr-2" />
                      {logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website Link*
                </label>
                <input
                  type="url"
                  name="websiteLink"
                  value={formData.websiteLink}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone*
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className=" w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Criteria Sheets</h3>
            <div className="space-y-4">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sheet Name
                  </label>
                  <input
                    type="text"
                    value={criteriaSheetName}
                    onChange={(e) => setCriteriaSheetName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Product Guide, Eligibility Criteria"
                  />
                </div>
                <div>
                  <input
                    type="file"
                    ref={criteriaSheetInputRef}
                    accept=".pdf"
                    onChange={handleCriteriaSheetChange}
                    className="hidden"
                    id="criteria-sheet-upload"
                  />
                  <label
                    htmlFor="criteria-sheet-upload"
                    className={`flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                      criteriaSheetName.trim() 
                        ? 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer' 
                        : 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <Upload size={16} className="mr-2" />
                    Upload PDF
                  </label>
                </div>
              </div>

              {formData.criteriaSheets.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Sheets:</h4>
                  <ul className="space-y-2">
                    {formData.criteriaSheets.map((sheet) => (
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
                          <button
                            type="button"
                            onClick={() => removeCriteriaSheet(sheet.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Parameters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Rate (%)*
                </label>
                <input
                  type="number"
                  name="minRate"
                  value={formData.minRate}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Rate (%)*
                </label>
                <input
                  type="number"
                  name="maxRate"
                  value={formData.maxRate}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Loan (£)*
                </label>
                <input
                  type="number"
                  name="minLoan"
                  value={formData.minLoan}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Loan (£)*
                </label>
                <input
                  type="number"
                  name="maxLoan"
                  value={formData.maxLoan}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Term (years)*
                </label>
                <input
                  type="number"
                  name="minTerm"
                  value={formData.minTerm}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Term (years)*
                </label>
                <input
                  type="number"
                  name="maxTerm"
                  value={formData.maxTerm}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Age*
                </label>
                <input
                  type="number"
                  name="minAge"
                  value={formData.minAge}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Age*
                </label>
                <input
                  type="number"
                  name="maxAge"
                  value={formData.maxAge}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Loan Processing Time (days)*
                </label>
                <input
                  type="number"
                  name="minLoanProcessingTime"
                  value={formData.minLoanProcessingTime}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Loan Processing Time (days)*
                </label>
                <input
                  type="number"
                  name="maxLoanProcessingTime"
                  value={formData.maxLoanProcessingTime}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Decision Time (days)*
                </label>
                <input
                  type="number"
                  name="minDecisionTime"
                  value={formData.minDecisionTime}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Decision Time (days)*
                </label>
                <input
                  type="number"
                  name="maxDecisionTime"
                  value={formData.maxDecisionTime}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Trading Period (months)*
                </label>
                <input
                  type="number"
                  name="minTradingPeriod"
                  value={formData.minTradingPeriod}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Loan-To-Value (%)*
                </label>
                <input
                  type="number"
                  name="maxLoanToValue"
                  value={formData.maxLoanToValue}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="personalGuarantee"
                  name="personalGuarantee"
                  checked={formData.personalGuarantee}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="personalGuarantee" className="ml-2 block text-sm text-gray-700">
                  Personal Guarantee Required
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="earlyRepaymentCharges"
                  name="earlyRepaymentCharges"
                  checked={formData.earlyRepaymentCharges}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="earlyRepaymentCharges" className="ml-2 block text-sm text-gray-700">
                  Early Repayment Charges
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interest Treatment*
              </label>
              <select
                name="interestTreatment"
                value={formData.interestTreatment}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {allInterestTreatments.map(treatment => (
                  <option key={treatment} value={treatment}>{treatment}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Covered Locations</h3>
            <div className="flex flex-wrap gap-2">
              {allLocations.map((location) => (
                <button
                  type="button"
                  key={location}
                  onClick={() => toggleLocation(location)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    formData.coveredLocation.includes(location)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
            {formData.coveredLocation.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Please select at least one location</p>
            )}
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Types</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Types*
              </label>
              <div className="flex flex-wrap gap-2">
                {allLoanTypes.map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => toggleLoanType(type)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      formData.loanTypes.includes(type)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {formData.loanTypes.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Please select at least one loan type</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Information (optional)
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              formData.loanTypes.length === 0 || 
              formData.coveredLocation.length === 0
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {lender ? 'Update Lender' : 'Add Lender'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LenderForm;