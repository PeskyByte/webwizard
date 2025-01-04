import React from "react";

import BlurPage from "@/components/blur-page";
import MediaComponent from "@/components/media";
import { getMedia } from "@/lib/queries";

type Props = {
  params: Promise<{ subaccountId: string }>;
};

const MediaPage = async (props: Props) => {
  const params = await props.params;
  const data = await getMedia(params.subaccountId);

  return (
    <BlurPage>
      <MediaComponent data={data} subaccountId={params.subaccountId} />
    </BlurPage>
  );
};

export default MediaPage;
