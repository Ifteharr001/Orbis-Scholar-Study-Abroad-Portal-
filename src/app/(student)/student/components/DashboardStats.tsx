"use client";

import { FileText, Hourglass, Gift, MessageSquare } from "lucide-react";

// ১. ডাটা টাইপ ডিফাইন করা
interface StatsProps {
  stats: {
    applications: number;
    pendingDocs: number;
    offers: number;
    unreadMessages: number;
  };
}

// ২. ডিফল্ট ভ্যালু সেট করা (যদি ডাটা না আসে তবে ০ দেখাবে)
export default function DashboardStats({ stats }: StatsProps) {
  const data = [
    {
      title: "Application submitted",
      value: stats?.applications || 0, // ডায়নামিক ভ্যালু
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Documents pending",
      value: stats?.pendingDocs || 0, // ডায়নামিক ভ্যালু
      icon: Hourglass,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Offers received",
      value: stats?.offers || 0, // ডায়নামিক ভ্যালু
      icon: Gift,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Unread message",
      value: stats?.unreadMessages || 0, // ডায়নামিক ভ্যালু
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="flex gap-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground text-center w-20 leading-tight">
            {item.title}
          </span>
          <span className="text-xl font-bold">{item.value}</span>
        </div>
      ))}
    </div>
  );
}