import React from "react";

export default function RecursiveCategoryTree({
  data,
  path = [],
  onSelectPath,
  activePath
}) {
  if (typeof data !== "object" || Array.isArray(data)) return null;

  const level = path.length;
  const keys = Object.keys(data);

  return (
    <div className="space-y-4">
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {keys.map((key) => {
          const currentPath = [...path, key];
          const isSelected =
            JSON.stringify(currentPath) === JSON.stringify(activePath);
          const isOnPath =
            activePath.length >= currentPath.length &&
            activePath.slice(0, currentPath.length).join("/") === currentPath.join("/");

          return (
            <button
              key={key}
              className={`whitespace-nowrap px-4 py-1 rounded-full border transition text-sm
                ${isSelected ? "bg-blue-600 text-white" : ""}
                ${!isSelected && isOnPath ? "bg-blue-100 text-blue-900" : ""}
                ${!isOnPath ? "bg-gray-100 hover:bg-blue-100 text-gray-700" : ""}
              `}
              onClick={() => onSelectPath(currentPath)}
            >
              {key}
            </button>
          );
        })}
      </div>

      {/* 展开子类目（如果是路径上的） */}
      {keys.map((key) => {
        const currentPath = [...path, key];
        const isOnPath =
          activePath.length >= currentPath.length &&
          activePath.slice(0, currentPath.length).join("/") === currentPath.join("/");

        const value = data[key];

        if (typeof value === "object" && !Array.isArray(value) && isOnPath) {
          return (
            <div key={key} className="pl-2 border-l border-gray-200 ml-2">
              <RecursiveCategoryTree
                data={value}
                path={currentPath}
                activePath={activePath}
                onSelectPath={onSelectPath}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
