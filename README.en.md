<p align="right">
  <a href="./README.md">UA</a> &nbsp;|&nbsp; EN
</p>

# 🪄 Intelligent module for automated text editing in web-publishing systems

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-2F74C0?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7811F7?style=for-the-badge&logo=bootstrap&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F43E01?style=for-the-badge&logo=groq&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-38CC6E?style=for-the-badge&logo=vitest&logoColor=white)

![Academic Project](https://img.shields.io/badge/Academic_Project-2026-3C7574?style=for-the-badge)
![Sandbox Demo](https://img.shields.io/badge/Sandbox_Demo-628D9C?style=for-the-badge&labelColor=2C3030)
![Made for Dragon Tale](https://img.shields.io/badge/Made_for-Dragon_Tale-D5DADA?style=for-the-badge)

**Automated editing module** is an example of an intelligent tool designed to assist authors within the built-in editor of a literary web-platform. It was created to optimize the manual editing process based on the ethical and controlled use of Artificial Intelligence.

🚩 **The module does not perform automatic text rewriting and does not replace the author.**

This repository contains a **demonstration sandbox-version** of the intelligent automated text editing module. Unlike the full implementation integrated into the **Dragon Tale** literary platform, this version lacks additional validation mechanisms, a database, and other platform components. It is intended solely to demonstrate the core functionality and workflows of the module.

## 💫 Module in the Dragon Tale editor

The **full functionality of the module** can be tested within **[Dragon Tale](https://dragon-tale.vercel.app/)**.
To do this, you need to:

1. Register in the system.
2. Create a literary work.
3. Add a chapter to this work.
4. Switch to the chapter editing mode.
5. Select a valid text fragment.
6. Start interacting with the module.

## ✨ Key features of the module

- Controlled interaction with LLM.
- Pre-validation of the selected text fragment.
- Mandatory user consent for transferring text to a third-party service for AI-editing.
- Use of a pre-built template library with structured prompts designed specifically for fiction prose.
- Complete user control over their own text.
- Detection of AI-edited text usage in the final chapter text during saving (two-level verification, including the shingling method).
- Visible indication of AI editing usage.

## 🛠️ Technologies used

- **Full-stack Next.js with TypeScript** — for implementing the demonstration full-stack application.
- **React** — for building the user interface.
- **Bootstrap 5 and React-Bootstrap** — for styling and using ready-made UI components.
- **OpenAI SDK** — for integration with the Groq API and working with the Llama-3.1-8b-instant model.
- **Vitest** — for unit testing of pre-validation mechanisms and components of the AI-editing detection algorithm.

## 💻 Local setup

🔑 **A valid API key for interacting with the Groq API is required for the module to function (you can obtain one at the [Groq Console](https://console.groq.com/home)).**

### 📋 Setup instructions:

1. Clone this repository:

```
git clone [https://github.com/Mikaiella/AI_editing_module.git](https://github.com/Mikaiella/AI_editing_module.git)
```

2. Navigate to the actual module folder:

```
cd demo_module
```

3. Install dependencies:

```
npm install
```

4. Create a _.env.local_ file (you can copy it from _.env.example_) and add your API key:

```
GROQ_API_KEY=KEY_GOES_HERE
```

5. Run the project:

```
npm run dev
```

6. Open the link:

```
http://localhost:3000/
```

📝 The project already includes data for a demonstration chapter (_demo-chapter.json_ file), which contains the text and the AI-editing detection state, both of which can be modified if needed.

## ⚡️ User workflow scenario

1. Select a text fragment in the editor.
2. Click the module activation button.
3. Confirm consent to transfer text for AI editing.
4. Select an editing template.
5. Compare the original and AI-edited versions.
6. Apply the chosen changes.
7. Save changes (the algorithm will automatically detect the usage).
