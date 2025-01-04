import { currentUser } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import React from "react";

import SendInvitation from "@/components/forms/send-invitation";
import { db } from "@/lib/db";

import { columns } from "./columns";
import DataTable from "./data-table";

type Props = {
  params: Promise<{ agencyId: string }>;
};

const TeamPage = async (props: Props) => {
  const params = await props.params;
  const authUser = await currentUser();
  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: params.agencyId,
      },
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });

  if (!authUser) return null;
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    ></DataTable>
  );
};

export default TeamPage;
