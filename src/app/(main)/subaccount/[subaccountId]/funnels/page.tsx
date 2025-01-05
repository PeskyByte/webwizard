import { Plus } from "lucide-react";

import BlurPage from "@/components/blur-page";
import FunnelForm from "@/components/forms/funnel-form";
import { getFunnels } from "@/lib/queries";

import { columns } from "./columns";
import FunnelsDataTable from "./data-table";

const Funnels = async (props: {
  params: Promise<{ subaccountId: string }>;
}) => {
  const params = await props.params;
  const funnels = await getFunnels(params.subaccountId);
  if (!funnels) return null;

  return (
    <BlurPage>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={
          <FunnelForm subAccountId={params.subaccountId}></FunnelForm>
        }
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  );
};

export default Funnels;
