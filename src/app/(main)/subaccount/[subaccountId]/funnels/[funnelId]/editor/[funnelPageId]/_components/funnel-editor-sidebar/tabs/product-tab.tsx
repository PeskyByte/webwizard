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
    <div className="overflow-auto p-4">
      <div className="flex flex-col gap-4 h-full w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl">Products</h1>
          <ProductUploadButton subaccountId={props.subaccountId} />
        </div>
        <Command className="bg-transparent">
          <CommandInput placeholder="Search for product name..." />
          <CommandList className="max-h-full">
            <CommandEmpty>No Products</CommandEmpty>
            <CommandGroup heading="Products">
              <div className="flex flex-col gap-4">
                {data &&
                  data.map((product) => (
                    <CommandItem
                      key={product.id}
                      className="p-1 max-w-[300px] w-full rounded-lg"
                    >
                      <ProductCard product={product} />
                    </CommandItem>
                  ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default ProductsTab;
