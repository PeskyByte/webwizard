import React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { getSubaccountOrders } from "@/lib/queries";
import { Orders } from "@prisma/client";

type Props = {
  params: Promise<{ subaccountId: string }>;
};

const Order = async ({ params }: Props) => {
  const {subaccountId} = await params;
  const data: Orders[] = await getSubaccountOrders(subaccountId);
  
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Orders</h1>
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for order name..." />
        <CommandList className="pb-40 max-h-full ">
          <CommandEmpty>No Orders</CommandEmpty>
          <CommandGroup heading="Orders">
            <div className="flex flex-wrap gap-4 pt-4">
              {
                data.map((order) => (
                  <CommandItem key={order.id}>
                    <p>{order.id}</p>
                  </CommandItem>
                ))
              }
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default Order;
