import { Funnel } from "@prisma/client";

import FunnelForm from "@/components/forms/funnel-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";

import DeleteButton from "../../_components/delete-funnel";
import FunnelProductsTable from "./funnel-products-table";

interface FunnelSettingsProps {
  subaccountId: string;
  defaultData: Funnel;
}

const FunnelSettings: React.FC<FunnelSettingsProps> = async ({
  subaccountId,
  defaultData,
}) => {
  //CHALLENGE: go connect your stripe to sell products

  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  });

  if (!subaccountDetails) return;

  return (
    <div className="flex gap-4 flex-col xl:!flex-row">
      <FunnelForm subAccountId={subaccountId} defaultData={defaultData} />

      <Card className="flex-1 flex-shrink">
        <CardHeader>
          <CardTitle>Delete This Funnel</CardTitle>
          <CardDescription>
            This action will delete the current opened tunnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteButton subaccountId={subaccountId} funnelId={defaultData.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FunnelSettings;
