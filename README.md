# Crystal-Line Base-Ball 🔮⚾

> 🎯 Real-time Baseline compatibility detector for CSS, HTML & JavaScript features

A VS Code extension that provides instant visual feedback about web feature compatibility using the Baseline standard. Choose between gutter icons or text highlighting to see which features are widely supported, have limited support, or are experimental.

## ✨ Features

- 🔮 **Dual Visualization Modes**: Choose between gutter icons, text decorations, or both
- 🎯 **Multi-Language Support**: CSS, HTML, and JavaScript feature detection
- 🌐 **Comprehensive Coverage**: From basic features to cutting-edge experimental APIs
- 💡 **Rich Hover Information**: Get architecture insights, browser support, and pro tips
- ⚡ **Real-time Detection**: Instant feedback as you type
- 🎨 **Crystal Ball Theme**: Cosmic-inspired visual design

## 🚀 Quick Start

1. Install the extension from the VS Code Marketplace
2. Open any CSS, HTML, or JavaScript file
3. Use Command Palette (`Ctrl+Shift+P`) and search for "Crystal Ball"
4. Choose your preferred visualization mode:
   - **Gutter Icons Mode**: Icons beside line numbers
   - **Text Decorations Mode**: Colored backgrounds and borders
   - **Both Modes**: Maximum visual feedback

## 🎯 Feature Status Indicators

- ✅ **Green (High)**: Widely supported baseline features
- ⚠️ **Orange (Low)**: Limited support, use with caution
- 🧪 **Purple (Experimental)**: Cutting-edge features, experimental status

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

## 🛠️ Built With

TypeScript, VS Code Extension API, Node.js, ESBuild, ESLint, Mocha, SVG Graphics, Regex Pattern Matching, JSON Configuration, Git/GitHub, CSS/HTML/JavaScript Feature Detection

## 📦 Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Crystal-Line Base-Ball"
4. Click Install

### From Source

```bash
git clone https://github.com/ti-chamas/crystal-line-base-ball.git
cd crystal-line-base-ball
npm install
npm run compile
```

## 🎮 Usage Examples

### CSS Features

```css
/* Grid Layout - Widely supported ✅ */
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

/* CSS Nesting - Limited support ⚠️ */
.card {
  background: white;

  &:hover {
    transform: scale(1.05);
  }
}

/* Container Queries - Experimental 🧪 */
@container (min-width: 400px) {
  .responsive-element {
    font-size: 1.2em;
  }
}
```

### HTML Features

```html
<!-- Dialog Element - Widely supported ✅ -->
<dialog open>
  <p>This is a dialog</p>
</dialog>

<!-- Popover API - Experimental 🧪 -->
<div popover="auto" id="my-popover">Popover content</div>
```

### JavaScript Features

```javascript
// Optional Chaining - Widely supported ✅
const value = obj?.property?.nested

// Private Fields - Limited support ⚠️
class MyClass {
  #privateField = 'secret'
}

// Temporal API - Experimental 🧪 */
const now = Temporal.Now.instant()
```

## ⚙️ Configuration

Use the Command Palette to switch between modes:

- `Crystal Ball: Gutter Icons Mode` - Show only gutter icons
- `Crystal Ball: Text Decorations Mode` - Show only text highlighting
- `Crystal Ball: Both Modes` - Show both visualizations
- `Crystal Ball: Basic Mode` - Simple hover information
- `Crystal Ball: Architecture Mode` - Technical architecture details
- `Crystal Ball: Support Mode` - Browser support information
- `Crystal Ball: Tips Mode` - Developer tips and best practices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎊 Acknowledgments

- Built for the Baseline Tooling Hackathon
- Inspired by the Baseline web standards initiative
- Thanks to the VS Code extension development community

## 🔗 Try It Out

- **VS Code Marketplace**: [Crystal-Line Base-Ball](https://marketplace.visualstudio.com/items?itemName=ti-chamas.crystal-line-base-ball)
- **GitHub Repository**: [ti-chamas/crystal-line-base-ball](https://github.com/ti-chamas/crystal-line-base-ball)
- **Report Issues**: [GitHub Issues](https://github.com/ti-chamas/crystal-line-base-ball/issues)

---

Made with 🔮 and ⚾ for the modern web

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
═══════════════════════════════
♪ The crystal ball sees all ♪
♫ Your web features standing tall ♫  
♪ Baseline magic, hear the call ♪
♫ Crystal-Line Base-Ball! ♫
═══════════════════════════════
