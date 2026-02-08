import { connect } from "@/lib/db";
import Application from "@/models/Application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingDown, 
  TrendingUp, 
  Filter, 
  Download 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FunnelChartComponent from "./FunnelChartComponent"; 

async function getFunnelData() {
  await connect();

  const stats = await Application.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const statusMap: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats.forEach((s: any) => { statusMap[s._id] = s.count; });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = stats.reduce((acc: number, curr: any) => acc + curr.count, 0);
  
  const applied = total; 
  const underReview = statusMap["Under Review"] || 0;
  const offerIssued = statusMap["Offer Issued"] || 0;
  const visaProcessing = statusMap["Visa Pending"] || 0;
  const enrolled = statusMap["Enrolled"] || 0;

  const chartData = [
    { name: "Applied", value: applied, fill: "#3b82f6" },      
    { name: "Under Review", value: underReview, fill: "#8b5cf6" }, 
    { name: "Offer Issued", value: offerIssued, fill: "#10b981" },
    { name: "Visa Process", value: visaProcessing, fill: "#f59e0b" },
    { name: "Enrolled", value: enrolled, fill: "#f43f5e" },     
  ];

  const conversionRate = applied > 0 ? ((enrolled / applied) * 100).toFixed(1) : "0";

  return { chartData, total, enrolled, conversionRate };
}

export default async function FunnelReportPage() {
  const { chartData, total, enrolled, conversionRate } = await getFunnelData();

  return (
    <div className="space-y-6 p-6 animate-in fade-in-50">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Application Funnel</h1>
          <p className="text-muted-foreground text-sm">Track student conversion from application to enrollment.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2"/> Filter</Button>
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2"/> Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{total}</div>
                <p className="text-xs text-muted-foreground mt-1">All time applications</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Enrolled</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600">{enrolled}</div>
                <div className="flex items-center text-xs text-green-600 mt-1 gap-1">
                    <TrendingUp className="h-3 w-3" /> Students finalized
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-blue-600">{conversionRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">Lead to Enrollment ratio</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Conversion Visualization</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
                <FunnelChartComponent data={chartData} />
            </CardContent>
        </Card>

        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Stage Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {chartData.map((item, index) => {
                        const prevValue = index > 0 ? chartData[index - 1].value : item.value;
                        const dropOff = prevValue > 0 ? Math.round(((prevValue - item.value) / prevValue) * 100) : 0;
                        
                        return (
                            <div key={item.name} className="relative">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="font-medium text-sm">{item.name}</span>
                                    <span className="font-bold">{item.value}</span>
                                </div>
                                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${(item.value / total) * 100}%`, backgroundColor: item.fill }} 
                                    />
                                </div>
                                {index > 0 && (
                                    <div className="text-xs text-muted-foreground mt-1 flex justify-end items-center gap-1">
                                        <TrendingDown className="h-3 w-3 text-red-400" />
                                        {dropOff}% drop-off
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}