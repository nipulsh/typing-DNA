export type TabTextJson = {
  text?: string;
  texts?: string[];
};

export function getPassagesFromJson(data: TabTextJson): string[] {
  const fromTexts = data.texts?.filter((t) => t.length > 0) ?? [];
  if (fromTexts.length > 0) return fromTexts;
  if (data.text != null && data.text.length > 0) return [data.text];
  return [""];
}
