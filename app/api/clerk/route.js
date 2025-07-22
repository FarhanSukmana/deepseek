import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers"; // ✅ Tambahkan ini
import { NextResponse } from "next/server";

export async function POST(req) {
  // ✅ Pastikan secret tersedia
  if (!process.env.SIGNING_SECRET) {
    console.error("Missing SIGNING_SECRET");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const wh = new Webhook(process.env.SIGNING_SECRET);
  const headerPayload = headers();
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-signature": headerPayload.get("svix-signature"),
    "svix-timestamp": headerPayload.get("svix-timestamp"), // Optional tapi direkomendasikan
  };

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt;
  try {
    evt = wh.verify(body, svixHeaders);
  } catch (err) {
    console.error("Webhook verification failed", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const { data, type } = evt;

  // Log untuk debugging
  console.log("Received webhook:", type, data);

  await connectDB();

  switch (type) {
    case "user.created":
    case "user.updated": {
      const email = data.email_addresses?.[0]?.email_address || null;
      if (!email) {
        console.error("Missing email in Clerk data:", data);
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
      }

      const userData = {
        _id: data.id,
        email,
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url || null,
      };

      await User.findByIdAndUpdate(data.id, userData, { upsert: true });
      break;
    }

    case "user.deleted":
      await User.findByIdAndDelete(data.id);
      break;

    default:
      console.log("Unhandled event type:", type);
  }

  return NextResponse.json({ message: "Event received" });
}
