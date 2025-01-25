import { Product } from "@prisma/client";
import React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getSubaccountProducts } from "@/lib/queries";

import ProductCard from "./_components/product-card";
import ProductUploadButton from "./_components/product-upload-btn";

type Props = {
  params: Promise<{ subaccountId: string }>;
};

const Products = async ({ params }: Props) => {
  const { subaccountId } = await params;
  const data: Product[] = await getSubaccountProducts(subaccountId);
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Products</h1>
        <ProductUploadButton subaccountId={subaccountId} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for product name..." />
        <CommandList className="pb-40 max-h-full ">
          <CommandEmpty>No Products</CommandEmpty>
          <CommandGroup heading="Products">
            <div className="flex flex-wrap gap-4 pt-4">
              {data.map((product) => (
                <CommandItem key={product.id} className="p-1 rounded-lg">
                  <ProductCard product={product} />
                </CommandItem>
              ))}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default Products;
