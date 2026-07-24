import type { Metadata } from "next";
import { MemberDirectory } from "@/components/member-directory/member-directory";
import { PageShell } from "@/components/page-shell/page-shell";

export const metadata: Metadata = {
  title: "Membros",
};

export default function MembersPage() {
  return (
    <PageShell
      eyebrow="Comunidade"
      title="Membros"
      description="Conheça outras pessoas que também estão registrando sua história com o cinema."
    >
      <MemberDirectory />
    </PageShell>
  );
}
