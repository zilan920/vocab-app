import React, { useEffect, useState } from "react";
import RecursiveCategoryTree from "./components/RecursiveCategoryTree";
import WordList from "./components/WordList";
import { books } from "./data/books";
import BookSelector from "./components/BookSelector";

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
    <div className="max-w-4xl mx-auto p-4 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📚 Vocabulary Browser</h1>
        <BookSelector selected={selectedBook} onSelect={setSelectedBook} />
      </header>

      {/* Category Selector 上方结构 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">📂 类目选择</h2>
        <div className="bg-white rounded shadow p-4">
          <RecursiveCategoryTree
            data={data}
            activePath={activePath}
            onSelectPath={setActivePath}
          />
        </div>
      </div>

      {/* Word List 下方结构 */}
      <div className="bg-white rounded shadow p-4">
        <WordList words={wordList} />
      </div>
    </div>
  );
}

export default App;
