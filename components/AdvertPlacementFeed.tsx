import React from "react";

import RotatingAdvert from "@/components/RotatingAdvert";
import {
  AdvertPlacement,
  getActiveAdverts,
} from "@/lib/queries/admin/adverts";

export default async function AdvertPlacementFeed({
  placement,
  className = "",
  limit = 20,
}: {
  placement: AdvertPlacement;
  className?: string;
  limit?: number;
}) {
  const feed =
    await getActiveAdverts(
      placement,
      limit
    );

  if (
    !feed.success ||
    !feed.adverts.length
  ) {
    return null;
  }

  return (
    <RotatingAdvert
      adverts={feed.adverts}
      interval={
        feed.rotationInterval
      }
      className={className}
    />
  );
}
