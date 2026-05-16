import { useLayoutEffect } from "react";
import textStore from "@/store/TextStore";

function useUpdateText(character: string[]) {
  useLayoutEffect(() => {
    const next: Record<
      number,
      { value: string; position: number; matched?: boolean | null }
    > = {};
    for (let i = 0; i < character.length; i++) {
      next[i] = { value: character[i]!, position: i };
    }
    textStore.setState({ text: next });
  }, [character]);
}

export default useUpdateText;
