"use client";

import { FunnelPage } from "@prisma/client";
import clsx from "clsx";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEditor } from "@/providers/editor/editor-provider";

import TabList from "./tabs";
import ChatTab from "./tabs/ai-chat-tab";
import ComponentsTab from "./tabs/components-tab";
import MediaBucketTab from "./tabs/media-bucket-tab";
import ProductsTab from "./tabs/product-tab";
import SettingsTab from "./tabs/settings-tab";

type Props = {
  funnelId: string;
  funnelPageDetails: FunnelPage;
  subaccountId: string;
};

const FunnelEditorSidebar = ({
  subaccountId,
  funnelPageDetails,
  funnelId,
}: Props) => {
  const { state } = useEditor();

  return (
    <Sheet open={true} modal={false}>
      <Tabs className="w-full " defaultValue="Settings">
        <SheetContent
          showX={false}
          side="right"
          className={clsx(
            "mt-[97px] w-16 z-[80] shadow-none  p-0 focus:border-none transition-all overflow-hidden",
            { hidden: state.editor.previewMode },
          )}
        >
          <TabList />
        </SheetContent>
        <SheetContent
          showX={false}
          side="right"
          className={clsx(
            "mt-[97px] w-80 z-[40] shadow-none p-0 mr-16 bg-background h-full transition-all overflow-hidden ",
            { hidden: state.editor.previewMode },
          )}
        >
          <div className="grid gap-4 h-full overflow-auto">
            <TabsContent value="Settings">
              <SheetHeader className="text-left p-6">
                <SheetTitle>Styles</SheetTitle>
                <SheetDescription>
                  Show your creativity! You can customize every component as you
                  like.
                </SheetDescription>
              </SheetHeader>
              <SettingsTab />
            </TabsContent>
            <TabsContent value="Media">
              <MediaBucketTab subaccountId={subaccountId} />
            </TabsContent>
            <TabsContent value="Components">
              <SheetHeader className="text-left p-6 ">
                <SheetTitle>Components</SheetTitle>
                <SheetDescription>
                  You can drag and drop components on the canvas
                </SheetDescription>
              </SheetHeader>
              <ComponentsTab />
            </TabsContent>
            <TabsContent value="Products">
              <ProductsTab subaccountId={subaccountId} />
            </TabsContent>
            <TabsContent value="AI">
              <ChatTab
                subaccountId={subaccountId}
                funnelId={funnelId}
                funnelPageDetails={funnelPageDetails}
              />
            </TabsContent>
          </div>
        </SheetContent>
      </Tabs>
    </Sheet>
  );
};

export default FunnelEditorSidebar;
