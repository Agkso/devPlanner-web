import { Loader2 } from "lucide-react";
import LogRow from "./LogsRow";
import { AuditLog } from "../../pages/AdminLogs";

interface LogsTableProps {
  logs: AuditLog[];
  isLoading: boolean;
}

export const LogsTable = ({ logs, isLoading }: LogsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!logs.length) {
    return <p className="textcenter">Nenhum log encontrado</p>;
  }

    return (
    <div className="surface rounded-2xl border border-border">
        <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed text-base">
            <thead>
            <tr className="border-b border-border">
                <th className=" px-4 py-3 text-center text-xs text-muted-foreground w-[15%]">
                Usuário
                </th>
                <th className="px-4 py-3 text-center text-xs text-muted-foreground w-[10%]">
                Ação
                </th>
                <th className="px-4 py-3 text-center text-xs text-muted-foreground w-[10%]">
                Recurso
                </th>
                <th className="px-4 py-3 text-center text-xs text-muted-foreground w-[10%]">
                ID
                </th>
                <th className="px-4 py-3 text-center text-xs text-muted-foreground w-[20%]">
                Quando
                </th>
                <th className="px-4 py-3 text-center text-xs text-muted-foreground w-[35%]">
                Detalhes
                </th>
            </tr>
            </thead>

            <tbody>
            {logs.map((log) => (
                <LogRow key={log._id} log={log} />
            ))}
            </tbody>
        </table>
        </div>
    </div>
    );
}