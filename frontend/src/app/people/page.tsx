import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell/page-shell";
import { PeopleDirectory } from "@/components/people-directory/people-directory";

export const metadata: Metadata = {
  title: "Elenco e direção",
};

export default function PeoplePage() {
  return (
    <PageShell
      eyebrow="Créditos"
      title="Elenco e direção"
      description="Explore as pessoas que dão vida aos filmes do catálogo."
    >
      <div className="space-y-12">
        <PeopleDirectory kind="directors" title="Diretores" />
        <PeopleDirectory kind="actors" title="Atores" />
      </div>
    </PageShell>
  );
}
