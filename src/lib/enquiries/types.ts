export type EnquiryStatus = "new" | "replied" | "archived";

export type EnquiryRow = {
  id: string;
  reference_number: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  service_slug: string | null;
  service_title: string | null;
  look_slug: string | null;
  look_title: string | null;
  status: EnquiryStatus;
  created_at: string;
  updated_at: string;
};