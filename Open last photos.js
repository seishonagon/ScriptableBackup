// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: images;
// Open last ten photos
let imagePack = await Photos.latestPhotos(10)
let table = new UITable()
for (img of imagePack){
    let row = new UITableRow()
    let imageCell = row.addImage(img)
    let titleCell = row.addText(img.name)
    imageCell.widthWeight = 20
    titleCell.widthWeight = 80
    row.height = 60
    row.cellSpacing = 10
    table.addRow(row)
}
QuickLook.present(table)

        
// let url = "https://macstories.net/feed/json"
// let req = new Request(url)
// let json = await req.loadJSON()
// let items = json.items
// let table = new UITable()
// for (item of items) {
//   let row = new UITableRow()
//   let imageURL = extractImageURL(item)
//   let title = decode(item.title)
//   let imageCell = row.addImageAtURL(imageURL)
//   let titleCell = row.addText(title)
//   imageCell.widthWeight = 20
//   titleCell.widthWeight = 80
//   row.height = 60
//   row.cellSpacing = 10
//   table.addRow(row)
// }
// QuickLook.present(table)
// 
// function extractImageURL(item) {
//   let regex = /<img src="(.*)" alt="/
//   let html = item["content_html"]
//   let matches = html.match(regex)
//   if (matches && matches.length >= 2) {
//     return matches[1]
//   } else {
//     return null
//   }
// }
// 
// function decode(str) {
//   let regex = /&#(\d+);/g
//   return str.replace(regex, (match, dec) => {
//     return String.fromCharCode(dec)
//   })
// }