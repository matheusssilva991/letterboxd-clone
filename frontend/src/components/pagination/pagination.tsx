import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-3"
      aria-label="Paginação"
    >
      <Button
        type="button"
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="border-white/15 bg-transparent text-white hover:bg-white/10"
      >
        Anterior
      </Button>
      <span className="text-sm text-letterboxd-label">
        Página <strong className="text-white">{page}</strong> de {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="border-white/15 bg-transparent text-white hover:bg-white/10"
      >
        Próxima
      </Button>
    </nav>
  );
}
