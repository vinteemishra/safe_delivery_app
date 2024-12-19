import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function pop() {
  _navigator.dispatch(
    NavigationActions.back()
  );
}

function deepNavigate(array) {
  const actions = array.map(i => {
    navigate(i.routeName, i.params);
  })
}

// add other navigation functions that you need and export them

export default {
  pop,
  navigate,
  setTopLevelNavigator,
  deepNavigate,
};