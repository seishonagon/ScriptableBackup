// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: user-graduate;
// share-sheet-inputs: file-url, url, plain-text;
let cs = importModule('lib/Colors.js')
let io = importModule('lib/ExpertsIo.js')
let gel = importModule('lib/tableGrphElements.js')
let xp = importModule('lib/ExpertJSON.js')
let tb = importModule('lib/Tables.js')

let mainTable = new UITable()
createExpertTable(mainTable)
mainTable.showSeparators = true
mainTable.present()

// make mainTable with expert list
function createExpertTable(table) {
  let experts = io.loadExperts()
  experts.sort(io.sortExperts)
  table.removeAllRows()
  let headRow = tb.addTitleRow(table, "Experts", "origin", cs.white, cs.grey)
  for (i = 0; i < experts.length; i++) {
    let expert = experts[i]
    let org = expert.origin.toLowerCase()
    if (cs.colorKeys.includes(org))
      { blockColor = cs.itColors[org]
      } else 
      { blockColor = cs.blue}
    let expRow = addExpertRow(table, expert, blockColor, blockColor)
    }
}

// mainTable row with expert info
function addExpertRow(table, expert, ftColor, bgColor) {
    const rowHeight = 70
    let row = new UITableRow()
    let cell1 = row.addImage(
        expert.isActive ? gel.getBlockImage(25, rowHeight, ftColor, bgColor) : gel.getOutlineBlockImage(25, rowHeight, ftColor, bgColor))
    cell1.widthWeight = 5
    cell1.leftAligned()
    let cell2 = row.addText(expert.name,expert.origin)
    cell2.widthWeight = 95;
    cell2.leftAligned()
    let isActive
    if (expert.isActive) {
      isActive = "🔘"
    } else {
      isActive = "⚫️"
    }
    let tglBtn = row.addButton(isActive)
    tglBtn.widthWeight = 10
    tglBtn.onTap = () => {
      toggleActive(expert.reference)
      createExpertTable(table)
      table.reload()
    }
    row.height = rowHeight
    row.cellSpacing = 10
    row.dismissOnSelect = false;
    row.onSelect = (idx) => {
      showExpert(expert)
    }
    row.isHeader = false
    table.addRow(row)
    return row;
}
  
// Toggles expert's active state
function toggleActive(expertReference) {
  let experts = io.loadExperts()
  for (expert of experts) {
    if (expert.reference == expertReference) {
      expert.isActive = !expert.isActive
    }
  }
  io.saveExperts(experts) 
}

// show expert 
function showExpert(expert)
  {
  let expertTable = new UITable()
  expertTable.showSeparators = true
  createMissionTable(expertTable, expert)
  expertTable.present()
}

// fill missionTable with missions
function createMissionTable(table, expert)
  {
  table.removeAllRows()
  let rowHeight = 70
  let org = expert.origin.toLowerCase()
  let row = tb.addTitleRow(table, expert.name, expert.origin, cs.itColors[org], Color.black())
  let expertReference = expert.reference
  for (i = 0; i < expert.missions.length; i++) {
    let m = expert.missions[i]
    let row = new UITableRow()
    row.height = rowHeight
    row.dismissOnSelect = false
    clt = m.client.toLowerCase()
    if (cs.colorKeys.includes(clt))
      { blockColor = cs.itColors[clt]
      } else 
      { blockColor = cs.blue}
    let cell1 = row.addImage(gel.getBlockImage(25, rowHeight, blockColor, blockColor))
    cell1.widthWeight = 5
    cell1.leftAligned()
    let cell2 = row.addText(
      m.title,
      m.number)
    cell2.widthWeight = 80
    let cell3 = row.addText(m.ofLink)
    cell3.widthWeight = 15
    cell3.leftAligned()
    row.onSelect = (idx) => {
      let eInd = xp.getIdxFmRef(expertReference)
      let mInd = idx - 1
      let link = xp.getMnLnk(eInd,mInd)
      showMission(link)
    }
    row.isHeader = false
    table.addRow(row)
  }   
}

function showMission(ofLink){
  let baseURL = 'omnifocus:///task/'
  let url = baseURL + ofLink
  Safari.open(url)
}

async function makeMission(expert, mission){
  let ofUrl = null;
  let url = new CallbackURL('omnifocus://x-callback-url/add');
  let name = mission.number + ' - ' + mission.client + ' - ' + expert.name
  log('of Link - name: ', name)
  url.addParameter('name', name)
  log('of Link - full: ', url)
  let ofPromise = url.open()
  let result = await ofPromise
  log('return ' , result)
  if (result) {
    ofUrl = result.result}
  return ofUrl;
}

function log(...args) {
	args = args.map(arg => 
	typeof arg === "object" && arg != null ?
		JSON.stringify(arg, null, 4) :
		arg
	);
	console.log(args.join(" "));
}

// unused for now
// Removes the expert from the list.
function removeExpert(expertRef) {
  let experts = io.loadExperts()
  experts = experts.filter(e => {
    return e.reference != expertRef
  })
  io.saveExperts(experts)
}

function gotoProjects(){
  let url = 'omnifocus:///projects'
  Safari.open(url)
}

// Create an Omnifocus entry
async function createEntry(expert) {
    let url = new CallbackURL('omnifocus:///add');
    url.addParameter('name', expert.name);
    url.addParameter('project', expert.name);
    url.addParameter('flag', 'false');
    url.addParameter('note', expert.missions);
    // Confirmation alert
    let alert = new Alert();
    alert.title = 'Create OmniFocus Task';
    alert.message = 'Task: "' + expert.name;
    alert.addAction('OK');
    alert.addCancelAction('Cancel');
    let selId = await (alert.present());
    if (selId === 0) {
        url.open();
    }
}

// Presents an alert that prompts to confirm that the expert should be removed.
async function promptRemoval(expert) {
  let alert = new Alert()
  alert.title = "Remove from list of Experts?"
  alert.message = "Are you sure you want to remove " + expert.name + " from your list?"
  alert.addDestructiveAction("Remove")
  alert.addCancelAction("Cancel")
  let idx = await alert.presentAlert()
  if (idx == 0) {
    // Remove the movie and populate the table again. We must reload the table after populating it.
    removeExpert(expert.reference)
    fillExpertTble()
    table.reload()
  }
}

