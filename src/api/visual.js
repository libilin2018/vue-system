import request from '@/utils/request'

export function getHomeData() {
  return request({
    url: '/home',
    method: 'get'
  })
}

export function getRaw(params) {
  return request({
    url: '/raw',
    method: 'get',
    params
  })
}

export function getRawQuery(params) {
  return request({
    url: '/raw/query',
    method: 'get',
    params
  })
}

export function getRawDelete(params) {
  return request({
    url: '/raw/delete',
    method: 'get',
    params
  })
}

export function getMap(params) {
  return request({
    url: '/visual/map',
    method: 'get',
    params
  })
}

export function getRequireTop10(params) {
  return request({
    url: '/visual/requireTop10',
    method: 'get',
    params
  })
}

export function getEducation(params) {
  return request({
    url: '/visual/education',
    method: 'get',
    params
  })
}

export function getWorkyear(params) {
  return request({
    url: '/visual/workyear',
    method: 'get',
    params
  })
}

export function getCompanyType(params) {
  return request({
    url: '/visual/companyType',
    method: 'get',
    params
  })
}

export function getCompanyscale(params) {
  return request({
    url: '/visual/companyscale',
    method: 'get',
    params
  })
}

export function getWashData(params) {
  return request({
    url: '/visual/wash',
    method: 'get',
    params
  })
}

