"use client";

import { Funnel } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  saveActivityLogsNotification,
  updateFunnelProducts,
} from "@/lib/queries";

interface FunnelProductsTableProps {
  defaultData: Funnel;
}

const FunnelProductsTable: React.FC<FunnelProductsTableProps> = ({
  defaultData,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [liveProducts, setLiveProducts] = useState<
    { productId: string; recurring: boolean }[] | []
  >(JSON.parse(defaultData.liveProducts || "[]"));

  const handleSaveProducts = async () => {
    setIsLoading(true);
    const response = await updateFunnelProducts(
      JSON.stringify(liveProducts),
      defaultData.id,
    );
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Update funnel products | ${response.name}`,
      subaccountId: defaultData.subAccountId,
    });
    setIsLoading(false);
    router.refresh();
  };

  return (
    <>
      <Table className="bg-card border-[1px] border-border rounded-md">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead>Live</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {}
        </TableBody>
      </Table>
      <Button
        disabled={isLoading}
        onClick={handleSaveProducts}
        className="mt-4"
      >
        Save Products
      </Button>
    </>
  );
};

export default FunnelProductsTable;
