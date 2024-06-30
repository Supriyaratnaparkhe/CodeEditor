import React, { useState, useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "./CodeEditor.css";

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const textareaRef = useRef(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newValue =
        code.substring(0, selectionStart) + "  " + code.substring(selectionEnd);
      setCode(newValue);
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          selectionStart + 2;
      }, 0);
    } else if (["{", "(", "[", '"', "'", "<"].includes(e.key)) {
      e.preventDefault();
      const pairs = {
        "{": "}",
        "(": ")",
        "[": "]",
        '"': '"',
        "'": "'",
        "<": ">",
      };
      const { selectionStart, selectionEnd } = e.target;
      const newValue =
        code.substring(0, selectionStart) +
        e.key +
        pairs[e.key] +
        code.substring(selectionEnd);
      setCode(newValue);
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          selectionStart + 1;
      }, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const currentLine = code.substring(0, selectionStart).split("\n").pop();
      const indentMatch = currentLine.match(/^\s*/);
      const indent = indentMatch ? indentMatch[0] : "";

      const newIndent =
        currentLine.trim().endsWith("{") || currentLine.trim().endsWith(">")
          ? indent + "  "
          : indent;
      const isBlockStart =
        currentLine.trim().endsWith("{") || currentLine.trim().endsWith(">");
      const newValue =
        code.substring(0, selectionStart) +
        "\n" +
        newIndent +
        (isBlockStart ? "\n" + indent : "") +
        code.substring(selectionEnd);
      setCode(newValue);

      setTimeout(() => {
        const cursorPosition = selectionStart + newIndent.length + 1;
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          cursorPosition;
      }, 0);
    }
  };

  const getLineNumbers = () => {
    return code.split("\n").map((line, index) => (
      <span key={index} className="line-number">
        {index + 1}
      </span>
    ));
  };

  return (
    <div className="code-editor-container">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="language-select"
      >
        <option value="javascript">JavaScript</option>
        <option value="css">CSS</option>
        <option value="html">HTML</option>
        <option value="python">Python</option>
      </select>
      <div className="container">
        <div className="editor">
          <div className="line-numbers">{getLineNumbers()}</div>

          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            className="code-input"
          />
        </div>
        <div className="editor">
          <div className="line-numbers">{getLineNumbers()}</div>

          <pre
            className="code-output"
            style={{ padding: "10px", margin: "0px" }}
          >
            <code className={`language-${language}`}>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
