"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
const ExcelUpload: React.FC = () => {
  const [jsonData, setJsonData] = useState<Record<string, any> | string>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        let allData: Record<string, any>[] = [];

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const jsonSheetData: (string | number | boolean | null)[][] =
            XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const headers: string[] = jsonSheetData[0] as string[];
          const jsonObjects = jsonSheetData.slice(1).map((row) => {
            const formattedData: Record<string, any> = {
              category: sheetName.toLowerCase(),
              title: row[0],
            };
            // Initialize the category object
            formattedData.details = {};

            // Assuming subsequent columns correspond to each category
            for (let i = 1; i < headers.length; i++) {
              const categoryName = headers[i]
                .replace(/\s+/g, "_")
                .replace(/[()\/]/g, "")
                .replace(/[^a-zA-Z0-9_]/g, "");
              formattedData.details[categoryName] = row[i];
            }

            return formattedData;
          });

          // Filter out empty rows
          const filteredData = jsonObjects.filter((row) => {
            return Object.values(row).some((value) => value !== null);
          });
          allData = [...allData, ...filteredData];
        });

        const jsonString = allData;

        if (jsonString) {
          await axios.post("/api/products/dynamic/create", jsonString);
        }
        setJsonData(jsonString);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <pre>{JSON.stringify(jsonData, null, 2)}</pre>
    </div>
  );
};

export default ExcelUpload;
