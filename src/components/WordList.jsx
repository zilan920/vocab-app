import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WordList({ words }) {
    if (!words.length) return <p className="text-gray-400">请选择类目以查看单词。</p>;

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">单词列表</h2>
            <ul className="space-y-4">
                <AnimatePresence>
                    {words.map((word, idx) => (
                        <motion.li
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border rounded-lg p-4 shadow hover:shadow-md transition"
                        >
                            <div className="text-xl font-semibold">{word.word}</div>
                            <div className="text-sm text-gray-500 mb-1">
                                [{word.phonetic}] <em>{word.part_of_speech}</em>
                            </div>
                            <div className="mb-1">📖 {word.meaning}</div>
                            {word.synonyms && <div className="text-sm text-gray-600">近义词: {word.synonyms.join(", ")}</div>}
                            {word.mnemonic && <div className="text-sm italic text-purple-600">记忆: {word.mnemonic}</div>}
                            {word.examples && (
                                <ul className="mt-2 list-disc list-inside text-sm text-green-700">
                                    {word.examples.map((ex, i) => (
                                        <li key={i}>例：{ex}</li>
                                    ))}
                                </ul>
                            )}
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    );
}
