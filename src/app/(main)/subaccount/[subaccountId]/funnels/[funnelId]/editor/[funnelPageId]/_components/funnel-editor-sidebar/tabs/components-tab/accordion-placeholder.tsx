import { ListCollapse } from "lucide-react";

import { EditorBtns } from "@/lib/constants";

type Props = {};

const AccordionPlaceholder = (props: Props) => {
  const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        handleDragState(e, "accordion");
      }}
      className=" h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <ListCollapse size={40} className="text-muted-foreground" />
    </div>
  );
};

export default AccordionPlaceholder;
