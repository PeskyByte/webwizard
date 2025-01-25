"use client";

import { Product } from "@prisma/client";
import clsx from "clsx";
import { Badge, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

import CustomModal from "@/components/custom-modal";
import ProductUserForm from "@/components/forms/product-user-form";
import { Button } from "@/components/ui/button";
import { EditorBtns } from "@/lib/constants";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useModal } from "@/providers/modal-provider";

type Props = {
  element: EditorElement;
};

const ProductComponent = (props: Props) => {
  const [product, setProduct] = useState<Product>();
  const { dispatch, state, subaccountId } = useEditor();

  useEffect(() => {
    if (Array.isArray(props.element.content)) return;
    const { productId } = props.element.content;
    setProduct(JSON.parse(productId!));
  }, []);

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };
  const styles = props.element.styles;

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  const { setOpen } = useModal();

  const handleCreateProduct = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    setOpen(
      <CustomModal
        title="Place your order"
        subheading="Enter your contact details."
      >
        <ProductUserForm subaccountId={subaccountId} productId={id} />
      </CustomModal>,
    );
  };

  return (
    <div
      style={styles}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all",
        {
          "!border-blue-500":
            state.editor.selectedElement.id === props.element.id,
          "!border-solid": state.editor.selectedElement.id === props.element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        },
      )}
      draggable
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, "product")}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      {product && (
        <article className="border rounded-lg bg-white text-black dark:bg-slate-900 dark:text-white p-4 flex flex-col gap-8">
          <p className="break-words">
            {product.description === ""
              ? "---No Description---"
              : product.description}
          </p>
          <div>
            <div>
              <p>{product.name}</p>
              <p>{String(product.price)}$</p>
            </div>
            <Button
              onClick={(e) => handleCreateProduct(e, product.id)}
              className="w-full"
            >
              Buy
            </Button>
          </div>
        </article>
      )}
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default ProductComponent;
