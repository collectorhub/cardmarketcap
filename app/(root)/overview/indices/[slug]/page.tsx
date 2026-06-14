import React from "react";
import { notFound } from "next/navigation";
import IndexDetailsPage from "@/components/indices/IndexDetailsPage";
import { getIndexDetails } from "@/lib/queries/indices";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const response = await getIndexDetails(slug);

  if (!response?.success || !response?.index) {
    notFound();
  }

  return <IndexDetailsPage data={response} />;
}