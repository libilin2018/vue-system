import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    job: '通信工程师',
    scale: '10000人以上',
    companyName: '腾讯科技',
    companyType: '民营企业',
    education: '本科',
    area: '深圳',
    workyear: '2年经验',
    require: '招若干人',
    salary: '1.2-1.5万/月'
  }]
})

export default [
  {
    url: '/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
