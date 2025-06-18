import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { useAuth } from '../../context/authContext';

const ExportData = ({ isOpen, onClose }) => {
    const { incomes, expenses } = useGlobalContext();
    const { user } = useAuth();
    const [exportFormat, setExportFormat] = useState('csv');
    const [exportType, setExportType] = useState('all');
    const [isExporting, setIsExporting] = useState(false);

    const downloadCSV = (data, filename) => {
        if (data.length === 0) {
            alert('No data to export!');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    // Handle values that might contain commas
                    return typeof value === 'string' && value.includes(',') 
                        ? `"${value}"` 
                        : value;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadJSON = (data, filename) => {
        if (data.length === 0) {
            alert('No data to export!');
            return;
        }

        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDataForExport = (data, type) => {
        return data.map(item => ({
            Title: item.title,
            Amount: item.amount,
            Category: item.category,
            Description: item.description,
            Date: new Date(item.date).toLocaleDateString(),
            Type: type,
            'Created At': new Date(item.createdAt).toLocaleString()
        }));
    };

    const handleExport = async () => {
        setIsExporting(true);
        
        try {
            let dataToExport = [];
            let filename = '';

            switch (exportType) {
                case 'incomes':
                    dataToExport = formatDataForExport(incomes, 'Income');
                    filename = `incomes_${new Date().toISOString().split('T')[0]}`;
                    break;
                case 'expenses':
                    dataToExport = formatDataForExport(expenses, 'Expense');
                    filename = `expenses_${new Date().toISOString().split('T')[0]}`;
                    break;
                case 'all':
                default:
                    const formattedIncomes = formatDataForExport(incomes, 'Income');
                    const formattedExpenses = formatDataForExport(expenses, 'Expense');
                    dataToExport = [...formattedIncomes, ...formattedExpenses];
                    filename = `financial_data_${new Date().toISOString().split('T')[0]}`;
                    break;
            }

            // Add user info to export
            const exportData = {
                exportInfo: {
                    exportedBy: user?.name,
                    exportedAt: new Date().toISOString(),
                    exportType: exportType,
                    totalRecords: dataToExport.length
                },
                data: dataToExport
            };

            if (exportFormat === 'csv') {
                downloadCSV(dataToExport, `${filename}.csv`);
            } else {
                downloadJSON(exportData, `${filename}.json`);
            }

            // Show success message
            setTimeout(() => {
                alert(`Successfully exported ${dataToExport.length} records!`);
                onClose();
            }, 1000);

        } catch (error) {
            console.error('Export error:', error);
            alert('Export failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    if (!isOpen) return null;

    const totalRecords = incomes.length + expenses.length;

    return (
        <>
            <Overlay onClick={onClose} />
            <Modal>
                <ModalHeader>
                    <h2>
                        <i className="fa-solid fa-download"></i>
                        Export Data
                    </h2>
                    <CloseButton onClick={onClose}>
                        <i className="fa-solid fa-times"></i>
                    </CloseButton>
                </ModalHeader>

                <ModalContent>
                    <ExportStats>
                        <StatItem>
                            <StatIcon className="income">
                                <i className="fa-solid fa-arrow-up"></i>
                            </StatIcon>
                            <StatInfo>
                                <label>Income Records</label>
                                <value>{incomes.length}</value>
                            </StatInfo>
                        </StatItem>
                        
                        <StatItem>
                            <StatIcon className="expense">
                                <i className="fa-solid fa-arrow-down"></i>
                            </StatIcon>
                            <StatInfo>
                                <label>Expense Records</label>
                                <value>{expenses.length}</value>
                            </StatInfo>
                        </StatItem>
                        
                        <StatItem>
                            <StatIcon className="total">
                                <i className="fa-solid fa-database"></i>
                            </StatIcon>
                            <StatInfo>
                                <label>Total Records</label>
                                <value>{totalRecords}</value>
                            </StatInfo>
                        </StatItem>
                    </ExportStats>

                    <ExportOptions>
                        <OptionGroup>
                            <OptionLabel>What to Export</OptionLabel>
                            <RadioGroup>
                                <RadioOption>
                                    <input
                                        type="radio"
                                        name="exportType"
                                        value="all"
                                        checked={exportType === 'all'}
                                        onChange={(e) => setExportType(e.target.value)}
                                    />
                                    <span>All Data</span>
                                    <small>({totalRecords} records)</small>
                                </RadioOption>
                                
                                <RadioOption>
                                    <input
                                        type="radio"
                                        name="exportType"
                                        value="incomes"
                                        checked={exportType === 'incomes'}
                                        onChange={(e) => setExportType(e.target.value)}
                                    />
                                    <span>Income Only</span>
                                    <small>({incomes.length} records)</small>
                                </RadioOption>
                                
                                <RadioOption>
                                    <input
                                        type="radio"
                                        name="exportType"
                                        value="expenses"
                                        checked={exportType === 'expenses'}
                                        onChange={(e) => setExportType(e.target.value)}
                                    />
                                    <span>Expenses Only</span>
                                    <small>({expenses.length} records)</small>
                                </RadioOption>
                            </RadioGroup>
                        </OptionGroup>

                        <OptionGroup>
                            <OptionLabel>Export Format</OptionLabel>
                            <RadioGroup>
                                <RadioOption>
                                    <input
                                        type="radio"
                                        name="exportFormat"
                                        value="csv"
                                        checked={exportFormat === 'csv'}
                                        onChange={(e) => setExportFormat(e.target.value)}
                                    />
                                    <span>CSV (Excel)</span>
                                    <small>Spreadsheet format</small>
                                </RadioOption>
                                
                                <RadioOption>
                                    <input
                                        type="radio"
                                        name="exportFormat"
                                        value="json"
                                        checked={exportFormat === 'json'}
                                        onChange={(e) => setExportFormat(e.target.value)}
                                    />
                                    <span>JSON</span>
                                    <small>Developer format</small>
                                </RadioOption>
                            </RadioGroup>
                        </OptionGroup>
                    </ExportOptions>

                    <ExportInfo>
                        <InfoIcon>
                            <i className="fa-solid fa-info-circle"></i>
                        </InfoIcon>
                        <InfoText>
                            Your exported file will include all transaction details, categories, dates, and descriptions. 
                            Personal information is not included for privacy.
                        </InfoText>
                    </ExportInfo>

                    <ButtonGroup>
                        <CancelButton onClick={onClose}>
                            Cancel
                        </CancelButton>
                        <ExportButton 
                            onClick={handleExport} 
                            disabled={isExporting || totalRecords === 0}
                        >
                            {isExporting ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-download"></i>
                                    Export Data
                                </>
                            )}
                        </ExportButton>
                    </ButtonGroup>
                </ModalContent>
            </Modal>
        </>
    );
};

// Styled Components
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 2000;
`;

const Modal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 24px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    z-index: 2001;
`;

const ModalHeader = styled.div`
    padding: 2rem 2rem 1rem 2rem;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
        color: var(--primary-color);
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        i {
            color: #17a2b8;
        }
    }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #999;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
        background: #f5f5f5;
        color: #333;
    }
`;

const ModalContent = styled.div`
    padding: 2rem;
`;

const ExportStats = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const StatItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 12px;
`;

const StatIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.income {
        background: rgba(66, 173, 0, 0.1);
        color: var(--color-green);
    }
    
    &.expense {
        background: rgba(255, 71, 87, 0.1);
        color: #ff4757;
    }
    
    &.total {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
    }
`;

const StatInfo = styled.div`
    label {
        display: block;
        font-size: 0.8rem;
        color: #666;
        margin-bottom: 0.2rem;
    }
    
    value {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--primary-color);
    }
`;

const ExportOptions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
`;

const OptionGroup = styled.div``;

const OptionLabel = styled.h4`
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.1rem;
`;

const RadioGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const RadioOption = styled.label`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        border-color: #17a2b8;
        background: rgba(23, 162, 184, 0.05);
    }

    input[type="radio"] {
        width: 18px;
        height: 18px;
        accent-color: #17a2b8;
    }

    span {
        font-weight: 600;
        color: var(--primary-color);
    }

    small {
        color: #666;
        margin-left: auto;
    }
`;

const ExportInfo = styled.div`
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: rgba(23, 162, 184, 0.05);
    border-radius: 12px;
    margin-bottom: 2rem;
`;

const InfoIcon = styled.div`
    color: #17a2b8;
    font-size: 1.2rem;
    margin-top: 0.2rem;
`;

const InfoText = styled.div`
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
`;

const CancelButton = styled.button`
    flex: 1;
    padding: 1rem;
    background: transparent;
    color: #666;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: #f7fafc;
    }
`;

const ExportButton = styled.button`
    flex: 1;
    padding: 1rem;
    background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(23, 162, 184, 0.3);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

export default ExportData;