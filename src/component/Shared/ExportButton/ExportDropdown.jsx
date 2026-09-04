import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFileExcel, 
    faFilePdf, 
    faCheck, 
    faChevronDown 
} from '@fortawesome/free-solid-svg-icons';
import { 
    getActiveExportFormat, 
    setActiveExportFormat, 
    exportToExcel, 
    exportToPdf 
} from '../../../services/exportService';
import './ExportDropdown.css';

/**
 * Universal Export Component
 * Default format: Excel (.xlsx / .xls)
 * Alternate format: PDF (.pdf)
 * Fully interactive with active format indicators and instant execution.
 */
const ExportDropdown = ({ 
    data = [], 
    options = {}, 
    variant = 'dark', // 'dark' | 'light' | 'primary'
    buttonText = 'Export',
    align = 'end'
}) => {
    const [activeFormat, setFormat] = useState(() => getActiveExportFormat());

    const handleExport = (format) => {
        const targetFormat = format || activeFormat;
        if (targetFormat === 'pdf') {
            exportToPdf(data, options);
        } else {
            exportToExcel(data, options);
        }
    };

    const handleSelectFormat = (format) => {
        setFormat(format);
        setActiveExportFormat(format);
        handleExport(format);
    };

    return (
        <Dropdown align={align} className="kosher-export-dropdown">
            <div className={`kosher-export-btn-group variant-${variant}`} role="group">
                {/* Main Action Button - Executes Active Format (Excel by default) */}
                <button
                    type="button"
                    className="kosher-export-main-btn"
                    onClick={() => handleExport(activeFormat)}
                    title={`Export ${data.length} records as ${activeFormat === 'excel' ? 'Excel (.xls/.xlsx)' : 'PDF'}`}
                >
                    <FontAwesomeIcon 
                        icon={activeFormat === 'excel' ? faFileExcel : faFilePdf} 
                        className={`kosher-export-type-icon ${activeFormat === 'excel' ? 'excel-color' : 'pdf-color'}`}
                    />
                    <span>{buttonText}</span>
                    <span className="kosher-export-badge-tag">
                        {activeFormat === 'excel' ? 'Excel' : 'PDF'}
                    </span>
                </button>

                {/* Dropdown Toggle Chevron to choose format */}
                <Dropdown.Toggle 
                    as="button" 
                    className="kosher-export-toggle-btn"
                    title="Change export format (Excel or PDF)"
                    id="export-format-toggle"
                >
                    <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '10px' }} />
                </Dropdown.Toggle>
            </div>

            <Dropdown.Menu className="kosher-export-menu shadow-lg">
                <div className="kosher-export-menu-header">
                    <span>EXPORT FORMAT</span>
                    <small>Default: Excel</small>
                </div>

                {/* Option 1: Microsoft Excel (Default & Active) */}
                <Dropdown.Item 
                    onClick={() => handleSelectFormat('excel')}
                    className={`kosher-export-item ${activeFormat === 'excel' ? 'is-selected' : ''}`}
                >
                    <div className="d-flex align-items-center justify-content-between w-100 gap-3">
                        <div className="d-flex align-items-center gap-2.5">
                            <div className="kosher-export-icon-box excel">
                                <FontAwesomeIcon icon={faFileExcel} />
                            </div>
                            <div>
                                <div className="kosher-export-item-title">
                                    Microsoft Excel (.xls / .xlsx)
                                    <span className="kosher-default-pill">Default</span>
                                </div>
                                <div className="kosher-export-item-desc">
                                    Structured spreadsheet with column metrics
                                </div>
                            </div>
                        </div>
                        {activeFormat === 'excel' ? (
                            <span className="kosher-active-pill">
                                <FontAwesomeIcon icon={faCheck} className="me-1" /> Active
                            </span>
                        ) : (
                            <span className="kosher-switch-label">Select</span>
                        )}
                    </div>
                </Dropdown.Item>

                {/* Option 2: PDF Document */}
                <Dropdown.Item 
                    onClick={() => handleSelectFormat('pdf')}
                    className={`kosher-export-item ${activeFormat === 'pdf' ? 'is-selected' : ''}`}
                >
                    <div className="d-flex align-items-center justify-content-between w-100 gap-3">
                        <div className="d-flex align-items-center gap-2.5">
                            <div className="kosher-export-icon-box pdf">
                                <FontAwesomeIcon icon={faFilePdf} />
                            </div>
                            <div>
                                <div className="kosher-export-item-title">
                                    PDF Document (.pdf)
                                </div>
                                <div className="kosher-export-item-desc">
                                    Executive print-ready telemetry report
                                </div>
                            </div>
                        </div>
                        {activeFormat === 'pdf' ? (
                            <span className="kosher-active-pill pdf">
                                <FontAwesomeIcon icon={faCheck} className="me-1" /> Active
                            </span>
                        ) : (
                            <span className="kosher-switch-label">Select</span>
                        )}
                    </div>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ExportDropdown;
