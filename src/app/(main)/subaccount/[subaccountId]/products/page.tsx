import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import React from "react";
import ProductCard from "./_components/product-card";
import { FolderSearch } from "lucide-react";
import ProductUploadButton from "./_components/product-upload-btn";
import { GetProduct } from "@/lib/types";

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
            <div className="flex flex-wrap gap-4 pt-4">
              
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default Products;
