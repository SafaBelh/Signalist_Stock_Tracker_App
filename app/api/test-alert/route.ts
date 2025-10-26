// import { NextRequest, NextResponse } from "next/server";
// import { createAlert } from "@/lib/actions/alert.actions";

// export async function GET() {
//   try {
//     type AlertType = "upper" | "lower";

//     const testAlert: {
//       userId: string;
//       email: string;
//       symbol: string;
//       company: string;
//       alertType: AlertType;
//       targetPrice: string;
//       currentPrice: string;
//     } = {
//       userId: "123",
//       email: "belhouchesafa@gmail.com",
//       company: "Apple Inc",
//       currentPrice: "205",
//       symbol: "MSFT",
//       alertType: "lower",
//       targetPrice: "200",
//     };

//     const alert = await createAlert(testAlert);

//     return NextResponse.json({
//       success: true,
//       message: "Test alert triggered",
//       alert,
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ success: false, error: (err as Error).message });
//   }
// }
