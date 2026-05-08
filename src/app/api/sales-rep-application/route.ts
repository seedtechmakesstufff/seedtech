import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSalesRepApplicationNotification } from "@/lib/email";
import { getClientIp, validateFormSecurity, verifyRecaptcha } from "@/lib/form-security";
import { DEFAULT_SITE_ID } from "@/lib/site-context";

export const dynamic = "force-dynamic";

const ALLOWED_RESUME_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_RESUME_BYTES = 8 * 1024 * 1024;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fullName = getString(formData, "fullName");
    const email = getString(formData, "email");
    const phone = getString(formData, "phone");
    const location = getString(formData, "location");
    const currentCompany = getString(formData, "currentCompany");
    const linkedinUrl = getString(formData, "linkedinUrl");
    const salesExperience = getString(formData, "salesExperience");
    const outboundExperience = getString(formData, "outboundExperience");
    const message = getString(formData, "message");
    const recaptchaToken = getString(formData, "recaptchaToken");

    const ip = getClientIp(req);
    const rejection = await validateFormSecurity(ip, {
      fullName,
      company: currentCompany,
      message,
      website_url: getString(formData, "website_url"),
      _started: Number(getString(formData, "_started")),
    });
    if (rejection) return rejection;

    const recaptchaOk = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaOk) {
      return NextResponse.json({ error: "Bot check failed. Please try again." }, { status: 422 });
    }

    const resume = formData.get("resume");
    if (!(resume instanceof File)) {
      return NextResponse.json({ error: "Resume upload is required." }, { status: 400 });
    }

    if (!fullName || !email || !phone || !location) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    if (!ALLOWED_RESUME_MIME.includes(resume.type)) {
      return NextResponse.json({ error: "Resume must be a PDF, DOC, or DOCX file." }, { status: 400 });
    }

    if (resume.size > MAX_RESUME_BYTES) {
      return NextResponse.json({ error: "Resume exceeds the 8 MB limit." }, { status: 400 });
    }

    const siteId = DEFAULT_SITE_ID;
    const extension = resume.name.split(".").pop() ?? "pdf";
    const blobPath = `applications/sales-reps/${Date.now()}_${sanitizeFileName(fullName)}.${extension}`;
    const blob = await put(blobPath, resume, { access: "public", contentType: resume.type });

    let contact = await prisma.contact.findFirst({ where: { siteId, email } });
    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          siteId,
          fullName,
          email,
          phone,
          company: currentCompany || null,
        },
      });
    }

    const submission = await prisma.formSubmission.create({
      data: {
        siteId,
        source: "contact_page",
        fullName,
        email,
        phone,
        company: currentCompany || null,
        service: "Sales Rep Application",
        message,
        metadata: {
          applicationType: "sales_rep",
          location,
          linkedinUrl: linkedinUrl || null,
          salesExperience: salesExperience || null,
          outboundExperience: outboundExperience || null,
          resumeUrl: blob.url,
          resumeFileName: resume.name,
        },
        contactId: contact.id,
      },
    });

    sendSalesRepApplicationNotification({
      fullName,
      email,
      phone,
      location,
      linkedinUrl: linkedinUrl || undefined,
      currentCompany: currentCompany || undefined,
      salesExperience: salesExperience || undefined,
      outboundExperience: outboundExperience || undefined,
      message: message || undefined,
      resumeUrl: blob.url,
      resumeFileName: resume.name,
    }).catch((error) => {
      console.error("[POST /api/sales-rep-application] Email error:", error);
    });

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/sales-rep-application] Error:", error);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}