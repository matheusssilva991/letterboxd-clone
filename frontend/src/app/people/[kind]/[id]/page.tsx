import { notFound } from "next/navigation";
import { PersonProfile } from "@/components/person-profile/person-profile";

interface PersonPageProps {
  params: Promise<{ kind: string; id: string }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { kind, id } = await params;
  if (kind !== "actors" && kind !== "directors") notFound();
  return <PersonProfile kind={kind} personId={id} />;
}
