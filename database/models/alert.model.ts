import { Schema, model, models, type Document, type Model } from "mongoose";

export interface AlertItem extends Document {
  userId: string;
  email: string;
  symbol: string;
  company: string;
  alertType: "upper" | "lower";
  targetPrice: string;
  currentPrice?: string;
  createdAt: Date;
  triggered?: boolean; // optional flag for whether alert has been triggered
}

const AlertSchema = new Schema<AlertItem>(
  {
    userId: { type: String, required: true, index: true },
    email: { type: String, required: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    alertType: { type: String, enum: ["upper", "lower"], required: true },
    targetPrice: { type: String, required: true },
    currentPrice: { type: String },
    triggered: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

AlertSchema.index({ userId: 1, symbol: 1, alertType: 1 }, { unique: true });

export const Alerts: Model<AlertItem> =
  (models?.Alerts as Model<AlertItem>) || model<AlertItem>("Alerts", AlertSchema);
