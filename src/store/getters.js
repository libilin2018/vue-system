const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  loading: state => state.app.loading,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  asyncRoutes: state => state.user.asyncRoutes
}
export default getters
