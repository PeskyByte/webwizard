"use client";

import { Product } from "@prisma/client";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { EditorBtns } from "@/lib/constants";
import { deleteProduct, saveActivityLogsNotification } from "@/lib/queries";

type Props = { product: Product };

const ProductCard = ({ product }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
    e.dataTransfer.setData("product", JSON.stringify(product));
  };

  return (
    <div
      draggable
      onDragStart={(e) => handleDragState(e, "product")}
      className="w-full"
    >
      <AlertDialog>
        <DropdownMenu>
          <article className="rounded-lg bg-white text-black dark:bg-slate-900 dark:text-white">
            <div className="w-[275px] p-4">
              <p className="break-words">
                {product.description === ""
                  ? "---No Description---"
                  : product.description}
              </p>
            </div>
            <div className="p-4 relative">
              <p className="text-muted-foreground">
                {product.createdAt.toDateString()}
              </p>
              <p>{product.name}</p>
              <p>{String(product.price)}$</p>
              <div className="absolute top-4 right-4 p-[1px] cursor-pointer ">
                <DropdownMenuTrigger>
                  <MoreHorizontal />
                </DropdownMenuTrigger>
              </div>
            </div>
            <DropdownMenuContent>
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="flex gap-2">
                  <Trash size={15} /> Delete Product
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </article>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-left">
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Are you sure you want to delete this product?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center">
            <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              className="bg-destructive hover:bg-destructive"
              onClick={async () => {
                setLoading(true);
                const response = await deleteProduct(product.id);
                await saveActivityLogsNotification({
                  agencyId: undefined,
                  description: `Deleted a product | ${response?.name}`,
                  subaccountId: response.subAccountId,
                });
                toast({
                  title: "Deleted Product",
                  description: "Successfully deleted the product",
                });
                setLoading(false);
                router.refresh();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductCard;
