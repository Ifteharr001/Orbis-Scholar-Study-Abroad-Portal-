import { connect } from "@/lib/db";
import AuditLog from "@/models/AuditLog";

export async function logActivity(
  action: string,
  email: string,
  role: string,
  details: string = "",
  ip: string = "127.0.0.1"
) {
  try {
    await connect();
    await AuditLog.create({
      action,
      performedBy: email,
      role,
      details,
      ipAddress: ip
    });
  } catch (error) {
    console.error("Failed to create audit log", error);
  }
}