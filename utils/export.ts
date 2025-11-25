
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }

  // Get headers
  const headers = Object.keys(data[0]);
  
  // Format rows
  const csvRows = data.map(row => {
    return headers.map(fieldName => {
      const val = row[fieldName] === null || row[fieldName] === undefined ? '' : row[fieldName];
      const stringVal = String(val);
      // Escape quotes and wrap in quotes if contains comma
      return `"${stringVal.replace(/"/g, '""')}"`;
    }).join(',');
  });

  // Combine headers and rows
  const csvContent = [headers.join(','), ...csvRows].join('\n');
  
  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
