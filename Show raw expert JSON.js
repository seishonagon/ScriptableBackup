// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: code; share-sheet-inputs: file-url, url, plain-text;
let experts = loadExperts()
prompt(experts)



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

function parseAndPrompt(text) {
  let json = JSON.parse(text)
  if (json != null) {
    prompt(json)
  } else {
    let alert = new Alert()
    alert.title = "Invalid JSON"
    alert.message = "The string could not be parsed to JSON."
    alert.present()
  }
}

function prompt(json) {
  let alert = new Alert()
  alert.addAction("Pretty print")
  alert.addAction("Browse")
  alert.presentSheet().then(idx => {
    if (idx == 0) {
      prettyPrint(json)
    } else {
      browse(json)
    }
  })
}

function prettyPrint(json) {
  let str = JSON.stringify(json, null, 2)
  QuickLook.present(str)
}

function browse(json) {
  QuickLook.present(json)
}
