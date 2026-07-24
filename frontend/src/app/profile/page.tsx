import type { Metadata } from "next";
import { AccountProfile } from "@/components/account-profile/account-profile";
import { PageShell } from "@/components/page-shell/page-shell";

export const metadata: Metadata = {
  title: "Meu perfil",
};

export default function ProfilePage() {
  return (
    <PageShell
      eyebrow="Conta"
      title="Meu perfil"
      description="Gerencie suas informações pessoais e sua identidade na comunidade."
    >
      <AccountProfile />
    </PageShell>
  );
}
