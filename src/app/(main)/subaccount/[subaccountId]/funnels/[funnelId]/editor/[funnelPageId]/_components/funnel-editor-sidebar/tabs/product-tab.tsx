import { Product } from "@prisma/client";
import React, { useEffect, useState } from "react";

import ProductUploadButton from "@/app/(main)/subaccount/[subaccountId]/products/_components/product-upload-btn";
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

type Props = {
  subaccountId: string;
};

const ProductsTab = (props: Props) => {
  const [data, setData] = useState<Product[]>();

  useEffect(() => {
    const fn = async () => {
      const response = await getSubaccountProducts(props.subaccountId);
      setData(response);
    };
    fn();
  }, [props]);

  return (
    <div className="h-[900px] overflow-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Products</h1>
        <ProductUploadButton subaccountId={props.subaccountId} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for product name..." />
        <CommandList className="pb-40 max-h-full ">
          <CommandEmpty>No Products</CommandEmpty>
          <CommandGroup heading="Products">
            <div className="flex flex-wrap gap-4 pt-4">
              {data &&
                data.map((product) => (
                  <CommandItem key={product.id}>
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

export default ProductsTab;
