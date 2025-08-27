// Year options from 1990 to 2023
export const YEAR_OPTIONS = Array.from({ length: 34 }, (_, i) => {
  const year = 1990 + i;
  return { value: year.toString(), label: year.toString() };
});

// Indian states and union territories
export const STATE_OPTIONS = [
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Tripura", label: "Tripura" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" },
  { value: "Delhi", label: "Delhi" },
  { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
  { value: "Ladakh", label: "Ladakh" },
  { value: "Chandigarh", label: "Chandigarh" },
  {
    value: "Dadra and Nagar Haveli and Daman and Diu",
    label: "Dadra and Nagar Haveli and Daman and Diu",
  },
  { value: "Lakshadweep", label: "Lakshadweep" },
  { value: "Puducherry", label: "Puducherry" },
  {
    value: "Andaman and Nicobar Islands",
    label: "Andaman and Nicobar Islands",
  },
];

// Table type options
export const TABLE_TYPE_OPTIONS = [
  { value: "by", label: "By" },
  { value: "against", label: "Against" },
];

// Column type options
export const COLUMN_TYPE_OPTIONS = [
  { value: "a_aff_resolved", label: "Affected Resolved (A)" },
  { value: "c_aff_resolved", label: "Affected Resolved (C)" },
];

// Default values
export const DEFAULT_VALUES = {
  START_YEAR: "2020" as string,
  END_YEAR: "2023" as string,
  SELECTED_STATE: "Bihar" as string,
  TABLE_TYPE: "by" as "by" | "against",
  COLUMN_TYPE: "a_aff_resolved" as "a_aff_resolved" | "c_aff_resolved",
};

// API Configuration
export const API_BASE_URL = import.meta.env.PROD
  ? "https://complainst-deployment.onrender.com"
  : "";
