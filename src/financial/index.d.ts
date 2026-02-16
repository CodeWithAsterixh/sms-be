export interface FinancialRecord {
  id: number;
  student_id: number;
  academic_session: string;
  term: string;
  payment_status: "paid" | "unpaid" | "partial";
  amount_paid: number;
  amount_due: number;
  recorded_by: number;
  recorder_name?: string;
  recorded_at: string;
  updated_at: string;
}

export interface CreateFinancialRecordDTO {
  student_id: number;
  academic_session: string;
  term: string;
  payment_status: "paid" | "unpaid" | "partial";
  amount_paid: number;
  amount_due: number;
  recorded_by: number;
}

export interface UpdateFinancialRecordDTO {
  payment_status?: "paid" | "unpaid" | "partial";
  amount_paid?: number;
  amount_due?: number;
}
