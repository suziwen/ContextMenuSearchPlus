import { v4 as uuidv4 } from "./uuid.js"
import { getItem, setItem } from './getset.js'



export const initMenu = async function (){
	const searchstring = await getItem("_allsearch");
  if (searchstring) return
  const _all = new Array(5);
  // 0th item in the array is reserved for context menu item id
  
  _all[0] = new Array(4);
  _all[0][0] = uuidv4()
  _all[0][1] = "Bing"; // Display label
  _all[0][2] = "http://www.bing.com/search?q=TESTSEARCH"; // Link
  _all[0][3] = true; // whether this option is enabled or not

  _all[1] = new Array(4);
  _all[1][0] = uuidv4();
  _all[1][1] = "Bing Images";
  _all[1][2] = "http://www.bing.com/images/search?q=TESTSEARCH";
  _all[1][3] = true;

  _all[2] = new Array(4);
  _all[2][0] = uuidv4();
  _all[2][1] = "IMDB";
  _all[2][2] = "http://www.imdb.com/find?s=all&q=TESTSEARCH";
  _all[2][3] = true;

  _all[3] = new Array(4);
  _all[3][0] = uuidv4();
  _all[3][1] = "Wikipedia";
  _all[3][2] = "http://en.wikipedia.org/wiki/Special:Search?search=TESTSEARCH&go=Go";
  _all[3][3] = true;

  _all[4] = new Array(4);
  _all[4][0] = uuidv4();
  _all[4][1] = "Yahoo!";
  _all[4][2] = "http://search.yahoo.com/search?vc=&p=TESTSEARCH";
  _all[4][3] = true;
  
  var stringified = JSON.stringify(_all);
  await setItem({
    "_askbg": false,
    "_asknext": true,
    "_askoptions": true,
    "_allsearch": stringified
  })
}


export const getMenuItems = async function(){
	const searchstring = await getItem("_allsearch");
  if (!searchstring) return []
  try {
    var parsedArray = JSON.parse(searchstring);
    let needReSave = false;
    const cacheObj = {}
    parsedArray.forEach((item)=>{
      if (item[0] == '-1') {
        item[0] = uuidv4()
        needReSave = true
      }
      if (cacheObj[item[0]]) {
        // 有重复的主键, 重新生成一个新的主键
        needReSave = true
        item[0] = uuidv4()
      }
      cacheObj[item[0]] = true
    })
    if (needReSave) {
      await setItem("_allsearch", JSON.stringify(parsedArray))
    }
    return parsedArray;
  } catch (e){
    return []
  }
}

export const updateMenu = async function ()
{
	chrome.contextMenus.removeAll();
	
  const _all = await getMenuItems();
  const numentries = _all.length;
	for(var i=0; i<numentries; i++)
	{
		if(_all[i][3]){
			chrome.contextMenus.create({
        "id": _all[i][0] + '',
        "title": _all[i][1],
        "contexts":["selection"]
      });
		}
	}
	
	var ask_options = await getItem("_askoptions");
	
	if(ask_options){
		//show separator
		chrome.contextMenus.create({
      "id": uuidv4(),
      "type": "separator",
      "contexts":["selection"]
    });
		//show the item for linking to extension options
		chrome.contextMenus.create({
      "id": "options",
      "title": "Options",
      "contexts":["selection"]
    });
	}
}

export const menuOnClick = async function (info, tab) 
{
  const _all = await getMenuItems();
  const numentries = _all.length;
	var itemindex = 0;
  switch (info.menuItemId) {
    case "options": {
      chrome.tabs.create({"url":"options.html"});
      return
    }
    default: {
      for(var i=0; i<numentries; i++)
      {
        if(info.menuItemId == _all[i][0])
        {
          //alert(i);
          itemindex = i;
        }
      }
    }
  }
	var ask_fg = await getItem("_askbg");
	var ask_next = await getItem("_asknext");
	var index = 1000;
	
	var targetURL = _all[itemindex][2].replace("TESTSEARCH", info.selectionText);
	targetURL = targetURL.replace("%s", info.selectionText);
	
	if(ask_next)
	{
		const tabs = await chrome.tabs.query({active: true})
    if (tabs && tabs.length > 0) {
      const tab = tabs[0]
      index = tab.index + 1;
      chrome.tabs.create({"url":targetURL, "selected":ask_fg, "index":index});
    }
	}
	else
	{
		chrome.tabs.create({"url":targetURL, "selected":ask_fg});
	}
}

// End of file;
