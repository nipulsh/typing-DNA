
import { Button } from "@/components/ui/button"
import useStartStore from "@/store/StartStore";

export function RestartButton() {
  const { reset, start } = useStartStore();
  const setStart = useStartStore((state) => state.setStart);

  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline" onClick={() => start ? reset() : setStart(true)}>{start ? "Restart" : "Start"}</Button>
    </div>
  )
}
