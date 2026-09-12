import CephaBannerOne from "@assets/logos/CephaBannerOne.png";
import { useCallback } from "react";

const usePrintFile = (freeUser: boolean, fileName: string) => {
  const handlePrintFile = useCallback(() => {
    const printableArea = document.getElementById("printableArea").innerHTML;
    if (!printableArea) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const bannerHTML = freeUser
      ? `<img src="${CephaBannerOne}" style="height: 50px;" />`
      : "";
    const title = freeUser ? "www.cephadex.com" : fileName;

    printWindow.document.write(`
      <html>
      <head>
          <title>${title}</title>
          ${bannerHTML}
          <style>
              @media print {
                  @page { margin: 2cm; }
                  img { display: block; }
              }
          </style>
      </head>
      <body>
          ${printableArea}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    printWindow.onload = function () {
      printWindow.print();
      printWindow.close();
    };
  }, [freeUser, fileName, CephaBannerOne]);

  return handlePrintFile;
};

export { usePrintFile };
