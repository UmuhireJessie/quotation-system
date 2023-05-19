export const printTable = (tableRef) => {
    window.print();
  };

  // export const printTable = (tableRef) => {
  //   const printWindow:any = window.open('', '_blank');
  //   const printDocument = printWindow.document;
  
  //   const styleLink = printDocument.createElement('link');
  //   styleLink.rel = 'stylesheet';
  //   styleLink.type = 'text/css';
  //   styleLink.href = '/path/to/print.css'; // Replace with the path to your print.css file
  //   printDocument.head.appendChild(styleLink);
  
  //   printDocument.write('<html><head><title>Report</title></head><body>');
  //   printDocument.write('<div>');
  //   printDocument.write(tableRef.current.outerHTML);
  //   printDocument.write('</div>');
  //   printDocument.write('</body></html>');
  
  //   printWindow.document.close();
  //   printWindow.print();
  // };