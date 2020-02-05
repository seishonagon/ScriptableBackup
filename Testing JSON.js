// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: vial;
// share-sheet-inputs: file-url, url, plain-text;
let js = importModule('lib/ExpertJSON.js')
let io = importModule('lib/ExpertsIo.js')

let xps = io.loadExperts()
let myRef = String(4)
let eInd = js.getIdxFmRef(xps, myRef)
let myExpert = xps[eInd]
let m = js.getMissions(myExpert)
let n = js.getMissionNumbers(myExpert)
let mRef = '3910-00'
let mInd = js.getIdxFmProp(myExpert.missions, 'number', mRef)
let newLink = await js.getMnLnk(eInd,mInd)
log('Link: ',newLink)
    


// -- end of fn getExpertName() -- //

// -- display/prompt functions  -- //
async function display(p_strMsg)
{
  let showText = new Alert();
  showText.message = p_strMsg;
  showText.title = "Alert";
  let result = await showText.present();
	if (result == -1)
	{
		return null;
	}
	else
	{
		return null;
	}
}
  
async function prompt(p_strMsg)
{
	let getText = new Alert();
	getText.message = p_strMsg
	getText.addTextField();
	getText.title = "Enter text";
	getText.addAction("OK");
	getText.addCancelAction("Cancel");
	let result = await getText.present();
	if (result == -1)
	{
		return null;
	}
	else
	{
  return getText.textFieldValue(0);
	}
}
// --- end of display fn  --- //

// Gets path of the file containing
// the experts data. Creates the 
// file if necessary.
// function getFilePath() {
//   let fm = FileManager.iCloud() 
//   let dirPath = fm.bookmarkedPath("Work")
//   let name = "Tests.json"
//   return fm.joinPath(
//     dirPath,
//     name)
// }
// 
// Loads the test from a JSON 
// file stored in iCloud Drive.
// function loadExperts() {
//   let fm = FileManager.iCloud()
//   let path = getFilePath()
//   let raw = fm.readString(path)
//   if (raw == null) {
//     return []
//   } else {
//     return JSON.parse(raw)
//   }
// }
// 
// save test data file
// function saveTests(data) {
//   log('In saveTests')
//   let fm = FileManager.iCloud()
//   let path = getFilePath()
//   let raw = JSON.stringify(data)
//   log('saving data', raw)
//   fm.writeString(path, raw)
// }

function log(...args) {
	args = args.map(arg => 
	typeof arg === "object" && arg != null ?
		JSON.stringify(arg, null, 4) :
		arg
	);
	console.log(args.join(" "));
}