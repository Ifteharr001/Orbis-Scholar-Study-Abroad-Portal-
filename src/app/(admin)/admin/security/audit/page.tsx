
/* eslint-disable @typescript-eslint/no-explicit-any */

import { connect } from "@/lib/db";
import AuditLog from "@/models/AuditLog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Search, Clock, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export const dynamic = 'force-dynamic';

async function getAuditLogs() {
  await connect();
  
  const logs = await AuditLog.find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return JSON.parse(JSON.stringify(logs));
}

export default async function AuditLogPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6 p-6 animate-in fade-in-50">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-blue-600" /> Security Audit Log
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track all system activities, logins, and critical changes.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-md bg-white p-1 rounded-sm border shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Filter logs by user or action..." 
          className="border-none focus-visible:ring-0 rounded-sm shadow-none"
        />
      </div>

      <Card>
        <CardHeader className="bg-slate-50 py-4 border-b">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Performed By</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right">Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No activity logs found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        logs.map((log: any) => (
                            <TableRow key={log._id} className="hover:bg-slate-50/50">
                                <TableCell>
                                    <div className="font-medium text-slate-800">{log.action}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-0.5">IP: {log.ipAddress || "N/A"}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 bg-slate-100 rounded-full">
                                            <User className="h-3 w-3 text-slate-500"/>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">{log.performedBy}</div>
                                            <Badge variant="outline" className="text-[10px] h-4 px-1 py-0">{log.role}</Badge>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[300px]">
                                    <p className="text-sm text-slate-600 truncate" title={log.details}>
                                        {log.details || "-"}
                                    </p>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1.5 text-slate-500">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span className="text-xs">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}