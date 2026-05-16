import textStore from "@/store/TextStore";
function useUpdateText(character: string[]) {
  const setText = textStore((state) => state.setText);

  character.forEach((char, index) => {
    setText(char, index);
  });
}

export default useUpdateText;
