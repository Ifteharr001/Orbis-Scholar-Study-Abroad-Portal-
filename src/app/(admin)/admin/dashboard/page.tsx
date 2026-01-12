import { 
  Users, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Clock,
  DollarSign,
  GraduationCap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// 1. Data Fetching Simulation (Replace this with actual DB/API calls later)
async function getDashboardData() {
  // Simulate delay or API call
  // const res = await fetch('https://api.example.com/dashboard');
  // return res.json();

  return {
    kpiCards: [
      { 
        title: "Total Students", 
        value: "2,847", 
        change: "+12%", 
        trend: "up",
        icon: Users,
        color: "text-blue-600 bg-blue-100"
      },
      { 
        title: "Active Applications", 
        value: "1,234", 
        change: "+8%", 
        trend: "up",
        icon: FileText,
        color: "text-green-600 bg-green-100"
      },
      { 
        title: "Pending Documents", 
        value: "89", 
        change: "-5%", 
        trend: "down",
        icon: Clock,
        color: "text-orange-600 bg-orange-100"
      },
      { 
        title: "Revenue (MTD)", 
        value: "$125,430", 
        change: "+23%", 
        trend: "up",
        icon: DollarSign,
        color: "text-purple-600 bg-purple-100"
      },
    ],
    workQueue: [
      { task: "Document verification", count: 23, priority: "high" },
      { task: "Application review", count: 15, priority: "medium" },
      { task: "Student inquiries", count: 8, priority: "low" },
      { task: "Visa follow-ups", count: 12, priority: "high" },
      { task: "Payment reconciliation", count: 5, priority: "medium" },
    ],
    funnelData: [
      { stage: "Leads", count: 450, percentage: 100 },
      { stage: "Applications Started", count: 320, percentage: 71 },
      { stage: "Documents Submitted", count: 280, percentage: 62 },
      { stage: "Offer Received", count: 180, percentage: 40 },
      { stage: "Visa Applied", count: 120, percentage: 27 },
      { stage: "Enrolled", count: 95, percentage: 21 },
    ],
    alerts: [
      { type: "warning", message: "5 visa applications expiring in 3 days", time: "2h ago" },
      { type: "error", message: "Payment failed for invoice #4521", time: "4h ago" },
      { type: "info", message: "New intake opening for Fall 2025", time: "1d ago" },
      { type: "warning", message: "12 documents pending for 7+ days", time: "1d ago" },
    ],
    quickStats: [
        { label: "Universities", value: "156", icon: GraduationCap, color: "bg-primary/10 text-primary" },
        { label: "Offers Received", value: "892", icon: CheckCircle, color: "bg-green-100 text-green-600" },
        { label: "Active Agents", value: "45", icon: Users, color: "bg-blue-100 text-blue-600" },
        { label: "Visa Success Rate", value: "78%", icon: TrendingUp, color: "bg-purple-100 text-purple-600" },
    ]
  };
}

export default async function AdminDashboardPage() {
  // 2. Fetch data inside the Server Component
  const data = await getDashboardData();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here what happening today.</p>
      </div>

      {/* KPI Cards */}
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
        {/* Work Queue */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Work Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.workQueue.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.priority === 'high' ? 'bg-red-500' :
                      item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className="text-sm text-foreground">{item.task}</span>
                  </div>
                  <Badge variant="secondary" className="font-medium">
                    {item.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Funnel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Conversion Funnel</CardTitle>
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

        {/* Alerts */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.alerts.map((alert, index) => (
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

      {/* Quick Stats */}
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