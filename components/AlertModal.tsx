"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ALERT_TYPES = [
  { value: "upper", label: "Upper Threshold" },
  { value: "lower", label: "Lower Threshold" },
];

interface AlertModalProps {
  alertData?: AlertData;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  alertData,
  open,
  setOpen,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AlertData>({
    defaultValues: alertData || {
      symbol: "",
      company: "",
      alertName: "",
      alertType: "upper",
      threshold: "",
    },
  });

  console.log("Alert Modal alertData:", alertData);

  const onSubmit = async (data: AlertData) => {
    try {
      console.log("Submitted alert:", data);
      toast.success("Alert saved!");
      setOpen(false);
      // Here you can convert to Alert type and save to DB/Inngest
    } catch (err) {
      console.error(err);
      toast.error("Failed to save alert");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg alert-dialog ">
        <DialogHeader>
          <DialogTitle>Add New Alert </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            name="symbol"
            label="Stock Symbol"
            placeholder="AAPL"
            register={register}
            error={errors.symbol}
            validation={{ required: "Symbol is required" }}
          />

          <InputField
            name="company"
            label="Company Name"
            placeholder="Apple Inc."
            register={register}
            error={errors.company}
            validation={{ required: "Company is required" }}
          />

          <InputField
            name="alertName"
            label="Alert Name"
            placeholder="My Alert"
            register={register}
            error={errors.alertName}
            validation={{ required: "Alert name is required" }}
          />

          <SelectField
            name="alertType"
            label="Alert Type"
            placeholder="Select Type"
            options={ALERT_TYPES}
            control={control}
            error={errors.alertType}
            required
          />

          <InputField
            name="threshold"
            label="Threshold Price"
            placeholder="Enter price"
            type="number"
            register={register}
            error={errors.threshold}
            validation={{ required: "Threshold is required" }}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="yellow-btn w-full mt-5"
          >
            {isSubmitting ? "Creating ..." : "Create Alert"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AlertModal;
