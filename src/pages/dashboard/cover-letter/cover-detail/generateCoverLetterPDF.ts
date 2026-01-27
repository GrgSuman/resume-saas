import jsPDF from "jspdf";

interface CoverLetterPDFOptions {
  title: string;
  content: string;
  fileName?: string;
}

export const generateCoverLetterPDF = ({
  title,
  content,
  fileName,
}: CoverLetterPDFOptions) => {
  // Create new PDF document (A4 size)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - 2 * margin;
  const lineHeight = 7;

  // Prepare content
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  // Split content into paragraphs
  const paragraphs = content.split("\n").filter((p) => p.trim());

  let yPosition = margin + 15;

  paragraphs.forEach((paragraph, index) => {
    // Split paragraph into lines that fit the page width
    const lines = doc.splitTextToSize(paragraph.trim(), contentWidth);

    // Check if we need a new page
    if (yPosition + lines.length * lineHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }

    // Add lines to document
    lines.forEach((line: string) => {
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });

    // Add spacing between paragraphs (except last one)
    if (index < paragraphs.length - 1) {
      yPosition += 3;
    }
  });

  // Generate filename
  const pdfFileName = fileName
    ? `${fileName}.pdf`
    : `${title.replace(/\s+/g, "_")}.pdf`;

  // Save the PDF
  doc.save(pdfFileName);
};

