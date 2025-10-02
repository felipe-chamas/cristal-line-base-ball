import * as vscode from 'vscode'

interface BaselineFeature {
  status: { baseline: string }
  description: string
  architecture: string
  support: string
  tips: string
}

class BaselineGutterProvider {
  private features: { [key: string]: BaselineFeature }
  private hoverMode: 'basic' | 'architecture' | 'support' | 'tips' = 'basic'
  private visualMode: 'gutter-icons' | 'text-decorations' | 'both' = 'both'
  private gutterDecorationTypes: { [key: string]: vscode.TextEditorDecorationType }
  private textDecorationTypes: { [key: string]: vscode.TextEditorDecorationType }
  private activeEditor: vscode.TextEditor | undefined

  constructor() {
    // Initialize GUTTER ICON decoration types for true gutter experience
    this.gutterDecorationTypes = {
      high: vscode.window.createTextEditorDecorationType({
        overviewRulerColor: '#22c55e',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        light: {
          gutterIconPath: vscode.Uri.parse('data:image/svg+xml;base64,' + Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text x="2" y="12" fill="#22c55e" font-size="12">✅</text></svg>`).toString('base64')),
        },
        dark: {
          gutterIconPath: vscode.Uri.parse('data:image/svg+xml;base64,' + Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text x="2" y="12" fill="#22c55e" font-size="12">✅</text></svg>`).toString('base64')),
        }
      }),
      low: vscode.window.createTextEditorDecorationType({
        overviewRulerColor: '#f59e0b',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        light: {
          gutterIconPath: vscode.Uri.parse('data:image/svg+xml;base64,' + Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text x="2" y="12" fill="#f59e0b" font-size="12">⚠️</text></svg>`).toString('base64')),
        },
        dark: {
          gutterIconPath: vscode.Uri.parse('data:image/svg+xml;base64,' + Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text x="2" y="12" fill="#f59e0b" font-size="12">⚠️</text></svg>`).toString('base64')),
        }
      }),
      false: vscode.window.createTextEditorDecorationType({
        overviewRulerColor: '#8b5cf6',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        light: {
          gutterIconPath: vscode.Uri.parse('data:image/svg+xml;base64,' + Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text x="2" y="12" fill="#8b5cf6" font-size="12">🧪</text></svg>`).toString('base64')),
        },
        dark: {
          gutterIconPath: vscode.Uri.parse('data:image/svg+xml;base64,' + Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text x="2" y="12" fill="#8b5cf6" font-size="12">🧪</text></svg>`).toString('base64')),
        }
      })
    }

    // Initialize TEXT decoration types for inline highlighting  
    this.textDecorationTypes = {
      high: vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        border: '2px solid #22c55e',
        borderRadius: '3px',
        isWholeLine: false,
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
      }),
      low: vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        border: '2px solid #f59e0b',
        borderRadius: '3px',
        isWholeLine: false,
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
      }),
      false: vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        border: '2px solid #8b5cf6',
        borderRadius: '3px',
        isWholeLine: false,
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
      })
    }

    this.features = {
      // CSS Features
      'css-nesting': {
        status: { baseline: 'low' },
        description: 'SCSS-like nesting native in CSS - the preprocessor killer! 🪆',
        architecture: '🏗️ **Architecture Impact:** Reduces build complexity, eliminates SCSS/LESS dependencies',
        support: '🔧 **Browser Support:** Chrome 112+, Firefox 117+, Safari 16.5+ (March 2023)',
        tips: '💡 **Pro Tips:** Use & for self-reference, avoid deep nesting (max 3 levels), combines with @layer!'
      },
      'css-has-selector': {
        status: { baseline: 'low' },
        description: 'The parent selector we\'ve dreamed of! 👪 Firefox is catching up!',
        architecture: '🚀 **Performance:** Can be expensive - use sparingly, especially in complex selectors',
        support: '🌐 **Browser Support:** Chrome 105+, Firefox 121+, Safari 15.4+ (September 2022)',
        tips: '⚡ **Use Cases:** Form validation styling, conditional layouts, interactive components'
      },
      'css-grid': {
        status: { baseline: 'high' },
        description: 'A magnificent two-dimensional canvas where layout dreams come true! ✨',
        architecture: '🎯 **Best For:** Complex layouts, magazine-style designs, dashboards, card grids',
        support: '✅ **Universal Support:** All modern browsers since 2017 - safe to use everywhere!',
        tips: '🧠 **Learning:** Master grid-template-areas, auto-fit vs auto-fill, subgrid (newer!)'
      },
      'css-flexbox': {
        status: { baseline: 'high' },
        description: 'The elastic dancer of layouts - bends without breaking! 🌊',
        architecture: '🎪 **Perfect For:** Navigation bars, centering content, responsive components',
        support: '✅ **Rock Solid:** Supported everywhere since 2015 - your reliable friend!',
        tips: '🔥 **Power Moves:** Use gap property, master flex-basis vs width, align-content vs align-items'
      },
      
      // HTML Features
      'html-dialog': {
        status: { baseline: 'high' },
        description: '🎭 Native modal dialogs without JavaScript! Accessibility built-in!',
        architecture: '♿ **A11y Champion:** Built-in focus trapping, ESC handling, backdrop clicks',
        support: '✅ **Universal:** Chrome 37+, Firefox 98+, Safari 15.4+ (March 2022)',
        tips: '🎪 **Magic Methods:** Use showModal() for modals, show() for non-modal dialogs'
      },
      'html-popover': {
        status: { baseline: 'low' },
        description: '🎈 Declarative popovers with just HTML attributes! No more JS libraries!',
        architecture: '⚡ **Zero-JS:** Automatic positioning, light-dismiss, focus management',
        support: '🆕 **Fresh:** Chrome 114+, Firefox 125+, Safari 17+ (early 2024)',
        tips: '🎯 **Attributes:** popover="auto" for light-dismiss, popovertarget for triggers'
      },
      'html-inert': {
        status: { baseline: 'high' },
        description: '🚫 Remove elements from accessibility tree and interactions!',
        architecture: '♿ **A11y Tool:** Perfect for modal backdrops, loading states, disabled sections',
        support: '✅ **Ready:** Chrome 102+, Firefox 112+, Safari 15.5+ (mid 2022)',
        tips: '🎭 **Use Cases:** Modal overlays, progressive enhancement, temporary disabling'
      },
      
      // JavaScript Features  
      'js-temporal': {
        status: { baseline: 'false' },
        description: '📅 The future of date/time in JavaScript! Finally fixing Date()!',
        architecture: '🚀 **Revolutionary:** Immutable, timezone-aware, precision handling, better API',
        support: '🧪 **Stage 3:** Polyfills available, browsers implementing (2024-2025)',
        tips: '⏰ **Game Changer:** Temporal.PlainDate, Temporal.ZonedDateTime, duration calculations'
      },
      'js-top-level-await': {
        status: { baseline: 'high' },
        description: '⏳ Use await at module top-level! No more IIFE wrapping!',
        architecture: '🏗️ **Module Magic:** Simplifies async module initialization, cleaner code',
        support: '✅ **Solid:** Chrome 89+, Firefox 89+, Safari 15+ (early 2021)',
        tips: '📦 **ES Modules:** Only works in ES modules, perfect for dynamic imports'
      },
      'js-private-fields': {
        status: { baseline: 'high' },
        description: '🔒 True private class fields with # syntax! Real encapsulation!',
        architecture: '🛡️ **Encapsulation:** Runtime privacy, not just convention, better security',
        support: '✅ **Baseline:** Chrome 74+, Firefox 90+, Safari 14.1+ (2021)',
        tips: '🔐 **Syntax:** #privateField, #privateMethod(), static #staticPrivate'
      },
      'js-web-locks': {
        status: { baseline: 'low' },
        description: '🔐 Coordinate between tabs/workers with Web Locks API!',
        architecture: '🌐 **Multi-Tab Magic:** Prevent race conditions, coordinate shared resources',
        support: '🆕 **Growing:** Chrome 69+, Firefox 96+, Safari not yet (2022+)',
        tips: '🔄 **Use Cases:** IndexedDB coordination, single-instance apps, resource management'
      },
      'js-import-maps': {
        status: { baseline: 'low' },
        description: '🗺️ Map bare import specifiers to URLs! No more bundler required!',
        architecture: '📦 **Native Modules:** Simplify imports, reduce build complexity, better caching',
        support: '🌟 **Fresh:** Chrome 89+, Firefox 108+, Safari 16.4+ (2023)',
        tips: '🎯 **JSON Magic:** Define mappings in script[type="importmap"], works with CDNs'
      }
    }
  }

  setHoverMode(mode: 'basic' | 'architecture' | 'support' | 'tips') {
    this.hoverMode = mode
    if (this.activeEditor) {
      this.scanAndDecorateDocument(this.activeEditor)
    }
  }

  setVisualMode(mode: 'gutter-icons' | 'text-decorations' | 'both') {
    this.visualMode = mode
    if (this.activeEditor) {
      this.scanAndDecorateDocument(this.activeEditor)
    }
  }

  onActiveEditorChanged(editor: vscode.TextEditor | undefined) {
    this.activeEditor = editor
    if (editor && this.isWebFile(editor.document)) {
      console.log('🎨 Baseline: Scanning web file:', editor.document.languageId, editor.document.fileName)
      this.scanAndDecorateDocument(editor)
    }
  }

  private isWebFile(document: vscode.TextDocument): boolean {
    return ['css', 'scss', 'less', 'html', 'javascript', 'typescript'].includes(document.languageId)
  }

  private scanAndDecorateDocument(editor: vscode.TextEditor) {
    const document = editor.document
    const text = document.getText()
    
    // Separate decoration arrays for gutter and text decorations
    const gutterDecorations: { [key: string]: vscode.DecorationOptions[] } = { high: [], low: [], false: [] }
    const textDecorations: { [key: string]: vscode.DecorationOptions[] } = { high: [], low: [], false: [] }

    // Pattern matching for web features
    const patterns = [
      // CSS Features
      { regex: /&\s*{|&:[\w-]+/g, feature: 'css-nesting', name: 'CSS Nesting' },
      { regex: /:has\s*\(/g, feature: 'css-has-selector', name: ':has() Selector' },
      { regex: /display:\s*grid|grid-template/g, feature: 'css-grid', name: 'CSS Grid' },
      { regex: /display:\s*flex|justify-content|align-items/g, feature: 'css-flexbox', name: 'Flexbox' },
      
      // HTML Features  
      { regex: /<dialog\b|showModal\(\)|HTMLDialogElement/g, feature: 'html-dialog', name: 'Dialog Element' },
      { regex: /popover\s*=|popovertarget|showPopover\(\)/g, feature: 'html-popover', name: 'Popover API' },
      { regex: /\binert\b(?:\s*=|\s|>)/g, feature: 'html-inert', name: 'Inert Attribute' },
      
      // JavaScript Features
      { regex: /Temporal\./g, feature: 'js-temporal', name: 'Temporal API' },
      { regex: /^(?!.*function).*await\s+/gm, feature: 'js-top-level-await', name: 'Top-level Await' },
      { regex: /#[\w]+(?:\s*=|\s*\(|;)/g, feature: 'js-private-fields', name: 'Private Fields' },
      { regex: /navigator\.locks|Web\s*Locks\s*API/g, feature: 'js-web-locks', name: 'Web Locks API' },
      { regex: /type\s*=\s*["']importmap["']|import\s+.*from\s*["'][^.\/]/g, feature: 'js-import-maps', name: 'Import Maps' }
    ]

    patterns.forEach((pattern) => {
      let match
      while ((match = pattern.regex.exec(text)) !== null) {
        console.log('✨ Found match:', pattern.name, 'at index', match.index)
        
        const startPos = document.positionAt(match.index)
        const endPos = document.positionAt(match.index + match[0].length)
        const range = new vscode.Range(startPos, endPos)
        
        // For gutter icons, use line-based range
        const lineRange = new vscode.Range(startPos.line, 0, startPos.line, 0)

        const feature = this.features[pattern.feature]
        if (feature) {
          const status = feature.status.baseline
          const hoverMessage = this.createHoverMessage(pattern.feature, feature)

          // Add to appropriate decoration arrays based on visual mode
          if (this.visualMode === 'gutter-icons' || this.visualMode === 'both') {
            gutterDecorations[status].push({ range: lineRange, hoverMessage })
          }
          
          if (this.visualMode === 'text-decorations' || this.visualMode === 'both') {
            textDecorations[status].push({ range, hoverMessage })
          }
        }
      }
    })

    // Apply decorations based on visual mode
    if (this.visualMode === 'gutter-icons' || this.visualMode === 'both') {
      Object.keys(gutterDecorations).forEach((status) => {
        editor.setDecorations(this.gutterDecorationTypes[status], gutterDecorations[status])
      })
    }
    
    if (this.visualMode === 'text-decorations' || this.visualMode === 'both') {
      Object.keys(textDecorations).forEach((status) => {
        editor.setDecorations(this.textDecorationTypes[status], textDecorations[status])
      })
    }

    console.log('📊 Applied decorations - Gutter mode:', this.visualMode)
  }

  private createHoverMessage(featureKey: string, feature: BaselineFeature): vscode.MarkdownString {
    const contents = new vscode.MarkdownString()
    const featureName = featureKey.replace(/^(css-|html-|js-)/, '').replace(/-/g, ' ').toUpperCase()
    
    const statusIcon = feature.status.baseline === 'high' ? '✅' : 
                      feature.status.baseline === 'low' ? '⚠️' : '🧪'
    
    const statusText = feature.status.baseline === 'high' ? 'BASELINE READY' : 
                      feature.status.baseline === 'low' ? 'NEWLY AVAILABLE' : 'EXPERIMENTAL'
    
    if (this.hoverMode === 'architecture') {
      contents.appendMarkdown(`## 🏗️ ARCHITECTURE INSIGHTS\n\n`)
      contents.appendMarkdown(`### ${featureName}\n`)
      contents.appendMarkdown(`${feature.architecture}\n\n`)
    } else if (this.hoverMode === 'support') {
      contents.appendMarkdown(`## 🌐 BROWSER SUPPORT\n\n`)
      contents.appendMarkdown(`### ${featureName}\n`)
      contents.appendMarkdown(`${feature.support}\n\n`)
    } else if (this.hoverMode === 'tips') {
      contents.appendMarkdown(`## 💡 PRO DEVELOPER TIPS\n\n`)
      contents.appendMarkdown(`### ${featureName}\n`)
      contents.appendMarkdown(`${feature.tips}\n\n`)
    } else {
      contents.appendMarkdown(`## 🎨 ${featureName}\n\n`)
      contents.appendMarkdown(`**${statusIcon} Status:** ${statusText}\n\n`)
      contents.appendMarkdown(`${feature.description}\n\n`)
    }
    
    contents.appendMarkdown(`---\n`)
    contents.appendMarkdown(`**🎨 Visual Mode:** ${this.visualMode.replace('-', ' ').toUpperCase()}\n`)
    contents.appendMarkdown(`**🔮 Info Mode:** ${this.hoverMode.toUpperCase()}\n\n`)
    contents.appendMarkdown(`*Switch modes via Ctrl+Shift+P*\n\n`)
    contents.appendMarkdown(`---\n*Made with 💖 by Hanami & Philip*`)
    contents.isTrusted = true

    return contents
  }

  dispose() {
    Object.values(this.gutterDecorationTypes).forEach(decoration => decoration.dispose())
    Object.values(this.textDecorationTypes).forEach(decoration => decoration.dispose())
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('🎨✨ Hanami & Philip\'s DUAL-MODE Baseline Magic is awakening... ✨🎨')

  const gutterProvider = new BaselineGutterProvider()
  
  // Listen for active editor changes
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      gutterProvider.onActiveEditorChanged(editor)
    })
  )

  // Scan current active editor on activation
  if (vscode.window.activeTextEditor) {
    gutterProvider.onActiveEditorChanged(vscode.window.activeTextEditor)
  }

  // Listen for document changes to re-scan
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      const editor = vscode.window.activeTextEditor
      if (editor && editor.document === event.document) {
        gutterProvider.onActiveEditorChanged(editor)
      }
    })
  )

  // Visual mode switching commands
  context.subscriptions.push(
    vscode.commands.registerCommand('baseline-compatibility-checker.gutterMode', () => {
      gutterProvider.setVisualMode('gutter-icons')
      vscode.window.showInformationMessage('🎯 Baseline: Gutter Icons Mode - Classic line gutter icons!')
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('baseline-compatibility-checker.textMode', () => {
      gutterProvider.setVisualMode('text-decorations')
      vscode.window.showInformationMessage('🎨 Baseline: Text Decorations Mode - Inline highlighting!')
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('baseline-compatibility-checker.bothMode', () => {
      gutterProvider.setVisualMode('both')
      vscode.window.showInformationMessage('🚀 Baseline: Both Modes - Maximum visual power!')
    })
  )

  // Info mode switching commands  
  context.subscriptions.push(
    vscode.commands.registerCommand('baseline-compatibility-checker.basicMode', () => {
      gutterProvider.setHoverMode('basic')
      vscode.window.showInformationMessage('🎨 Baseline: Basic Mode - Beautiful overviews!')
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('baseline-compatibility-checker.architectureMode', () => {
      gutterProvider.setHoverMode('architecture')
      vscode.window.showInformationMessage('🏗️ Baseline: Architecture Mode - Performance & impact insights!')
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('baseline-compatibility-checker.supportMode', () => {
      gutterProvider.setHoverMode('support')
      vscode.window.showInformationMessage('🌐 Baseline: Support Mode - Browser compatibility timeline!')
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('baseline-compatibility-checker.tipsMode', () => {
      gutterProvider.setHoverMode('tips')
      vscode.window.showInformationMessage('💡 Baseline: Tips Mode - Pro developer insights!')
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('baseline-compatibility-checker.helloWorld', () => {
      vscode.window.showInformationMessage('🚀 Baseline DUAL-MODE Magic is active! CSS, HTML & JS features highlighted!')
    })
  )

  // Dispose resources on deactivation
  context.subscriptions.push(gutterProvider)
}

export function deactivate() {}