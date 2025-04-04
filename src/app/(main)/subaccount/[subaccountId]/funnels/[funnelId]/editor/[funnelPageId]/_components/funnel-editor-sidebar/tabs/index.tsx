import {
  Database,
  Plus,
  SettingsIcon,
  SquareStackIcon,
  MessageSquareCode,
} from "lucide-react";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {};

const TabList = (props: Props) => {
  return (
    <TabsList className=" flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4 ">
      <TabsTrigger
        value="Settings"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <SettingsIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Components"
        className="data-[state=active]:bg-muted w-10 h-10 p-0"
      >
        <Plus />
      </TabsTrigger>

      <TabsTrigger
        value="Products"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <SquareStackIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Media"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <Database />
      </TabsTrigger>
      <TabsTrigger
        value="AI"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <MessageSquareCode />
      </TabsTrigger>
    </TabsList>
  );
};

export default TabList;
