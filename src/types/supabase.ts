export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      lenders: {
        Row: {
          id: string
          name: string
          logo: string | null
          website_link: string
          phone: string
          email: string
          min_rate: number
          max_rate: number
          min_loan: number
          max_loan: number
          min_term: number
          max_term: number
          min_age: number
          max_age: number
          min_loan_processing_time: number
          max_loan_processing_time: number
          min_decision_time: number
          max_decision_time: number
          min_trading_period: number
          max_loan_to_value: number
          personal_guarantee: boolean
          early_repayment_charges: boolean
          interest_treatment: string
          covered_location: string[]
          loan_types: string[]
          additional_info: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo?: string | null
          website_link: string
          phone: string
          email: string
          min_rate: number
          max_rate: number
          min_loan: number
          max_loan: number
          min_term: number
          max_term: number
          min_age: number
          max_age: number
          min_loan_processing_time: number
          max_loan_processing_time: number
          min_decision_time: number
          max_decision_time: number
          min_trading_period: number
          max_loan_to_value: number
          personal_guarantee: boolean
          early_repayment_charges: boolean
          interest_treatment: string
          covered_location: string[]
          loan_types: string[]
          additional_info?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo?: string | null
          website_link?: string
          phone?: string
          email?: string
          min_rate?: number
          max_rate?: number
          min_loan?: number
          max_loan?: number
          min_term?: number
          max_term?: number
          min_age?: number
          max_age?: number
          min_loan_processing_time?: number
          max_loan_processing_time?: number
          min_decision_time?: number
          max_decision_time?: number
          min_trading_period?: number
          max_loan_to_value?: number
          personal_guarantee?: boolean
          early_repayment_charges?: boolean
          interest_treatment?: string
          covered_location?: string[]
          loan_types?: string[]
          additional_info?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      criteria_sheets: {
        Row: {
          id: string
          lender_id: string
          name: string
          url: string
          upload_date: string
        }
        Insert: {
          id?: string
          lender_id: string
          name: string
          url: string
          upload_date?: string
        }
        Update: {
          id?: string
          lender_id?: string
          name?: string
          url?: string
          upload_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "criteria_sheets_lender_id_fkey"
            columns: ["lender_id"]
            referencedRelation: "lenders"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          username: string
          password: string
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          password: string
          is_admin: boolean
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          password?: string
          is_admin?: boolean
          created_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          lender_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lender_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lender_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_lender_id_fkey"
            columns: ["lender_id"]
            referencedRelation: "lenders"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}