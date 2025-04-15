import React from "react";
import { books } from "../data/books";

export default function BookSelector({ selected, onSelect }) {
    return (
        <select
            value={selected}
            onChange={(e) => onSelect(e.target.value)}
            className="border p-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 text-sm"
        >
            {Object.entries(books).map(([key, value]) => (
                <option key={key} value={key}>
                    {value.name}
                </option>
            ))}
        </select>
    );
}
