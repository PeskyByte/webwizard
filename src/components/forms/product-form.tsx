"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";
import {
  createMedia,
  saveActivityLogsNotification,
  upsertProduct,
} from "@/lib/queries";
import { useModal } from "@/providers/modal-provider";

import FileUpload from "../file-upload";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type Props = {
  subaccountId: string;
};

export const ProductFormSchema = z.object({
  name: z.string().min(1).max(191),
  description: z.string().min(0).max(191).optional(),
  price: z.string(),
});

const AddProductForm = ({ subaccountId }: Props) => {
  const { data: defaultData, setClose } = useModal();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      price: "0",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ProductFormSchema>) {
    try {
      const response = await upsertProduct({
        ...values,
        subAccountId: subaccountId,
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Uploaded a product | ${response.name}`,
        subaccountId,
      });

      toast({ title: "Success", description: "Added product" });
      router.refresh();
    } catch (error) {
      console.log(error);
      console.log(values);
      console.log(subaccountId);
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not add product",
      });
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>
          Please enter the details for the product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4">
              Add Product
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
