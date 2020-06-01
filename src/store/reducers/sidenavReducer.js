const initState = {
  tab: 'dashboard',
  menuOpen: true
}

const sidenavReducer = (state = initState, action) => {
  switch (action.type) {
    case 'SIDENAV_CHANGE':
      return {
        ...state,
        tab: action.tab
      }
    case 'SIDENAV_TOGGLE':
      return {
        ...state,
        menuOpen: !state.menuOpen
      }
    default:
      return state
  }
};

export default sidenavReducer;