"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { number, z } from "zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { saveActivityLogsNotification, upsertContact, upsertOrder } from "@/lib/queries";
import { ContactUserFormSchema } from "@/lib/types";

import { useModal } from "../../providers/modal-provider";
import Loading from "../loading";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Props = {
  subaccountId: string;
  productId: string;
};

export const OrderFormSchema = z.object({
  contactName: z.string().max(191).min(1, "Required"),
  contctEmail: z.string().max(191).email().min(1, "Required"),
  contactNumber: z.string().max(191).min(1, "Required"),
  address: z.string().max(191).min(1, "Required"),
  quantity: number().min(1, "Required"),
});

const ProductUserForm = ({ subaccountId, productId }: Props) => {
  const { setClose, data } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof OrderFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      contactName: "",
      contctEmail: "",
      contactNumber: "",
      address: "",
      quantity: 1,
    },
  });

  useEffect(() => {
    if (data.order) {
      form.reset(data.order);
    }
  }, [data, form.reset]);

  const isLoading = form.formState.isLoading;

  const handleSubmit = async (
    values: z.infer<typeof OrderFormSchema>,
  ) => {
    try {
      const response = await upsertOrder({
          ...values,
          subAccountId: subaccountId,
          productId: productId,
      });
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `order placed | ${response?.contactName}`,
        subaccountId: subaccountId,
      });
      toast({
        title: "Success",
        description: "Saved order details",
      });
      setClose();
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not save order details",
      });
    }
  };

  return (
    <Card className=" w-full">
      <CardHeader>
        <CardTitle>Product Info</CardTitle>
        <CardDescription>
          You can make an order of this product by adding you contact details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="contctEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Quantity"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />            
            <Button className="mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? (
                <Loading />
              ) : (
                "Saved Order Details!"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductUserForm;
