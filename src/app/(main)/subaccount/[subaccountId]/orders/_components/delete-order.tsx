"use client";

import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  deleteFunnel,
  deleteOrder,
  getSubaccountDetails,
  saveActivityLogsNotification,
} from "@/lib/queries";

type Props = {
  orderId: string;
  subaccountId: string;
};

const DeleteButton = ({ subaccountId, orderId }: Props) => {
  const router = useRouter();

  return (
    <Button
      variant={"outline"}
      className="w-22 self-end border-destructive text-destructive hover:bg-destructive"
      type="button"
      onClick={async () => {
        const response = await getSubaccountDetails(subaccountId);
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Deleted an order | ${response?.name}`,
          subaccountId,
        });
        await deleteOrder(orderId);
        router.refresh();
      }}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;
