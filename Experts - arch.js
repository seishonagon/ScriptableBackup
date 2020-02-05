// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: code; share-sheet-inputs: file-url, url, plain-text;
let cs = importModule('lib/Colors.js')
let io = importModule('lib/ExpertsIo.js')
let xp = importModule('lib/ExpertJSON.js')

let mainTable = new UITable()
mainTable.showSeparators = true
fillExpertTble(mainTable)
mainTable.present()

// make mainTable with expert list
function fillExpertTble(table) {
  table.removeAllRows()
  let headRow = addTitleRow(table, "Experts", "origin", cs.white, cs.grey)
  let experts = io.loadExperts()
  experts.sort(io.sortExperts)
  for (i = 0; i < experts.length; i++) {
    let expert = experts[i]
    let expRow = addExpertRow(table, experts, expert, cs.itemColor[expert.origin.toLowerCase()], cs.orange)
    }
}

// Create a title row (bold text)
function addTitleRow(uitable, title, subtitle, ftColor, bgColor) {
  rowHeight = 70
  let uiTableRow = new UITableRow();
  let cell1 = uiTableRow.addImage(getBlockImage(20, rowHeight, ftColor))
  cell1.widthWeight = 5
  let titleCell = uiTableRow.addText(title, subtitle);
  titleCell.titleColor = ftColor
  titleCell.subtitleColor = ftColor
  titleCell.leftAligned();
  titleCell.widthWeight = 95;
  
  uiTableRow.backgroundColor = bgColor
  uiTableRow.height = rowHeight;
  uiTableRow.cellSpacing = 10;
  uiTableRow.dismissOnSelect = false;
  uiTableRow.isHeader = true;
  uitable.addRow(uiTableRow);
  return uiTableRow;
}

// mainTable row with expert info
function addExpertRow(table, experts, expert, ftColor, bgColor) {
    const rowHeight = 70
    let row = new UITableRow()
    let org = expert.origin.toLowerCase()
    if (Object.keys(cs.itemColor).includes(org))
      { blockColor = cs.itemColor[org]
      } else 
      { blockColor = cs.blue}
    let cell1 = row.addImage(
        expert.isActive ? getBlockImage(25, rowHeight, blockColor, blockColor) : getOutlineBlockImage(25, rowHeight, blockColor, blockColor))
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
      fillExpertTble(table)
      table.reload()
    }
    row.height = rowHeight
    row.cellSpacing = 10
    row.dismissOnSelect = false;
    row.onSelect = (idx) => {
      let expert = experts[idx-1]
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
  fillMissionTble(expertTable, expert)
  expertTable.present()
}

// fill missionTable with missions
function fillMissionTble(table, expert)
  {
  table.removeAllRows()
  let row = addTitleRow(table, expert.name, expert.origin, cs.itemColor[expert.origin.toLowerCase()], Color.black())
  let expertReference = expert.reference
  for (i = 0; i < expert.missions.length; i++) {
    let mission = expert.missions[i]
    let row = new UITableRow()
    row.height = 70
    row.dismissOnSelect = false
    clt = mission.client.toLowerCase()
    if (Object.keys(cs.itemColor).includes(clt))
      { blockColor = cs.itemColor[clt]
      } else 
      { blockColor = cs.blue}
    let cell1 = row.addImage(getBlockImage(25, rowHeight, blockColor, blockColor))
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
        let ofLink = makeMission(expert,mission)
        for (expert of experts) {
          if (expert.reference == expertReference) {
            expert.ofLink = ofLink
            }
          }
          io.saveExperts(experts) 
        }
      else {
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
  let url = new CallbackURL('omnifocus://x-callback-url/add');
  let name = mission.number + mission.client + expert.name
  url.addParameter('name', target)
  let ofPromise = url.open()
  let result = await ofPromise
  if (result) {
    ofUrl = result.result}
  return ofUrl;
}


function getBlockImage(width, height, fillColor, lineColor) {
    let c = new DrawContext()
    c.size = new Size(width, height)
    c.setFillColor(fillColor)
    c.setLineWidth(6)
    c.setStrokeColor(fillColor)
    let rect = new Rect(0, 0 , width, height)
    c.fill(rect);
    c.stroke(rect)
    return c.getImage();
}

function getOutlineBlockImage(width, height, fillColor, lineColor) {
    let c = new DrawContext()
    c.opaque = false
    c.size = new Size(width, height)
    c.setLineWidth(6)
    c.setStrokeColor(fillColor)
    c.setFillColor(new Color("000", 0))
    c.stroke(new Rect(0, 0 , width, height))
    return c.getImage();
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

