import React, { useEffect, useState } from "react";
import RecursiveCategoryTree from "./components/RecursiveCategoryTree";
import WordList from "./components/WordList";
import BookSelector from "./components/BookSelector";
import { books } from "./data/books";

function App() {
  const [selectedBook, setSelectedBook] = useState("IELTS");
  const [data, setData] = useState({});
  const [activePath, setActivePath] = useState([]);

  useEffect(() => {
    fetch(books[selectedBook].path)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setActivePath([]);
      });
  }, [selectedBook]);

  const getWordsAtPath = (path) => {
    let node = data;
    for (let key of path) {
      node = node?.[key];
    }
    return Array.isArray(node) ? node : [];
  };

  const wordList = getWordsAtPath(activePath);

  return (
    <div className="w-full max-w-screen-md mx-auto p-4 font-sans">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          📚 Vocabulary Browser
        </h1>
        <BookSelector selected={selectedBook} onSelect={setSelectedBook} />
      </header>

      {/* 类目选择 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">📂 类目选择</h2>
        <div className="bg-white rounded shadow p-3 overflow-x-auto">
          <RecursiveCategoryTree
            data={data}
            activePath={activePath}
            onSelectPath={setActivePath}
          />
        </div>
      </div>

      {/* 单词展示 */}
      <div className="bg-white rounded shadow p-3">
        <WordList words={wordList} />
      </div>
    </div>
  );
}

export default App;
