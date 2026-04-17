import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { PrivateRoute } from "../components/PrivateRoute";
import api from "../services/api";
import { toast } from "sonner";
import LogsFilter from "../components/logs/LogsFilter";
import LogsTable from "../components/logs/LogsTable";
import LogsHeader from "../components/logs/LogsHeader";

export interface AuditLogUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditLog {
  _id: string;
  user: AuditLogUser;
  action: string;
  details: Record<string, any>;
  resource: string;
  resourceId: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/admin/logs");
      setLogs(response.data);
    } catch (error) {
      toast.error("Erro ao carregar logs");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) =>
    [log.user.name, log.action, log.resource]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <PrivateRoute requiredRole="Admin">
      <DashboardLayout>
        <div className="w-full  ml-10 space-y-8">
          <LogsHeader onReload={loadLogs} />
          <LogsFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            total={logs.length}
            filtered={filteredLogs.length}
          />
          <LogsTable logs={filteredLogs} isLoading={isLoading} />
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}