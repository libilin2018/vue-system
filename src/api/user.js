import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'post',
    data: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function userList(data) {
  return request({
    url: '/user/userList',
    method: 'post',
    data
  })
}

export function changeRoles(data) {
  return request({
    url: '/user/changeRoles',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/user/deleteUser',
    method: 'post',
    data
  })
}

export function getQnToken() {
  return request({
    url: '/token',
    method: 'get'
  })
}

export function changeInfo(data) {
  return request({
    url: '/user/changeInfo',
    method: 'post',
    data
  })
}

