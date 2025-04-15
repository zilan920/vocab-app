import re
import json
from collections import defaultdict

def extract_intent_hierarchy(text):
    """提取按意群分类下的一级 -> 二级结构"""
    match = re.search(r'按意群分类(.+?)\n\n\nIELTS', text, re.DOTALL)
    section = match.group(1) if match else ""

    hierarchy = defaultdict(list)
    current_primary = None
    for line in section.splitlines():
        line = line.strip()
        if not line:
            continue
        primary_match = re.match(r'^\d+\.\s*(.+)$', line)
        if primary_match:
            current_primary = primary_match.group(1).strip()
            continue
        if current_primary:
            hierarchy[current_primary].append(line)
    return hierarchy


def parse_vocab_book(text, intent_hierarchy):
    """主函数：构建完整词汇数据结构"""
    structured_data = {
        "按学科分类": defaultdict(list),
        "按意群分类": defaultdict(lambda: defaultdict(list))
    }

    current_top = None
    current_primary = None
    current_secondary = None
    word_entry = None

    lines = text.splitlines()

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Top-level classification
        if line == "按学科分类":
            current_top = "按学科分类"
            current_primary = current_secondary = None
            continue
        elif line == "按意群分类":
            current_top = "按意群分类"
            current_primary = current_secondary = None
            continue

        # Examples / Mnemonics
        if line.startswith("【例 】") and word_entry:
            word_entry.setdefault("examples", []).append(line.replace("【例 】", "").strip())
            continue
        if line.startswith("【记 】") and word_entry:
            word_entry["mnemonic"] = line.replace("【记 】", "").strip()
            continue

        # Word entry line
        word_match = re.match(
            r'^([a-zA-Z\-\']+)[［\[\' ]+([^\]］\']+)[］\] ]+([a-z]+\.)\s*(.*?)\s*(（(.*?)）)?$',
            line
        )
        if word_match:
            word, phonetic, pos, meaning, _, synonyms = word_match.groups()
            word_entry = {
                "word": word.strip(),
                "phonetic": phonetic.strip(),
                "part_of_speech": pos.strip(),
                "meaning": meaning.strip()
            }
            if synonyms:
                word_entry["synonyms"] = [s.strip() for s in synonyms.split(',')]

            # Save to appropriate location
            if current_top == "按学科分类" and current_primary:
                structured_data["按学科分类"][current_primary].append(word_entry)
            elif current_top == "按意群分类" and current_primary and current_secondary:
                structured_data["按意群分类"][current_primary][current_secondary].append(word_entry)
            continue

        # Category line (subject-based)
        if current_top == "按学科分类" and not re.match(r'^[a-zA-Z【]', line):
            current_primary = line
            continue

        # Category line (intent-based)
        if current_top == "按意群分类":
            if line in intent_hierarchy:
                current_primary = line
                current_secondary = None
                continue
            elif current_primary and line in intent_hierarchy[current_primary]:
                current_secondary = line
                continue

    return structured_data


# === 主执行 ===
if __name__ == "__main__":
    # 输入文本路径
    input_path = "你的词汇书.txt"
    output_path = "ielts_wordbook_final_correct.json"

    with open(input_path, encoding="utf-8") as f:
        content = f.read()

    # 提取结构 & 解析
    intent_hierarchy = extract_intent_hierarchy(content)
    structured_json = parse_vocab_book(content, intent_hierarchy)

    # 保存为 JSON 文件
    with open(output_path, "w", encoding="utf-8") as out:
        json.dump(structured_json, out, ensure_ascii=False, indent=2)

    print(f"✅ 完成：输出文件已保存至 {output_path}")
