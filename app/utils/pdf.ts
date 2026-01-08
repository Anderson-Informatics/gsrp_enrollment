import { fill, PDFDocument } from "pdf-lib";

export async function fillForm(state) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
  const fullName = `${state.child.firstName} ${state.child.middleName || ""} ${
    state.child.lastName
  }`;
  const formUrl = "PreK 2025_26 Enrollment Forms_Unique Fields.pdf";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  const allFields = {
    TextField: [] as string[],
    CheckBox: [] as string[],
    Signature: [] as string[],
  };

  for (const field of fields) {
    const ctor = field.constructor?.name ?? "";
    const name = field.getName();

    if (/text/i.test(ctor) || /TextField/i.test(ctor)) {
      allFields.TextField.push(name);
    } else if (/check/i.test(ctor) || /CheckBox/i.test(ctor)) {
      allFields.CheckBox.push(name);
    } else if (/sign/i.test(ctor) || /Signature/i.test(ctor)) {
      allFields.Signature.push(name);
    } else {
      // fallback: if unsure, treat as TextField (remove/change if undesired)
      allFields.TextField.push(name);
    }
  }

  // Alphabetize each array of field names
  (Object.keys(allFields) as Array<keyof typeof allFields>).forEach((key) =>
    allFields[key].sort((a, b) => a.localeCompare(b))
  );
  console.log("allFields:", allFields);

  const uniqueTypes = Object.keys(allFields);
  console.log("unique field types:", uniqueTypes);

  // Page 1 fields
  const school1 = form.getTextField("School_1");
  const date1 = form.getTextField("Date_1");
  const stfn1 = form.getTextField("Student First Name_1");
  const stmn1 = form.getTextField("Student Middle Name_1");
  const stln1 = form.getTextField("Student Last Name_1");
  const stdob1 = form.getTextField("Student DOB_1");
  const pgph1 = form.getTextField("Primary Parent Phone_1");
  const pgem1 = form.getTextField("Primary Parent Email_1");
  const gr1 = form.getTextField("Grade_1");
  const schy1 = form.getTextField("School Year_1");
  const addstr1 = form.getTextField("Physical Street_1");
  const addc1 = form.getTextField("Physical City_1");
  const addst1 = form.getTextField("Physical State_1");
  const addz1 = form.getTextField("Physical Zip_1");
  const mailstr1 = form.getTextField("Mailing Street_1");
  const mailc1 = form.getTextField("Mailing City_1");
  const mailst1 = form.getTextField("Mailing State_1");
  const mailz1 = form.getTextField("Mailing Zip_1");

  school1.setText(state.school.firstChoice);
  date1.setText(today);
  stfn1.setText(state.child.firstName);
  stmn1.setText(state.child.middleName || "");
  stln1.setText(state.child.lastName);
  stdob1.setText(state.child.dob);
  pgph1.setText(state.pg1.phone);
  pgem1.setText(state.pg1.email);
  gr1.setText("PreK");
  schy1.setText("2025-26");
  addstr1.setText(state.address.street);
  addc1.setText(state.address.city);
  addst1.setText(state.address.state);
  addz1.setText(state.address.zip);
  mailstr1.setText(state.address.street);
  mailc1.setText(state.address.city);
  mailst1.setText(state.address.state);
  mailz1.setText(state.address.zip);

  // If you want to prevent further edits, you can flatten the form.
  // Note: form.flatten() exists in recent pdf-lib versions. Uncomment if available.
  // form.flatten();

  pdfDoc.setTitle(`GSRP PreK Interest Form - ${fullName}`);
  const pdfBytes = await pdfDoc.save();

  // Trigger browser download
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  // filename safe: remove problematic chars
  const safeName = `GSRP PreK Interest Form - ${fullName}`.replace(
    /[/\\?%*:|"<>]/g,
    ""
  );
  a.download = `${safeName}.pdf`;
  // Append to DOM, click and clean up
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke object URL after a short delay
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
