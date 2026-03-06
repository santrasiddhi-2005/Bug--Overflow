import React, { useEffect, useRef } from "react";
import copy from "copy-to-clipboard";
import { showToast } from "../../utils/toast";

const HtmlWithCopyCode = ({ html, className }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const codeBlocks = container.querySelectorAll("pre");

    codeBlocks.forEach((pre) => {
      if (pre.parentElement?.classList.contains("code-block-wrapper")) return;

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "code-copy-btn";
      copyBtn.textContent = "Copy";

      copyBtn.onclick = () => {
        const codeNode = pre.querySelector("code");
        const codeText = codeNode?.innerText || pre.innerText || "";

        if (codeText.trim()) {
          copy(codeText);
          showToast("Code copied", "success");
          copyBtn.textContent = "Copied";
          setTimeout(() => {
            copyBtn.textContent = "Copy";
          }, 1200);
        }
      };

      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper";
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      wrapper.appendChild(copyBtn);
    });
  }, [html]);

  return <div ref={contentRef} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default HtmlWithCopyCode;
