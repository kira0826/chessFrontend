import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react";

interface ShareCodeDialogProps {
  code: number;
}

export const ShareCodeDialog = ({ code }: ShareCodeDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share code</DialogTitle>
          <DialogDescription>
            Share the invitation code with your friend, or your new oponent?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label className="sr-only">
              Link
            </Label>
            <Input
              id="id"
              defaultValue={code}
              readOnly
            />
          </div>
          <Button type="button" size="sm" className="px-3" onClick={() => navigator.clipboard.writeText(String(code))}>
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  );
};
