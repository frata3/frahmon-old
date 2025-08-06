import { Editor } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"

const editor = new Editor({
  element: document.querySelector("#editor"),
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: "پست بلاگ خود را اینجا بنویسید...",
    }),
    Link.configure({
      openOnClick: false,
    }),
    Image,
    Highlight,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
  ],
  content: "<p>به بلاگ خود خوش آمدید.</p>",
})

document.getElementById("editor-toolbar").addEventListener("click", (e) => {
  const action = e.target.dataset.action
  if (!action) return

  switch (action) {
    case "bold":
      editor.chain().focus().toggleBold().run()
      break
    case "italic":
      editor.chain().focus().toggleItalic().run()
      break
    case "code":
      editor.chain().focus().toggleCode().run()
      break
    case "highlight":
      editor.chain().focus().toggleHighlight().run()
      break
    case "link":
      const url = prompt("آدرس لینک:")
      if (url) {
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
      }
      break
    case "image":
      const imgUrl = prompt("آدرس تصویر:")
      if (imgUrl) {
        editor.chain().focus().setImage({ src: imgUrl }).run()
      }
      break
  }
})

// تراز متن
document.querySelector('[data-action="align"]').addEventListener("change", (e) => {
  const align = e.target.value
  editor.chain().focus().setTextAlign(align).run()
})

// ذخیره نهایی در فرم
document.getElementById("submit-post").addEventListener("click", () => {
  const html = editor.getHTML()
  document.getElementById("hidden-content").value = html
})
