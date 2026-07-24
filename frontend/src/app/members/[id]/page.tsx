import type { Metadata } from "next";
import { MemberProfile } from "@/components/member-profile/member-profile";

export const metadata: Metadata = {
  title: "Perfil do membro",
};

interface MemberPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberPage({ params }: MemberPageProps) {
  const { id } = await params;
  return <MemberProfile memberId={id} />;
}
