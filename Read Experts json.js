// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: code; share-sheet-inputs: file-url, url, plain-text;
let experts = loadExperts()


// functions ~~~~~~~~~~~~~~~~<<<<<
// get record whose property "prop" has value "val"
// https://stackoverflow.com/questions/13964155/get-javascript-object-from-array-of-objects-by-value-of-property
function getRecordFromPropertyValue(array, key, value){
  if (!Array.isArray(array)) {
    throw "parameter is not an array" }
  return array.find(item => getProp(item, key) === value)

}

/** Get a nested property from an
object without returning any 
errors. from https://it.knightnet.org.uk/kb/node-js/get-properties/
*/
function getProp(obj, prop) 
  {
  if (typeof obj !== 'object') throw 'getProp: obj is not an object'
  if (typeof prop !== 'string') throw 'getProp: prop is not a string'
  prop = prop.replace(/\[["'`](.*)["'`]\]/g,".$1")
    return prop.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : undefined
    }, obj || self)
} 

// --- end of fn getProp() --- //


function getExpertFromReference(experts, reference){
  return getRecordFromPropertyValue(experts, "reference", reference)
}
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
function getFilePath() {
  let fm = FileManager.iCloud() 
  let dirPath = fm.bookmarkedPath("Work")
  let name = "Experts.json"
  return fm.joinPath(
    dirPath,
    name)
}

// Loads the experts from a JSON 
// file stored in iCloud Drive.
function loadExperts() {
  let fm = FileManager.iCloud()
  let path = getFilePath()
  let raw = fm.readString(path)
  if (raw == null) {
    return []
  } else {
    return JSON.parse(raw)
  }
}
