import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApartmentInquiryForm } from "@/components/ApartmentInquiryForm";

type ApartmentInquiryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apartmentCode?: string;
  apartmentTitle?: string;
  floorLabel?: string;
  defaultRooms?: number;
};

export function ApartmentInquiryDialog({
  open,
  onOpenChange,
  apartmentCode,
  apartmentTitle,
  floorLabel,
  defaultRooms,
}: ApartmentInquiryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
            Anfrage
          </p>
          <DialogTitle>Interesse an dieser Wohnung</DialogTitle>
          <DialogDescription>
            Hinterlassen Sie bitte Namen und E-Mail. Wir melden uns mit
            weiteren Details zur Wohnung.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-8">
          <ApartmentInquiryForm
            key={`${apartmentCode ?? "general"}-${defaultRooms ?? "rooms"}`}
            apartmentCode={apartmentCode}
            apartmentTitle={apartmentTitle}
            floorLabel={floorLabel}
            defaultRooms={defaultRooms}
            submitLabel="Anfrage senden"
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
