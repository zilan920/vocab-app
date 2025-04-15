import React from "react";

export default function WordList({ words }) {
    if (!words.length) return <p className="text-gray-400">请选择一个类目。</p>;

    return (
        <div className="mt-4 space-y-4 text-sm sm:text-base">
            {words.map((word, idx) => (
                <div
                    key={idx}
                    className="border-b pb-2 text-gray-800 space-y-1"
                >
                    <div className="font-bold text-blue-800 text-lg">{word.word}</div>
                    <div className="text-gray-600 italic">
                        [{word.phonetic}] <span>{word.part_of_speech}</span>
                    </div>
                    <div>📖 {word.meaning}</div>
                    {word.synonyms && (
                        <div className="text-sm text-gray-500">近义词: {word.synonyms.join(", ")}</div>
                    )}
                    {word.mnemonic && (
                        <div className="text-sm text-purple-700">记忆: {word.mnemonic}</div>
                    )}
                    {word.examples && (
                        <ul className="text-green-700 list-disc ml-5">
                            {word.examples.map((ex, i) => (
                                <li key={i}>例：{ex}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}
