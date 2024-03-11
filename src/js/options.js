import Swal from './sweetalert2.esm.js'

import { v4 as uuidv4 } from "./uuid.js"
import { getItem, setItem, clearStrg } from './getset.js'
import { initMenu, getMenuItems } from './menu.js'


function showMessage(msg){
  Swal.fire({
    position: "top-end",
    icon: "success",
    title:  msg || "success",
    showConfirmButton: false,
    timer: 1500
  });
}

function showDimmer(msg){
  Swal.fire({
    title: msg || 'processing...',
    allowEscapeKey: false,
    allowEnterKey: false,
    allowOutsideClick: false,
    showConfirmButton: false
  })
}

function hideDimmer(){
  Swal.close()
}

async function initialise(){
	showpage(1);
	await restore_options();
}

async function save_import()
{
  showDimmer()
	await setItem("_allsearch", document.getElementById("exporttext").value);
  await restore_options();
  hideDimmer()
  showMessage("New Configuration Saved")
}

async function save_otheroptions() 
{	
  showDimmer()
	var ask_bg = document.getElementById("ask_bg").checked;
	var ask_next = document.getElementById("ask_next").checked;
	var ask_options = document.getElementById("ask_options").checked;

  await setItem({
    "_askbg": ask_bg,
    "_asknext": ask_next,
    "_askoptions": ask_options
  })
  hideDimmer()
  showMessage('Options Saved')
}

async function save_options() 
{
  showDimmer()
	var optionsList = document.getElementById("options_list_ul");
	var maxindex = optionsList.childElementCount;
	var _all = new Array(maxindex);
	
	for(var i=0; i<maxindex;i++)
	{
		const curnum = optionsList.children[i].getAttribute('index');
		_all[i] = new Array(4);
		_all[i][0] = document.getElementById("listItemId"+curnum).value || uuidv4();
		_all[i][1] = document.getElementById("listItemName"+curnum).value;
		_all[i][2] = document.getElementById("listItemLink"+curnum).value;
		_all[i][3] = document.getElementById("listItemEnab"+curnum).checked;
		//alert(_all[i][3]);
	}
	
	//alert(_all);
	var stringified = JSON.stringify(_all);
	await setItem("_allsearch", stringified);
	
	var ask_bg = document.getElementById("ask_bg").checked;
	var ask_next = document.getElementById("ask_next").checked;
	
  await setItem({
    "_askbg": ask_bg,
    "_asknext": ask_next
  })
	
  hideDimmer()
  showMessage('Options Saved')
}

async function restore_options() 
{
	var optionsList = document.getElementById("options_list_ul");
	optionsList.innerHTML = "";
  var parsedArray = await getMenuItems();
	document.getElementById("exporttext").value = JSON.stringify(parsedArray) || '';
	
	for(var i=0;i<parsedArray.length;i++)
	{
		add_item();
	}
	for(var i=0;i<parsedArray.length;i++)
	{
		document.getElementById("listItemId"+i).value = parsedArray[i][0];
		document.getElementById("listItemName"+i).value = parsedArray[i][1];
		document.getElementById("listItemLink"+i).value = parsedArray[i][2];
		if(parsedArray[i][3]) document.getElementById("listItemEnab"+i).checked = "true";
		document.getElementById("listItemRemoveButton"+i).onclick = function(event){
			const index = event.target.getAttribute("index");
			remove(index);
		};
	}
	
	var ask_bg = await getItem("_askbg");
	var ask_next = await getItem("_asknext");
	var ask_options = await getItem("_askoptions");

	if(ask_bg) document.getElementById("ask_bg").checked = "true";
	if(ask_next) document.getElementById("ask_next").checked = "true";
	if(ask_options) document.getElementById("ask_options").checked = "true";
}

function remove(j)
{
	var listOfSearchOptions = document.getElementById("options_list_ul");
	var listItemToRemove = document.getElementById("listItem"+j);
	listOfSearchOptions.removeChild(listItemToRemove);
}

function add_item()
{
	var optionsList = document.getElementById("options_list_ul");
	const curnum = optionsList.childElementCount;
	
	var appendListHTML = "<li index='"+curnum+"' id='listItem"+curnum+"'>\
							<div align='center'>\
							<div class='dragIcon'></div>\
							<input type='hidden' class='listItemId' id='listItemId"+curnum+"'>\
							<input type='text' class='listItemName' id='listItemName"+curnum+"' size='20' maxlength='30'>\
							<input type='text' class='listItemLink' id='listItemLink"+curnum+"' size='80' maxlength='200'>\
							<input type='checkbox' class='checkStyle' id='listItemEnab"+curnum+"'>\
							<button index="+curnum+" class='removeButtonStyle' id='listItemRemoveButton"+curnum+"'>X</button>\
							</div></li>"
	document.getElementById("options_list_ul").innerHTML += appendListHTML;
}

async function add_option()
{
  showDimmer()
	var nname = document.getElementById("newname").value;
	var nlink = document.getElementById("newlink").value;

  var parsedArray = await getMenuItems();

	var newoptions = new Array(parsedArray.length+1);
	
	for(var i=0;i<parsedArray.length;i++)
	{
		newoptions[i] = new Array(4);
		newoptions[i] = parsedArray[i].slice(0);
	}
	
	newoptions[i] = new Array(4);
	newoptions[i][0] = uuidv4();
	newoptions[i][1] = nname;
	newoptions[i][2] = nlink;
	newoptions[i][3] = true;
	
	var newstring = JSON.stringify(newoptions);
	await setItem("_allsearch", newstring);

	await restore_options();
	await save_options();
	
	document.getElementById("newname").value = "";
	document.getElementById("newlink").value = "";
  hideDimmer()
  showpage(2)
  showMessage('Options Saved')
}

async function resetdefault()
{
	await clearStrg();
  await initMenu();
	await restore_options();
}

async function AddFromList()
{
  showDimmer()
	var numoptions = document.getElementById("numoptions").value;
	//alert("numoptions = "+numoptions);
	for(var j=1; j<=numoptions; j++)
	{
		if(document.getElementById("s"+j).checked)
		{
			var nname = document.getElementById("names"+j).value;
			var nlink = document.getElementById("links"+j).value;
		
      var parsedArray = await getMenuItems();
		
			var newoptions = new Array(parsedArray.length+1);
			
			for(var i=0;i<parsedArray.length;i++)
			{
				newoptions[i] = new Array(4);
				newoptions[i] = parsedArray[i].slice(0);
			}
			
			newoptions[i] = new Array(4);
			newoptions[i][0] = uuidv4();
			newoptions[i][1] = nname;
			newoptions[i][2] = nlink;
			newoptions[i][3] = true;
			
			//alert(newoptions[i]);
			
			var newstring = JSON.stringify(newoptions);
			await setItem("_allsearch", newstring);
			document.getElementById("s"+j).checked = false;
		
			await restore_options();
			await save_options();
		}
	}
  hideDimmer()
  showpage(2)
  showMessage('Options Saved')
}	


function showpage(page){
	for(var i=1; i<=4; i++){
		if(i==page) document.getElementById("page"+i).style.display = "block";
		else document.getElementById("page"+i).style.display = "none";
	}	
}


initialise().then(()=>{
  $("#options_list_ul").sortable({ opacity: 0.3, cursor: 'move', update: function() {
    console.log("Reordered");
  }});
  
  $("#showpage_1").click(function() {
    showpage(1);
  });
  
  $("#showpage_2").click(function() {
    showpage(2);
  });	
  
  $("#showpage_3").click(function() {
    showpage(3);
  });	
  
  $("#showpage_4").click(function() {
    showpage(4);
  });
  
  $("#add_option").click(function() {
    add_option();
  });
  
  $("#AddFromList").click(function() {
    AddFromList();
  });
  
  $("#save_options").click(function() {
    save_options();
  });
  
  $("#resetdefault").click(async function() {
    showDimmer()
    await resetdefault();
    hideDimmer()
    showMessage();
  });
  
  $("#save_otheroptions").click(function() {
    save_otheroptions();
  });
  
  $("#save_import").click(function() {
    save_import();
  });
})
