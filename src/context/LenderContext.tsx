import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lender, FilterOptions, LoanType, CriteriaSheet } from '../types';
import { allLoanTypes, allLocations, allInterestTreatments } from '../data/mockLenders';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface LenderContextType {
  lenders: Lender[];
  filteredLenders: Lender[];
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  addLender: (lender: Omit<Lender, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLender: (id: string, lender: Partial<Lender>) => Promise<void>;
  deleteLender: (id: string) => Promise<void>;
  getLenderById: (id: string) => Lender | undefined;
  addCriteriaSheet: (lenderId: string, name: string, file: File) => Promise<void>;
  deleteCriteriaSheet: (lenderId: string, sheetId: string) => Promise<void>;
  allLoanTypes: LoanType[];
  allLocations: string[];
  allInterestTreatments: string[];
  resetFilters: () => void;
  isLoading: boolean;
}

const LenderContext = createContext<LenderContextType | undefined>(undefined);

export const useLenders = () => {
  const context = useContext(LenderContext);
  if (!context) {
    throw new Error('useLenders must be used within a LenderProvider');
  }
  return context;
};

export const LenderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [filteredLenders, setFilteredLenders] = useState<Lender[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLenders = async () => {
      try {
        const { data: lendersData, error: lendersError } = await supabase
          .from('lenders')
          .select('*')
          .order('name', { ascending: true }); // Sort by name A-Z
        
        if (lendersError) {
          console.error('Error fetching lenders:', lendersError);
          return;
        }
        
        if (lendersData) {
          const lendersWithSheets = await Promise.all(
            lendersData.map(async (lender) => {
              const { data: sheetsData, error: sheetsError } = await supabase
                .from('criteria_sheets')
                .select('*')
                .eq('lender_id', lender.id);
              
              if (sheetsError) {
                console.error('Error fetching criteria sheets:', sheetsError);
                return {
                  ...lender,
                  criteriaSheets: []
                };
              }
              
              const criteriaSheets = sheetsData?.map(sheet => ({
                id: sheet.id,
                name: sheet.name,
                url: sheet.url,
                uploadDate: new Date(sheet.upload_date)
              })) || [];
              
              return {
                id: lender.id,
                name: lender.name,
                logo: lender.logo || '',
                websiteLink: lender.website_link,
                phone: lender.phone,
                email: lender.email,
                minRate: lender.min_rate,
                maxRate: lender.max_rate,
                minLoan: lender.min_loan,
                maxLoan: lender.max_loan,
                minTerm: lender.min_term,
                maxTerm: lender.max_term,
                minAge: lender.min_age,
                maxAge: lender.max_age,
                minLoanProcessingTime: lender.min_loan_processing_time,
                maxLoanProcessingTime: lender.max_loan_processing_time,
                minDecisionTime: lender.min_decision_time,
                maxDecisionTime: lender.max_decision_time,
                minTradingPeriod: lender.min_trading_period,
                maxLoanToValue: lender.max_loan_to_value,
                personalGuarantee: lender.personal_guarantee,
                earlyRepaymentCharges: lender.early_repayment_charges,
                interestTreatment: lender.interest_treatment,
                coveredLocation: lender.covered_location,
                loanTypes: lender.loan_types,
                criteriaSheets,
                additionalInfo: lender.additional_info || '',
                createdAt: new Date(lender.created_at),
                updatedAt: new Date(lender.updated_at)
              };
            })
          );
          
          setLenders(lendersWithSheets);
          setFilteredLenders(lendersWithSheets);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLenders();
  }, []);

  useEffect(() => {
    let result = [...lenders];

    if (filterOptions.searchTerm) {
      const searchTerm = filterOptions.searchTerm.toLowerCase();
      result = result.filter(lender => 
        lender.name.toLowerCase().includes(searchTerm) || 
        (lender.additionalInfo && lender.additionalInfo.toLowerCase().includes(searchTerm))
      );
    }

    if (filterOptions.minLoan) {
      result = result.filter(lender => lender.maxLoan >= filterOptions.minLoan!);
    }

    if (filterOptions.maxLoan) {
      result = result.filter(lender => lender.minLoan <= filterOptions.maxLoan!);
    }

    if (filterOptions.minRate !== undefined) {
      result = result.filter(lender => lender.maxRate >= filterOptions.minRate!);
    }

    if (filterOptions.maxRate !== undefined) {
      result = result.filter(lender => lender.minRate <= filterOptions.maxRate!);
    }

    if (filterOptions.minTerm !== undefined) {
      result = result.filter(lender => lender.maxTerm >= filterOptions.minTerm!);
    }

    if (filterOptions.maxTerm !== undefined) {
      result = result.filter(lender => lender.minTerm <= filterOptions.maxTerm!);
    }

    if (filterOptions.maxLTV !== undefined) {
      result = result.filter(lender => lender.maxLoanToValue <= filterOptions.maxLTV!);
    }

    if (filterOptions.loanTypes && filterOptions.loanTypes.length > 0) {
      result = result.filter(lender => 
        filterOptions.loanTypes!.some(type => lender.loanTypes.includes(type))
      );
    }

    if (filterOptions.location) {
      result = result.filter(lender => 
        lender.coveredLocation.includes(filterOptions.location!)
      );
    }

    // Always sort by name alphabetically
    result.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredLenders(result);
  }, [lenders, filterOptions]);

  const addLender = async (newLender: Omit<Lender, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const lenderData = {
        name: newLender.name,
        logo: newLender.logo || null,
        website_link: newLender.websiteLink,
        phone: newLender.phone,
        email: newLender.email,
        min_rate: newLender.minRate,
        max_rate: newLender.maxRate,
        min_loan: newLender.minLoan,
        max_loan: newLender.maxLoan,
        min_term: newLender.minTerm,
        max_term: newLender.maxTerm,
        min_age: newLender.minAge,
        max_age: newLender.maxAge,
        min_loan_processing_time: newLender.minLoanProcessingTime,
        max_loan_processing_time: newLender.maxLoanProcessingTime,
        min_decision_time: newLender.minDecisionTime,
        max_decision_time: newLender.maxDecisionTime,
        min_trading_period: newLender.minTradingPeriod,
        max_loan_to_value: newLender.maxLoanToValue,
        personal_guarantee: newLender.personalGuarantee,
        early_repayment_charges: newLender.earlyRepaymentCharges,
        interest_treatment: newLender.interestTreatment,
        covered_location: newLender.coveredLocation,
        loan_types: newLender.loanTypes,
        additional_info: newLender.additionalInfo || null
      };

      const { data: insertedLender, error: insertError } = await supabase
        .from('lenders')
        .insert(lenderData)
        .select()
        .single();
      
      if (insertError) {
        console.error('Error adding lender:', insertError);
        return;
      }
      
      if (!insertedLender) {
        console.error('No data returned after adding lender');
        return;
      }

      if (newLender.criteriaSheets && newLender.criteriaSheets.length > 0) {
        for (const sheet of newLender.criteriaSheets) {
          if (sheet.file) {
            await addCriteriaSheet(insertedLender.id, sheet.name, sheet.file);
          }
        }
      }

      const { data: updatedLendersData, error: fetchError } = await supabase
        .from('lenders')
        .select('*')
        .order('name', { ascending: true }); // Sort by name A-Z
      
      if (fetchError) {
        console.error('Error fetching lenders after add:', fetchError);
        return;
      }
      
      if (updatedLendersData) {
        const lendersWithSheets = await Promise.all(
          updatedLendersData.map(async (lender) => {
            const { data: sheetsData, error: sheetsError } = await supabase
              .from('criteria_sheets')
              .select('*')
              .eq('lender_id', lender.id);
            
            if (sheetsError) {
              console.error('Error fetching criteria sheets:', sheetsError);
              return {
                ...lender,
                criteriaSheets: []
              };
            }
            
            const criteriaSheets = sheetsData?.map(sheet => ({
              id: sheet.id,
              name: sheet.name,
              url: sheet.url,
              uploadDate: new Date(sheet.upload_date)
            })) || [];
            
            return {
              id: lender.id,
              name: lender.name,
              logo: lender.logo || '',
              websiteLink: lender.website_link,
              phone: lender.phone,
              email: lender.email,
              minRate: lender.min_rate,
              maxRate: lender.max_rate,
              minLoan: lender.min_loan,
              maxLoan: lender.max_loan,
              minTerm: lender.min_term,
              maxTerm: lender.max_term,
              minAge: lender.min_age,
              maxAge: lender.max_age,
              minLoanProcessingTime: lender.min_loan_processing_time,
              maxLoanProcessingTime: lender.max_loan_processing_time,
              minDecisionTime: lender.min_decision_time,
              maxDecisionTime: lender.max_decision_time,
              minTradingPeriod: lender.min_trading_period,
              maxLoanToValue: lender.max_loan_to_value,
              personalGuarantee: lender.personal_guarantee,
              earlyRepaymentCharges: lender.early_repayment_charges,
              interestTreatment: lender.interest_treatment,
              coveredLocation: lender.covered_location,
              loanTypes: lender.loan_types,
              criteriaSheets,
              additionalInfo: lender.additional_info || '',
              createdAt: new Date(lender.created_at),
              updatedAt: new Date(lender.updated_at)
            };
          })
        );
        
        setLenders(lendersWithSheets);
      }
    } catch (error) {
      console.error('Error adding lender:', error);
    }
  };

  const updateLender = async (id: string, updatedFields: Partial<Lender>) => {
    try {
      const lenderData: any = {};
      
      if (updatedFields.name !== undefined) lenderData.name = updatedFields.name;
      if (updatedFields.logo !== undefined) lenderData.logo = updatedFields.logo || null;
      if (updatedFields.websiteLink !== undefined) lenderData.website_link = updatedFields.websiteLink;
      if (updatedFields.phone !== undefined) lenderData.phone = updatedFields.phone;
      if (updatedFields.email !== undefined) lenderData.email = updatedFields.email;
      if (updatedFields.minRate !== undefined) lenderData.min_rate = updatedFields.minRate;
      if (updatedFields.maxRate !== undefined) lenderData.max_rate = updatedFields.maxRate;
      if (updatedFields.minLoan !== undefined) lenderData.min_loan = updatedFields.minLoan;
      if (updatedFields.maxLoan !== undefined) lenderData.max_loan = updatedFields.maxLoan;
      if (updatedFields.minTerm !== undefined) lenderData.min_term = updatedFields.minTerm;
      if (updatedFields.maxTerm !== undefined) lenderData.max_term = updatedFields.maxTerm;
      if (updatedFields.minAge !== undefined) lenderData.min_age = updatedFields.minAge;
      if (updatedFields.maxAge !== undefined) lenderData.max_age = updatedFields.maxAge;
      if (updatedFields.minLoanProcessingTime !== undefined) lenderData.min_loan_processing_time = updatedFields.minLoanProcessingTime;
      if (updatedFields.maxLoanProcessingTime !== undefined) lenderData.max_loan_processing_time = updatedFields.maxLoanProcessingTime;
      if (updatedFields.minDecisionTime !== undefined) lenderData.min_decision_time = updatedFields.minDecisionTime;
      if (updatedFields.maxDecisionTime !== undefined) lenderData.max_decision_time = updatedFields.maxDecisionTime;
      if (updatedFields.minTradingPeriod !== undefined) lenderData.min_trading_period = updatedFields.minTradingPeriod;
      if (updatedFields.maxLoanToValue !== undefined) lenderData.max_loan_to_value = updatedFields.maxLoanToValue;
      if (updatedFields.personalGuarantee !== undefined) lenderData.personal_guarantee = updatedFields.personalGuarantee;
      if (updatedFields.earlyRepaymentCharges !== undefined) lenderData.early_repayment_charges = updatedFields.earlyRepaymentCharges;
      if (updatedFields.interestTreatment !== undefined) lenderData.interest_treatment = updatedFields.interestTreatment;
      if (updatedFields.coveredLocation !== undefined) lenderData.covered_location = updatedFields.coveredLocation;
      if (updatedFields.loanTypes !== undefined) lenderData.loan_types = updatedFields.loanTypes;
      if (updatedFields.additionalInfo !== undefined) lenderData.additional_info = updatedFields.additionalInfo || null;
      
      lenderData.updated_at = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('lenders')
        .update(lenderData)
        .eq('id', id);
      
      if (updateError) {
        console.error('Error updating lender:', updateError);
        return;
      }

      if (updatedFields.criteriaSheets) {
        const newSheets = updatedFields.criteriaSheets.filter(sheet => !sheet.id);
        
        for (const sheet of newSheets) {
          if (sheet.file) {
            await addCriteriaSheet(id, sheet.name, sheet.file);
          }
        }
      }

      const { data: updatedLender, error: fetchError } = await supabase
        .from('lenders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching updated lender:', fetchError);
        return;
      }

      const { data: sheetsData, error: sheetsError } = await supabase
        .from('criteria_sheets')
        .select('*')
        .eq('lender_id', id);
      
      if (sheetsError) {
        console.error('Error fetching criteria sheets:', sheetsError);
        return;
      }

      const criteriaSheets = sheetsData?.map(sheet => ({
        id: sheet.id,
        name: sheet.name,
        url: sheet.url,
        uploadDate: new Date(sheet.upload_date)
      })) || [];

      const mappedLender = {
        id: updatedLender.id,
        name: updatedLender.name,
        logo: updatedLender.logo || '',
        websiteLink: updatedLender.website_link,
        phone: updatedLender.phone,
        email: updatedLender.email,
        minRate: updatedLender.min_rate,
        maxRate: updatedLender.max_rate,
        minLoan: updatedLender.min_loan,
        maxLoan: updatedLender.max_loan,
        minTerm: updatedLender.min_term,
        maxTerm: updatedLender.max_term,
        minAge: updatedLender.min_age,
        maxAge: updatedLender.max_age,
        minLoanProcessingTime: updatedLender.min_loan_processing_time,
        maxLoanProcessingTime: updatedLender.max_loan_processing_time,
        minDecisionTime: updatedLender.min_decision_time,
        maxDecisionTime: updatedLender.max_decision_time,
        minTradingPeriod: updatedLender.min_trading_period,
        maxLoanToValue: updatedLender.max_loan_to_value,
        personalGuarantee: updatedLender.personal_guarantee,
        earlyRepaymentCharges: updatedLender.early_repayment_charges,
        interestTreatment: updatedLender.interest_treatment,
        coveredLocation: updatedLender.covered_location,
        loanTypes: updatedLender.loan_types,
        criteriaSheets,
        additionalInfo: updatedLender.additional_info || '',
        createdAt: new Date(updatedLender.created_at),
        updatedAt: new Date(updatedLender.updated_at)
      };

      setLenders(prev => {
        const updated = prev.map(lender => 
          lender.id === id ? mappedLender : lender
        );
        return updated.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name A-Z
      });

    } catch (error) {
      console.error('Error updating lender:', error);
    }
  };

  const deleteLender = async (id: string) => {
    try {
      // Delete all criteria sheets first
      const { data: sheets } = await supabase
        .from('criteria_sheets')
        .select('id, url')
        .eq('lender_id', id);
      
      if (sheets) {
        for (const sheet of sheets) {
          if (sheet.url) {
            const fileName = sheet.url.split('/').pop();
            if (fileName) {
              await supabase.storage
                .from('criteria-sheets')
                .remove([fileName]);
            }
          }
        }
      }

      const { error } = await supabase
        .from('lenders')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting lender:', error);
        return;
      }

      setLenders(prev => prev.filter(lender => lender.id !== id));
    } catch (error) {
      console.error('Error deleting lender:', error);
    }
  };

  const getLenderById = (id: string) => {
    return lenders.find(lender => lender.id === id);
  };

  const addCriteriaSheet = async (lenderId: string, name: string, file: File) => {
    try {
      const fileName = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const { error: uploadError } = await supabase.storage
        .from('criteria-sheets')
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: 'application/pdf'
        });
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('criteria-sheets')
        .getPublicUrl(fileName);
      
      if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error('Error getting public URL for file');
        return;
      }
      
      const { error: insertError } = await supabase
        .from('criteria_sheets')
        .insert({
          lender_id: lenderId,
          name,
          url: publicUrlData.publicUrl
        });
      
      if (insertError) {
        console.error('Error adding criteria sheet:', insertError);
        // Clean up the uploaded file if database insert fails
        await supabase.storage
          .from('criteria-sheets')
          .remove([fileName]);
        return;
      }

      const { data: updatedLender, error: lenderError } = await supabase
        .from('lenders')
        .select('*')
        .eq('id', lenderId)
        .single();
      
      if (lenderError) {
        console.error('Error fetching lender after adding criteria sheet:', lenderError);
        return;
      }
      
      const { data: sheetsData, error: sheetsError } = await supabase
        .from('criteria_sheets')
        .select('*')
        .eq('lender_id', lenderId);
      
      if (sheetsError) {
        console.error('Error fetching criteria sheets after add:', sheetsError);
        return;
      }
      
      const criteriaSheets = sheetsData?.map(sheet => ({
        id: sheet.id,
        name: sheet.name,
        url: sheet.url,
        uploadDate: new Date(sheet.upload_date)
      })) || [];
      
      setLenders(prev => {
        const updated = prev.map(lender => {
          if (lender.id === lenderId) {
            return {
              ...lender,
              criteriaSheets
            };
          }
          return lender;
        });
        return updated.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name A-Z
      });
    } catch (error) {
      console.error('Error adding criteria sheet:', error);
    }
  };

  const deleteCriteriaSheet = async (lenderId: string, sheetId: string) => {
    try {
      const { data: sheetData, error: sheetError } = await supabase
        .from('criteria_sheets')
        .select('url')
        .eq('id', sheetId)
        .single();
      
      if (sheetError) {
        console.error('Error fetching criteria sheet to delete:', sheetError);
        return;
      }
      
      if (sheetData && sheetData.url) {
        const fileName = sheetData.url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('criteria-sheets')
            .remove([fileName]);
        }
      }
      
      const { error: deleteError } = await supabase
        .from('criteria_sheets')
        .delete()
        .eq('id', sheetId);
      
      if (deleteError) {
        console.error('Error deleting criteria sheet:', deleteError);
        return;
      }

      setLenders(prev => {
        const updated = prev.map(lender => {
          if (lender.id === lenderId) {
            return {
              ...lender,
              criteriaSheets: lender.criteriaSheets.filter(sheet => sheet.id !== sheetId)
            };
          }
          return lender;
        });
        return updated.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name A-Z
      });
    } catch (error) {
      console.error('Error deleting criteria sheet:', error);
    }
  };

  const resetFilters = () => {
    setFilterOptions({});
  };

  const value = {
    lenders,
    filteredLenders,
    filterOptions,
    setFilterOptions,
    addLender,
    updateLender,
    deleteLender,
    getLenderById,
    addCriteriaSheet,
    deleteCriteriaSheet,
    allLoanTypes,
    allLocations,
    allInterestTreatments,
    resetFilters,
    isLoading
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <LenderContext.Provider value={value}>{children}</LenderContext.Provider>;
};