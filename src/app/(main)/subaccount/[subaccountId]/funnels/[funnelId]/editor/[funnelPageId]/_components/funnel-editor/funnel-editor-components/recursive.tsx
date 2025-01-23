import { EditorElement } from "@/providers/editor/editor-provider";

import ContactFormComponent from "./contact-form-component";
import Container from "./container";
import ImageComponent from "./image";
import LinkComponent from "./link-component";
import TextComponent from "./text";
import VideoComponent from "./video";
import SeparatorComponent from "./separator-component";

type Props = {
  element: EditorElement;
};

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "container":
      return <Container element={element} />;
    case "video":
      return <VideoComponent element={element} />;
    case "contactForm":
      return <ContactFormComponent element={element} />;
    case "2Col":
      return <Container element={element} />;
    case "__body":
      return <Container element={element} />;
    case "link":
      return <LinkComponent element={element} />;
    case "image":
      return <ImageComponent element={element} />;
    case "separator":
      return <SeparatorComponent element={element} />;
    default:
      return null;
  }
};

export default Recursive;
