import { FolderSearch } from "lucide-react";
import React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { GetProduct } from "@/lib/types";

import ProductCard from "./_components/product-card";
import ProductUploadButton from "./_components/product-upload-btn";

type Props = {
  data: GetProduct[];
  subaccountId: string;
};

const Products = ({ data = [], subaccountId }: Props) => {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Products</h1>
        <ProductUploadButton subaccountId={subaccountId} productId={""} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for product name..." />
        <CommandList className="pb-40 max-h-full ">
          <CommandEmpty>No Products</CommandEmpty>
          <CommandGroup heading="Products">
            <div className="flex flex-wrap gap-4 pt-4"></div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default Products;
