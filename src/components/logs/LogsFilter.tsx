import { Search } from "lucide-react";

export const LogsFilter = ({
  searchTerm,
  setSearchTerm,
  total,
  filtered,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  total: number;
  filtered: number;
}) => {
  return (
    <div className="w-full surface rounded-2xl border border-border p-5 flex flex-col md:flex-row gap-4">
      <label className="flex items-center gap-3 px-3 h-11 rounded-md bg-background/60 border border-border flex-1">
        <Search className="size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none text-sm flex-1"
        />
      </label>

      <div className="text-xs text-muted-foreground">
        {filtered} de {total}
      </div>
    </div>
  );
}