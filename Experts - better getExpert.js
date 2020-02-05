// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: code; share-sheet-inputs: file-url, url, plain-text;
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
    let mission = expert.missions[i]
    let row = new UITableRow()
    row.height = rowHeight
    row.dismissOnSelect = false
    clt = mission.client.toLowerCase()
    if (cs.colorKeys.includes(clt))
      { blockColor = cs.itColors[clt]
      } else 
      { blockColor = cs.blue}
    let cell1 = row.addImage(gel.getBlockImage(25, rowHeight, blockColor, blockColor))
    cell1.widthWeight = 5
    cell1.leftAligned()
    let cell2 = row.addText(
      mission.title,
      mission.number)
    cell2.widthWeight = 90
    let cell3 = row.addText(mission.ofLink)
    cell3.widthWeight = 5
    cell3.leftAligned()
    row.onSelect = (idx) => {
      let link = mission.ofLink
      if(link === undefined){
        log('no OF link')
        promptLink(expertReference, mission)
        
//         log('New link: ', ofLink)
//         let experts = io.loadExperts()

//         for (expert of experts) {
//           if (expert.reference == expertReference) {
//             expert.ofLink = ofLink
//             log('updated link: ', expert.oflink)
//             }
//           }
//           io.saveExperts(experts) 
        }
      else {
        log('OF link', link)
        showMission(link)}
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
  let url = new CallbackURL('omnifocus://x-callback-url/paste');
  let content = mission.number + ' - ' + mission.client + ' - ' + expert.name
  let target='/folder/missions'
  log('of Link - name: ', content)
  url.addParameter('content', content)
  url.addParameter('target', target)
  
  log('of Link - full: ', url.getURL())
  let ofPromise = url.open()
  let result = await ofPromise
  log('return ' , result)
  if (result) {
    ofUrl = result.result
    ofUrl = ofUrl.replace("omnifocus:///task/", "")}
  log('result ' , ofUrl)
  let exRef = expert.reference
  let experts = io.loadExperts()
  for (ex of experts) {
    if (ex.reference == exRef) {
      expert.ofLink = ofLink}
      }
  io.saveExperts(experts)
//   return ofUrl;
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
async function promptLink(expertReference, mission) {
  let alert = new Alert()
  alert.title = "No link to OmniFocus"
  alert.message = "Do you want to create a link to OF?"
  alert.addAction("Yes")
  alert.addCancelAction("No")
  let idx = await alert.presentAlert()
  if (idx == 0) {
    log('OK next time we make link for reference', expertReference)
    let experts = io.loadExperts()
    let expert = xp.getExpRef(experts, expertReference)
    log('for ', expert.name)
    let ofLink = makeMission(expert, mission)
//     log('this link ', ofLink)
  }
}

