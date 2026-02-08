import { connect } from "@/lib/db";
import Application from "@/models/Application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, CheckCircle, CalendarRange } from "lucide-react";
import ConversionChart from "./ConversionChart"; 

async function getConversionData() {
  await connect();

  const monthlyStats = await Application.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        applications: { $sum: 1 }, 
        enrolled: {
          $sum: {
            $cond: [{ $eq: ["$status", "Enrolled"] }, 1, 0],
          },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    { $limit: 12 }
  ]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartData = monthlyStats.map((stat: any) => ({
    name: `${months[stat._id.month - 1]} ${stat._id.year}`,
    Applications: stat.applications,
    Enrolled: stat.enrolled,
    Rate: stat.applications > 0 ? ((stat.enrolled / stat.applications) * 100).toFixed(1) : 0
  }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalApps = chartData.reduce((acc: number, cur: any) => acc + cur.Applications, 0);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalEnrolled = chartData.reduce((acc: number, cur: any) => acc + cur.Enrolled, 0);
  const avgRate = totalApps > 0 ? ((totalEnrolled / totalApps) * 100).toFixed(1) : "0";

  return { chartData, totalApps, totalEnrolled, avgRate };
}

export default async function ConversionsReportPage() {
  const { chartData, totalApps, totalEnrolled, avgRate } = await getConversionData();

  return (
    <div className="space-y-6 p-6 animate-in fade-in-50">
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Conversion Analytics</h1>
        <p className="text-muted-foreground text-sm">Monthly breakdown of application success rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{avgRate}%</div>
                <p className="text-xs text-muted-foreground">Overall success rate</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Enrolled</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalEnrolled}</div>
                <p className="text-xs text-muted-foreground">Successfully admitted students</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalApps}</div>
                <p className="text-xs text-muted-foreground">Across all programs</p>
            </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <CalendarRange className="h-5 w-5" /> Monthly Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-2 h-[400px]">
          <ConversionChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}