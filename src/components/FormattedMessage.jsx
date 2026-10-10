import React from 'react'

/**
 * Parses inline markdown: **bold**, *italic*, `code`
 */
function parseInline(text) {
  if (!text) return null

  // Regex to split by bold, italic, code
  const tokens = []
  let remaining = text

  // Match bold **text**, code `text`, italic *text*
  const inlineRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g
  let lastIndex = 0
  let match

  while ((match = inlineRegex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(remaining.substring(lastIndex, match.index))
    }

    const matchedStr = match[0]
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      tokens.push(<strong key={tokens.length}>{matchedStr.slice(2, -2)}</strong>)
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
      tokens.push(<code key={tokens.length} className="inline-code">{matchedStr.slice(1, -1)}</code>)
    } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
      tokens.push(<em key={tokens.length}>{matchedStr.slice(1, -1)}</em>)
    }

    lastIndex = match.index + matchedStr.length
  }

  if (lastIndex < remaining.length) {
    tokens.push(remaining.substring(lastIndex))
  }

  return tokens
}

/**
 * Render tables from Markdown table syntax
 */
function renderTable(tableLines, key) {
  if (tableLines.length < 2) return null

  const parseRow = (row) =>
    row
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim())

  const headerCells = parseRow(tableLines[0])
  // Skip separator line if it's like |---|---|
  const dataStartIndex = tableLines[1].includes('---') ? 2 : 1
  const bodyRows = tableLines.slice(dataStartIndex).map(parseRow)

  return (
    <div key={key} className="formatted-table-wrapper">
      <table className="formatted-table">
        <thead>
          <tr>
            {headerCells.map((cell, idx) => (
              <th key={idx}>{parseInline(cell)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx}>{parseInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Formats structured AI responses (Markdown headers, tables, bold, bullet/numbered lists)
 * into human-readable, professional layout without raw stars, hashes, or pipes.
 */
function FormattedMessage({ content }) {
  if (!content) return null

  const lines = content.split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Empty lines
    if (!trimmed) {
      i++
      continue
    }

    // Markdown Table detection (starts and contains '|')
    if (trimmed.startsWith('|') && trimmed.includes('|', 1)) {
      const tableLines = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      blocks.push(renderTable(tableLines, `table-${blocks.length}`))
      continue
    }

    // Headings (###, ##, #)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2]
      const Tag = level === 1 ? 'h3' : level === 2 ? 'h4' : 'h5'
      blocks.push(
        <Tag key={`heading-${blocks.length}`} className="formatted-heading">
          {parseInline(text)}
        </Tag>
      )
      i++
      continue
    }

    // Standalone bold header lines like **Section Name** or **1. Action**
    const boldHeaderMatch = trimmed.match(/^\*\*([^*]+)\*\*$/)
    if (boldHeaderMatch) {
      blocks.push(
        <h4 key={`bold-head-${blocks.length}`} className="formatted-heading bold-subhead">
          {boldHeaderMatch[1]}
        </h4>
      )
      i++
      continue
    }

    // Unordered lists (- item or * item)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const listItems = []
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        const itemText = lines[i].trim().substring(2).trim()
        listItems.push(itemText)
        i++
      }
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="formatted-list unordered">
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInline(item)}</li>
          ))}
        </ul>
      )
      continue
    }

    // Ordered lists (1. item, 2. item)
    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/)
    if (orderedMatch) {
      const listItems = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^\d+\.\s+/, '')
        listItems.push(itemText)
        i++
      }
      blocks.push(
        <ol key={`ol-${blocks.length}`} className="formatted-list ordered">
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInline(item)}</li>
          ))}
        </ol>
      )
      continue
    }

    // Regular paragraph
    blocks.push(
      <p key={`p-${blocks.length}`} className="formatted-paragraph">
        {parseInline(trimmed)}
      </p>
    )
    i++
  }

  return <div className="formatted-response-content">{blocks}</div>
}

export default FormattedMessage
