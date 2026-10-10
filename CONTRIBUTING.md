# 🤝 Contributing to Cafe Pilot

Thank you for your interest in contributing to Cafe Pilot! We welcome contributions to make autonomous retail operations smarter, faster, and more resilient.

---

## 🛠️ Development Setup

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/bhanu964/cafe-pilot.git
   cd cafe-pilot
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Add your GROQ_API_KEY or GROK_API_KEY
   ```

4. **Run Local Dev Server**:
   ```bash
   npm run dev
   ```

---

## 📋 Code Standards

- **Think Before Coding**: Clearly define assumptions, performance constraints, and failure modes before writing code.
- **Simplicity First**: Reject unnecessary abstractions, microservices, and external packages when native JavaScript/React suffices.
- **Deterministic Pricing**: NEVER allow an LLM to generate or mutate prices directly. All pricing must resolve through `src/data/menuDetailed.js`.
- **Linting**: Run `npm run lint` before committing. Ensure zero errors.
- **Formatting**: Preserve clean code style and documentation integrity.

---

## 🚀 Pull Request Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Commit your changes following Conventional Commits:
   ```bash
   git commit -m "feat(ai): add multi-item modifier parsing"
   ```
3. Verify local build:
   ```bash
   npm run build
   npm run lint
   ```
4. Push to your branch and submit a Pull Request.

---

## 📄 License
By contributing to Cafe Pilot, you agree that your contributions will be licensed under the [MIT License](LICENSE).
