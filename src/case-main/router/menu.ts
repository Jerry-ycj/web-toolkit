import { IMenuItem, storePageMenu } from '../';

// 用于菜单导航的顺序,name+icon
export function buildMenu(routes: any[], mainMenuTitles: any, indexName: any) {
  // 生成menu item
  // menu所在的主路由名称
  if (!indexName) { indexName = 'index'; }
  const routeIndex = routes.filter((config) => config.name === indexName)[0];
  const children = routeIndex && routeIndex.children ? routeIndex.children : [];
  // menu: {title, privileges(all), authDepartments(all), children:[{cTitle, name, privileges, authDepartments}], }
  const menu: IMenuItem[] = [];
  for (const mainRouteItem of children) {
    // 不检测 子页面也不检查
    if (!mainRouteItem.meta || mainRouteItem.meta.parentName) { continue; }
    let title;
    let onlyMainTitle;
    if (mainRouteItem.meta.menuTitle) { title = mainRouteItem.meta.menuTitle; } else if (mainRouteItem.meta.parentCName) { title = mainRouteItem.meta.parentCName; } else if (mainRouteItem.meta.CName) {
      onlyMainTitle = true;
      title = mainRouteItem.meta.CName;
    }
    const i = mainMenuTitles.indexOf(title);
    if (i >= 0) {
      if (!menu[i / 2]) {
        menu[i / 2] = {
          title,
          icon: mainMenuTitles[i + 1],
        };
      }
      if (onlyMainTitle) {
        // 没有子导航
        menu[i / 2].cTitle = mainRouteItem.meta.CName;
        menu[i / 2].name = mainRouteItem.name;
        menu[i / 2].privileges = mainRouteItem.meta.privileges;
        menu[i / 2].authDepartments = mainRouteItem.meta.authDepartments;
      } else {
        const children = menu[i / 2].children || [];
        if (children.length === 0) {
          menu[i / 2].children = children;
        }
        children.push({
          cTitle: mainRouteItem.meta.CName,
          name: mainRouteItem.name,
          privileges: mainRouteItem.meta.privileges,
          authDepartments: mainRouteItem.meta.authDepartments,
        });
        if (mainRouteItem.meta.privileges) {
          const privileges = menu[i / 2].privileges || [];
          menu[i / 2].privileges = privileges.concat(mainRouteItem.meta.privileges);
        }
        if (mainRouteItem.meta.authDepartments) {
          const authDepartments = menu[i / 2].authDepartments || [];
          menu[i / 2].authDepartments = authDepartments.concat(mainRouteItem.meta.authDepartments);
        }
      }

    }
  }
  storePageMenu.push(...menu);
}
