import request from '@/utils/request'

export function getNotices() {
  return request({
    url: '/notice',
    method: 'get'
  })
}

export function readNotice(params) {
  return request({
    url: '/notice/read',
    method: 'get',
    params
  })
}

export function publishNotice(data) {
  return request({
    url: '/notice/publish',
    method: 'post',
    data
  })
}

export function deleteNotice(params) {
  return request({
    url: '/notice/delete',
    method: 'get',
    params
  })
}
