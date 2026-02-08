import { Award } from "lucide-react";

interface ScholarshipCardProps {
  name: string;
  type: string;
  tuitionFee: string;
  accommodationFee: string;
  insuranceFee: string;
  monthlyStipend: string;
  yearlyStipend: string;
}

const isFree = (value: string | undefined | null) => {
  return (value || "").toLowerCase() === "free";
};

const FeeItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span
      className={`text-sm font-medium ${
        isFree(value) ? "text-success" : value === "N/A" ? "text-muted-foreground" : "text-foreground"
      }`}
    >
      {value}
    </span>
  </div>
);

const ScholarshipCard = ({
  name,
  type,
  tuitionFee,
  accommodationFee,
  insuranceFee,
  monthlyStipend,
  yearlyStipend,
}: ScholarshipCardProps) => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-primary p-4">
        <div className="flex items-center gap-2 text-primary-foreground">
          <Award className="h-5 w-5" />
          <span className="text-xs font-medium uppercase tracking-wide">{type}</span>
        </div>
        <h3 className="text-lg font-semibold text-primary-foreground mt-2 leading-tight">{name}</h3>
      </div>
      <div className="p-4">
        <FeeItem label="Tuition Fee" value={tuitionFee} />
        <FeeItem label="Accommodation Fee" value={accommodationFee} />
        <FeeItem label="Insurance Fee" value={insuranceFee} />
        <FeeItem label="Stipend Monthly" value={monthlyStipend} />
        <FeeItem label="Stipend Yearly" value={yearlyStipend} />
      </div>
    </div>
  );
};

export default ScholarshipCard;