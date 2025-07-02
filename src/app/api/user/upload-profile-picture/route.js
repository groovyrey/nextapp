import { admin } from "/lib/firebase-admin.js";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const uid = formData.get("uid");
    const file = formData.get("file");

    if (!uid || !file) {
      return NextResponse.json({ error: "Missing UID or file." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "profile_pictures",
          public_id: uid, // Use UID as public ID for easy retrieval
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(buffer);
    });

    await admin.firestore().collection("users").doc(uid).update({
      profilePictureUrl: uploadResult.secure_url,
    });

    return NextResponse.json({ message: "Profile picture uploaded successfully.", url: uploadResult.secure_url }, { status: 200 });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return NextResponse.json({ error: "Failed to upload profile picture." }, { status: 500 });
  }
}
