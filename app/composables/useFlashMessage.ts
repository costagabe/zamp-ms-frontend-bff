type FlashMessage = {
  title: string;
  description: string;
  color: "success" | "error" | "warning" | "info";
} | null;

export function useFlashMessage() {
  const flash = useState<FlashMessage>("flash_message", () => null);

  function setFlash(msg: NonNullable<FlashMessage>) {
    flash.value = msg;
  }

  const toast = useToast();

  function consumeFlash() {
    if (!flash.value) return;
    toast.add(flash.value);
    flash.value = null;
  }

  return { setFlash, consumeFlash };
}
