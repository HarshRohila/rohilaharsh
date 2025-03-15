---
title: 'Clean Architecture in Frontend'
date: 2025-03-15T09:30:00+05:30
author: 'Harsh Rohila'
draft: false
featured_image: '/img/clean_arch.webp'
---

# Clean Architecture in Frontend

Recently, the term **"Clean Architecture"** was discussed in my company. It sounded interesting, so I started thinking about whether we could use it in frontend projects too. To understand it better, I read **"Clean Architecture"** by Robert C. Martin.

After learning the basics, I tried applying Clean Architecture to a frontend project. In this blog, I will share my experience and how I built a **To-Do CRUD app**, which you can check out [here](https://stackblitz.com/~/github.com/HarshRohila/clean_arch).

Let's see how Clean Architecture can help in frontend development.

---

## Key Principles of Clean Architecture in Frontend

### 1. The Web is for Input/Output

In Clean Architecture, the UI is treated as an interchangeable layer that only handles input and output, while the core logic remains independent. The same app should work on **Web, Mobile, or a CLI app** without big changes. The UI should be replaceable without affecting the main logic.

To make this possible, I used the following folder structure (all source code exists inside the `src` folder):

#### **Folder Structure**

- **`views/web`** → Contains the web-specific UI code.
  - If we want mobile or CLI versions, we can create `views/mobile` or `views/cli`.
- **`views/web/ports`** → This folder contains interfaces that define how the web UI interacts with other parts of the application. These interfaces act as a bridge between the UI and data sources, ensuring that the UI remains independent of any specific data source implementation.
  - Example: `ITodoService`, an interface for managing to-do items. Any data source—REST API, GraphQL, memory, or local storage—can implement this interface to provide data to the UI. This makes it easy to switch data sources without modifying the UI logic.
- **`config/main`** → Handles dependency injection (DI), mapping interfaces to actual implementations.
- **`persistence/`** → Contains different ways to store data and implementations of the `ITodoService` interface to send data to the UI.
  - `persistence/api` → Implements `ITodoService` to fetch and store data using a mock server powered by Mirage.js, simulating a REST API.
  - `persistence/memory` → Implements `ITodoService` to store data in memory for quick access. This serves as an alternative data source that does not rely on an API. You can try this by switching the import of `TodoService` in `config/main.ts` from `"@/persistence/api/todos"` to `"@/persistence/memory/todos"`. This allows the app to fetch and store to-do items directly in memory instead of using a backend service.
- **`libs/`** → This folder manages external libraries.
  - Example: `libs/rx.ts` re-exports RxJS functions. If RxJS updates in the future, only this file needs to change, not the whole codebase.

### 2. Keep Frameworks Separate from Core Logic

Many frontend projects become tightly connected to a framework, making it hard to switch or upgrade. Clean Architecture suggests treating frameworks as tools, not as the core of your project.

In this project, I used **React**, but the app is designed to support **Angular, Vue, Ember.js**, or any other framework with minimal changes.

#### **How to Separate UI from Core Logic**

- **Use ViewModels & Presenters**:
  - **ViewModels** hold the data needed for the UI.
  - **Presenters** prepare the data and send it to ViewModels.
  - This keeps UI components simple, only displaying data without processing it.
- **Keep Framework-Specific Code in One Place**:
  - All React components are inside `views/web/react-components`.
  - If we switch to another framework, only this folder needs to be updated.
- **Use RxJS for State Management**:
  - Components subscribe to **ViewModel Observables** to get updates.
  - We need a way to notify UI components when data changes. ViewModels should provide this notification system, allowing templates/HTML to update automatically.
  - Instead of Redux, I used my own RxJS-based state management library - [@rx-state-utils/js](https://www.npmjs.com/package/@rx-state-utils/js), which makes state updates easier by using Observables that React components can subscribe to.
  - Redux can also be used here, where React components subscribe to Redux state updates.

---

## Conclusion

Using Clean Architecture in frontend makes the code **modular, scalable, and easy to maintain**. The key takeaways are:

- Treat the **UI as a separate layer** and don’t mix it with the core logic.
- **Isolate dependencies** so that frameworks and libraries don’t affect the core logic.
- Use **ViewModels & Presenters** to separate data processing from UI.

This method helped me build a **framework-independent, scalable frontend architecture** that can be extended to multiple platforms. I experimented with this approach to make frontend architecture cleaner and more maintainable.

Let me know your thoughts in the comments!
