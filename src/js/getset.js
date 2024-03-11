
// JavaScript to be used in all extensions possibly!

let logging  = false;

export const setItem = async function (key, value) {
	try {
		log("Inside setItem:" + key + ":" + value);
    if (typeof key === 'string') {
      await chrome.storage.sync.set({[key]: value})
    } else {
      await chrome.storage.sync.set(key)
    }
	}catch(e) {
		log("Error inside setItem");
		log(e);
	}
	log("Return from setItem" + key + ":" +  value);
}
export const getItem= async function (key) {
	let value;
	log('Get Item:' + key);
	try {
    value = (await chrome.storage.sync.get(key))[key] || null
	}catch(e) {
		log("Error inside getItem() for key:" + key);
		log(e);
    value = null
	}
	log("Returning value: " + value);
	return value;
}

export const clearStrg = async function () {
	log('about to clear local storage');
  await chrome.storage.sync.clear();
	log('cleared');
}

function log(txt) {
	if(logging) {
		console.log(txt);
	}
}
