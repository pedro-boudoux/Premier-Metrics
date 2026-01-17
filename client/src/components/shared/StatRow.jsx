import React from "react";

/**
 * StatRow - A reusable component for displaying stat rows
 * 
 * Supports two modes:
 * - Single player mode: Shows label on left, value on right
 * - Compare mode: Shows p1Value on left, label in center, p2Value on right
 */
export const StatRow = ({ label, value, unit = "", mode = "single" }) => (
  <div className="flex justify-between items-center px-1 py-2 border-b border-gray-100 last:border-0">
    <p className="w-1/3 text-left text-xs md:text-sm text-gray-600">{label}</p>
    <p className="w-1/3 text-right text-xs md:text-sm font-semibold text-premier-dark">
      {value ?? "N/A"}{value != null && value !== "N/A" ? unit : ""}
    </p>
  </div>
);

export const CompareRow = ({ label, p1Value, p2Value, unit = "" }) => (
  <div className="flex justify-between items-center px-1 py-2 border-b border-gray-100 last:border-0">
    <p className="w-1/3 text-left text-xs md:text-sm font-semibold text-premier-dark">
      {p1Value ?? "N/A"}{p1Value != null && p1Value !== "N/A" ? unit : ""}
    </p>
    <p className="w-1/3 text-center text-xs md:text-sm text-gray-600">{label}</p>
    <p className="w-1/3 text-right text-xs md:text-sm font-semibold text-premier-dark">
      {p2Value ?? "N/A"}{p2Value != null && p2Value !== "N/A" ? unit : ""}
    </p>
  </div>
);
