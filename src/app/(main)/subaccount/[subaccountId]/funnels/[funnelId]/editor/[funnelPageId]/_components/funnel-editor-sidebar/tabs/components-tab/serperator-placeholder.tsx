import { Minus } from "lucide-react";

import { EditorBtns } from "@/lib/constants";

type Props = {};

const SeparatorPlaceholder = (props: Props) => {
  const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        handleDragState(e, "separator");
      }}
      className=" h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <Minus size={40} className="text-muted-foreground" />
    </div>
  );
};

export default SeparatorPlaceholder;
