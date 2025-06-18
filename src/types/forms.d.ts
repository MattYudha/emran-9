export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  lang?: string;
}

export interface ContactSubmission extends ContactFormData {
  id: string;
  sourceIp?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface FormValidationError {
  field: string;
  message: string;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  errors?: FormValidationError[];
}
