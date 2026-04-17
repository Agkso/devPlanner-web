import { AuditLog } from "../../pages/AdminLogs";

const actionTone = (action: string) => {
    switch (action) {
        case "CREATE":
            return "text-green-500";
        case "UPDATE":
            return "text-yellow-500";
        case "DELETE":
            return "text-red-500";
        default:
            return "text-gray-400";
    }
};

export default function LogRow({ log }: { log: AuditLog }) {
    return (
        <tr className="border-b border-border hover:bg-muted/10 transition-colors">
            <td className="px-4 py-3 text-center">
                {log.user.name}
            </td>

            <td className={`px-4 py-3 text-center ${actionTone(log.action)}`}>
                {log.action}
            </td>

            <td className="px-4 py-3 text-center">
                {log.resource}
            </td>

            <td className="px-4 py-3 text-center">
                {log.resourceId.slice(-6)}
            </td>

            <td className="px-4 py-3 text-center whitespace-nowrap">
                {new Date(log.createdAt).toLocaleString("pt-BR")}
            </td>

            <td className="px-4 py-3 text-center">
                <pre className="text-xs whitespace-pre-wrap break-words max-w-full">
                    {JSON.stringify(log.details, null, 2)}
                </pre>
            </td>
        </tr>
    );
}