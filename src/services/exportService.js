import toast from 'react-hot-toast';

// Storage key for user's active export format preference
export const EXPORT_FORMAT_KEY = 'kosher_active_export_format';

/**
 * Returns the currently active export format ('excel' | 'pdf').
 * Defaults to 'excel' as requested.
 */
export const getActiveExportFormat = () => {
    try {
        const saved = localStorage.getItem(EXPORT_FORMAT_KEY);
        if (saved === 'pdf' || saved === 'excel') return saved;
        return 'excel'; // Default format
    } catch (e) {
        return 'excel';
    }
};

/**
 * Persists the active export format preference.
 */
export const setActiveExportFormat = (format) => {
    try {
        const normalized = format === 'pdf' ? 'pdf' : 'excel';
        localStorage.setItem(EXPORT_FORMAT_KEY, normalized);
        return normalized;
    } catch (e) {
        return 'excel';
    }
};

/**
 * Escapes XML / HTML characters
 */
const escapeXml = (unsafe) => {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

/**
 * Generates an Excel SpreadsheetML XML document with Kosher Code styling.
 * Opens natively in Microsoft Excel, Google Sheets, LibreOffice, and Apple Numbers.
 */
export const generateExcelXml = (data = [], title = 'Kosher Code Enterprise Report') => {
    const rowsXml = data.map((item, index) => {
        const id = escapeXml(item._id || item.id || `ORD-${index + 101}`);
        const date = escapeXml(item.date || item.postedDate || new Date().toISOString().split('T')[0]);
        const name = escapeXml(item.name || item.representative || 'Enterprise Client');
        const email = escapeXml(item.email || 'N/A');
        const phone = escapeXml(item.phone || 'N/A');
        const institution = escapeXml(item.institution || item.company || 'Enterprise');
        const service = escapeXml(item.serviceName || item.title || 'Enterprise Solution');
        const location = escapeXml(item.region || item.location || 'Kampala HQ / East Africa');
        const price = escapeXml(item.price || item.amount || 'Custom');
        const status = escapeXml(item.status || 'Pending');
        const desc = escapeXml(item.description || item.scope || '');

        const statusStyle = (status === 'Active' || status === 'In Progress') ? 'StatusActive'
            : (status === 'Done' || status === 'Completed') ? 'StatusDone'
            : 'StatusPending';

        return `
   <Row ss:Height="22">
    <Cell ss:StyleID="CellBold"><Data ss:Type="String">${id}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${date}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">${name}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">${email}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">${phone}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">${institution}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">${service}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">${location}</Data></Cell>
    <Cell ss:StyleID="CellNumber"><Data ss:Type="String">${price.startsWith('$') ? price : `$${price}`}</Data></Cell>
    <Cell ss:StyleID="${statusStyle}"><Data ss:Type="String">${status}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">${desc}</Data></Cell>
   </Row>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>${escapeXml(title)}</Title>
  <Author>Kosher Code Technologies</Author>
  <Company>Kosher Code Technologies Uganda</Company>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Header">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#4B24F5"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#4B24F5"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#7355F7" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Cell">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#334155"/>
  </Style>
  <Style ss:ID="CellBold">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#0F172A" ss:Bold="1"/>
  </Style>
  <Style ss:ID="CellCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#64748B"/>
  </Style>
  <Style ss:ID="CellNumber">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#059669" ss:Bold="1"/>
  </Style>
  <Style ss:ID="StatusActive">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#059669" ss:Bold="1"/>
   <Interior ss:Color="#ECFDF5" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="StatusDone">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#2563EB" ss:Bold="1"/>
   <Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="StatusPending">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#D97706" ss:Bold="1"/>
   <Interior ss:Color="#FFFBEB" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Inbound Requests">
  <Table>
   <Column ss:Width="90"/>
   <Column ss:Width="95"/>
   <Column ss:Width="140"/>
   <Column ss:Width="180"/>
   <Column ss:Width="125"/>
   <Column ss:Width="170"/>
   <Column ss:Width="220"/>
   <Column ss:Width="140"/>
   <Column ss:Width="90"/>
   <Column ss:Width="95"/>
   <Column ss:Width="260"/>
   <Row ss:Height="26">
    <Cell ss:StyleID="Header"><Data ss:Type="String">REF ID</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">DATE</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">CLIENT NAME</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">CORPORATE EMAIL</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">DIRECT PHONE</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">INSTITUTION</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">SOLUTION / SERVICE</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">DEPLOYMENT NODE</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">VALUATION</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">STATUS</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">PROJECT SPECIFICATION</Data></Cell>
   </Row>
   ${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;
};

/**
 * Triggers Excel (.xls / SpreadsheetML) download directly in the browser
 */
export const exportToExcel = (data = [], options = {}) => {
    try {
        if (!data || data.length === 0) {
            toast.error('No records available to export.');
            return false;
        }

        const title = options.title || 'Kosher Code Inbound Inquiries Report';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = options.filename || `kosher_code_inbound_requests_${timestamp}.xls`;

        const xmlContent = generateExcelXml(data, title);
        const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', url);
        downloadAnchor.setAttribute('download', filename);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
        toast.success(`Exported ${data.length} records to Excel successfully!`);
        return true;
    } catch (err) {
        console.error('Excel export error:', err);
        toast.error('Failed to export Excel report.');
        return false;
    }
};

/**
 * Generates an executive printable PDF document and opens print dialog (Save as PDF)
 */
export const exportToPdf = (data = [], options = {}) => {
    try {
        if (!data || data.length === 0) {
            toast.error('No records available to export.');
            return false;
        }

        const title = options.title || 'Inbound Requests & Platform Telemetry';
        const subtitle = options.subtitle || 'Kampala HQ Superadmin Operations Desk • East Africa Switch';
        const timestamp = new Date().toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'medium'
        });

        const activeCount = data.filter(d => d.status === 'Active' || d.status === 'In Progress').length;
        const pendingCount = data.filter(d => d.status === 'Pending' || d.status === 'In Review').length;
        const doneCount = data.filter(d => d.status === 'Done' || d.status === 'Completed').length;

        const tableRowsHtml = data.map((item, idx) => {
            const id = escapeXml(item._id ? item._id.substring(0, 8).toUpperCase() : `ORD-${idx + 1}`);
            const date = escapeXml(item.date || item.postedDate || 'Recent');
            const name = escapeXml(item.name || item.representative || 'Enterprise Client');
            const institution = escapeXml(item.institution || item.company || 'Enterprise');
            const service = escapeXml(item.serviceName || item.title || 'Enterprise Solution');
            const location = escapeXml(item.region || item.location || 'Kampala HQ');
            const price = escapeXml(item.price || item.amount || 'Custom');
            const status = escapeXml(item.status || 'Pending');

            const statusClass = (status === 'Active' || status === 'In Progress') ? 'badge-active'
                : (status === 'Done' || status === 'Completed') ? 'badge-done'
                : 'badge-pending';

            return `
            <tr>
                <td style="font-weight:700; color:#4B24F5; font-size:11px;">#${id}</td>
                <td style="color:#64748B; font-size:11px;">${date}</td>
                <td>
                    <div style="font-weight:600; color:#0F172A;">${name}</div>
                    <div style="font-size:10px; color:#64748B;">${institution}</div>
                </td>
                <td>
                    <div style="font-weight:600; color:#1E293B;">${service}</div>
                    <div style="font-size:10px; color:#64748B;">${location}</div>
                </td>
                <td style="text-align:right; font-weight:700; color:#059669; font-size:11.5px;">${price.startsWith('$') ? price : `$${price}`}</td>
                <td style="text-align:center;">
                    <span class="badge ${statusClass}">${status}</span>
                </td>
            </tr>`;
        }).join('');

        const printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${escapeXml(title)}</title>
    <style>
        @page {
            size: landscape;
            margin: 12mm 15mm;
        }
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #0F172A;
            background: #FFFFFF;
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.4;
        }
        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #7355F7;
            padding-bottom: 14px;
            margin-bottom: 16px;
        }
        .brand-section {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .brand-logo {
            width: 40px;
            height: 40px;
            background: #7355F7;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-weight: 900;
            font-size: 20px;
        }
        .brand-title {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: #0F172A;
            margin: 0;
        }
        .brand-sub {
            font-size: 11px;
            color: #64748B;
            margin: 2px 0 0;
        }
        .meta-strip {
            text-align: right;
            font-size: 11px;
            color: #475569;
        }
        .kpi-row {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
        }
        .kpi-box {
            flex: 1;
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 10px 14px;
        }
        .kpi-label {
            font-size: 10px;
            font-weight: 700;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
        }
        .kpi-value {
            font-size: 18px;
            font-weight: 800;
            color: #0F172A;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
        }
        th {
            background-color: #7355F7;
            color: #FFFFFF;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            padding: 9px 10px;
            text-align: left;
            border: none;
        }
        th:first-child { border-top-left-radius: 6px; }
        th:last-child { border-top-right-radius: 6px; }
        td {
            padding: 8px 10px;
            border-bottom: 1px solid #E2E8F0;
            vertical-align: middle;
            font-size: 11px;
        }
        tr:nth-child(even) td {
            background-color: #F8FAFC;
        }
        tr {
            page-break-inside: avoid;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 999px;
            font-size: 9.5px;
            font-weight: 700;
        }
        .badge-active {
            background-color: #ECFDF5;
            color: #059669;
            border: 1px solid #A7F3D0;
        }
        .badge-done {
            background-color: #EFF6FF;
            color: #2563EB;
            border: 1px solid #BFDBFE;
        }
        .badge-pending {
            background-color: #FFFBEB;
            color: #D97706;
            border: 1px solid #FDE68A;
        }
        .report-footer {
            border-top: 1px solid #E2E8F0;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            color: #64748B;
        }
    </style>
</head>
<body>
    <div class="report-header">
        <div class="brand-section">
            <div class="brand-logo">K</div>
            <div>
                <h1 class="brand-title">Kosher Code Technologies</h1>
                <p class="brand-sub">${escapeXml(subtitle)}</p>
            </div>
        </div>
        <div class="meta-strip">
            <div><strong>Report Reference:</strong> KSH-REP-${Date.now().toString().slice(-6)}</div>
            <div><strong>Generated:</strong> ${timestamp}</div>
            <div><strong>SLA Standard:</strong> 99.9% Uptime Verified</div>
        </div>
    </div>

    <div class="kpi-row">
        <div class="kpi-box">
            <div class="kpi-label">Total Records</div>
            <div class="kpi-value">${data.length}</div>
        </div>
        <div class="kpi-box">
            <div class="kpi-label">Active Deployments</div>
            <div class="kpi-value" style="color:#059669;">${activeCount}</div>
        </div>
        <div class="kpi-box">
            <div class="kpi-label">Pending Inquiries</div>
            <div class="kpi-value" style="color:#D97706;">${pendingCount}</div>
        </div>
        <div class="kpi-box">
            <div class="kpi-label">Completed Deliverables</div>
            <div class="kpi-value" style="color:#2563EB;">${doneCount}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 85px;">Ref ID</th>
                <th style="width: 95px;">Date</th>
                <th>Client &amp; Institution</th>
                <th>Solution / Service</th>
                <th style="width: 100px; text-align:right;">Valuation</th>
                <th style="width: 95px; text-align:center;">Status</th>
            </tr>
        </thead>
        <tbody>
            ${tableRowsHtml}
        </tbody>
    </table>

    <div class="report-footer">
        <div>Kosher Code Technologies • Plot 14 Kampala Road, Kampala, Uganda • Tel: +256 703 275 790</div>
        <div>koshercode01@gmail.com • Confidential Corporate Telemetry</div>
    </div>
</body>
</html>`;

        // Render via hidden iframe to bypass popup blockers and trigger print-to-PDF
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        const frameDoc = iframe.contentWindow.document;
        frameDoc.open();
        frameDoc.write(printHtml);
        frameDoc.close();

        iframe.contentWindow.focus();
        setTimeout(() => {
            iframe.contentWindow.print();
            setTimeout(() => {
                try {
                    document.body.removeChild(iframe);
                } catch (e) {}
            }, 3000);
        }, 350);

        toast.success(`Preparing PDF document (${data.length} records)...`);
        return true;
    } catch (err) {
        console.error('PDF export error:', err);
        toast.error('Failed to generate PDF report.');
        return false;
    }
};

/**
 * Universal export function respecting active format
 */
export const executeExport = (data = [], format, options = {}) => {
    const targetFormat = format || getActiveExportFormat();
    if (targetFormat === 'pdf') {
        return exportToPdf(data, options);
    }
    return exportToExcel(data, options);
};
