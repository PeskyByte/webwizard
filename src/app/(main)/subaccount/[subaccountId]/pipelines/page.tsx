import { redirect } from "next/navigation";

import { db } from "@/lib/db";

type Props = {
  params: Promise<{ subaccountId: string }>;
};

const Pipelines = async (props: Props) => {
  const params = await props.params;
  const pipelineExists = await db.pipeline.findFirst({
    where: { subAccountId: params.subaccountId },
  });

  if (pipelineExists)
    return redirect(
      `/subaccount/${params.subaccountId}/pipelines/${pipelineExists.id}`,
    );

  try {
    const response = await db.pipeline.create({
      data: { name: "First Pipeline", subAccountId: params.subaccountId },
    });

    return redirect(
      `/subaccount/${params.subaccountId}/pipelines/${response.id}`,
    );
  } catch (error) {
    console.log();
  }
};

export default Pipelines;
