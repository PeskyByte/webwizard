"use client";

import React from "react";

import { useModal } from "../../providers/modal-provider";
import CustomModal from "../custom-modal";
import UploadMediaForm from "../forms/upload-media";
import { Button } from "../ui/button";

type Props = {
  subaccountId: string;
};

const MediaUploadButton = ({ subaccountId }: Props) => {
  const { isOpen, setOpen, setClose } = useModal();

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Upload Media"
            subheading="Upload a file to your media bucket"
          >
            <UploadMediaForm subaccountId={subaccountId}></UploadMediaForm>
          </CustomModal>,
        );
      }}
    >
      Upload
    </Button>
  );
};

export default MediaUploadButton;
