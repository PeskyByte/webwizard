"use client";

import CustomModal from "@/components/custom-modal";
import ContactUserForm from "@/components/forms/contact-user-form";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";

type Props = {
  subaccountId: string;
};

const CraeteContactButton = ({ subaccountId }: Props) => {
  const { setOpen } = useModal();

  const handleCreateContact = async () => {
    setOpen(
      <CustomModal
        title="Create Or Update Contact information"
        subheading="Contacts are like customers."
      >
        <ContactUserForm subaccountId={subaccountId} />
      </CustomModal>,
    );
  };

  return <Button onClick={handleCreateContact}>Create Contact</Button>;
};

export default CraeteContactButton;
