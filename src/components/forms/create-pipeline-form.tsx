"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pipeline } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { saveActivityLogsNotification, upsertPipeline } from "@/lib/queries";
import { CreatePipelineFormSchema } from "@/lib/types";

import { useModal } from "../../providers/modal-provider";
import Loading from "..//loading";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface CreatePipelineFormProps {
  defaultData?: Pipeline;
  subAccountId: string;
}

const CreatePipelineForm: React.FC<CreatePipelineFormProps> = ({
  defaultData,
  subAccountId,
}) => {
  const { data, isOpen, setOpen, setClose } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof CreatePipelineFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CreatePipelineFormSchema),
    defaultValues: {
      name: defaultData?.name || "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name || "",
      });
    }
  }, [defaultData]);

  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof CreatePipelineFormSchema>) => {
    if (!subAccountId) return;
    try {
      const response = await upsertPipeline({
        ...values,
        id: defaultData?.id,
        subAccountId: subAccountId,
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updates a pipeline | ${response?.name}`,
        subaccountId: subAccountId,
      });

      toast({
        title: "Success",
        description: "Saved pipeline details",
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not save pipeline details",
      });
    }

    setClose();
  };
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Pipeline Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pipeline Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-20 mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePipelineForm;
