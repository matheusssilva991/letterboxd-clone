"use client";

import Link from "next/link";
import { Clapperboard, UserRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiResource } from "@/hooks/use-api-resource";
import { getPaginatedItems } from "@/lib/api";
import type { PaginatedResponse, Person } from "@/types/api";

interface PeopleSectionProps {
  kind: "actors" | "directors";
  title: string;
}

export function PeopleDirectory({ kind, title }: PeopleSectionProps) {
  const { data, error, isLoading } = useApiResource<PaginatedResponse<Person>>(
    `/${kind}?page=1&limit=12&order=name:ASC`,
  );
  const people = getPaginatedItems(data);

  return (
    <section aria-labelledby={`${kind}-title`}>
      <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
        <Clapperboard className="h-4 w-4 text-letterboxd-blue" aria-hidden="true" />
        <h2
          id={`${kind}-title`}
          className="text-sm font-bold uppercase tracking-[0.18em] text-white"
        >
          {title}
        </h2>
      </div>
      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-20 bg-white/10" />
          ))}
        </div>
      ) : null}
      {error ? <p className="text-sm text-letterboxd-orange">{error}</p> : null}
      {!isLoading && !error && people.length === 0 ? (
        <p className="text-sm text-letterboxd-label">Nenhum nome cadastrado.</p>
      ) : null}
      {people.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => (
            <Link
              key={person.id}
              href={`/people/${kind}/${person.id}`}
              className="flex items-center gap-3 rounded-md bg-[#14181c] p-4 transition hover:bg-[#2c3440]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#445566] text-letterboxd-label">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="truncate font-bold text-white">{person.name}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
