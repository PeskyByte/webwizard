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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import DeleteButton from "./_components/delete-order";

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[300px]">Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {data.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.contactName}</TableCell>
              <TableCell>
                {order.contctEmail}
              </TableCell>
              <TableCell>
                {order.contactNumber}
              </TableCell>
              <TableCell>
                {order.address}
              </TableCell>
              <TableCell>{order.createdAt.toDateString()}</TableCell>
              <TableCell><DeleteButton subaccountId={subaccountId} orderId={order.id}/></TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Order;
