import Towxml from 'towxml'

const towxml = new Towxml()

/**
 * 将 Markdown 文本解析为小程序可用的 nodes 结构
 * @param {string} content markdown 内容
 * @returns {Object|null} towxml json 结果
 */
export function parseMarkdown(content) {
  if (!content || !String(content).trim()) return null
  const data = towxml.toJson(String(content), 'markdown')
  return data
}

