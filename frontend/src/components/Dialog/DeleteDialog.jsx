import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // ✅ Ensure the correct path
import { Button } from "@/components/ui/button";

const DeleteDialog = ({ title, description, onConfirm, onCancel, isOpen }) => {

  return (

    <Dialog open={isOpen} onOpenChange={onCancel}>        
    {" "}
      {/* ✅ Ensure Dialog is controlled */}
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;