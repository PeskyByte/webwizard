"use client";

import React from "react";

import CustomModal from "@/components/custom-modal";
import AddProductForm from "@/components/forms/product-form";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";

type Props = {
  subaccountId: string;
  productId: string;
};

const ProductUploadButton = ({ subaccountId, productId }: Props) => {
  const { isOpen, setOpen, setClose } = useModal();
  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Add Product"
            subheading="Add a new product to your subaccount"
          >
            <AddProductForm subaccountId={subaccountId} />
          </CustomModal>,
        );
      }}
    >
      Upload
    </Button>
  );
};

export default ProductUploadButton;
