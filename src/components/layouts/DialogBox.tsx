import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SlidersHorizontal } from "lucide-react";
import { DialogForm, FilterProperties } from "..";
import { DialogBoxProps } from "@/types";

const DialogBox = ({ type = "contact", filters, setFilters }: DialogBoxProps) => {
    return (
        <Dialog>
            <DialogTrigger
                className={type === "filter" ? "filter-class self-center" : `text-sand-soft border-sand-soft btn-class`}
            >
                {type === "filter" ? <SlidersHorizontal /> : "Get in Touch"}
            </DialogTrigger>
            <DialogContent className="bg-sand-soft rounded-lg">
                <DialogHeader>
                    <DialogTitle>
                        {type === "filter" ? (
                            <h2 className="text-xl font-bold text-center text-home">Filter Properties</h2>
                        ) : (
                            "Contact Us"
                        )}
                    </DialogTitle>
                    {type === "contact" && (
                        <DialogDescription>
                            Don&apos;t worry, we won&apos;t share your details.
                        </DialogDescription>
                    )}
                </DialogHeader>
                {type === "filter" ? (
                    filters && setFilters ? ( 
                        <FilterProperties filters={filters} setFilters={setFilters} />
                    ) : (
                        <p className="text-center text-gray-500">Filters are unavailable.</p>
                    )
                ) : (
                    <DialogForm />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DialogBox;
