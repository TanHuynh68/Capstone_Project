import { STATUS_MAPPING } from "../constants/reports.constants";

export const getStatusNumber = (status: string): number => {
  const normalizedStatus = status.toLowerCase() as keyof typeof STATUS_MAPPING;
  return STATUS_MAPPING[normalizedStatus] || 0;
};

export const highlightMatch = (text: string, keyword: string) => {
  if (!text || !keyword) return text;

  const parts = text.split(new RegExp(`(${keyword})`, "gi"));

  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 text-black px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
};


export const filterReportsBySearch = (reports: Report[], searchTerm: string) => {
  if (!searchTerm.trim()) return reports;
  const keyword = searchTerm.trim().toLowerCase();
  return reports.filter((report) =>
    Object.values(report).some((value) =>
      String(value).toLowerCase().includes(keyword)
    )
  );
};