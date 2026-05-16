import { useEffect } from "react";
import textStore from "@/store/TextStore";

function useUpdateText(character: string[]) {
  const setText = textStore((state) => state.setText);

  useEffect(() => {
    character.forEach((char, index) => {
      setText(char, index, null);
    });
  }, [character, setText]);
}

export default useUpdateText;
