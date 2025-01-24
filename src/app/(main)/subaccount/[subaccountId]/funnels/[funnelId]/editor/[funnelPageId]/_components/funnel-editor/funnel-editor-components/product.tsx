"use client";

import { Product } from "@prisma/client";
import clsx from "clsx";
import { Badge, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";

import { EditorBtns } from "@/lib/constants";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";

type Props = {
  element: EditorElement;
};

const ProductComponent = (props: Props) => {
  const [product, setProduct] = useState<Product>();
  const { dispatch, state } = useEditor();

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
        <article className="border w-56 h-64 rounded-lg bg-white text-black dark:bg-slate-900 dark:text-white pt-3 pl-3 pr-3">
          <div className="relative w-full h-40">
            <p className="overflow-ellipsis overflow-hidden whitespace-normal break-words">
              {product.description === ""
                ? "---No Description---"
                : product.description}
            </p>
          </div>
          <p className="opacity-0 h-0 w-0">{product.name}</p>
          <div className="p-4 relative">
            <p>{product.name}</p>
            <p>{String(product.price)}$</p>
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
