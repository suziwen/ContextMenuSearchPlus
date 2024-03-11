import { updateMenu, initMenu, menuOnClick } from "./menu.js"

chrome.contextMenus.onClicked.addListener(menuOnClick)


chrome.storage.onChanged.addListener(async (args)=>{
  console.log('update menu.....')
  await updateMenu()
})

chrome.runtime.onInstalled.addListener(async ()=>{
  console.log('init menu')
  await updateMenu()
  await initMenu()
})
