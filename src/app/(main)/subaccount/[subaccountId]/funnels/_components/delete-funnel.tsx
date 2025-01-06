"use client";

import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  deleteFunnel,
  getSubaccountDetails,
  saveActivityLogsNotification,
} from "@/lib/queries";

type Props = {
  funnelId: string;
  subaccountId: string;
};

const DeleteButton = ({ subaccountId, funnelId }: Props) => {
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
          description: `Deleted a subaccount | ${response?.name}`,
          subaccountId,
        });
        await deleteFunnel(funnelId);
        router.refresh();
      }}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;
