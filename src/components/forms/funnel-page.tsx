"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FunnelPage } from "@prisma/client";
import { CopyPlusIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";
import {
  deleteFunnelePage,
  getFunnelPages,
  saveActivityLogsNotification,
  upsertFunnelPage,
} from "@/lib/queries";
import { FunnelPageSchema } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";

import Loading from "../loading";
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

interface CreateFunnelPageProps {
  defaultData?: FunnelPage;
  funnelId: string;
  order: number;
  subaccountId: string;
}

const CreateFunnelPage: React.FC<CreateFunnelPageProps> = ({
  defaultData,
  funnelId,
  order,
  subaccountId,
}) => {
  const { setClose } = useModal();
  const { toast } = useToast();
  const router = useRouter();
  //ch
  const form = useForm<z.infer<typeof FunnelPageSchema>>({
    resolver: zodResolver(FunnelPageSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      pathName: "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({ name: defaultData.name, pathName: defaultData.pathName });
    }
  }, [defaultData]);

  const onSubmit = async (values: z.infer<typeof FunnelPageSchema>) => {
    const funnelPages = await getFunnelPages(funnelId);
    if (funnelPages.some((funnel) => funnel.pathName === values.pathName)) {
      return form.setError("pathName", {
        message: "Path name already used",
      });
    }

    try {
      const response = await upsertFunnelPage(
        subaccountId,
        {
          ...values,
          id: defaultData?.id || v4(),
          order: defaultData?.order || order,
          pathName: values.pathName || "",
        },
        funnelId,
      );

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a funnel page | ${response?.name}`,
        subaccountId: subaccountId,
      });

      toast({
        title: "Success",
        description: "Saves Funnel Page Details",
      });

      router.refresh();
      setClose();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could Save Funnel Page Details",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Page</CardTitle>
        <CardDescription>
          Funnel pages are flow in the order they are created by default. You
          can move them around to change their order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="pathName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Path Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Path for the page"
                      {...field}
                      value={field.value?.toLowerCase()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Button
                className="w-22 self-end"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting ? <Loading /> : "Save Page"}
              </Button>

              {defaultData?.id && (
                <Button
                  variant={"outline"}
                  className="w-22 self-end border-destructive text-destructive hover:bg-destructive"
                  disabled={form.formState.isSubmitting}
                  type="button"
                  onClick={async () => {
                    const response = await deleteFunnelePage(defaultData.id);
                    await saveActivityLogsNotification({
                      agencyId: undefined,
                      description: `Deleted a funnel page | ${response?.name}`,
                      subaccountId: subaccountId,
                    });
                    router.refresh();
                  }}
                >
                  {form.formState.isSubmitting ? <Loading /> : <Trash />}
                </Button>
              )}
              {defaultData?.id && (
                <Button
                  variant={"outline"}
                  size={"icon"}
                  disabled={form.formState.isSubmitting}
                  type="button"
                  onClick={async () => {
                    const funnelPages = await getFunnelPages(funnelId);

                    const copyNumbers = funnelPages
                      .map((funnel) => {
                        const regex = new RegExp(
                          `^${defaultData.pathName}-copy-(\\d+)$`,
                        );
                        const match = funnel.pathName.match(regex);
                        return match ? parseInt(match[1], 10) : 0;
                      })
                      .filter((num) => num > 0);

                    const maxCopyNumber =
                      copyNumbers.length > 0 ? Math.max(...copyNumbers) : 0;

                    const newPathName = `${defaultData.pathName}-copy-${maxCopyNumber + 1}`;

                    await upsertFunnelPage(
                      subaccountId,
                      {
                        ...defaultData,
                        id: v4(),
                        order: funnelPages.length,
                        visits: 0,
                        name: `${defaultData.name} Copy`,
                        pathName: newPathName,
                        content: defaultData.content,
                      },
                      funnelId,
                    );

                    toast({
                      title: "Success",
                      description: "Saves Funnel Page Details",
                    });
                    router.refresh();
                  }}
                >
                  {form.formState.isSubmitting ? <Loading /> : <CopyPlusIcon />}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateFunnelPage;
