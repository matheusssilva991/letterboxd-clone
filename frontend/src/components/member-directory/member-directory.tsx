"use client";

import Link from "next/link";
import { useState } from "react";
import { UserRound } from "lucide-react";
import { Pagination } from "@/components/pagination/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiResource } from "@/hooks/use-api-resource";
import { getPaginatedItems } from "@/lib/api";
import type { PaginatedResponse, UserProfile } from "@/types/api";

export function MemberDirectory() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useApiResource<
    PaginatedResponse<UserProfile>
  >(`/users?page=${page}&limit=18`);
  const members = getPaginatedItems(data);

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }, (_, index) => (
          <Skeleton key={index} className="h-24 bg-white/10" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-md border border-letterboxd-orange/30 bg-letterboxd-orange/10 p-6 text-sm text-white">
        {error}
      </p>
    );
  }

  if (members.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-white/15 p-10 text-center text-letterboxd-label">
        Nenhum membro encontrado.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Link
            key={member.id}
            href={`/members/${member.id}`}
            className="flex items-center gap-4 rounded-md bg-[#14181c] p-4 transition hover:bg-[#2c3440] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-letterboxd-blue"
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#445566] text-letterboxd-label">
              <UserRound className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-bold text-white">
                {member.name || member.username}
              </span>
              <span className="block truncate text-sm text-letterboxd-label">
                @{member.username}
              </span>
            </span>
          </Link>
        ))}
      </div>
      <Pagination
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </>
  );
}
