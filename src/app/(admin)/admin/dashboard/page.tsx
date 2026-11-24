import {
  Users,
  FileText,
  Clock,
  TrendingUp,
  DollarSign,
  GraduationCap,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { connect } from "@/lib/db";
import User from "@/models/User";
import Application from "@/models/Application";
import Document from "@/models/Document";
import Task from "@/models/Task";
import University from "@/models/University";

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  await connect();

  const [
    totalStudents,
    totalApplications,
    pendingDocsCount,
    universitiesCount,
    agentsCount,
    recentTasks,
    applicationStats
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    Application.countDocuments({}),
    Document.countDocuments({ status: "Pending" }),
    University.countDocuments({}),
    User.countDocuments({ role: "agent" }),
    Task.find({ status: "Pending" }).sort({ priority: 1, createdAt: -1 }).limit(5), 
    Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ])
  ]);

  const statusMap: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applicationStats.forEach((s: any) => { statusMap[s._id] = s.count; });

  const activeApps = totalApplications - (statusMap["Draft"] || 0) - (statusMap["Rejected"] || 0);
  
  const estimatedRevenue = activeApps * 50; 

  const funnelData = [
    { stage: "Total Applied", count: totalApplications, percentage: 100 },
    { stage: "Under Review", count: statusMap["Under Review"] || 0, percentage: totalApplications ? Math.round(((statusMap["Under Review"] || 0) / totalApplications) * 100) : 0 },
    { stage: "Offer Issued", count: statusMap["Offer Issued"] || 0, percentage: totalApplications ? Math.round(((statusMap["Offer Issued"] || 0) / totalApplications) * 100) : 0 },
    { stage: "Visa Pending", count: statusMap["Visa Pending"] || 0, percentage: totalApplications ? Math.round(((statusMap["Visa Pending"] || 0) / totalApplications) * 100) : 0 },
    { stage: "Enrolled", count: statusMap["Enrolled"] || 0, percentage: totalApplications ? Math.round(((statusMap["Enrolled"] || 0) / totalApplications) * 100) : 0 },
  ];

  return {
    kpiCards: [
      { 
        title: "Total Students", 
        value: totalStudents.toLocaleString(), 
        change: "+12%", 
        trend: "up",
        icon: Users,
        color: "text-blue-600 bg-blue-100"
      },
      { 
        title: "Active Applications", 
        value: activeApps.toLocaleString(), 
        change: "+8%", 
        trend: "up",
        icon: FileText,
        color: "text-green-600 bg-green-100"
      },
      { 
        title: "Pending Documents", 
        value: pendingDocsCount.toString(), 
        change: pendingDocsCount > 10 ? "+High" : "-Low", 
        trend: pendingDocsCount > 10 ? "up" : "down",
        icon: Clock,
        color: "text-orange-600 bg-orange-100"
      },
      { 
        title: "Est. Revenue", 
        value: `$${estimatedRevenue.toLocaleString()}`, 
        change: "+23%", 
        trend: "up",
        icon: DollarSign,
        color: "text-purple-600 bg-purple-100"
      },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workQueue: recentTasks.map((task: any) => ({
      task: task.title,
      count: 1, 
      priority: task.priority ? task.priority.toLowerCase() : "medium"
    })),
    funnelData: funnelData,
    alerts: [
      pendingDocsCount > 5 ? { type: "warning", message: `${pendingDocsCount} documents waiting for review`, time: "Real-time" } : null,
      { type: "info", message: "System operational", time: "Now" },
      activeApps > 0 ? { type: "info", message: `${activeApps} applications currently active`, time: "Real-time" } : null,
    ].filter(Boolean),
    quickStats: [
        { label: "Universities", value: universitiesCount.toString(), icon: GraduationCap, color: "bg-primary/10 text-primary" },
        { label: "Offers Issued", value: (statusMap["Offer Issued"] || 0).toString(), icon: CheckCircle, color: "bg-green-100 text-green-600" },
        { label: "Active Agents", value: agentsCount.toString(), icon: Users, color: "bg-blue-100 text-blue-600" },
        { label: "Visa Success", value: `${statusMap["Enrolled"] || 0}`, icon: TrendingUp, color: "bg-purple-100 text-purple-600" },
    ]
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here is what happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpiCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className={`h-4 w-4 ${card.trend === 'up' ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                    <span className={`text-sm ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {card.change}
                    </span>
                    <span className="text-sm text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {data.workQueue.length > 0 ? (
                <div className="space-y-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {data.workQueue.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                        item.priority === 'high' ? 'bg-red-500' :
                        item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <span className="text-sm text-foreground truncate max-w-[180px]">{item.task}</span>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                        {item.priority}
                    </Badge>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-4">No pending tasks</div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Application Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.funnelData.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{stage.stage}</span>
                    <span className="text-muted-foreground">{stage.count}</span>
                  </div>
                  <Progress value={stage.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {data.alerts.map((alert: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`mt-0.5 ${
                    alert.type === 'error' ? 'text-red-500' :
                    alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                  }`}>
                    {alert.type === 'error' ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : alert.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.quickStats.map((stat, index) => (
            <Card key={index}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}