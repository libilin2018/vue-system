import defaultSettings from '@/settings'

const title = defaultSettings.title || '招聘可视化系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
